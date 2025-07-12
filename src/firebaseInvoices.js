// Utility functions for reading/writing invoices and insurers from Firestore
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';

function getFirestoreNames(environment = 'production') {
  const IS_TEST = environment === 'test';
  return {
    COLLECTION_NAME: IS_TEST ? 'invoices_test' : 'invoices',
    DOC_NAME: IS_TEST ? 'last_invoices_test' : 'last_invoices',
    INSURERS_COLLECTION: IS_TEST ? 'insurers_test' : 'insurers',
  };
}

// Fetch invoices JSON from Firestore
export async function fetchInvoices(environment = 'production') {
  const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames(environment);
  const docRef = doc(collection(db, COLLECTION_NAME), DOC_NAME);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null; // No data found
  }
}

// Save invoices to Firestore
export const saveInvoices = async (data, environment = 'production') => {
  try {
    const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames(environment);
    const docRef = doc(collection(db, COLLECTION_NAME), DOC_NAME);
    
    console.log('Saving invoices to Firestore:', data);
    
    // Get the current document first
    const docSnap = await getDoc(docRef);
    let currentData = {};
    
    if (docSnap.exists()) {
      currentData = docSnap.data();
      console.log('Current Firestore data:', currentData);
    }
    
    // If we received an object with lastInvoices and allInvoices, use it as is
    // Otherwise, assume it's the old format and save to both fields for backward compatibility
    let saveData;
    
    if (data.lastInvoices !== undefined && data.allInvoices !== undefined) {
      // For new format, we need to merge the invoice arrays
      const mergedLastInvoices = { ...(currentData.lastInvoices || {}), ...data.lastInvoices };
      
      // For allInvoices, we need to merge the arrays for each insurer
      const mergedAllInvoices = { ...(currentData.allInvoices || {}) };
      
      // Merge the invoices for each insurer
      Object.entries(data.allInvoices).forEach(([insurerName, invoices]) => {
        if (Array.isArray(invoices) && invoices.length > 0) {
          const existingInvoices = Array.isArray(mergedAllInvoices[insurerName]) 
            ? mergedAllInvoices[insurerName] 
            : [];
          
          // Create a map of existing invoices by date to avoid duplicates
          const invoiceMap = new Map();
          
          // Add existing invoices to the map
          existingInvoices.forEach(inv => {
            const date = inv.display || String(inv);
            invoiceMap.set(date, inv);
          });
          
          // Add new invoices, overwriting any with the same date
          invoices.forEach(inv => {
            const date = inv.display || String(inv);
            invoiceMap.set(date, inv);
          });
          
          // Convert back to array and sort by timestamp (newest first)
          mergedAllInvoices[insurerName] = Array.from(invoiceMap.values())
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        } else if (!mergedAllInvoices[insurerName]) {
          // Only set if it doesn't exist yet
          mergedAllInvoices[insurerName] = [];
        }
      });
      
      saveData = {
        lastInvoices: mergedLastInvoices,
        allInvoices: mergedAllInvoices
      };
    } else {
      // Old format - convert to new format
      saveData = {
        lastInvoices: data,
        allInvoices: data
      };
    }
    
    console.log('Merged data to save:', saveData);
    
    // Use setDoc with merge: false to completely replace the document
    await setDoc(docRef, saveData, { merge: false });
    console.log('Invoices saved to Firestore');
    return saveData;
  } catch (error) {
    console.error('Error saving invoices to Firestore:', error);
    throw error;
  }
};

// Subscribe to real-time updates for invoices
export function subscribeInvoices(callback, environment = 'production') {
  const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames(environment);
  const docRef = doc(collection(db, COLLECTION_NAME), DOC_NAME);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({});
    }
  });
}

// Fetch all insurers from Firestore
export async function fetchInsurers(environment = 'production') {
  const { INSURERS_COLLECTION } = getFirestoreNames(environment);
  const insurersCol = collection(db, INSURERS_COLLECTION);
  const snapshot = await getDocs(insurersCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Save or update an insurer in Firestore (optional, for admin use)
export async function saveInsurer(insurer, environment = 'production') {
  if (!insurer || !insurer.name) throw new Error('Insurer must have a name');
  const { INSURERS_COLLECTION } = getFirestoreNames(environment);
  const insurerDoc = doc(collection(db, INSURERS_COLLECTION), insurer.name);
  await setDoc(insurerDoc, insurer);
}
