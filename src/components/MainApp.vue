<template>
  <div class="app-container">
    <div class="min-h-screen bg-gray-50">
      <AppHeader 
        :isProduction="isProduction"
        :gitBranch="gitBranch"
        v-model:activeTab="activeTab"
      />

      <main class="container mx-auto px-4 py-6">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg font-medium text-gray-700">Daten werden geladen...</p>
            <p class="text-sm text-gray-500">{{ dataMode === 'production' ? 'Produktionsumgebung' : 'Testumgebung' }}</p>
          </div>
        </div>

        <!-- Conditional Views -->
        <DashboardView 
          v-if="activeTab === 'main'"
          :isLoading="isLoading"
          :isProduction="isProduction"
          :filteredInsurers="filteredInsurers"
          :statusCounts="statusCounts"
          :statusFilter="statusFilter"
          v-model:searchFilter="searchFilter"
          v-model:simulatedDate="simulatedDate"
          :dataMode="dataMode"
          v-model:sortOption="sortOption"
          :lastInvoices="lastInvoices"
          :currentDate="currentDate"
          :selectedInsurer="selectedInsurer"
          :hasMore="hasMoreInsurers"
          :onLoadMore="loadMoreInsurers"
          @status-clicked="handleStatusClicked"
          @switch-mode="toggleEnvironment"
          @clear-status-filter="clearStatusFilter"
          @create-insurer="isCreateInsurerModalVisible = true"
          @select-insurer="handleInsurerSelection"
          @clear-selection="handleClearSelection"
          @change-date="changeDate"
          @reset-date="resetDate"
        />

        <HistoryView 
          v-else-if="activeTab === 'history'"
          :selectedInsurer="selectedInsurer"
          :dataMode="dataMode"
          :abrechnungen="abrechnungStore.abrechnungen"
          :isCreatingSampleData="isCreatingSampleData"
          :isLoading="abrechnungStore.isLoading"
          @create-sample-data="createSampleData"
        />
      </main>
    </div>

    <!-- Modals and Overlays -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedInsurer" class="fixed inset-0 z-50">
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 bg-black bg-opacity-50"
            @click="handleClearSelection"
          ></div>
          
          <!-- Modal -->
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-4"
            >
              <div v-if="selectedInsurer" class="w-full max-w-3xl">
                <InsurerDetail 
                  :insurer="selectedInsurer" 
                  :last-invoice="storeLastInvoices[selectedInsurer.id]"
                  :data-mode="dataMode"
                  @update:insurer="handleUpdateInsurer"
                  @settlement-completed="handleSettlementCompleted"
                  @insurer-deleted="handleInsurerDeleted"
                  @close="handleClearSelection"
                />
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <CreateInsurerForm 
      v-if="isCreateInsurerModalVisible" 
      @close="isCreateInsurerModalVisible = false"
      @save="handleSaveInsurer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

// Store Imports
import { useInsurerStore } from '@/stores/insurerStore.js';
import { useAbrechnungStore } from '@/stores/abrechnungStore';
import { useAuthStore } from '@/stores/authStore';

// Composables
import { useInsurerUtils } from '@/composables/useInsurerUtils';

// Layout and View Components
import AppHeader from './layout/AppHeader.vue';
import DashboardView from '@/views/DashboardView.vue';
import HistoryView from '@/views/HistoryView.vue';

// Other Components
import InsurerList from '@/components/InsurerList.vue';
import InsurerDetail from '@/components/InsurerDetail.vue';
import CreateInsurerForm from '@/components/CreateInsurerForm.vue';

// --- App State ---
const activeTab = ref('main');
const searchFilter = ref('');
const statusFilter = ref('all');
const sortOption = ref('name');

const isCreateInsurerModalVisible = ref(false);
const isCreatingSampleData = ref(false);

// --- Environment Info ---
const gitBranch = ref(import.meta.env.VITE_GIT_BRANCH || 'unknown');
const isProduction = computed(() => {
  const prodBranches = ['main', 'master', 'staging'];
  return prodBranches.includes(gitBranch.value);
});

// Initialize Pinia stores
const insurerStore = useInsurerStore();
const abrechnungStore = useAbrechnungStore();
const userStore = useAuthStore();

