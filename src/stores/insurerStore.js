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

      // First, get the insurers
      const insurersSnapshot = await getDocs(collection(db, insurerCollectionName));
      insurers.value = insurersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Initialize lastInvoices
      lastInvoices.value = {};
      
      // In test mode, we need to get the last invoice from each insurer's subcollection
      // since the top-level last_invoices document might not be maintained
      if (dataMode.value === 'test') {
        console.log('Test mode: Fetching last invoices from insurer subcollections...');
        
        // For each insurer, get the most recent invoice from their invoice-history subcollection
        for (const insurer of insurers.value) {
          try {
            // Use the correct subcollection name based on environment
            const invoicesSubcollection = dataMode.value === 'test' ? 'invoice-history-test' : 'invoice-history';
            const invoicesCollectionRef = collection(db, insurerCollectionName, insurer.id, invoicesSubcollection);
            const invoicesSnapshot = await getDocs(invoicesCollectionRef);
            
            console.log(`Fetching last invoices from: ${insurerCollectionName}/${insurer.id}/${invoicesSubcollection}`);
            
            if (!invoicesSnapshot.empty) {
              // Get all invoices and sort by date (newest first)
              const invoices = invoicesSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => {
                  const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date || 0);
                  const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date || 0);
                  return dateB - dateA; // Newest first
                });
              
              // Store the most recent invoice
              if (invoices.length > 0) {
                lastInvoices.value[insurer.id] = {
                  datum: invoices[0].date,
                  display: invoices[0].date?.seconds 
                    ? new Date(invoices[0].date.seconds * 1000).toLocaleDateString() 
                    : new Date(invoices[0].date).toLocaleDateString()
                };
              }
            }
          } catch (err) {
            console.error(`Error fetching invoices for insurer ${insurer.id}:`, err);
          }
        }
      } else {
        // In production mode, use the top-level last_invoices document as before
        const invoicesDoc = await getDoc(doc(db, invoicesCollectionName, invoicesDocName));
        
        if (invoicesDoc.exists()) {
          lastInvoices.value = invoicesDoc.data();
        } else {
          console.warn(`Invoices document '${invoicesDocName}' not found in collection '${invoicesCollectionName}'.`);
        }
      }

      console.log('Store: Data fetching complete. Last invoices:', lastInvoices.value);

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
      // Use the correct subcollection name based on environment
      const invoicesSubcollection = dataMode.value === 'test' ? 'invoice-history-test' : 'invoice-history';
      console.log(`Fetching invoices for insurer ${insurerId} from '${invoicesSubcollection}' subcollection...`);
      
      // Use the correct subcollection based on environment
      const invoicesCollectionRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      const invoicesSnapshot = await getDocs(invoicesCollectionRef);
      
      // Map the documents and sort by date
      settlementHistory.value = invoicesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          // Handle both date formats (timestamp or ISO string)
          const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date || 0);
          const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date || 0);
          return dateB - dateA; // Sort descending (newest first)
        });
      
      console.log(`Fetched ${settlementHistory.value.length} invoices for insurer ${insurerId}`);
    } catch (err) {
      console.error('Error fetching settlement history:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

    const addInsurer = async (insurerData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const insurerCollectionName = collections.value.insurers;
      const docRef = await addDoc(collection(db, insurerCollectionName), {
        ...insurerData,
        createdAt: serverTimestamp()
      });
      // Add the new insurer to the local state for immediate UI update
      insurers.value.push({ id: docRef.id, ...insurerData });
      console.log('New insurer added with ID:', docRef.id);
    } catch (err) {
      console.error('Error adding insurer:', err);
      error.value = err.message;
    }
    finally {
      isLoading.value = false;
    }
  };

  const addInvoiceToHistory = async (insurerId, invoiceData) => {
    isLoading.value = true;
    let docRef = null;
    
    try {
      console.log(`Adding invoice to insurer ${insurerId} in 'invoice-history' subcollection...`);
      
      // Validate inputs
      if (!insurerId) {
        throw new Error('Invalid insurer ID provided');
      }
      
      if (!invoiceData) {
        throw new Error('Invalid invoice data provided');
      }
      
      // Use the correct subcollection name based on environment
      const invoicesSubcollection = dataMode.value === 'test' ? 'invoice-history-test' : 'invoice-history';
      console.log(`Adding invoice to: ${collections.value.insurers}/${insurerId}/${invoicesSubcollection}`);
      
      // Save to the correct subcollection based on environment
      const invoicesCollectionRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
      
      // Add additional fields needed for Abrechnungen display
      const invoiceToSave = {
        ...invoiceData,
        date: invoiceData.date || new Date().toISOString(),
        documentType: invoiceData.documentType || 'invoice',
        status: invoiceData.status || 'completed',
        createdAt: serverTimestamp(),
        insurerId: insurerId // Add the insurerId for reference
      };
      
      // Save the document and get the reference
      docRef = await addDoc(invoicesCollectionRef, invoiceToSave);
      console.log(`Invoice saved successfully with ID: ${docRef.id}`);
      
      // No longer update the last_invoice field on the insurer document
      // as per requirement to only store invoice data in subcollections
      
      // Return the full document reference
      return docRef;
    } catch (err) {
      console.error('Error adding invoice to history:', err);
      error.value = err.message;
      throw err;
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
    addInsurer,
    testFirestoreConnection,
    debugStoreState
  };
});