// Script to import last_invoices.test.json into Firestore as 'last_invoices_test' document
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const invoicesPath = path.join(__dirname, 'src', 'data', 'environments', 'last_invoices.test.json');
const collectionName = 'invoices_test';
const docName = 'last_invoices_test';

async function importLastInvoices() {
  const data = fs.readFileSync(invoicesPath, 'utf8');
  const invoices = JSON.parse(data);
  await db.collection(collectionName).doc(docName).set(invoices);
  console.log('Imported last_invoices.test.json to Firestore as last_invoices_test document.');
  process.exit(0);
}

importLastInvoices().catch(err => {
  console.error('Error importing last_invoices.test.json:', err);
  process.exit(1);
});
