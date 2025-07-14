import { ref } from 'vue'

export const currentEnvironment = ref('test') // or 'production' as default

import { fetchInvoices, fetchInsurers } from '../firebaseInvoices';

export const getInsurersData = async () => {
  try {
    // Load insurers from Firestore based on current environment
    const env = currentEnvironment.value;
    const insurersData = await fetchInsurers(env);
    let lastInvoicesData = {};
    try {
      lastInvoicesData = await fetchInvoices(env) || {};
    } catch (e) {
      console.error('Error loading last_invoices from Firestore:', e);
      lastInvoicesData = {};
    }
    // Merge last_invoice data into insurers while preserving all other properties including formats
    return insurersData.map(insurer => {
      const mergedInsurer = {
        ...insurer,
        last_invoice: lastInvoicesData[insurer.name] || ''
      };
      
      // Log the insurer data for debugging
      console.log(`Insurer: ${insurer.name}`, {
        hasFormats: !!insurer.formats,
        formats: insurer.formats,
        mergedFormats: mergedInsurer.formats
      });
      
      return mergedInsurer;
    });
  } catch (error) {
    console.error('Error loading insurers data:', error);
    return [];
  }
};

// This function is deprecated. Use saveInvoices from firebaseInvoices.js instead.
export const updateLastInvoice = async (insurerName, newDate) => {
  console.error('updateLastInvoice: This function is deprecated. Use saveInvoices from firebaseInvoices.js instead.');
  return false;
};
