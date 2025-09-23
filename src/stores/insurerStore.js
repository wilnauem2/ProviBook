import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  doc, updateDoc, getDoc, collection, getDocs, addDoc, 
  serverTimestamp, deleteDoc, query, limit, orderBy, startAfter 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const settlementHistories = ref({});
  const isLoading = ref(false);
  const error = ref(null);
  const dataMode = ref('production'); // 'production' or 'test'

  // Pagination state
  const pageSize = 20;
  const lastVisible = ref(null);
  const hasMore = ref(true);

  // Getters
  const collections = computed(() => ({
    insurers: dataMode.value === 'production' ? 'insurers' : 'insurers_test',
    invoices: dataMode.value === 'production' ? 'invoices' : 'invoices_test',
  }));

  // Fetch all insurers at once
  const fetchInsurers = async () => {
    try {
      isLoading.value = true;
      const insurersRef = collection(db, collections.value.insurers);
      const queryRef = query(insurersRef, orderBy('name'));
      
      const snapshot = await getDocs(queryRef);
      const newInsurers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      insurers.value = newInsurers;
      
      // Preload invoices for all insurers
      if (newInsurers.length > 0) {
        await preloadLastInvoices(newInsurers);
      }
      
      return newInsurers;
    } catch (err) {
      console.error('Error fetching insurers:', err);
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Switch between production and test environments function is defined later in the file

  // Preload last invoices for better performance
  const preloadLastInvoices = async (insurersToLoad) => {
    try {
      const batchSize = 10;
      for (let i = 0; i < insurersToLoad.length; i += batchSize) {
        const batch = insurersToLoad.slice(i, i + batchSize);
        await Promise.all(batch.map(insurer => 
          getLastInvoice(insurer.id).then(invoice => {
            if (invoice) {
              lastInvoices.value = {
                ...lastInvoices.value,
                [insurer.id]: invoice
              };
            }
          })
        ));
      }
    } catch (err) {
      console.error('Error preloading invoices:', err);
    }
  };

  // Get the last invoice for an insurer
  const getLastInvoice = async (insurerId) => {
    try {
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const invoicesRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      const q = query(invoicesRef, orderBy('date', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date
      };
    } catch (err) {
      console.error('Error fetching last invoice:', err);
      return null;
    }
  };

  // Add invoice to history
  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    try {
      if (!insurerId || !invoiceData) throw new Error('Invalid insurer ID or invoice data');
      
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const invoicesRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      
      const invoiceToSave = {
        ...invoiceData,
        date: invoiceData.date || new Date(),
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(invoicesRef, invoiceToSave);
      const newInvoice = {
        id: docRef.id,
        ...invoiceToSave,
        date: invoiceToSave.date.toISOString(),
        createdAt: new Date()
      };
      
      // Update local state
      if (!settlementHistories.value[insurerId]) {
        settlementHistories.value[insurerId] = [];
      }
      settlementHistories.value[insurerId].unshift(newInvoice);
      
      // Update last invoice
      lastInvoices.value[insurerId] = newInvoice;
      
      // Update insurer's last_invoice
      const insurerRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerRef, {
        last_invoice: newInvoice,
        updated_at: serverTimestamp()
      });
      
      return newInvoice;
    } catch (err) {
      console.error('Error adding invoice to history:', err);
      error.value = err.message;
      throw err;
    }
  };

  // Update insurer
  const updateInsurer = async (insurerId, updateData) => {
    try {
      const insurerRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerRef, {
        ...updateData,
        updated_at: serverTimestamp()
      });
      
      // Update local state
      const index = insurers.value.findIndex(i => i.id === insurerId);
      if (index !== -1) {
        insurers.value[index] = {
          ...insurers.value[index],
          ...updateData,
          updated_at: new Date()
        };
      }
      
      if (selectedInsurer.value?.id === insurerId) {
        selectedInsurer.value = {
          ...selectedInsurer.value,
          ...updateData,
          updated_at: new Date()
        };
      }
      
      return true;
    } catch (err) {
      console.error('Error updating insurer:', err);
      error.value = err.message;
      return false;
    }
  };

  // Delete insurer
  const deleteInsurer = async (insurerId) => {
    try {
      await deleteDoc(doc(db, collections.value.insurers, insurerId));
      insurers.value = insurers.value.filter(i => i.id !== insurerId);
      
      if (selectedInsurer.value?.id === insurerId) {
        selectedInsurer.value = null;
      }
      
      if (lastInvoices.value[insurerId]) {
        delete lastInvoices.value[insurerId];
      }
      
      if (settlementHistories.value[insurerId]) {
        delete settlementHistories.value[insurerId];
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting insurer:', err);
      error.value = err.message;
      return false;
    }
  };

  // Update last invoice
  const updateLastInvoice = (insurerId, newInvoice) => {
    if (!lastInvoices.value) lastInvoices.value = {};
    lastInvoices.value[insurerId] = newInvoice;
  };

  // Test Firestore connection
  const testFirestoreConnection = async () => {
    try {
      const q = query(collection(db, collections.value.insurers), limit(1));
      await getDocs(q);
      return true;
    } catch (err) {
      console.error('Firestore connection test failed:', err);
      return false;
    }
  };

  // Delete settlement
  const deleteSettlement = async (insurerId, settlementId) => {
    isLoading.value = true;
    try {
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const settlementRef = doc(db, collections.value.insurers, insurerId, invoicesSubcollection, settlementId);
      
      await deleteDoc(settlementRef);
      
      // Update local state
      if (settlementHistories.value[insurerId]) {
        settlementHistories.value[insurerId] = settlementHistories.value[insurerId]
          .filter(s => s.id !== settlementId);
        
        // If this was the last settlement, clear the last_invoice
        if (settlementHistories.value[insurerId].length === 0) {
          const insurerRef = doc(db, collections.value.insurers, insurerId);
          await updateDoc(insurerRef, { last_invoice: null });
          
          if (lastInvoices.value[insurerId]) {
            delete lastInvoices.value[insurerId];
          }
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting settlement:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Keep this for backward compatibility but make it a no-op
  const loadMoreInsurers = async () => {
    // No-op since we're loading all insurers at once
    return [];
  };

  // Refresh insurers
  const refreshInsurers = async () => {
    await fetchInsurers();
  };

  // Set selected insurer
  const setSelectedInsurer = (insurer) => {
    selectedInsurer.value = insurer;
  };

  // Clear selected insurer
  const clearSelectedInsurer = () => {
    selectedInsurer.value = null;
  };

  // Fetch settlement history for an insurer
  const fetchSettlementHistory = async (insurerId) => {
    try {
      if (!insurerId) return [];
      
      const settlementsRef = collection(
        db, 
        collections.value.insurers, 
        insurerId, 
        dataMode.value === 'production' ? 'settlements' : 'settlements_test'
      );
      
      const q = query(settlementsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const settlements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        settlements.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to Date objects
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      });
      
      // Update the settlement histories
      settlementHistories.value = {
        ...settlementHistories.value,
        [insurerId]: settlements
      };
      
      return settlements;
    } catch (err) {
      console.error('Error fetching settlement history:', err);
      error.value = err.message;
      return [];
    }
  };

  // Add a new insurer
  const addInsurer = async (insurerData) => {
    try {
      isLoading.value = true;
      const insurersRef = collection(db, collections.value.insurers);
      
      const docRef = await addDoc(insurersRef, {
        ...insurerData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      const newInsurer = {
        id: docRef.id,
        ...insurerData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      insurers.value.unshift(newInsurer);
      return newInsurer;
    } catch (err) {
      console.error('Error adding insurer:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Switch between production and test environments
  const switchEnvironmentAndFetchData = async (mode) => {
    try {
      // Set the data mode based on the provided mode or toggle if not provided
      const newMode = (mode === 'production' || mode === 'test') 
        ? mode 
        : (dataMode.value === 'production' ? 'test' : 'production');
      
      console.log(`Switching to ${newMode} environment...`);
      
      // Update the data mode
      dataMode.value = newMode;
      
      // Reset all relevant state
      insurers.value = [];
      lastInvoices.value = {};
      settlementHistories.value = {};
      lastVisible.value = null;
      hasMore.value = true;
      
      console.log('Fetching fresh data for environment:', collections.value.insurers);
      
      // Fetch fresh data for the new environment
      await fetchInsurers(true);
      
      console.log(`Successfully switched to ${newMode} environment`);
      return newMode;
    } catch (err) {
      console.error('Error switching environment:', err);
      error.value = err.message;
      throw err;
    }
  };

  return {
    // State
    insurers,
    selectedInsurer,
    lastInvoices,
    settlementHistories,
    isLoading,
    error,
    dataMode,
    
    // Getters
    collections,
    hasMore,
    
    // Actions
    fetchInsurers,
    loadMoreInsurers,
    refreshInsurers,
    setSelectedInsurer,
    clearSelectedInsurer,
    updateInsurer,
    deleteInsurer,
    addInsurer,
    getLastInvoice,
    addInvoiceToHistory,
    updateLastInvoice,
    testFirestoreConnection,
    deleteSettlement,
    switchEnvironmentAndFetchData,
    fetchSettlementHistory
  };
});
