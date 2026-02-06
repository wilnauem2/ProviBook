import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  doc, updateDoc, getDoc, collection, getDocs, addDoc, 
  serverTimestamp, deleteDoc, query, limit, orderBy, startAfter 
} from 'firebase/firestore';
import { useInsurerUtils } from '@/composables/useInsurerUtils';
import { db } from '../firebase';

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const settlementHistories = ref({});
  const isLoading = ref(false);
  const error = ref(null);
  const dataMode = ref('production');

  // Pagination state
  const pageSize = 20;
  const lastVisible = ref(null);
  const hasMore = ref(true);

  // Getters
  const collections = computed(() => ({
    insurers: 'insurers',
    invoices: 'invoices',
  }));

  // Fetch all insurers at once
  const fetchInsurers = async () => {
    console.group('fetchInsurers');
    try {
      console.log('[FETCH] Starting to fetch insurers...');
      console.log('[FETCH] Current dataMode:', dataMode.value);
      isLoading.value = true;
      
      // Log the collection name being queried
      const collectionName = collections.value.insurers;
      console.log('[FETCH] Using collection:', collectionName);
      
      const insurersRef = collection(db, collectionName);
      const queryRef = query(insurersRef, orderBy('name'));
      
      console.log('[FETCH] Executing Firestore query...');
      const snapshot = await getDocs(queryRef);
      console.log(`[FETCH] Query complete. Found ${snapshot.size} documents.`);
      
      if (snapshot.empty) {
        console.warn('[FETCH] No documents found in collection:', collectionName);
      }
      
      const newInsurers = [];
      snapshot.forEach(doc => {
        try {
          console.log(`[FETCH] Processing document ${doc.id}`, doc.data());
          newInsurers.push({
            id: doc.id,
            ...doc.data()
          });
        } catch (docErr) {
          console.error(`Error processing document ${doc.id}:`, docErr);
        }
      });
      
      console.log('[FETCH] Processed documents:', {
        count: snapshot.size,
        firstDoc: snapshot.docs.length > 0 ? snapshot.docs[0].id : 'No documents',
        allDocs: snapshot.docs.map(doc => doc.id)
      });
      
      console.log('[FETCH] Processed insurers:', {
        count: newInsurers.length,
        firstInsurer: newInsurers.length > 0 ? newInsurers[0] : 'No insurers'
      });
      
      console.log('[FETCH] Updating state with', newInsurers.length, 'insurers');
      console.log('[FETCH] State before update:', {
        isLoading: isLoading.value,
        error: error.value
      });
      
      // Update state
      isLoading.value = false;
      error.value = null;
      insurers.value = newInsurers;  // Fixed: Changed companies to insurers
      
      console.log('[FETCH] State after update:', {
        isLoading: isLoading.value,
        error: error.value,
        insurersCount: insurers.value.length
      });
      
      if (newInsurers.length > 0) {
        // Preload last invoices for all insurers
        console.log('[FETCH] Preloading last invoices...');
        await preloadLastInvoices(newInsurers);
        console.log('[FETCH] Finished preloading last invoices');
      } else {
        console.warn('[FETCH] No insurers to preload invoices for');
      }
      
      return newInsurers;
    } catch (err) {
      console.error('Error in fetchInsurers:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code,
        serverResponse: err.serverResponse
      });
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
      console.log('Finished fetching insurers.');
    }
  };

  // Switch between production and test environments function is defined later in the file

  // Preload last invoices for better performance
  const preloadLastInvoices = async (insurersToLoad) => {
    if (!insurersToLoad || !Array.isArray(insurersToLoad) || insurersToLoad.length === 0) {
      console.warn('No insurers provided to preloadLastInvoices');
      return;
    }

    console.log(`Preloading invoices for ${insurersToLoad.length} insurers...`);
    
    try {
      const batchSize = 10;
      let processedCount = 0;
      
      for (let i = 0; i < insurersToLoad.length; i += batchSize) {
        const batch = insurersToLoad.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(insurersToLoad.length / batchSize)}`);
        
        await Promise.all(batch.map(insurer => {
          if (!insurer || !insurer.id) {
            console.warn('Invalid insurer in batch:', insurer);
            return Promise.resolve();
          }
          
          console.log(`Fetching last invoice for insurer ${insurer.id}`);
          return getLastInvoice(insurer.id)
            .then(invoice => {
              if (invoice) {
                lastInvoices.value = {
                  ...lastInvoices.value,
                  [insurer.id]: invoice
                };
                processedCount++;
                console.log(`Successfully loaded invoice for insurer ${insurer.id}`);
              } else {
                console.log(`No invoice found for insurer ${insurer.id}`);
              }
            })
            .catch(err => {
              console.error(`Error loading invoice for insurer ${insurer.id}:`, err);
            });
        }));
      }
      
      console.log(`Successfully preloaded invoices for ${processedCount}/${insurersToLoad.length} insurers`);
    } catch (err) {
      console.error('Error in preloadLastInvoices:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
    }
  };

  // Get the last invoice for an insurer
  const getLastInvoice = async (insurerId) => {
    if (!insurerId) {
      console.warn('No insurerId provided to getLastInvoice');
      return null;
    }
    
    try {
      const invoicesSubcollection = 'invoice-history';
      const collectionPath = `${collections.value.insurers}/${insurerId}/${invoicesSubcollection}`;
      console.log(`Fetching last invoice from: ${collectionPath}`);
      
      const invoicesRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      const q = query(invoicesRef, orderBy('date', 'desc'), limit(1));
      
      console.log('Executing invoice query...');
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`No invoices found for insurer ${insurerId} in ${collectionPath}`);
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const docData = doc.data();
      
      // Safely handle the date field
      let invoiceDate = null;
      if (docData.date) {
        try {
          invoiceDate = docData.date.toDate ? docData.date.toDate() : docData.date;
          if (invoiceDate instanceof Date && isNaN(invoiceDate.getTime())) {
            console.warn(`Invalid date for invoice ${doc.id}:`, docData.date);
            invoiceDate = null;
          }
        } catch (dateError) {
          console.error(`Error parsing date for invoice ${doc.id}:`, dateError);
        }
      }
      
      const invoice = {
        id: doc.id,
        ...docData,
        date: invoiceDate
      };
      
      console.log(`Found invoice for insurer ${insurerId}:`, {
        id: invoice.id,
        date: invoice.date,
        amount: invoice.amount
      });
      
      return invoice;
    } catch (err) {
      console.error(`Error in getLastInvoice for insurer ${insurerId}:`, {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      return null;
    }
  };

  // Add invoice to history
  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    try {
      if (!insurerId || !invoiceData) throw new Error('Invalid insurer ID or invoice data');
      
      // Use the correct subcollection name based on data mode
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
      
      // Update local settlement histories state
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
      
      // Also update abrechnungStore if it exists (for sync with history view)
      try {
        const { useAbrechnungStore } = await import('./abrechnungStore.js');
        const abrechnungStore = useAbrechnungStore();
        if (abrechnungStore.abrechnungen) {
          const index = abrechnungStore.abrechnungen.findIndex(a => a.id === settlementId);
          if (index !== -1) {
            abrechnungStore.abrechnungen.splice(index, 1);
          }
        }
      } catch (e) {
        console.log('Could not update abrechnungStore:', e);
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
  // Alias for fetchSettlementHistory to maintain backward compatibility
  const fetchSettlements = async (insurerId) => {
    return fetchSettlementHistory(insurerId);
  };

  const fetchSettlementHistory = async (insurerId) => {
    try {
      if (!insurerId) return [];
      
      // Use the correct subcollection name based on data mode
      const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
      
      const settlementsRef = collection(
        db, 
        collections.value.insurers, 
        insurerId, 
        invoicesSubcollection
      );
      
      const q = query(settlementsRef, orderBy('date', 'desc'));
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
        // Initialize new fields with defaults
        loginInfo: insurerData.loginInfo || {
          type: '',
          customNotes: ''
        },
        abrechnungswege: insurerData.abrechnungswege || {
          csv: {
            enabled: false,
            link: '',
            description: ''
          },
          pdf: {
            enabled: false,
            link: '',
            description: ''
          }
        },
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      const newInsurer = {
        id: docRef.id,
        ...insurerData,
        loginInfo: insurerData.loginInfo || {
          type: '',
          customNotes: ''
        },
        abrechnungswege: insurerData.abrechnungswege || {
          csv: {
            enabled: false,
            link: '',
            description: ''
          },
          pdf: {
            enabled: false,
            link: '',
            description: ''
          }
        },
        created_at: new Date(),
        updated_at: new Date()
      };
      
      insurers.value.push(newInsurer);
      insurers.value.sort((a, b) => a.name.localeCompare(b.name));
      return newInsurer;
    } catch (err) {
      console.error('Error adding insurer:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getInsurerStatus = (insurer, currentDate = new Date()) => {
    const { calculateDaysOverdue } = useInsurerUtils();
    const daysOverdue = calculateDaysOverdue(insurer, currentDate);

    // Helper: robust invoice presence check across formats
    const hasInvoice = (() => {
      const inv = insurer.last_invoice || lastInvoices.value[insurer.id];
      if (!inv) return false;
      if (typeof inv === 'string') return inv.trim().length > 0;
      if (inv.seconds) return true; // Firestore Timestamp
      if (inv.date) return true;
      if (inv.datum) return true;
      if (inv.display) return true;
      return false;
    })();

    // If calculation is unknown (missing/invalid data), do NOT mark as overdue
    if (daysOverdue === null || Number.isNaN(daysOverdue)) {
      return hasInvoice ? 'on_time' : 'no_invoice';
    }

    // On or after due date should be considered overdue
    if (daysOverdue > 5) {
      return 'critical';
    }
    if (daysOverdue >= 0) {
      return 'warning'; // 0..5 days overdue (0 means due today)
    }

    // Negative means in the future -> on time
    return 'on_time';
  };

  const switchEnvironmentAndFetchData = async () => {
    await fetchInsurers(true);
    return 'production';
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
    fetchSettlementHistory,
    fetchSettlements,
    getInsurerStatus
  };
});
