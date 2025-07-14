// Script to import last_invoices.json into Firestore as 'last_invoices' document
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const invoicesPath = path.join(__dirname, 'src', 'data', 'last_invoices.json');
const collectionName = 'invoices';
const docName = 'last_invoices';

async function importLastInvoices() {
  const data = fs.readFileSync(invoicesPath, 'utf8');
  const invoices = JSON.parse(data);
  await db.collection(collectionName).doc(docName).set(invoices);
  console.log('Imported last_invoices.json to Firestore as last_invoices document.');
  process.exit(0);
}

importLastInvoices().catch(err => {
  console.error('Error importing last_invoices.json:', err);
  process.exit(1);
});
