import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, updateDoc, getDoc, collection, getDocs, addDoc, serverTimestamp, deleteDoc, query, limit, orderBy, startAfter } from 'firebase/firestore';
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
  const collections = computed(() => {
    const isProd = dataMode.value === 'production';
    return {
      insurers: isProd ? 'insurers' : 'insurers_test',
      invoices: isProd ? 'invoices' : 'invoices_test',
    };
  });

  const fetchInsurers = async (reset = false) => {
    try {
      if (reset) {
        insurers.value = [];
        lastVisible.value = null;
        hasMore.value = true;
      }
      
      if (!hasMore.value && !reset) return;
      
      isLoading.value = true;
      const insurersRef = collection(db, collections.value.insurers);
      let queryRef = query(
        insurersRef,
        orderBy('name'),
        limit(pageSize + 1) // Get one extra to check if there are more
      );
      
      if (lastVisible.value && !reset) {
        queryRef = query(
          insurersRef,
          orderBy('name'),
          startAfter(lastVisible.value),
          limit(pageSize + 1)
        );
      }
      
      const snapshot = await getDocs(queryRef);
      const docs = snapshot.docs;
      
      // Check if there are more documents
      hasMore.value = docs.length > pageSize;
      
      // Remove the extra doc we used to check for more
      const docsToAdd = hasMore.value ? docs.slice(0, -1) : docs;
      
      // Update lastVisible for next pagination
      if (docsToAdd.length > 0) {
        lastVisible.value = docsToAdd[docsToAdd.length - 1];
      }
      
      // Add new insurers to the list
      const newInsurers = docsToAdd.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (reset) {
        insurers.value = newInsurers;
      } else {
        insurers.value = [...insurers.value, ...newInsurers];
      }
      
      // Pre-fetch last invoices for the first page
      if (reset && newInsurers.length > 0) {
        preloadLastInvoices(newInsurers);
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
  
  // Preload last invoices for better performance
  const preloadLastInvoices = async (insurersToLoad) => {
    try {
      const batch = [];
      const batchSize = 10;
      
      for (let i = 0; i < insurersToLoad.length; i += batchSize) {
        const batchPromises = insurersToLoad
          .slice(i, i + batchSize)
          .filter(insurer => !lastInvoices.value[insurer.id])
          .map(insurer => 
            getLastInvoice(insurer.id)
              .then(invoice => {
                if (invoice) {
                  lastInvoices.value = {
                    ...lastInvoices.value,
                    [insurer.id]: invoice
                  };
                }
              })
              .catch(console.error)
          );
        
        await Promise.all(batchPromises);
      }
    } catch (err) {
      console.error('Error preloading invoices:', err);
    }
  };

  const getLastInvoice = async (insurerId) => {
    try {
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const insurerCollection = collections.value.insurers; // This already has the correct environment suffix
      
      const invoicesCollectionRef = collection(db, insurerCollection, insurerId, invoicesSubcollection);
      const invoicesSnapshot = await getDocs(invoicesCollectionRef);
      
      const invoices = invoicesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Ensure date is properly formatted
        date: doc.data().date?.toDate ? doc.data().date.toDate() : doc.data().date
      }));
      
      // Sort by date, newest first
      const sortedInvoices = [...invoices].sort((a, b) => {
        const dateA = a.date ? (a.date.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date)) : new Date(0);
        const dateB = b.date ? (b.date.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date)) : new Date(0);
        return dateB - dateA;
      });
      
      return sortedInvoices.length > 0 ? sortedInvoices[0] : null;
    } catch (err) {
      console.error('Error fetching last invoice:', err);
      return null;
    }
  };

  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    isLoading.value = true;
    try {
      if (!insurerId || !invoiceData) throw new Error('Invalid insurer ID or invoice data');

      // Use the correct collection name based on the environment
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const insurerCollection = collections.value.insurers; // This already has the correct environment suffix
      
      console.log(`Adding invoice to collection: ${insurerCollection}/${insurerId}/${invoicesSubcollection}`);
      
      const invoicesCollectionRef = collection(db, insurerCollection, insurerId, invoicesSubcollection);

      const invoiceToSave = {
        ...invoiceData,
        date: invoiceData.date || new Date(),
        createdAt: serverTimestamp(),
      };

      // Add the document to Firestore
      const docRef = await addDoc(invoicesCollectionRef, invoiceToSave);
      const newSettlementDoc = await getDoc(docRef);
      const newSettlement = { 
        id: newSettlementDoc.id, 
        ...newSettlementDoc.data(),
        // Ensure date is properly formatted
        date: newSettlementDoc.data().date?.toDate ? newSettlementDoc.data().date.toDate() : newSettlementDoc.data().date
      };

      console.log('New settlement added:', newSettlement);

      // Update local state
      const currentHistory = settlementHistories.value[insurerId] || [];
      const updatedHistory = [newSettlement, ...currentHistory];
      settlementHistories.value[insurerId] = updatedHistory;

      // Also update the lastInvoices map to ensure the tile UI updates reactively.
      lastInvoices.value[insurerId] = { ...newSettlement };

      // Persist this new settlement to the parent insurer's `last_invoice` field.
      const insurerDocRef = doc(db, insurerCollection, insurerId);
      await updateDoc(insurerDocRef, { 
        last_invoice: newSettlement 
      });

      // Also update the local state for immediate UI reactivity.
      updateLastInvoice(insurerId, newSettlement);

      return newSettlement;
    } catch (err) {
      console.error('Error adding invoice to history:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateInsurer = async (insurerId, updateData) => {
    try {
      const insurerRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerRef, updateData);

      const insurerIndex = insurers.value.findIndex(ins => ins.id === insurerId);
      if (insurerIndex !== -1) {
        insurers.value[insurerIndex] = { ...insurers.value[insurerIndex], ...updateData };
      }
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value = { ...selectedInsurer.value, ...updateData };
      }
      return true;
    } catch (err) {
      console.error('Error updating insurer:', err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteInsurer = async (insurerId) => {
    isLoading.value = true;
    try {
      const insurerDocRef = doc(db, collections.value.insurers, insurerId);
      await deleteDoc(insurerDocRef);

      insurers.value = insurers.value.filter(ins => ins.id !== insurerId);
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value = null;
      }
      if (lastInvoices.value[insurerId]) {
        delete lastInvoices.value[insurerId];
      }
    } catch (err) {
      console.error('Error deleting insurer:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const updateLastInvoice = (insurerId, newInvoice) => {
    if (!lastInvoices.value) lastInvoices.value = {};
    lastInvoices.value[insurerId] = newInvoice;
  };

  const testFirestoreConnection = async () => {
    try {
      const testCollectionRef = collection(db, collections.value.insurers);
      const q = query(testCollectionRef, limit(1));
      await getDocs(q);
      return true;
    } catch (err) {
      console.error('Firestore connection test failed:', err);
      return false;
    }
  };

  const deleteSettlement = async (insurerId, settlementId) => {
    isLoading.value = true;
    try {
      // Environment mapping matches actual Firestore data structure
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const settlementDocRef = doc(db, collections.value.insurers, insurerId, invoicesSubcollection, settlementId);
      await deleteDoc(settlementDocRef);

      if (settlementHistories.value[insurerId]) {
        settlementHistories.value[insurerId] = settlementHistories.value[insurerId].filter(s => s.id !== settlementId);
        
        // If this was the last settlement, also clear the last_invoice
        if (settlementHistories.value[insurerId].length === 0) {
          // Update Firestore document
          const insurerDocRef = doc(db, collections.value.insurers, insurerId);
          await updateDoc(insurerDocRef, { last_invoice: null });
          
          // Update local state
          if (lastInvoices.value[insurerId]) {
            delete lastInvoices.value[insurerId];
          }
          
          // Update the insurer object if it exists in the insurers array
          const insurerIndex = insurers.value.findIndex(ins => ins.id === insurerId);
          if (insurerIndex !== -1) {
            insurers.value[insurerIndex].last_invoice = null;
          }
          
          // Update selected insurer if it's the one we're modifying
          if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
            selectedInsurer.value.last_invoice = null;
          }
        }
      }
    } catch (err) {
      console.error('Error deleting settlement:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // Expose pagination controls
  const loadMoreInsurers = async () => {
    if (isLoading.value || !hasMore.value) return;
    return fetchInsurers(false);
  };
  
  // Reset and reload insurers
  const refreshInsurers = async () => {
    return fetchInsurers(true);
  };

  // Set the selected insurer
  const setSelectedInsurer = (insurer) => {
    selectedInsurer.value = insurer;
  };

  // Clear the selected insurer
  const clearSelectedInsurer = () => {
    selectedInsurer.value = null;
  };

  // Update the last invoice for an insurer
  const updateInsurerLastInvoice = async (insurerId, invoiceData) => {
    try {
      const insurerRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerRef, { last_invoice: invoiceData });
      
      // Update local state
      if (lastInvoices.value[insurerId]) {
        lastInvoices.value[insurerId] = invoiceData;
      }
      
      // Update in insurers list if present
      const insurerIndex = insurers.value.findIndex(ins => ins.id === insurerId);
      if (insurerIndex !== -1) {
        insurers.value[insurerIndex].last_invoice = invoiceData;
      }
      
      // Update selected insurer if it's the one being updated
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value.last_invoice = invoiceData;
      }
      
      return true;
    } catch (err) {
      console.error('Error updating insurer last invoice:', err);
      error.value = err.message;
      throw err;
    }
  };

  // Switch between production and test environments
  async function switchEnvironmentAndFetchData(mode) {
    try {
      // Set the data mode based on the provided mode or toggle if not provided
      if (mode === 'production' || mode === 'test') {
        dataMode.value = mode;
      } else {
        dataMode.value = dataMode.value === 'production' ? 'test' : 'production';
      }
      
      // Reset the insurers and last invoices
      insurers.value = [];
      lastInvoices.value = {};
      
      // Fetch fresh data for the new environment
      await fetchInsurers(true);
      
      return dataMode.value;
    } catch (error) {
      console.error('Error switching environment:', error);
      error.value = error.message;
      throw error;
    }
  }

  // Fetch settlement history for a specific insurer
  async function fetchSettlementHistory(insurerId) {
    if (!insurerId) return [];
    
    try {
      const settlementsRef = collection(db, 'insurers', insurerId, 'settlements');
      const q = query(settlementsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const settlements = [];
      querySnapshot.forEach((doc) => {
        settlements.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return settlements;
    } catch (error) {
      console.error('Error fetching settlement history:', error);
      error.value = error.message;
      return [];
    }
  }

  // Add a new insurer
  async function addInsurer(insurerData) {
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
      
      // Add to local state
      insurers.value.unshift(newInsurer);
      
      return newInsurer;
    } catch (error) {
      console.error('Error adding insurer:', error);
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    insurers,
    selectedInsurer,
    lastInvoices,
    settlementHistories,
    isLoading,
    error,
    dataMode,
    collections,
    hasMore,
    fetchInsurers,
    loadMoreInsurers,
    refreshInsurers,
    setSelectedInsurer,
    clearSelectedInsurer,
    updateInsurerLastInvoice,
    fetchSettlementHistory,
    addInsurer,
    addInvoiceToHistory,
    updateInsurer,
    deleteInsurer,
    updateLastInvoice,
    testFirestoreConnection,
    deleteSettlement,
    switchEnvironmentAndFetchData
  };
});