// Component registration
const components = {
  AppHeader,
  DashboardView,
  HistoryView,
  InsurerList,
  InsurerDetail,
  CreateInsurerForm
};

const { calculateDaysOverdue } = useInsurerUtils();

// Get store state
const { selectedInsurer, lastInvoices: storeLastInvoices } = storeToRefs(insurerStore);

// --- Lifecycle Hooks ---
onMounted(async () => {
  const initialMode = import.meta.env.PROD ? 'production' : 'test';
  await insurerStore.switchEnvironmentAndFetchData(initialMode);
  await abrechnungStore.switchEnvironmentAndFetchData(initialMode);
});

// Destructure state from stores
const { 
  insurers: insurersData, 
  isLoading, 
  lastInvoices, 
  dataMode,
  hasMore: hasMoreInsurers
} = storeToRefs(insurerStore);

// Load more insurers
const loadMoreInsurers = async () => {
  if (!isLoading.value && hasMoreInsurers.value) {
    try {
      await insurerStore.loadMoreInsurers();
    } catch (error) {
      console.error('Error loading more insurers:', error);
    }
  }
};

const toggleEnvironment = async () => {
  const newMode = dataMode.value === 'production' ? 'test' : 'production';
  try {
    await insurerStore.switchEnvironmentAndFetchData(newMode);
    await abrechnungStore.switchEnvironmentAndFetchData(newMode);
  } catch (error) {
    console.error('Error switching environment:', error);
  }
};


// --- Date Management ---
const simulatedDate = ref(null);

const changeDate = (days) => {
  console.log('Change date called with days:', days);
  const date = simulatedDate.value ? new Date(simulatedDate.value) : new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0); // Normalize time
  simulatedDate.value = date;
  console.log('New simulated date set to:', date);
};

const resetDate = () => {
  console.log('Resetting date to current date');
  simulatedDate.value = null;
};

const currentDate = computed(() => {
  const date = simulatedDate.value || new Date();
  // Always return a new Date object to ensure reactivity
  return new Date(date);
});


// --- Lifecycle Hooks ---
onMounted(async () => {
  await userStore.initialize();
  const initialMode = 'production';
  await insurerStore.switchEnvironmentAndFetchData(initialMode);
  await abrechnungStore.fetchAbrechnungen(initialMode);
});

// --- Computed Properties ---
const statusCounts = computed(() => {
  if (!insurersData.value) return { critical: 0, warning: 0, on_time: 0 };
  return insurersData.value.reduce((acc, insurer) => {
    const days = calculateDaysOverdue(insurer, currentDate.value, lastInvoices.value);
    if (days > 5) acc.critical++;
    else if (days > 0) acc.warning++;
    else acc.on_time++;
    return acc;
  }, { critical: 0, warning: 0, on_time: 0 });
});

const selectedInsurerLastInvoice = computed(() => {
  if (!selectedInsurer.value || !lastInvoices.value) return null;
  return lastInvoices.value[selectedInsurer.value.id];
});

const filteredInsurers = computed(() => {
  if (!insurerStore.insurers) return [];
  let filtered = insurerStore.insurers;

  if (searchFilter.value) {
    const lowerCaseFilter = searchFilter.value.toLowerCase();
    filtered = filtered.filter(insurer => 
      insurer.name.toLowerCase().includes(lowerCaseFilter)
    );
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(insurer => {
      const days = calculateDaysOverdue(insurer, currentDate.value);
      if (statusFilter.value === 'critical') return days > 5;
      if (statusFilter.value === 'warning') return days > 0 && days <= 5;
      if (statusFilter.value === 'on_time') return days <= 0;
      return false;
    });
  }
  return filtered;
});

// --- Status Filter Handlers ---
const handleStatusClicked = (status) => {
  statusFilter.value = status;
  console.log('Status filter changed to:', status);
};

const clearStatusFilter = () => {
  statusFilter.value = 'all';
  console.log('Status filter cleared');
};

// --- Event Handlers ---
const handleInsurerSelection = (insurer) => {
  insurerStore.setSelectedInsurer(insurer);
  console.log('Selected insurer:', insurer);
};

const handleClearSelection = () => {
  insurerStore.clearSelectedInsurer();  
  console.log('Cleared insurer selection');
};

