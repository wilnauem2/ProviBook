import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc, setDoc } from 'firebase/firestore';

/**
 * Creates a complete backup of all collections in Firestore
 * @returns {Promise<Object>} Object containing all collections and their documents
 */
export const backupFirestore = async () => {
  try {
    console.log('Starting Firestore backup...');
    
    // List of collections to back up
    const collectionsToBackup = [
      'insurers',
      'insurers_test',
      'invoices',
      'invoices_test',
      'settlement_history',
      'settlement_history_test'
    ];

    const backupData = {};
    
    // Get all documents from each collection
    for (const collectionName of collectionsToBackup) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        backupData[collectionName] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Backed up ${backupData[collectionName].length} documents from ${collectionName}`);
      } catch (error) {
        console.warn(`Warning: Could not back up collection ${collectionName}:`, error);
      }
    }
    
    // Create a timestamp for the backup
    const timestamp = new Date().toISOString();
    const backupInfo = {
      timestamp,
      collections: Object.keys(backupData),
      totalDocuments: Object.values(backupData).reduce((sum, docs) => sum + docs.length, 0)
    };
    
    // Include backup info in the data
    const completeBackup = {
      _backupInfo: backupInfo,
      ...backupData
    };
    
    console.log('Backup completed successfully');
    return completeBackup;
    
  } catch (error) {
    console.error('Error during backup:', error);
    throw error;
  }
};

/**
 * Restores data from a backup object to Firestore
 * @param {Object} backupData - The backup data to restore
 * @param {boolean} overwrite - Whether to overwrite existing documents
 * @returns {Promise<Object>} Object with results of the restore operation
 */
export const restoreFirestore = async (backupData, overwrite = false) => {
  try {
    console.log('Starting Firestore restore...');
    
    // Remove backup info from the data
    const { _backupInfo, ...collections } = backupData;
    const results = {
      success: true,
      collections: {},
      errors: []
    };
    
    // Process each collection in the backup
    for (const [collectionName, documents] of Object.entries(collections)) {
      try {
        console.log(`Restoring collection: ${collectionName}`);
        const batch = writeBatch(db);
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        
        // Process each document in the collection
        for (const docData of documents) {
          try {
            const docRef = doc(db, collectionName, docData.id);
            
            if (overwrite) {
              // Set will overwrite existing document
              batch.set(docRef, docData);
              successCount++;
            } else {
              // Check if document exists
              const docSnap = await getDoc(docRef);
              if (!docSnap.exists()) {
                batch.set(docRef, docData);
                successCount++;
              } else {
                skipCount++;
              }
            }
          } catch (error) {
            console.error(`Error processing document ${docData.id} in ${collectionName}:`, error);
            errorCount++;
          }
        }
        
        // Commit the batch
        await batch.commit();
        
        // Record results
        results.collections[collectionName] = {
          success: true,
          documents: documents.length,
          created: successCount,
          skipped: skipCount,
          errors: errorCount
        };
        
        console.log(`Restored ${successCount} documents to ${collectionName}`);
        if (skipCount > 0) {
          console.log(`Skipped ${skipCount} existing documents`);
        }
        if (errorCount > 0) {
          console.warn(`Encountered ${errorCount} errors while restoring ${collectionName}`);
        }
        
      } catch (error) {
        console.error(`Error restoring collection ${collectionName}:`, error);
        results.errors.push(`Error restoring ${collectionName}: ${error.message}`);
        results.success = false;
      }
    }
    
    console.log('Restore operation completed');
    return results;
    
  } catch (error) {
    console.error('Error during restore:', error);
    throw error;
  }
};

/**
 * Downloads a backup file
 * @param {Object} backupData - The backup data to download
 * @param {string} [filename='firestore-backup'] - The base filename to use
 */
export const downloadBackup = (backupData, filename = 'firestore-backup') => {
  try {
    // Add timestamp to filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('+')[0];
    const fullFilename = `${filename}-${timestamp}.json`;
    
    // Create download link
    const dataStr = 'data:text/json;charset=utf-8,' + 
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fullFilename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    console.log(`Backup downloaded as ${fullFilename}`);
    return true;
  } catch (error) {
    console.error('Error downloading backup:', error);
    return false;
  }
};

/**
 * Handles file selection for restore
 * @param {Event} event - The file input change event
 * @returns {Promise<Object>} The parsed backup data
 */
export const handleBackupFileSelect = (event) => {
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    if (!file) {
      return reject(new Error('No file selected'));
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        if (!backupData._backupInfo) {
          throw new Error('Invalid backup file format');
        }
        resolve(backupData);
      } catch (error) {
        reject(new Error('Error parsing backup file: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};
