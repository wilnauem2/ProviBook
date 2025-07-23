import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, updateDoc, getDoc, collection, getDocs, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
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

  // Getters
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
      return;
    }

    dataMode.value = newMode;
    isLoading.value = true;
    error.value = null;

    try {
      const insurerCollectionName = collections.value.insurers;
      const insurersSnapshot = await getDocs(collection(db, insurerCollectionName));

      const newInsurers = [];
      const newLastInvoices = {};

      for (const doc of insurersSnapshot.docs) {
        const insurerData = { id: doc.id, ...doc.data() };
        newInsurers.push(insurerData);

        // Correctly and robustly read the last_invoice from the insurer document.
        if (insurerData.last_invoice) {
          newLastInvoices[doc.id] = insurerData.last_invoice;
        }
      }

      insurers.value = newInsurers;
      lastInvoices.value = newLastInvoices;
    } catch (err) {
      console.error('Error fetching data from store:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const setSelectedInsurer = (insurer) => {
    selectedInsurer.value = insurer ? { ...insurer } : null;
  };

  const clearSelectedInsurer = () => {
    selectedInsurer.value = null;
  };

  const updateInsurerLastInvoice = async (insurerId, lastInvoice) => {
    try {
      isLoading.value = true;
      const insurerRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerRef, { last_invoice: lastInvoice });

      const index = insurers.value.findIndex(i => i.id === insurerId);
      if (index !== -1) insurers.value[index].last_invoice = lastInvoice;
      
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value.last_invoice = lastInvoice;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSettlementHistory = async (insurerId) => {
    isLoading.value = true;
    try {
      // Environment mapping matches actual Firestore data structure
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const invoicesCollectionRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      const invoicesSnapshot = await getDocs(invoicesCollectionRef);
      
      settlementHistories.value[insurerId] = invoicesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date || 0);
          const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date || 0);
          return dateB - dateA;
        });
    } catch (err) {
      console.error('Error fetching settlement history:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const addInsurer = async (insurerData) => {
    isLoading.value = true;
    try {
      const insurerCollectionName = collections.value.insurers;
      const docRef = await addDoc(collection(db, insurerCollectionName), {
        ...insurerData,
        createdAt: serverTimestamp()
      });
      insurers.value.push({ id: docRef.id, ...insurerData });
    } catch (err) {
      console.error('Error adding insurer:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    isLoading.value = true;
    try {
      if (!insurerId || !invoiceData) throw new Error('Invalid insurer ID or invoice data');

      // Environment mapping matches actual Firestore data structure
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      const invoicesCollectionRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);

      const invoiceToSave = {
        ...invoiceData,
        date: invoiceData.date || new Date(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(invoicesCollectionRef, invoiceToSave);
      const newSettlementDoc = await getDoc(docRef);
      const newSettlement = { id: newSettlementDoc.id, ...newSettlementDoc.data() };

      const currentHistory = settlementHistories.value[insurerId] || [];
      settlementHistories.value[insurerId] = [newSettlement, ...currentHistory];

      // Also update the lastInvoices map to ensure the tile UI updates reactively.
      lastInvoices.value[insurerId] = { ...newSettlement };

            // Persist this new settlement to the parent insurer's `last_invoice` field.
      const insurerDocRef = doc(db, collections.value.insurers, insurerId);
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
    isLoading.value = true;
    try {
      const insurerDocRef = doc(db, collections.value.insurers, insurerId);
      await updateDoc(insurerDocRef, updateData);

      const insurerIndex = insurers.value.findIndex(ins => ins.id === insurerId);
      if (insurerIndex !== -1) {
        insurers.value[insurerIndex] = { ...insurers.value[insurerIndex], ...updateData };
      }
      if (selectedInsurer.value && selectedInsurer.value.id === insurerId) {
        selectedInsurer.value = { ...selectedInsurer.value, ...updateData };
      }
    } catch (err) {
      console.error('Error updating insurer:', err);
      error.value = err.message;
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

  return {
    insurers,
    selectedInsurer,
    lastInvoices,
    settlementHistories,
    isLoading,
    error,
    dataMode,
    collections,
    switchEnvironmentAndFetchData,
    setSelectedInsurer,
    clearSelectedInsurer,
    updateInsurerLastInvoice,
    fetchSettlementHistory,
    addInsurer,
    addInvoiceToHistory,
    updateInsurer,
    deleteInsurer,
    deleteSettlement,
    updateLastInvoice
  };
});