const handleUpdateInsurer = (updatedInsurer) => {
  insurerStore.setSelectedInsurer(updatedInsurer);
};

const handleInsurerDeleted = () => { handleClearSelection(); };

// Handle saving a new insurer from the form
const handleSaveInsurer = (insurerData) => {
  console.log('New insurer data received:', insurerData);
  insurerStore.addInsurer(insurerData);
  isCreateInsurerModalVisible.value = false;
};

// Handle settlement completed event
const handleSettlementCompleted = (data) => {
  const { insurer, last_invoice } = data;
  
  if (insurer && insurer.id) {
    // Create a new object to ensure reactivity
    const updatedLastInvoices = { ...lastInvoices.value };
    
    if (last_invoice === null) {
      // If last_invoice is null, it means the last settlement was deleted
      // Delete the property from our copy
      delete updatedLastInvoices[insurer.id];
      // Replace the entire object to ensure reactivity
      lastInvoices.value = updatedLastInvoices;
      
      // Also update the insurer object in the insurers array to clear last_invoice
      const insurerIndex = insurersData.value.findIndex(ins => ins.id === insurer.id);
      if (insurerIndex !== -1) {
        // Create a new object to ensure reactivity
        const updatedInsurer = { ...insurersData.value[insurerIndex] };
        updatedInsurer.last_invoice = null;
        
        // Replace the insurer in the array
        insurersData.value[insurerIndex] = updatedInsurer;
      }
    } else {
      // Otherwise, update with the new settlement
      updatedLastInvoices[insurer.id] = last_invoice;
      // Replace the entire object to ensure reactivity
      lastInvoices.value = updatedLastInvoices;
      
      // Also update the insurer object in the insurers array
      const insurerIndex = insurersData.value.findIndex(ins => ins.id === insurer.id);
      if (insurerIndex !== -1) {
        // Create a new object to ensure reactivity
        const updatedInsurer = { ...insurersData.value[insurerIndex] };
        updatedInsurer.last_invoice = last_invoice;
        
        // Replace the insurer in the array
        insurersData.value[insurerIndex] = updatedInsurer;
      }
    }
    
    // If this is the currently selected insurer, update its display
    if (selectedInsurer.value && selectedInsurer.value.id === insurer.id) {
      // Force reactivity update for the selected insurer
      selectedInsurer.value = { ...selectedInsurer.value };
      if (last_invoice === null) {
        selectedInsurer.value.last_invoice = null;
      } else {
        selectedInsurer.value.last_invoice = last_invoice;
      }
    }
  }
};

