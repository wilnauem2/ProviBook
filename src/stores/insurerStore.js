import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const isLoading = ref(false);
  const error = ref(null);
  const currentCollection = ref('insurers');

  // Actions
  const fetchInsurers = async (collectionName = 'insurers') => {
    isLoading.value = true;
    try {
      const insurersCollection = collection(db, collectionName);
      const insurerSnapshot = await getDocs(insurersCollection);
      insurers.value = insurerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      currentCollection.value = collectionName;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  function setSelectedInsurer(insurer) {
    selectedInsurer.value = insurer ? { ...insurer } : null;
  }

  function clearSelectedInsurer() {
    selectedInsurer.value = null;
  }

  async function updateInsurerLastInvoice(insurerId, lastInvoice) {
    try {
      isLoading.value = true;
      const insurerRef = doc(db, currentCollection.value, insurerId);
      await updateDoc(insurerRef, { last_invoice: lastInvoice });

      const index = insurers.value.findIndex(i => i.id === insurerId);
      if (index !== -1) {
        insurers.value[index].last_invoice = lastInvoice;
      }
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value.last_invoice = lastInvoice;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  const testFirestoreConnection = async () => {
    try {
      // A lightweight check to confirm Firestore connectivity.
      // We try to get a document that may not exist. A successful response
      // (even if the document doesn't exist) means we are connected.
      const docRef = doc(db, '_internal', 'health');
      await getDoc(docRef);
      return true;
    } catch (e) {
      console.error('Firestore connection test failed:', e);
      return false;
    }
  };

  const debugStoreState = () => {
    console.log('--- Insurer Store State ---');
    console.log('Insurers:', insurers.value);
    console.log('Selected Insurer:', selectedInsurer.value);
    console.log('Last Invoices:', lastInvoices.value);
    console.log('Is Loading:', isLoading.value);
    console.log('Error:', error.value);
    console.log('Current Collection:', currentCollection.value);
    console.log('-------------------------');
  };

  return {
    insurers,
    selectedInsurer,
    lastInvoices,
    isLoading,
    error,
    currentCollection,
    fetchInsurers,
    setSelectedInsurer,
    clearSelectedInsurer,
    updateInsurerLastInvoice,
    testFirestoreConnection,
    debugStoreState
  };
});