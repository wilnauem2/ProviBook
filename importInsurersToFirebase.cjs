// Script to import insurers.json into Firestore
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load the service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Path to the insurers.json file
const insurersPath = path.join(__dirname, 'src', 'data', 'insurers.json');
const collectionName = 'insurers';

async function importInsurers() {
  try {
    console.log('Reading insurers data...');
    const data = fs.readFileSync(insurersPath, 'utf8');
    const insurers = JSON.parse(data);
    
    console.log(`Found ${insurers.length} insurers to import...`);
    
    const batch = db.batch();
    const collectionRef = db.collection(collectionName);
    
    // Clear existing collection
    console.log('Clearing existing collection...');
    const snapshot = await collectionRef.get();
    const batchDelete = db.batch();
    snapshot.docs.forEach(doc => {
      batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
    
    // Add new documents
    console.log('Importing new data...');
    for (const insurer of insurers) {
      if (insurer.name) {
        // Sanitize document ID
        const docId = insurer.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const docRef = collectionRef.doc(docId);
        batch.set(docRef, insurer);
      }
    }
    
    // Commit the batch
    console.log('Committing batch...');
    await batch.commit();
    
    console.log(`Successfully imported ${insurers.length} insurers to Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing insurers:', error);
    process.exit(1);
  }
}

// Run the import
importInsurers();
