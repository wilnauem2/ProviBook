// Script to import insurers.test.json into Firestore as 'insurers_test' collection
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const insurersPath = path.join(__dirname, 'src', 'data', 'environments', 'insurers.test.json');
const collectionName = 'insurers_test';

async function importInsurers() {
  const data = fs.readFileSync(insurersPath, 'utf8');
  const insurers = JSON.parse(data);
  let count = 0;
  for (const insurer of insurers) {
    if (insurer.name) {
      // Sanitize document ID
      const docId = insurer.name.replace(/[\/.#\[\]]/g, '-').trim();
      await db.collection(collectionName).doc(docId).set(insurer);
      count++;
    }
  }
  console.log(`Imported ${count} test insurers to Firestore.`);
  process.exit(0);
}

importInsurers().catch(err => {
  console.error('Error importing test insurers:', err);
  process.exit(1);
});
