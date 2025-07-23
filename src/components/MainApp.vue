<template>
  <div class="app-container">
    <!-- Main Layout -->
    <div class="min-h-screen bg-gray-50">
      <!-- Header with Tabs -->
      <header class="bg-white shadow-sm sticky top-0 z-10" :class="{ 'bg-yellow-100': !isProduction }">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-xl font-semibold text-gray-900">Versicherungsübersicht</h1>
            <div v-if="!isProduction" class="text-xs text-blue-500 font-mono ml-4">Branch: {{ gitBranch }}</div>

          </div>
          
          <!-- Simple fixed tabs -->
          <div class="border-b border-gray-200 -mb-px">
            <nav class="flex space-x-8">
              <button
                @click="activeTab = 'main'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeTab === 'main'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Übersicht
              </button>
              <button
                @click="activeTab = 'history'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Abrechnungen
              </button>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-6">
        <!-- Loading overlay -->
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
        
        <!-- Main Tab Content -->
        <div 
          v-if="activeTab === 'main'" 
          class="grid grid-cols-1 lg:grid-cols-4 gap-6"
          :class="{ 'filter blur-sm': selectedInsurer }"
        >
          <!-- Left Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <!-- Status summary cards -->
            <StatusSummary 
              :statusCounts="statusCounts"
              :activeStatus="statusFilter"
              @status-clicked="handleStatusClicked" 
            />
            
            <!-- Search bar -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-4">
                <SearchBar 
                  v-model="searchFilter" 
                  placeholder="Versicherer suchen..."
                />
              </div>
            </div>
            
                        <!-- TestDateSimulator for non-production branches -->
            <TestDateSimulator 
              v-if="!isProduction"
              v-model="simulatedDate"
            />

            <!-- BiPRO Tester -->
            <BiproTester v-if="!isProduction" />
            
            <!-- Environment Switcher -->
            <EnvironmentUserInfo 
              v-if="!isProduction"
              :current-mode="dataMode"
              @switch-mode="toggleEnvironment"
            />
          </div>
          
          <!-- Main Content Area -->
          <div class="lg:col-span-3">
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <div class="border-b border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
                <div class="flex items-center">
                  <h2 class="text-lg font-medium text-gray-900">Versicherer</h2>
                  
                  <!-- Active filter indicator -->
                  <div v-if="statusFilter !== 'all'" class="ml-3 flex items-center">
                    <span class="text-sm text-gray-500">Filter:</span>
                    <span 
                      class="ml-1 px-2 py-1 text-xs rounded-full" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': statusFilter === 'warning',
                        'bg-red-100 text-red-800': statusFilter === 'critical',
                        'bg-green-100 text-green-800': statusFilter === 'on_time'
                      }"
                    >
                      {{ getStatusFilterLabel(statusFilter) }}
                    </span>
                    <button 
                      @click="clearStatusFilter"
                      class="ml-1 text-gray-400 hover:text-gray-600"
                      title="Filter zurücksetzen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Sort options -->
                <div class="flex items-center">
                  <button @click="isCreateInsurerModalVisible = true" class="mr-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    + Neuer Versicherer
                  </button>
                  <div class="inline-flex">
                  <select 
                    v-model="sortOption"
                    class="form-select appearance-none rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="name">Name</option>
                    <option value="date">Letztes Abrechnungsdatum</option>
                    <option value="overdue">Tage überfällig</option>
                  </select>
                  </div>
                </div>
              </div>
              
              <!-- Loading state -->
              <div v-if="isLoading" class="py-12 flex justify-center">
                <div class="animate-pulse flex space-x-4 items-center">
                  <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
                  <div class="text-sm text-gray-500">Laden...</div>
                </div>
              </div>
              
              <!-- Insurer list -->
              <div v-else>
                <InsurerList
                  :insurers="filteredInsurers" 
                  :sortBy="sortOption"
                  :lastInvoices="lastInvoices"
                  :currentDate="currentDate"
                  :selectedInsurer="selectedInsurer"
                  @select-insurer="handleInsurerSelection($event)"
                  @clear-selection="handleClearSelection"
                />
              </div>
            </div>
          </div>
        </div>



        <!-- History Tab -->
        <div 
          v-else-if="activeTab === 'history'" 
          class="w-full"
          :class="{ 'filter blur-sm': selectedInsurer }"
        >

          

          
          <!-- Always render AbrechnungenHistory and let it handle empty state -->
          <AbrechnungenHistory 
            :is-production="dataMode.value === 'production'"
            :abrechnungen="abrechnungStore.abrechnungen"
          />
          
          <!-- Only show this when explicitly in test mode with no data -->
          <div v-if="dataMode.value === 'test' && (!abrechnungStore.abrechnungen || abrechnungStore.abrechnungen.length === 0)" class="bg-white shadow rounded-lg p-6 mt-4">
            <p class="text-gray-500 text-center mb-4">Keine Testdaten verfügbar. Erstellen Sie Testdaten mit dem Button unten.</p>
            <div class="flex justify-center">
              <button 
                @click="createSampleData"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="isCreatingSampleData"
              >
                <svg v-if="isCreatingSampleData" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isCreatingSampleData ? 'Erstelle Testdaten...' : 'Testdaten erstellen' }}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Insurer Detail Modal, teleported to the body to escape container constraints -->
    <Teleport to="body">
      <InsurerDetail 
        v-if="selectedInsurer" 
        :insurer="selectedInsurer" 
        :last-invoice="selectedInsurerLastInvoice"
        @update:insurer="handleUpdateInsurer"
        @settlement-completed="handleSettlementCompleted"
        @insurer-deleted="handleInsurerDeleted"
        @close="handleClearSelection"
      />
    </Teleport>

    <!-- Create Insurer Modal -->
    <CreateInsurerForm 
      v-if="isCreateInsurerModalVisible" 
      @close="isCreateInsurerModalVisible = false"
      @save="handleSaveInsurer"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useInsurerStore } from '@/stores/insurerStore';
