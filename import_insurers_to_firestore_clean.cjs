// Usage: node import_insurers_to_firestore_clean.cjs
// Make sure you have serviceAccountKey.json in your project root
// and src/data/insurers_clean.json exists.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
const insurersPath = path.resolve(__dirname, 'src', 'data', 'insurers_clean.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing serviceAccountKey.json in project root. Download it from Firebase Console > Project Settings > Service Accounts.');
  process.exit(1);
}

if (!fs.existsSync(insurersPath)) {
  console.error('Missing insurers_clean.json at src/data/insurers_clean.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

async function importInsurers() {
  const insurers = JSON.parse(fs.readFileSync(insurersPath, 'utf-8'));
  if (!Array.isArray(insurers)) {
    console.error('insurers_clean.json must be an array of insurer objects!');
    process.exit(1);
  }
  const batch = db.batch();
  insurers.forEach(insurer => {
    if (!insurer.name || !insurer.name.trim()) {
      console.warn('Skipping insurer with no name:', insurer);
      return;
    }
    // Sanitize document ID
    const sanitizedId = insurer.name
      .replace(/[\/#.\[\]]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    if (!sanitizedId) {
      console.warn('Skipping insurer with invalid sanitized name:', insurer.name);
      return;
    }
    const docRef = db.collection('insurers').doc(sanitizedId);
    batch.set(docRef, insurer);
  });
  await batch.commit();
  console.log(`Imported ${insurers.length} insurers to Firestore.`);
}

importInsurers().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
