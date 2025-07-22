import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, collection, getDocs, query, orderBy, limit, startAfter, endBefore, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const useAbrechnungStore = defineStore('abrechnung', () => {
  // State
  const abrechnungen = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const dataMode = ref('production'); // 'production' or 'test'
  const lastDocument = ref(null); // For pagination
  const totalDocuments = ref(0);
  const currentPage = ref(0); // For client-side pagination

  // Getters - Computed properties to get collection names based on dataMode
  const collections = computed(() => {
    const isProd = dataMode.value === 'production';
    return {
      abrechnungen: isProd ? 'abrechnungen' : 'abrechnungen_test'
    };
  });

  // Actions
  const switchEnvironmentAndFetchData = async (mode) => {
    dataMode.value = mode;
    
    // Update collections based on mode
    collections.value = {
      abrechnungen: mode === 'test' ? 'abrechnungen_test' : 'abrechnungen',
      insurers: mode === 'test' ? 'insurers_test' : 'insurers'
    };
    
    // Clear existing data
    abrechnungen.value = [];
    
    // Fetch new data
    await fetchAbrechnungen();
  };

  const fetchAbrechnungen = async (options = {}) => {
    isLoading.value = true;
    error.value = null;
    
    // Clear existing data if forceRefresh is true
    if (options.forceRefresh) {
      abrechnungen.value = [];
      lastDocument.value = null;
      totalDocuments.value = 0;
    }
    
    try {
      const { pageSize = 50, direction = 'next', filterOptions = {}, page = 0 } = options;
      
      // Store the current page for pagination
      currentPage.value = page;
      
      // Array to hold all invoices
      const allInvoices = [];
      
      // Get all insurers first
      const insurersCollectionName = dataMode.value === 'test' ? 'insurers_test' : 'insurers';
      const insurersCollection = collection(db, insurersCollectionName);
      
      // Always use 'invoice-history' subcollection regardless of environment
      // This is because the actual data is stored in 'invoice-history' even in test mode
      const invoicesSubcollection = 'invoice-history';
      
      const insurersSnapshot = await getDocs(insurersCollection);
      
      // Fetch invoices from each insurer's subcollection
      for (const insurerDoc of insurersSnapshot.docs) {
        const insurerData = insurerDoc.data();
        const insurerName = insurerData.name || 'Unbekannt';
        
        // Get the invoices subcollection for this insurer based on environment
        const invoicesCollection = collection(db, insurersCollectionName, insurerDoc.id, invoicesSubcollection);
        const invoicesSnapshot = await getDocs(invoicesCollection);
        
        // Add each invoice to our array with the insurer name
        invoicesSnapshot.forEach(invoiceDoc => {
          const invoiceData = invoiceDoc.data();
          allInvoices.push({
            id: invoiceDoc.id,
            insurerId: insurerDoc.id,
            insurerName: insurerName,
            ...invoiceData
          });
        });
      }
      
      // Sort all invoices by date (newest first)
      allInvoices.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      // Update the store with all invoices
      abrechnungen.value = allInvoices;
      totalDocuments.value = allInvoices.length;
      
      // Apply client-side pagination if specified
      if (page > 0 && pageSize > 0) {
        const start = page * pageSize;
        const end = start + pageSize;
        const paginatedInvoices = allInvoices.slice(start, end);
        abrechnungen.value = paginatedInvoices;
      }
      
      return abrechnungen.value;
    } catch (err) {
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const filterAbrechnungen = (filters = {}) => {
    return abrechnungen.value.filter(abrechnung => {
      const matchesDocumentType = !filters.documentType || abrechnung.documentType === filters.documentType;
      const matchesStatus = !filters.status || abrechnung.status === filters.status;
      const matchesSearch = !filters.search || 
        abrechnung.insurerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        abrechnung.reference?.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesDocumentType && matchesStatus && matchesSearch;
    });
  };

  const sortAbrechnungen = (abrechnungen, field, ascending) => {
    const sortMap = {
      date: 'date',
      insurer: 'insurerName'
    };

    const sortField = sortMap[field] || 'date';
    return [...abrechnungen].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      // Handle dates separately
      if (field === 'date') {
        return ascending 
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }
      
      return ascending 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  // Function to create sample data for testing
  const createSampleAbrechnungen = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Creating sample abrechnungen data for test mode...');
      console.log('Current data mode:', dataMode.value);
      
      // Get the correct insurers collection based on environment
      const insurersCollectionName = dataMode.value === 'test' ? 'insurers_test' : 'insurers';
      
      // Always use 'invoice-history' subcollection regardless of environment
      // This is because the actual data is stored in 'invoice-history' even in test mode
      const invoicesSubcollection = 'invoice-history';
      
      console.log(`Using collection: ${insurersCollectionName} and subcollection: ${invoicesSubcollection}`);
      
      // First, check if we have insurers in the collection
      const insurersRef = collection(db, insurersCollectionName);
      const insurersSnapshot = await getDocs(insurersRef);
      
      // If no insurers exist in test mode, create some test insurers first
      let insurers = [];
      
      if (insurersSnapshot.empty && dataMode.value === 'test') {
        console.log('No test insurers found. Creating sample insurers first...');
        
        // Create sample insurers
        const sampleInsurers = [
          { name: 'Allianz Versicherung', contactPerson: 'Max Mustermann', email: 'kontakt@allianz-test.de', lastInvoice: new Date().toISOString() },
          { name: 'AXA Versicherung', contactPerson: 'Anna Schmidt', email: 'info@axa-test.de', lastInvoice: new Date().toISOString() },
          { name: 'HUK-COBURG', contactPerson: 'Peter Müller', email: 'service@huk-test.de', lastInvoice: new Date().toISOString() },
          { name: 'Generali Versicherung', contactPerson: 'Lisa Weber', email: 'info@generali-test.de', lastInvoice: new Date().toISOString() },
          { name: 'ERGO Versicherung', contactPerson: 'Thomas Becker', email: 'kontakt@ergo-test.de', lastInvoice: new Date().toISOString() }
        ];
        
        // Add each insurer to Firestore
        for (const insurer of sampleInsurers) {
          const docRef = await addDoc(insurersRef, {
            ...insurer,
            createdAt: serverTimestamp()
          });
          insurers.push({ id: docRef.id, ...insurer });
          console.log(`Created test insurer: ${insurer.name} with ID: ${docRef.id}`);
        }
      } else {
        // Use existing insurers
        insurersSnapshot.forEach(doc => {
          insurers.push({ id: doc.id, ...doc.data() });
        });
        console.log(`Found ${insurers.length} existing insurers in ${insurersCollectionName}`);
      }
      
      // Sample invoice data
      const sampleData = [
        {
          date: new Date().toISOString(),
          insurerName: 'Allianz Versicherung',
          documentType: 'invoice',
          status: 'completed',
          abrechnungsweg: 'Online',
          reference: 'INV-2025-001',
          amount: 1250.00
        },
        {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          insurerName: 'AXA Versicherung',
          documentType: 'remittance',
          status: 'pending',
          abrechnungsweg: 'Email',
          reference: 'REM-2025-002',
          amount: 980.50
        },
        {
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          insurerName: 'HUK-COBURG',
          documentType: 'invoice',
          status: 'completed',
          abrechnungsweg: 'Post',
          reference: 'INV-2025-003',
          amount: 750.25
        },
        {
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
          insurerName: 'Generali Versicherung',
          documentType: 'rejection',
          status: 'error',
          abrechnungsweg: 'Online',
          reference: 'REJ-2025-004',
          amount: 0.00
        },
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          insurerName: 'ERGO Versicherung',
          documentType: 'invoice',
          status: 'completed',
          abrechnungsweg: 'Email',
          reference: 'INV-2025-005',
          amount: 1500.75
        }
      ];
      
      // Add each sample invoice to the appropriate insurer's subcollection
      console.log('Adding sample invoices to insurer subcollections...');
      
      // Distribute sample data across insurers
      for (let i = 0; i < sampleData.length; i++) {
        // Get an insurer for this invoice (cycle through available insurers)
        const insurer = insurers[i % insurers.length];
        if (!insurer || !insurer.id) {
          console.error('No valid insurer found for invoice', i);
          continue;
        }
        
        // Create the subcollection reference
        const invoiceSubcollectionRef = collection(db, insurersCollectionName, insurer.id, invoicesSubcollection);
        
        // Add the invoice to the insurer's subcollection
        const data = sampleData[i];
        data.insurerName = insurer.name; // Use the actual insurer name
        data.insurerId = insurer.id;     // Store the insurer ID for reference
        
        const docRef = await addDoc(invoiceSubcollectionRef, {
          ...data,
          createdAt: serverTimestamp()
        });
        
        console.log(`Added sample invoice for ${insurer.name} (ID: ${insurer.id}) to ${invoicesSubcollection} with ID: ${docRef.id}`);
      }
      
      console.log('Sample data creation complete!');
      
      // Fetch the newly created data
      console.log('Refreshing data from Firestore...');
      await switchEnvironmentAndFetchData(dataMode.value);
      
    } catch (err) {
      console.error('Error creating sample data:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // Function to fetch more abrechnungen (pagination)
  const fetchMoreAbrechnungen = async (direction = 'next') => {
    console.log('🔍 fetchMoreAbrechnungen called with direction:', direction);
    
    // Calculate the next page based on direction
    const nextPage = direction === 'next' ? currentPage.value + 1 : Math.max(0, currentPage.value - 1);
    console.log('🔍 Moving from page', currentPage.value, 'to page', nextPage);
    
    // Fetch with the new page number
    return fetchAbrechnungen({
      page: nextPage,
      direction: direction
    });
  };

  // Return all functions and state
  return {
    abrechnungen,
    isLoading,
    error,
    totalDocuments,
    currentPage,
    switchEnvironmentAndFetchData,
    fetchAbrechnungen,
    fetchMoreAbrechnungen,
    filterAbrechnungen,
    sortAbrechnungen,
    createSampleAbrechnungen
  };
});