import { useInsurerUtils } from '@/composables/useInsurerUtils';
import { useAbrechnungStore } from '../stores/abrechnungStore';
import { useAuthStore } from '../stores/auth';
import { useRoute } from 'vue-router';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { de } from 'date-fns/locale';

// Component imports
import AbrechnungenHistory from './AbrechnungenHistory.vue';
import StatusSummary from './StatusSummary.vue';
import SearchBar from './SearchBar.vue';
import InsurerList from './InsurerList.vue';
import InsurerDetail from './InsurerDetail.vue';
import TestDateSimulator from './TestDateSimulator.vue';
import EnvironmentUserInfo from './EnvironmentUserInfo.vue';
import CreateInsurerForm from './CreateInsurerForm.vue';
import BiproTester from './BiproTester.vue';

// Utility imports


// Initialize Pinia store
const insurerStore = useInsurerStore();
const { calculateDaysOverdue } = useInsurerUtils();
const abrechnungStore = useAbrechnungStore();

// Destructure state and getters from the store
// Use storeToRefs to keep reactivity
const {
  insurers: insurersData,
  lastInvoices,
  selectedInsurer,
  isLoading,
  dataMode,
  error
} = storeToRefs(insurerStore);

// Destructure actions from the store
const { switchEnvironmentAndFetchData: switchInsurerEnvironment, setSelectedInsurer, clearSelectedInsurer } = insurerStore;

// Local UI state
const searchFilter = ref('');
const activeTab = ref('main');
const isCreatingSampleData = ref(false);

// Watch for tab changes to load appropriate data
watch(activeTab, (newTab) => {
  if (newTab === 'history') {
    console.log('Switching to Abrechnungen tab, fetching data...');
    console.log('Current data mode:', dataMode.value);
    console.log('Current abrechnungen data:', abrechnungStore.abrechnungen);
    
    // Explicitly refresh the data in the current mode
    console.log('Calling abrechnungStore.switchEnvironmentAndFetchData with mode:', dataMode.value);
    abrechnungStore.switchEnvironmentAndFetchData(dataMode.value)
      .then(result => {
        console.log('Data fetch completed. Result:', result);
        console.log('Abrechnungen after fetch:', abrechnungStore.abrechnungen?.length || 0);
      })
      .catch(error => {
        console.error('Error fetching abrechnungen data:', error);
      });
  }
});
const sortOption = ref('name');
const statusFilter = ref('all'); // 'all', 'warning', 'critical', 'on_time'
const simulatedDate = ref(new Date()); // For the date simulator
const isCreateInsurerModalVisible = ref(false);

const isProduction = computed(() => {
  // Check if we're in production environment
  // First check VITE environment variable
  if (import.meta.env.VITE_ENV === 'production') return true;
  
  // Check window.IS_PRODUCTION flag
  if (typeof window !== 'undefined' && window.IS_PRODUCTION) return true;
  
  // If neither condition is met, assume development environment
  return false;
});

const gitBranch = computed(() => import.meta.env.VITE_GIT_BRANCH);

// When the component mounts, trigger the initial data fetch.
// The store defaults to 'production', so this will load production data initially.
onMounted(() => {
  console.log('MainApp component mounted. Fetching initial data...');
  switchInsurerEnvironment(dataMode.value);
  
  // Also fetch abrechnungen data if we're starting on the history tab
  if (activeTab.value === 'history') {
    abrechnungStore.switchEnvironmentAndFetchData(dataMode.value);
  }
});

onUnmounted(() => {
  console.log('MainApp component unmounted');
  // Clear selection when leaving the page to avoid stale data
  clearSelectedInsurer();
});

