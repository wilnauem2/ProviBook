// Utility functions for reading/writing invoices and insurers from Firestore
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';

function getFirestoreNames() {
  // This function now ALWAYS returns production names.
  // The environment switching logic was causing '400 Bad Request' errors in production
  // because the test collections do not exist or are not configured.
  return {
    COLLECTION_NAME: 'invoices',
    DOC_NAME: 'last_invoices',
    INSURERS_COLLECTION: 'insurers',
  };
}

// Fetch invoices JSON from Firestore
export async function fetchInvoices() {
  const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames();
  const docRef = doc(collection(db, COLLECTION_NAME), DOC_NAME);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null; // No data found
  }
}

// Save invoices JSON to Firestore
export async function saveInvoices(data) {
  try {
    console.log('[DEBUG] saveInvoices called.');
    console.log('[DEBUG] Data to save:', JSON.stringify(data, null, 2));
    
    const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames();
    console.log(`[DEBUG] Using collection: ${COLLECTION_NAME}, document: ${DOC_NAME}`);
    
    const docRef = doc(collection(db, COLLECTION_NAME), DOC_NAME);
    console.log('[DEBUG] Document reference created');
    
    // Ensure data is a plain object (not a Proxy or other non-serializable object)
    const cleanData = JSON.parse(JSON.stringify(data));
    console.log('[DEBUG] Data cleaned for Firebase:', cleanData);
    
    await setDoc(docRef, cleanData);
    console.log('[DEBUG] Firebase save completed successfully');
    
    // Verify the save by reading it back
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      console.log('[DEBUG] Verification - Data was saved:', savedDoc.data());
      return true;
    } else {
      console.error('[DEBUG] Verification failed - Document does not exist after save');
      return false;
    }
  } catch (error) {
    console.error('[DEBUG] Error in saveInvoices:', error);
    throw error;
  }
}

// Subscribe to real-time updates for invoices
export function subscribeInvoices(callback) {
  const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames();
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
export async function fetchInsurers() {
  const { INSURERS_COLLECTION } = getFirestoreNames();
  const insurersCol = collection(db, INSURERS_COLLECTION);
  const snapshot = await getDocs(insurersCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Save or update an insurer in Firestore (optional, for admin use)
export async function saveInsurer(insurer) {
  if (!insurer || !insurer.name) throw new Error('Insurer must have a name');
  const { INSURERS_COLLECTION } = getFirestoreNames();
  const insurerDoc = doc(collection(db, INSURERS_COLLECTION), insurer.name);
  await setDoc(insurerDoc, insurer);
}

// Update an insurer's last invoice date in both collections
export async function updateInsurerLastInvoiceDate(insurerId, insurerName, lastInvoice) {
  console.log('[DEBUG] updateInsurerLastInvoiceDate called with:', { insurerId, insurerName, lastInvoice, environment });
  
  try {
    // 1. Update the insurer document
        const { INSURERS_COLLECTION, COLLECTION_NAME, DOC_NAME } = getFirestoreNames();
    
    // Make sure we have valid data
    if (!insurerId) throw new Error('Insurer ID is required');
    if (!insurerName) throw new Error('Insurer name is required');
    if (!lastInvoice) throw new Error('Last invoice data is required');
    
    console.log(`[DEBUG] Updating insurer ${insurerId} in ${INSURERS_COLLECTION}`);
    const insurerRef = doc(db, INSURERS_COLLECTION, insurerId);
    await updateDoc(insurerRef, { last_invoice: lastInvoice });
    console.log('[DEBUG] Insurer document updated successfully');
    
    // 2. Update the invoices collection
    console.log(`[DEBUG] Updating invoices for ${insurerName} in ${COLLECTION_NAME}/${DOC_NAME}`);
    const invoicesRef = doc(db, COLLECTION_NAME, DOC_NAME);
    
    // First get the current data
    const invoicesDoc = await getDoc(invoicesRef);
    let invoicesData = {};
    
    if (invoicesDoc.exists()) {
      invoicesData = invoicesDoc.data();
      console.log('[DEBUG] Existing invoices data:', invoicesData);
    } else {
      console.log('[DEBUG] No existing invoices document, creating new one');
    }
    
    // Update the data for this insurer
    invoicesData[insurerName] = lastInvoice;
    
    // Save it back
    await setDoc(invoicesRef, invoicesData);
    console.log('[DEBUG] Invoices document updated successfully');
    
    return true;
  } catch (error) {
    console.error('[DEBUG] Error in updateInsurerLastInvoiceDate:', error);
    throw error;
  }
}
