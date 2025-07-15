import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

// Initialize Firestore
const db = getFirestore(app);

export const useInsurerStore = defineStore('insurer', () => {
  // State
  const insurers = ref([]);
  const selectedInsurer = ref(null);
  const lastInvoices = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const getInsurerById = computed(() => {
    return (id) => insurers.value.find(insurer => insurer.id === id);
  });

  // Actions
  function setInsurers(insurersList) {
    console.log('Setting insurers in store:', insurersList);
    insurers.value = insurersList;
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
        // 1. Update the insurer document
        const db = getFirestore();
        const insurerRef = doc(db, 'insurers', insurerId);
        
        await updateDoc(insurerRef, {
          last_invoice: lastInvoice
        });
        
        // 2. Also update the last_invoices document in the invoices collection
        // Import the necessary functions
        const { saveInvoices, fetchInvoices } = await import('../firebaseInvoices');
        
        // Get the current environment
        const { currentEnvironment } = await import('../config/environment');
        const env = typeof currentEnvironment === 'function' ? currentEnvironment() : 
                   (currentEnvironment.value || 'test');
        
        // Get current invoices data
        const currentInvoices = await fetchInvoices(env) || {};
        
        // Update the invoice for this insurer
        const updatedInvoices = {
          ...currentInvoices,
          [updatedInsurer.name]: lastInvoice
        };
        
        // Save back to Firebase
        await saveInvoices(updatedInvoices, env);
        
        console.log('Firebase updates successful (both insurer and invoices)');
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

  return {
    // State
    insurers,
    selectedInsurer,
    lastInvoices,
    isLoading,
    error,
    
    // Getters
    getInsurerById,
    
    // Actions
    setInsurers,
    setSelectedInsurer,
    setLastInvoices,
    updateInsurerLastInvoice
  };
});
