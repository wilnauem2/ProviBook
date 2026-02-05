// Script to clone all insurers from 'insurers' collection to 'gdv-data' collection
// Run with: node scripts/cloneInsurersToGdv.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - same as in firebase.js
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCnSIqvMvYlovpbCfnZL_BVa0E4MCs2eYk",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "provisionscheck.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "provisionscheck",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "provisionscheck.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "862215795498",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:862215795498:web:fec5e8c8a12345abcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cloneInsurersToGdv() {
  console.log('Starting to clone insurers to GDV...');
  
  try {
    // Fetch all insurers
    const insurersRef = collection(db, 'insurers');
    const snapshot = await getDocs(insurersRef);
    
    console.log(`Found ${snapshot.size} insurers to clone`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const doc of snapshot.docs) {
      const insurerData = doc.data();
      
      // Create GDV entry with default values
      const gdvEntry = {
        name: insurerData.name || 'Unbekannt',
        delivers_gdv: true, // Default: liefert GDV-Daten
        versandarten: [], // Empty, to be filled manually
        portal_link: '',
        frequency: '', // To be filled manually
        bestandsart: '', // To be filled manually
        last_import: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        // Keep reference to original insurer
        original_insurer_id: doc.id
      };
      
      try {
        const gdvRef = collection(db, 'gdv-data');
        await addDoc(gdvRef, gdvEntry);
        successCount++;
        console.log(`✓ Cloned: ${insurerData.name}`);
      } catch (err) {
        errorCount++;
        console.error(`✗ Failed to clone ${insurerData.name}:`, err.message);
      }
    }
    
    console.log('\n--- Summary ---');
    console.log(`Successfully cloned: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log('Done!');
    
  } catch (err) {
    console.error('Error fetching insurers:', err);
  }
  
  process.exit(0);
}

cloneInsurersToGdv();
