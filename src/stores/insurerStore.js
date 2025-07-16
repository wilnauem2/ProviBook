console.log('=== insurerStore.js: Initializing store ===');

import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { getFirestore, doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
console.log('Firestore instance in store:', db ? 'Available' : 'Not available');

// Use the pre-initialized Firestore instance
// No need to initialize Firestore again as it's already done in firebase.js

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const isLoading = ref(false);
  const error = ref(null);
  const currentCollection = ref('insurers'); // To track the current collection ('insurers' or 'insurers_test')

  // Getters
  const getInsurerById = computed(() => {
    return (id) => insurers.value.find(insurer => insurer.id === id);
  });

  // Actions
  const fetchInsurers = async (collectionName = 'insurers') => {
    console.log(`Fetching insurers from Firestore collection: ${collectionName}...`);
    isLoading.value = true;
    try {
      const db = getFirestore();
      const insurersCollection = collection(db, collectionName);
      const insurerSnapshot = await getDocs(insurersCollection);
      const insurersList = insurerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInsurers(insurersList);
      currentCollection.value = collectionName; // Track the current collection
      console.log(`Successfully fetched ${insurersList.length} insurers from ${collectionName}.`);
    } catch (err) {
      console.error(`Error fetching insurers from ${collectionName}:`, err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };



  function setInsurers(insurersList) {
    console.log('Setting insurers in store. Count:', insurersList?.length || 0);
    if (insurersList) {
      console.log('Sample insurer data:', JSON.stringify(insurersList[0] || {}, null, 2));
    }
    insurers.value = insurersList || [];
  }

  function setSelectedInsurer(insurer) {
    console.log('Setting selected insurer in store:', insurer);
    selectedInsurer.value = insurer ? { ...insurer } : null;
  }

  function setLastInvoices(invoicesData) {
    console.log('Setting last invoices in store:', invoicesData);
    lastInvoices.value = { ...invoicesData };
  }

  async function updateInsurerLastInvoice(insurerId, lastInvoice) {
    console.log('=== updateInsurerLastInvoice ===');
    console.log('Updating insurer last invoice in store:', { insurerId, lastInvoice });
    
    try {
      isLoading.value = true;
      error.value = null;

      // Find the insurer in the local state
      const index = insurers.value.findIndex(i => i.id === insurerId);
      
      if (index === -1) {
        throw new Error(`Insurer with ID ${insurerId} not found`);
      }

      // Create a deep copy of the insurer
      const updatedInsurer = JSON.parse(JSON.stringify(insurers.value[index]));
      
      // Update the last_invoice field
      updatedInsurer.last_invoice = lastInvoice;
      
      console.log('Updated insurer object:', updatedInsurer);

      // Update the local state with immutable operations to ensure reactivity
      const newInsurers = [...insurers.value];
      newInsurers[index] = updatedInsurer;
      insurers.value = newInsurers;

      // If this is the selected insurer, update it too
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value = { ...updatedInsurer };
      }

      // Update in Firebase (if needed)
      try {
        const db = getFirestore();
        const insurerCollectionName = currentCollection.value;
        const invoiceCollectionName = insurerCollectionName.replace('insurers', 'invoices');

        console.log(`Updating document in '${insurerCollectionName}' and '${invoiceCollectionName}'`);

        // 1. Update the insurer document in the correct collection
        const insurerRef = doc(db, insurerCollectionName, insurerId);
        await updateDoc(insurerRef, {
          last_invoice: lastInvoice
        });

        // 2. Update the corresponding invoices document
        const invoicesDocRef = doc(db, invoiceCollectionName, 'last_invoices');
        await updateDoc(invoicesDocRef, {
          [updatedInsurer.name]: lastInvoice
        });

        console.log('Firebase updates successful for both collections.');

      } catch (firebaseError) {
        console.error('Firebase update failed:', firebaseError);
        // We don't throw here to keep the UI updated even if Firebase fails
        error.value = 'Failed to save to database, but UI is updated';
      }

      return updatedInsurer;
    } catch (err) {
      console.error('Error updating insurer last invoice:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Debug function to check store state
  function debugStoreState() {
    console.log('=== Store State ===');
    console.log('Insurers count:', insurers.value.length);
    console.log('Selected Insurer:', selectedInsurer.value);
    console.log('Last Invoices count:', Object.keys(lastInvoices.value).length);
    console.log('Is Loading:', isLoading.value);
    console.log('Error:', error.value);
    console.log('===================');
  }

  // Add a function to test Firestore connection
  async function testFirestoreConnection() {
    console.log('Testing Firestore connection...');
    try {
      const testDoc = await getDoc(doc(db, 'test', 'test'));
      console.log('Firestore test query successful');
      return true;
    } catch (err) {
      console.error('Firestore test query failed:', err);
      error.value = `Firestore connection failed: ${err.message}`;
      return false;
    }
  }

  return {
    // State
    insurers,
    selectedInsurer,
    lastInvoices,
    isLoading,
    error,
    
    // Getters
    getInsurerById,
    
    // Debug
    debugStoreState,
    testFirestoreConnection,
    
    // Actions
    fetchInsurers,
    setInsurers,
    setSelectedInsurer,
    setLastInvoices,
    updateInsurerLastInvoice
  };
});
