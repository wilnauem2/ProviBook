// Firebase configuration and initialization
// IMPORTANT: Replace the below config object with your own Firebase project credentials!
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "beamtenprovi.firebaseapp.com",
    projectId: "beamtenprovi",
    storageBucket: "beamtenprovi.firebasestorage.app",
    messagingSenderId: "719958136121",
    appId: "1:719958136121:web:74379fdb2c0c7c942384e8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
