// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let db;
let app;

console.log('Initializing Firebase...');
console.log('Environment:', import.meta.env.MODE);

// Get environment variables with fallbacks
const getEnv = (key, fallback = '') => {
  const value = import.meta.env[key];
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || fallback;
};

// Log environment variables (without exposing sensitive data)
console.log('Firebase config check:', {
  hasApiKey: !!getEnv('VITE_FIREBASE_API_KEY'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'MISSING'),
  appId: getEnv('VITE_FIREBASE_APP_ID', 'MISSING')
});

try {
  const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID')
  };

  // Validate required fields
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key is missing. Please check your environment variables.');
  }

  if (!firebaseConfig.projectId) {
    throw new Error('Firebase Project ID is missing. Please check your environment variables.');
  }

    console.log('Initializing Firebase with config:', { 
        ...firebaseConfig, 
        apiKey: '***' // Don't log the actual API key
    });

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Create a user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '0';
    errorMessage.style.left = '0';
    errorMessage.style.right = '0';
    errorMessage.style.backgroundColor = '#fee2e2';
    errorMessage.style.color = '#b91c1c';
    errorMessage.style.padding = '1rem';
    errorMessage.style.zIndex = '9999';
    errorMessage.style.fontFamily = 'sans-serif';
    errorMessage.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Initialization Error</h2>
            <p style="margin: 0 0 0.5rem 0;">${error.message}</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem;">Please check the browser console for more details.</p>
            <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background-color: #b91c1c; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
                Reload Page
            </button>
        </div>
    `;
    document.body.prepend(errorMessage);
    throw error; // Re-throw to be caught by the global error handler
}

export { db, app };
