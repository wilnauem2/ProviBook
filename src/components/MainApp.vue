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

            <!-- Environment Switcher -->
            <EnvironmentUserInfo 
              v-if="!isProduction"
              :current-mode="dataMode"
              @switch-mode="switchEnvironment"
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
                <div class="inline-flex">
                  <select 
                    v-model="sortOption"
                    class="form-select rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="name">Name</option>
                    <option value="date">Letztes Abrechnungsdatum</option>
                    <option value="overdue">Tage überfällig</option>
                  </select>
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
                  :currentDate="getCurrentDate()"
                  :selectedInsurer="selectedInsurer"
                  @select-insurer="handleInsurerSelection($event)"
                  @clear-selection="handleClearSelection()"
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
          <div v-if="formattedAbrechnungen && formattedAbrechnungen.length > 0">
            <AbrechnungenHistory :abrechnungen="formattedAbrechnungen" :is-production="isProduction" />
          </div>
          <div v-else class="bg-white shadow rounded-lg p-6">
            <p class="text-gray-500 text-center">Keine Abrechnungen verfügbar.</p>
          </div>
        </div>
        
        <!-- Overlay that appears when detail view is open -->
        <transition name="fade">
          <div 
            v-if="selectedInsurer" 
            @click="handleClearSelection()"
            class="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          ></div>
        </transition>

        <!-- Insurer Detail Slide-out Panel -->
        <transition name="slide-in-right">
          <div 
            v-if="selectedInsurer" 
            class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out border-l border-gray-100"
            @click.stop
          >
            <div class="p-6 overflow-y-auto" style="height: 100vh;">
              <InsurerDetail 
                :insurer="selectedInsurer" 
                :current-date="getCurrentDate()"
                :is-production="isProduction"
                @settlement-completed="handleSettlementCompleted"
                @close="handleClearSelection"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';
import { useRouter, useRoute } from 'vue-router';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Component imports
import AbrechnungenHistory from './AbrechnungenHistory.vue';
import HeaderSection from './HeaderSection.vue';
import StatusSummary from './StatusSummary.vue';
import SearchBar from './SearchBar.vue';
import InsurerList from './InsurerList.vue';
import InsurerDetail from './InsurerDetail.vue';
import TestDateSimulator from './TestDateSimulator.vue';
import EnvironmentUserInfo from './EnvironmentUserInfo.vue';

// Utility and configuration imports
import { calculateDaysOverdue, isOverdue, getStatusColor, getStatusText, formatLastInvoiceDate } from '../utils/insurerUtils';
import { fetchInvoices, saveInvoices, subscribeInvoices } from '../firebaseInvoices';

// Core state and router
const router = useRouter();
const route = useRoute();

// Initialize Pinia store
const insurerStore = useInsurerStore();

// UI state
const searchFilter = ref('');
const activeTab = ref('main');
const isLoading = ref(false);
const sortOption = ref('name');
const statusFilter = ref('all'); // 'all', 'warning', 'critical', 'on_time'
const dataMode = ref('production'); // 'production' or 'test'
const simulatedDate = ref(new Date()); // For the date simulator

const isProduction = computed(() => {
  // This global flag is set to true only in `main-prod.js`, which is used for production builds.
  // For any other build (dev, testing), this flag will be undefined, and the expression will be false.
  return !!window.IS_PRODUCTION;
});

const gitBranch = computed(() => import.meta.env.VITE_GIT_BRANCH);





// Function to switch data mode, called by EnvironmentUserInfo component
const switchEnvironment = (newEnv) => {
  console.log(`Switching environment to: ${newEnv}`);
  dataMode.value = newEnv;
};

// Watch for data mode changes to load data accordingly
watch(dataMode, async (newMode) => {
  console.log(`Data mode changed to: ${newMode}. Fetching data...`);
  isLoading.value = true;
  try {
    const collection = newMode === 'production' ? 'insurers' : 'insurers_test';
    await insurerStore.fetchInsurers(collection);
  } catch (error) {
    console.error(`Error fetching data for mode ${newMode}:`, error);
  } finally {
    isLoading.value = false;
  }
}, { immediate: true }); // Use immediate: true to run the watcher on component mount

// Lifecycle hooks
onMounted(() => {
  console.log('MainApp component mounted');
  // The 'watch' with 'immediate: true' now handles the initial data load.
});

onUnmounted(() => {
  console.log('MainApp component unmounted');
  insurerStore.setSelectedInsurer(null);
});

// Data from Pinia store
const insurersData = computed(() => insurerStore.insurers);
const lastInvoices = computed(() => insurerStore.lastInvoices);
const selectedInsurer = computed(() => insurerStore.selectedInsurer);

// Status counts for summary
const statusCounts = computed(() => {
  const counts = { on_time: 0, warning: 0, critical: 0 };
  if (!insurersData.value) return counts;

  insurersData.value.forEach(insurer => {
    const days = calculateDaysOverdue(insurer, lastInvoices.value[insurer.id], getCurrentDate());
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
const getCurrentDate = () => {
  if (!isProduction.value && simulatedDate.value) {
    return new Date(simulatedDate.value);
  }
  return new Date();
};

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
      const days = calculateDaysOverdue(insurer, lastInvoices.value[insurer.id], getCurrentDate());
      if (statusFilter.value === 'critical') return days > 5;
      if (statusFilter.value === 'warning') return days > 0 && days <= 5;
      if (statusFilter.value === 'on_time') return days <= 0;
      return false;
    });
  }

  return filtered;
});