// Create sample abrechnungen data for testing
const createSampleData = async () => {
  isCreatingSampleData.value = true;
  try {
    console.log('Creating sample abrechnungen data in insurer subcollections...');
    
    // Get all insurers first - use the correct collection based on environment mode
    // Environment mapping matches actual Firestore data structure
    const insurersCollectionName = dataMode.value === 'production' ? 'insurers' : 'insurers_test';
    console.log(`Creating sample data in ${dataMode.value} mode, using collection: ${insurersCollectionName}`);
    
    const insurersCollection = collection(db, insurersCollectionName);
    let insurersSnapshot = await getDocs(insurersCollection);
    
    console.log(`Found ${insurersSnapshot.size} insurers in ${insurersCollectionName}`);
    
    // If we're in test mode and no insurers exist, create some test insurers first
    if (insurersSnapshot.empty && dataMode.value === 'test') {
      console.log('No test insurers found. Creating test insurers first...');
      
      // Create some test insurers
      const testInsurerData = [
        { name: 'Test Versicherung 1', type: 'Krankenversicherung', contactEmail: 'test1@example.com' },
        { name: 'Test Versicherung 2', type: 'Haftpflichtversicherung', contactEmail: 'test2@example.com' }
      ];
      
      for (const insurer of testInsurerData) {
        const docRef = await addDoc(insurersCollection, insurer);
        console.log(`Created test insurer with ID: ${docRef.id}`);
      }
      
      // Re-fetch insurers
      insurersSnapshot = await getDocs(insurersCollection);
      console.log(`Now have ${insurersSnapshot.size} test insurers`);
    }
    
    console.log(`Found ${insurersSnapshot.size} insurers to create sample data for`);
    
    // Use different subcollection names based on environment
    // IMPORTANT: Environment mapping has been swapped so 'production' uses test collections and vice versa
    const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
    console.log(`Using subcollection: ${invoicesSubcollection} for environment: ${dataMode.value}`);
    
    // Sample data templates
    const sampleDataTemplates = [
      {
        date: new Date().toISOString(),
        documentType: 'invoice',
        status: 'completed',
        abrechnungsweg: 'Online',
        reference: 'INV-2025-001',
        amount: 1250.00
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        documentType: 'remittance',
        status: 'pending',
        abrechnungsweg: 'E-Mail',
        reference: 'REM-2025-002',
        amount: 980.50
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        documentType: 'invoice',
        status: 'completed',
        abrechnungsweg: 'Post',
        reference: 'INV-2025-003',
        amount: 750.25
      },
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
        documentType: 'rejection',
        status: 'error',
        abrechnungsweg: 'Online',
        reference: 'REJ-2025-004',
        amount: 0.00
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        documentType: 'invoice',
        status: 'completed',
        abrechnungsweg: 'E-Mail',
        reference: 'INV-2025-005',
        amount: 1500.75
      }
    ];
    
    // Distribute sample data across insurers
    let dataIndex = 0;
    let totalCreated = 0;
    
    for (const insurerDoc of insurersSnapshot.docs) {
      const insurerData = insurerDoc.data();
      const insurerName = insurerData.name || 'Unbekannt';
      
      // Get the invoices subcollection for this insurer - use the correct collection based on environment mode
      const invoicesCollection = collection(db, insurersCollectionName, insurerDoc.id, invoicesSubcollection);
      console.log(`Adding invoices to: ${insurersCollectionName}/${insurerDoc.id}/${invoicesSubcollection}`);
      
      // Add 1-2 sample invoices per insurer
      const numToCreate = Math.min(2, sampleDataTemplates.length - dataIndex);
      
      for (let i = 0; i < numToCreate && dataIndex < sampleDataTemplates.length; i++) {
        const template = sampleDataTemplates[dataIndex++];
        
        await addDoc(invoicesCollection, {
          ...template,
          insurerName: insurerName,
          insurerId: insurerDoc.id,
          createdAt: serverTimestamp()
        });
        
        console.log(`Added sample abrechnung for ${insurerName}`);
        totalCreated++;
      }
      
      // Reset dataIndex if we've used all templates
      if (dataIndex >= sampleDataTemplates.length) {
        dataIndex = 0;
      }
    }
    
    console.log(`Sample data creation complete! Created ${totalCreated} invoices across ${insurersSnapshot.size} insurers.`);
    
    // Refresh the data
    console.log('Refreshing data after sample creation...');
    console.log('Current data mode:', dataMode.value);
    
    try {
      // Force a refresh of the abrechnungen store
      const result = await abrechnungStore.switchEnvironmentAndFetchData(dataMode.value);
      console.log('Data refresh result:', result);
      console.log('Abrechnungen after refresh:', abrechnungStore.abrechnungen?.length || 0);
      
      console.log('Sample data creation complete');
      alert(`${totalCreated} Beispiel-Abrechnungen erstellt`);
    } catch (refreshError) {
      console.error('Error refreshing data after sample creation:', refreshError);
    }
  } catch (error) {
    console.error('Error creating sample data:', error);
    alert('Fehler beim Erstellen von Beispieldaten: ' + error.message);
  } finally {
    isCreatingSampleData.value = false;
  }
};