// Data from Pinia store is already reactive thanks to storeToRefs

// Status counts for summary
const statusCounts = computed(() => {
  const counts = { on_time: 0, warning: 0, critical: 0 };
  if (!insurersData.value) return counts;

  insurersData.value.forEach(insurer => {
    const days = calculateDaysOverdue(insurer, currentDate.value);
    if (days > 5) {
      counts.critical++;
    } else if (days > 0) {
      counts.warning++;
    } else {
      counts.on_time++;
    }
  });
  return counts;
});

// Get current date (real or simulated)
const currentDate = computed(() => {
  if (!isProduction.value && simulatedDate.value) {
    return new Date(simulatedDate.value);
  }
  return new Date();
});

// Get a human-readable label for the status filter
const getStatusFilterLabel = (status) => {
  const labels = {
    warning: 'Mahnung',
    critical: 'Kritisch',
    on_time: 'Im Zeitplan'
  };
  return labels[status] || 'Alle';
};

// Clear the status filter
const clearStatusFilter = () => {
  statusFilter.value = 'all';
};

// Handle status button clicks from StatusSummary component
const handleStatusClicked = (data) => {
  console.log('Status clicked:', data);
  if (statusFilter.value === data.status) {
    statusFilter.value = 'all'; // Toggle off if already active
  } else {
    statusFilter.value = data.status;
  }
};

// Handle insurer selection
const handleInsurerSelection = (insurer) => {
  console.log('Insurer selected:', insurer.name);
  insurerStore.setSelectedInsurer(insurer);
};

// Handle clearing insurer selection
const handleClearSelection = () => {
  console.log('Clearing selection');
  insurerStore.clearSelectedInsurer();
  
  // Refresh insurer data to update the tiles with the latest invoice dates
  console.log('Refreshing insurer data after closing details view...');
  insurerStore.switchEnvironmentAndFetchData(dataMode.value);
};

// Handle insurer deletion
const handleInsurerDeleted = (insurerId) => {
  console.log(`Insurer deleted: ${insurerId}`);
  
  // Clear the selected insurer since it's been deleted
  insurerStore.clearSelectedInsurer();
  
  // No need to refresh data as the store's deleteInsurer method already updates the local state
  // But we can add a notification or toast here if desired
};

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
    const insurersCollectionName = dataMode.value === 'test' ? 'insurers_test' : 'insurers';
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
    const invoicesSubcollection = dataMode.value === 'test' ? 'invoice-history-test' : 'invoice-history';
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
        abrechnungsweg: 'Email',
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
        abrechnungsweg: 'Email',
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

// Toggle between production and test environment
const toggleEnvironment = () => {
  const newMode = dataMode.value === 'production' ? 'test' : 'production';
  console.log(`Switching environment from ${dataMode.value} to ${newMode}`);
  
  // Update both stores with the new environment mode
  switchInsurerEnvironment(newMode);
  abrechnungStore.switchEnvironmentAndFetchData(newMode);
  
  // Log the change
  console.log(`Environment switched to ${newMode}`);
};

// Refresh Abrechnungen data
const refreshAbrechnungen = async () => {
  console.log(`Refreshing Abrechnungen data in ${dataMode.value} mode...`);
  await abrechnungStore.switchEnvironmentAndFetchData(dataMode.value);
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
  console.log('- abrechnungen length:', abrechnungStore.abrechnungen?.length || 0);
  console.log('- abrechnungen sample:', abrechnungStore.abrechnungen?.[0] || 'No data');
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

// Main filtered insurers list
const filteredInsurers = computed(() => {
  if (!insurersData.value) return [];
  
  let filtered = insurersData.value;

  // Apply search filter
  if (searchFilter.value) {
    const lowerCaseFilter = searchFilter.value.toLowerCase();
    filtered = filtered.filter(insurer => 
      insurer.name.toLowerCase().includes(lowerCaseFilter)
    );
  }

  // Apply status filter
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



// Use real data from abrechnung store
const formattedAbrechnungen = computed(() => {
  return abrechnungStore.abrechnungen;
});

// Debug function to check insurer data and overdue status
const debugInsurerStatus = () => {
  console.log('--- Insurer Status Debug ---');
  insurersData.value.forEach(insurer => {
    const lastInv = lastInvoices.value[insurer.id];
        const daysOverdue = calculateDaysOverdue(insurer, currentDate.value);
    console.log(
      `${insurer.name}: ` +
      `Last Invoice: ${lastInv ? format(new Date(lastInv[0].date), 'dd.MM.yyyy') : 'N/A'}, ` +
      `Turnus: ${insurer.turnus}, ` +
      `Days Overdue: ${daysOverdue}, ` +
      `Status: ${getStatusText(daysOverdue)}`
    );
  });
  console.log('--------------------------');
};


</script>

<style>
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