// Handle settlement completion from the detail view
const handleSettlementCompleted = async (event) => {
  console.log('Settlement completed event received in MainApp:', event);
  const { insurerId, newInvoiceDate, note } = event;

  if (!insurerId || !newInvoiceDate) {
    console.error('Invalid settlement data received:', event);
    return;
  }

  isLoading.value = true;
  try {
    // Find the insurer to get their name
    const insurer = insurersData.value.find(i => i.id === insurerId);
    if (!insurer) {
      console.error('Could not find insurer with ID:', insurerId);
      return;
    }

    // Create the new invoice object
    const newInvoice = {
      date: newInvoiceDate,
      amount: '0', // Amount is not captured in this simplified flow
      note: note || '',
      createdAt: new Date().toISOString()
    };

    // Save the new invoice to Firebase
    const invoiceCollectionName = dataMode.value === 'production' ? 'invoices' : 'invoices_test';
    await saveInvoices(insurerId, [newInvoice], invoiceCollectionName);
    console.log(`New invoice for ${insurer.name} saved successfully.`);

    // Update the local lastInvoices store to reflect the change immediately
    insurerStore.addInvoice(insurerId, newInvoice);

    // Optionally, refetch all data to ensure consistency
    // await insurerStore.fetchInsurers(dataMode.value === 'production' ? 'insurers' : 'insurers_test');

    console.log('Local store updated with new invoice.');

    // Close the detail panel
    handleClearSelection();

  } catch (error) {
    console.error('Error in handleSettlementCompleted:', error);
  } finally {
    isLoading.value = false;
  }
};



// Format last invoices for the history view
const formattedAbrechnungen = computed(() => {
  const entries = [];
  
  if (!insurersData.value || !Array.isArray(insurersData.value)) {
    console.warn('insurersData is not a valid array:', insurersData.value);
    // Return sample data for development purposes
    return getSampleAbrechnungen();
  }
  
  console.log('Processing insurers for history:', insurersData.value);
  
  // Process insurers data for history
  insurersData.value.forEach(insurer => {
    if (!insurer || !insurer.name) {
      return;
    }
    
    const insurerInvoices = lastInvoices.value[insurer.id] || [];
    
    if (insurerInvoices && insurerInvoices.length > 0) {
      insurerInvoices.forEach(invoice => {
        entries.push({
          insurerId: insurer.id,
          insurerName: insurer.name,
          date: invoice.date ? new Date(invoice.date) : null,
          amount: invoice.amount,
          note: invoice.note,
          id: invoice.id,
          abrechnungsweg: insurer.abrechnungsweg
        });
      });
    }
  });
  
  // If no real data is available, use sample data for development
  if (entries.length === 0) {
    console.log('No real abrechnungen data, using sample data');
    return getSampleAbrechnungen();
  }
  
  // Sort by date descending
  return entries.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
});

// Helper function to generate sample abrechnungen for development
const getSampleAbrechnungen = () => {
  return [
    {
      insurerId: 'sample-1',
      insurerName: 'Allianz',
      date: new Date(2025, 5, 15), // June 15, 2025
      amount: '1250.00',
      abrechnungsweg: 'Portal',
      status: 'Erfolgreich',
      id: 'sample-invoice-1'
    },
    {
      insurerId: 'sample-2',
      insurerName: 'AXA',
      date: new Date(2025, 5, 10), // June 10, 2025
      amount: '980.50',
      abrechnungsweg: 'E-Mail',
      status: 'Erfolgreich',
      id: 'sample-invoice-2'
    },
    {
      insurerId: 'sample-3',
      insurerName: 'Generali',
      date: new Date(2025, 4, 28), // May 28, 2025
      amount: '1560.75',
      abrechnungsweg: 'E-Mail',
      status: 'Bezahlt',
      id: 'sample-invoice-3'
    },
    {
      insurerId: 'sample-4',
      insurerName: 'HUK-Coburg',
      date: new Date(2025, 4, 20), // May 20, 2025
      amount: '2100.00',
      abrechnungsweg: 'Portal',
      documentType: 'Rechnung',
      status: 'Fehlgeschlagen',
      id: 'sample-invoice-4'
    },
    {
      insurerId: 'sample-5',
      insurerName: 'ERGO',
      date: new Date(2025, 4, 5), // May 5, 2025
      amount: '750.25',
      documentType: 'Gutschrift',
      status: 'Erfolgreich',
      id: 'sample-invoice-5'
    }
  ];
};

// Debug function to check insurer data and overdue status
const debugInsurerStatus = () => {
  console.log('--- Insurer Status Debug ---');
  insurersData.value.forEach(insurer => {
    const lastInv = lastInvoices.value[insurer.id];
    const daysOverdue = calculateDaysOverdue(insurer, lastInv, getCurrentDate());
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
  color-adjust: exact;
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
