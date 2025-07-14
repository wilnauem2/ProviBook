import { ref } from 'vue'

export const currentEnvironment = ref('test') // or 'production' as default

import { fetchInvoices, fetchInsurers } from '../firebaseInvoices';

export const getInsurersData = async () => {
  try {
    // Load insurers from Firestore based on current environment
    const env = currentEnvironment.value;
    console.log(`[DEBUG] Loading insurers data for environment: ${env}`);
    
    const insurersData = await fetchInsurers(env);
    console.log(`[DEBUG] Fetched ${insurersData.length} insurers from Firestore`);
    
    let lastInvoicesData = {};
    try {
      lastInvoicesData = await fetchInvoices(env) || {};
      console.log(`[DEBUG] Fetched last_invoices data:`, lastInvoicesData);
    } catch (e) {
      console.error('[DEBUG] Error loading last_invoices from Firestore:', e);
      lastInvoicesData = {};
    }
    
    // Merge last_invoice data into insurers while preserving all other properties including formats
    const mergedData = insurersData.map(insurer => {
      const lastInvoice = lastInvoicesData[insurer.name] || '';
      console.log(`[DEBUG] For insurer ${insurer.name}, found last_invoice:`, lastInvoice);
      
      const mergedInsurer = {
        ...insurer,
        last_invoice: lastInvoice
      };
      
      // Log the insurer data for debugging
      console.log(`[DEBUG] Merged insurer: ${insurer.name}`, {
        id: insurer.id,
        name: insurer.name,
        hasLastInvoice: !!lastInvoice,
        lastInvoiceType: typeof lastInvoice,
        lastInvoiceValue: lastInvoice
      });
      
      return mergedInsurer;
    });
    
    console.log(`[DEBUG] Returning ${mergedData.length} merged insurers`);
    return mergedData;
  } catch (error) {
    console.error('[DEBUG] Error loading insurers data:', error);
    return [];
  }
};

// This function is deprecated. Use saveInvoices from firebaseInvoices.js instead.
export const updateLastInvoice = async (insurerName, newDate) => {
  console.error('updateLastInvoice: This function is deprecated. Use saveInvoices from firebaseInvoices.js instead.');
  return false;
};
