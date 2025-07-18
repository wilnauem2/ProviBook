import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, updateDoc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const settlementHistory = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const dataMode = ref('production'); // 'production' or 'test'

  // Getters - Computed properties to get collection names based on dataMode
  const collections = computed(() => {
    const isProd = dataMode.value === 'production';
    return {
      insurers: isProd ? 'insurers' : 'insurers_test',
      invoices: isProd ? 'invoices' : 'invoices_test',
    };
  });

  // Actions
  const switchEnvironmentAndFetchData = async (newMode) => {
    if (!['production', 'test'].includes(newMode)) {
      error.value = 'Invalid environment mode specified.';
      console.error(error.value, newMode);
      return;
    }

    dataMode.value = newMode;
    isLoading.value = true;
    error.value = null;

    try {
      console.log(`Store: Fetching data for ${dataMode.value} environment...`);
      
      const insurerCollectionName = collections.value.insurers;
      const invoicesDocName = 'last_invoices';
      const invoicesCollectionName = collections.value.invoices;

      const [insurersSnapshot, invoicesDoc] = await Promise.all([
        getDocs(collection(db, insurerCollectionName)),
        getDoc(doc(db, invoicesCollectionName, invoicesDocName))
      ]);

      insurers.value = insurersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (invoicesDoc.exists()) {
        lastInvoices.value = invoicesDoc.data();
      } else {
        lastInvoices.value = {};
        console.warn(`Invoices document '${invoicesDocName}' not found in collection '${invoicesCollectionName}'.`);
      }

      console.log('Store: Data fetching complete.');

    } catch (err) {
      console.error('Error fetching data from store:', err);
      error.value = err.message;
      insurers.value = [];
      lastInvoices.value = {};
    } finally {
      isLoading.value = false;
    }
  };

  function setSelectedInsurer(insurer) {
    selectedInsurer.value = insurer ? { ...insurer } : null;
  }

  function clearSelectedInsurer() {
    selectedInsurer.value = null;
    settlementHistory.value = [];
  }

  async function updateInsurerLastInvoice(insurerId, lastInvoice) {
    try {
      isLoading.value = true;
      const insurerRef = doc(db, collections.value.insurers, insurerId);
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

  const fetchSettlementHistory = async (insurerId) => {
    isLoading.value = true;
    try {
      const historyCollectionRef = collection(db, collections.value.insurers, insurerId, 'settlement_history');
      const historySnapshot = await getDocs(historyCollectionRef);
      settlementHistory.value = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.date.seconds - a.date.seconds);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    isLoading.value = true;
    try {
      const historyCollectionRef = collection(db, collections.value.insurers, insurerId, 'settlement_history');
      await addDoc(historyCollectionRef, {
        ...invoiceData,
        createdAt: serverTimestamp()
      });
      await updateInsurerLastInvoice(insurerId, invoiceData);
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

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
    console.log('Data Mode:', dataMode.value);
    console.log('-------------------------');
  };

  return {
    // State
    insurers,
    selectedInsurer,
    lastInvoices,
    settlementHistory,
    isLoading,
    error,
    dataMode,

    // Getters
    collections,

    // Actions
    switchEnvironmentAndFetchData,
    setSelectedInsurer,
    clearSelectedInsurer,
    updateInsurerLastInvoice,
    fetchSettlementHistory,
    addInvoiceToHistory,
    testFirestoreConnection,
    debugStoreState
  };
});