// Refresh Abrechnungen data
const refreshAbrechnungen = async () => {
  try {
    const currentMode = dataMode.value;
    await abrechnungStore.switchEnvironmentAndFetchData(currentMode);
    await insurerStore.switchEnvironmentAndFetchData(currentMode);
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
  console.log(`Abrechnungen data refreshed. Found ${abrechnungStore.abrechnungen.length} documents.`);
};

// Inspect Firestore collections for debugging
const inspectFirestore = async () => {
  try {
    console.log('Inspecting Firestore collections...');
    
    // Check both production and test collections
    const prodCollectionName = 'abrechnungen';
    const testCollectionName = 'abrechnungen_test';
    
    console.log(`Checking production collection: ${prodCollectionName}`);
    const prodSnapshot = await getDocs(collection(db, prodCollectionName));
    console.log(`Production collection has ${prodSnapshot.size} documents`);
    
    prodSnapshot.forEach(doc => {
      console.log('Production document:', { id: doc.id, ...doc.data() });
    });
    
    console.log(`Checking test collection: ${testCollectionName}`);
    const testSnapshot = await getDocs(collection(db, testCollectionName));
    console.log(`Test collection has ${testSnapshot.size} documents`);
    
    testSnapshot.forEach(doc => {
      console.log('Test document:', { id: doc.id, ...doc.data() });
    });
    
    // Check current store state
    console.log('Current abrechnungStore state:');
    console.log('- dataMode:', abrechnungStore.dataMode);
    console.log('- collections:', abrechnungStore.collections);
    console.log('- abrechnungen:', abrechnungStore.abrechnungen);
    console.log('- isLoading:', abrechnungStore.isLoading);
    console.log('- error:', abrechnungStore.error);
    
    // Check insurers collection and invoices subcollections
    console.log('Checking insurers collection and invoices subcollections...');
    const insurersCollection = collection(db, 'insurers');
    const insurersSnapshot = await getDocs(insurersCollection);
    console.log(`Found ${insurersSnapshot.size} insurers`);
    
    let totalInvoices = 0;
    for (const insurerDoc of insurersSnapshot.docs) {
      const insurerData = insurerDoc.data();
      const insurerName = insurerData.name || 'Unbekannt';
      
      const invoicesCollection = collection(db, 'insurers', insurerDoc.id, 'invoices');
      const invoicesSnapshot = await getDocs(invoicesCollection);
      
      console.log(`Insurer ${insurerName} (${insurerDoc.id}) has ${invoicesSnapshot.size} invoices`);
      totalInvoices += invoicesSnapshot.size;
      
      invoicesSnapshot.forEach(invoiceDoc => {
        console.log(`Invoice for ${insurerName}:`, { id: invoiceDoc.id, ...invoiceDoc.data() });
      });
    }
    
    alert(`Firestore Inspektion abgeschlossen. Ergebnisse in der Konsole.\n\nProduktion: ${prodSnapshot.size} Dokumente\nTest: ${testSnapshot.size} Dokumente\nVersicherer: ${insurersSnapshot.size}\nRechnungen: ${totalInvoices}`);
  } catch (error) {
    console.error('Error inspecting Firestore:', error);
    alert(`Fehler bei der Firestore-Inspektion: ${error.message}`);
  }
};

// Test function to save an invoice directly to an insurer's subcollection
const testSaveInvoice = async () => {
  try {
    console.log('Testing invoice saving functionality...');
    
    // Select a test insurer (first one in the list)
    if (!insurersData.value || insurersData.value.length === 0) {
      alert('No insurers available. Please load insurers first.');
      return;
    }
    
    const testInsurer = insurersData.value[0];
    console.log(`Selected test insurer: ${testInsurer.name} (${testInsurer.id})`);
    
    // Create a test invoice
    const testInvoice = {
      date: new Date().toISOString(),
      amount: 1000,
      currency: 'EUR',
      documentType: 'invoice',
      status: 'completed',
      description: 'Test invoice created via debug button',
      testId: `test-${Date.now()}`
    };
    
    console.log('Test invoice data:', testInvoice);
    
    // Method 1: Use the store function
    console.log('Using insurerStore.addInvoiceToHistory...');
    const docId = await insurerStore.addInvoiceToHistory(testInsurer.id, testInvoice);
    console.log(`Invoice saved with ID: ${docId}`);
    
    // Method 2: Direct Firestore access
    console.log('Direct Firestore access to invoice-history subcollection...');
    const directCollectionRef = collection(db, 'insurers', testInsurer.id, 'invoice-history');
    const directDocRef = await addDoc(directCollectionRef, {
      ...testInvoice,
      createdAt: serverTimestamp(),
      method: 'direct'
    });
    console.log(`Direct invoice saved with ID: ${directDocRef.id}`);
    
    // Method 3: Using settlement_history (legacy name) to test if it's still being used
    console.log('Direct Firestore access to settlement_history subcollection...');
    const legacyCollectionRef = collection(db, 'insurers', testInsurer.id, 'settlement_history');
    const legacyDocRef = await addDoc(legacyCollectionRef, {
      ...testInvoice,
      createdAt: serverTimestamp(),
      method: 'legacy'
    });
    console.log(`Legacy invoice saved with ID: ${legacyDocRef.id}`);
    
    // Check if the invoices were saved
    await checkSubcollectionNames();
    
    alert(`Test invoices saved successfully for ${testInsurer.name}. Check console for details.`);
  } catch (error) {
    console.error('Error in testSaveInvoice:', error);
    alert(`Error saving test invoice: ${error.message}`);
  }
};

// Check subcollection names in Firestore
const checkSubcollectionNames = async () => {
  try {
    console.log('Checking subcollection names in insurers collection...');
    
    // Get all insurers
    const insurersCollection = collection(db, 'insurers');
    const insurersSnapshot = await getDocs(insurersCollection);
    
    console.log(`Found ${insurersSnapshot.size} insurers`);
    
    // For each insurer, list all subcollections
    for (const insurerDoc of insurersSnapshot.docs) {
      const insurerData = insurerDoc.data();
      const insurerName = insurerData.name || 'Unbekannt';
      
      console.log(`Checking subcollections for insurer: ${insurerName} (${insurerDoc.id})`);
      
      // Check for 'invoice-history' subcollection
      const invoiceHistoryCollection = collection(db, 'insurers', insurerDoc.id, 'invoice-history');
      const invoiceHistorySnapshot = await getDocs(invoiceHistoryCollection);
      console.log(`- 'invoice-history' subcollection has ${invoiceHistorySnapshot.size} documents`);
      
      // Check for 'invoices' subcollection
      const invoicesCollection = collection(db, 'insurers', insurerDoc.id, 'invoices');
      const invoicesSnapshot = await getDocs(invoicesCollection);
      console.log(`- 'invoices' subcollection has ${invoicesSnapshot.size} documents`);
      
      // Check for 'settlement_history' subcollection
      const settlementHistoryCollection = collection(db, 'insurers', insurerDoc.id, 'settlement_history');
      const settlementHistorySnapshot = await getDocs(settlementHistoryCollection);
      console.log(`- 'settlement_history' subcollection has ${settlementHistorySnapshot.size} documents`);
      
      // Show sample documents from each subcollection
      if (settlementHistorySnapshot.size > 0) {
        console.log('Sample document from settlement_history:', settlementHistorySnapshot.docs[0].data());
      }
      if (invoicesSnapshot.size > 0) {
        console.log('Sample document from invoices:', invoicesSnapshot.docs[0].data());
      }
      if (invoiceHistorySnapshot.size > 0) {
        console.log('Sample document from invoice-history:', invoiceHistorySnapshot.docs[0].data());
      }
    }
    
    alert('Subcollection check complete. See console for details.');
  } catch (error) {
    console.error('Error checking subcollections:', error);
    alert(`Error checking subcollections: ${error.message}`);
  }
};

// Debug component state and data flow
const debugComponentState = () => {
  console.log('Debugging component state and data flow...');
  
  // Check MainApp.vue state
  console.log('MainApp.vue state:');
  console.log('- activeTab:', activeTab.value);
  console.log('- dataMode:', dataMode.value);
  console.log('- isProduction:', isProduction);
  
  // Check if abrechnungStore has data
  console.log('AbrechnungStore state:');
  console.log('- isLoading:', abrechnungStore.isLoading);
  console.log('- abrechnungen:', abrechnungStore.abrechnungen);
  console.log('- hasMorePages:', abrechnungStore.hasMorePages);
  console.log('- lastDocument:', abrechnungStore.lastDocument);
  console.log('- dataMode:', abrechnungStore.dataMode);
  
  // Check AbrechnungenHistory component props and data
  console.log('AbrechnungenHistory props:');
  console.log('- :is-production prop value:', isProduction);
  console.log('- :abrechnungen prop value length:', abrechnungStore.abrechnungen?.length || 0);
  
  // Check conditional rendering
  const shouldShowAbrechnungen = abrechnungStore.abrechnungen && abrechnungStore.abrechnungen.length > 0;
  console.log('Should show AbrechnungenHistory?', shouldShowAbrechnungen);
  
  // Force refresh data
  console.log('Forcing data refresh...');
  abrechnungStore.fetchAbrechnungen();
  
  alert(`Komponenten-Debug abgeschlossen. Ergebnisse in der Konsole.\n\nAbrechnungen: ${abrechnungStore.abrechnungen?.length || 0}\nAktiver Tab: ${activeTab.value}\nDaten-Modus: ${dataMode.value}`);
};

// Create a sample invoice in an insurer's subcollection
const createSampleInvoice = async () => {
  try {
    console.log('Creating sample invoice in insurer subcollection...');
    
    // Find an insurer to add the invoice to - use the correct collection based on environment mode
    const insurersCollectionName = dataMode.value === 'test' ? 'insurers_test' : 'insurers';
    console.log(`Creating sample invoice in ${dataMode.value} mode, using collection: ${insurersCollectionName}`);
    
    const insurersCollection = collection(db, insurersCollectionName);
    const insurersSnapshot = await getDocs(insurersCollection);
    
    if (insurersSnapshot.empty) {
      console.error('No insurers found to add invoice to');
      alert('Keine Versicherer gefunden, um eine Rechnung hinzuzufügen.');
      return;
    }
    
    // Use the first insurer
    const insurerDoc = insurersSnapshot.docs[0];
    const insurerData = insurerDoc.data();
    const insurerName = insurerData.name || 'Unbekannt';
    
    console.log(`Adding sample invoice to insurer: ${insurerName} (${insurerDoc.id})`);
    
    // Create a sample invoice
    const invoiceData = {
      date: new Date().toISOString(),
      documentType: 'invoice',
      status: 'completed',
      abrechnungsweg: 'Online',
      reference: `INV-${Date.now()}`,
      amount: 1250.00,
      createdAt: serverTimestamp()
    };
    
    // Add the invoice to the insurer's invoice-history subcollection - use the correct subcollection based on environment
    const invoicesSubcollection = dataMode.value === 'test' ? 'invoice-history-test' : 'invoice-history';
    const invoicesCollection = collection(db, insurersCollectionName, insurerDoc.id, invoicesSubcollection);
    
    console.log(`Adding invoice to: ${insurersCollectionName}/${insurerDoc.id}/${invoicesSubcollection}`);
    const docRef = await addDoc(invoicesCollection, invoiceData);
    
    console.log(`Sample invoice created with ID: ${docRef.id}`);
    alert(`Beispielrechnung für ${insurerName} erstellt. ID: ${docRef.id}`);
    
    // Refresh both stores to update all UI components
    console.log('Refreshing data after invoice creation...');
    const result = await abrechnungStore.fetchAbrechnungen();
    
    // Also refresh the insurerStore to update lastInvoices for tile display
    console.log('Refreshing insurerStore to update lastInvoices...');
    await insurerStore.switchEnvironmentAndFetchData(dataMode.value);
    
    // Verify the invoice was fetched
    console.log('After refresh, abrechnungStore has', abrechnungStore.abrechnungen.length, 'invoices');
    console.log('Updated lastInvoices:', insurerStore.lastInvoices);
    
    // Check if our new invoice is in the results
    const foundInvoice = abrechnungStore.abrechnungen.find(inv => inv.id === docRef.id);
    console.log('Found our new invoice in results?', !!foundInvoice);
    
    if (foundInvoice) {
      console.log('Invoice details:', foundInvoice);
    } else {
      console.warn('Could not find our new invoice in the results!');
    }
    
    // Check AbrechnungenHistory component
    console.log('AbrechnungenHistory should now display', abrechnungStore.abrechnungen.length, 'invoices');
    
    // Update alert with more info
    alert(`Beispielrechnung für ${insurerName} erstellt. ID: ${docRef.id}\n\nRechnungen im Store: ${abrechnungStore.abrechnungen.length}\nUnsere neue Rechnung gefunden: ${!!foundInvoice}`);
    
  } catch (error) {
    console.error('Error creating sample invoice:', error);
    alert(`Fehler beim Erstellen der Beispielrechnung: ${error.message}`);
  }
};


</script>

<style>
/* Ensure transforms work properly */
.transform {
  --tw-translate-y: 0;
  --tw-translate-x: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.app-container {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.filter.blur-sm {
  filter: blur(4px);
  transition: filter 0.3s ease-in-out;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
