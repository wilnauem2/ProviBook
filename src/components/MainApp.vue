<template>
  <div class="app-container">
    <!-- Main Layout -->
    <div class="min-h-screen bg-gray-50">
      <!-- Header with Tabs -->
      <header class="bg-white shadow-sm sticky top-0 z-10" :class="{ 'bg-yellow-100': currentEnvironment !== 'production' }">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <h1 class="text-xl font-semibold text-gray-900">Versicherungsübersicht</h1>
            <div class="ml-auto">
              <EnvironmentUserInfo 
                :currentEnvironment="currentEnvironment" 
                :username="'Admin'"
                @update:currentEnvironment="switchEnvironment"
              />
            </div>
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
              <button
                v-if="currentEnvironment !== 'production'"
                @click="activeTab = 'test'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
                  activeTab === 'test'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Test
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
            <p class="text-sm text-gray-500">{{ currentEnvironment === 'production' ? 'Produktionsumgebung' : 'Testumgebung' }}</p>
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
            
            <!-- TestDateSimulator moved to Test tab -->
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

        <!-- Test Tab -->
        <div v-else-if="activeTab === 'test'" class="w-full">
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="p-4">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Testmodus</h2>
                <p class="text-sm text-gray-600 mb-4">
                  In diesem Modus werden Mock-Daten anstelle der Live-Daten aus Firebase verwendet.
                  Verwenden Sie den Datumssimulator, um die überfälligen Status zu testen.
                </p>
                <TestDateSimulator 
                  :date="testDate" 
                  @update:date="handleDateUpdate"
                />
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
            <AbrechnungenHistory :abrechnungen="formattedAbrechnungen" />
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
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
              <h2 class="text-lg font-medium text-gray-900">{{ selectedInsurer.name }}</h2>
              <button 
                @click="handleClearSelection()" 
                class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto" style="height: calc(100vh - 80px);">
              <InsurerDetail 
                :insurer="selectedInsurer" 
                :lastInvoices="lastInvoices[selectedInsurer.id] || []" 
                :currentDate="getCurrentDate()"
                @settlement-completed="handleSettlementCompleted"
              />
              <!-- Debug output -->
              <div v-if="selectedInsurer" class="mt-4 p-3 bg-gray-100 rounded text-xs">
                <div><strong>Debug - Selected Insurer:</strong></div>
                <div>ID: {{ selectedInsurer.id }}</div>
                <div>Last Invoice: {{ JSON.stringify(selectedInsurer.last_invoice) }}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';
import { useRouter, useRoute } from 'vue-router';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Component imports
import AbrechnungenHistory from './AbrechnungenHistory.vue';
import HeaderSection from './HeaderSection.vue';
import EnvironmentUserInfo from './EnvironmentUserInfo.vue';
import StatusSummary from './StatusSummary.vue';
import SearchBar from './SearchBar.vue';
import InsurerList from './InsurerList.vue';
import InsurerDetail from './InsurerDetail.vue';
import TestDateSimulator from './TestDateSimulator.vue';

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
const testDate = ref(new Date());
const statusFilter = ref('all'); // 'all', 'warning', 'critical', 'on_time'
const currentEnvironment = ref(import.meta.env.MODE);

// Watch for tab changes to load data accordingly
watch(activeTab, (newTab) => {
  if (newTab === 'test') {
    insurerStore.fetchInsurers('insurers_test');
  } else if (newTab === 'main') {
    insurerStore.fetchInsurers('insurers'); // Explicitly fetch from production collection
  }
});

// Data - use store references
const insurersData = computed(() => insurerStore.insurers);
const selectedInsurer = computed(() => insurerStore.selectedInsurer);
const lastInvoices = computed(() => insurerStore.lastInvoices);



// Status counts for dashboard
const statusCounts = computed(() => {
  const now = getCurrentDate();
  const counts = {
    warning: 0,
    critical: 0,
    total: 0,
    on_time: 0
  };
  
  if (insurersData.value) {
    insurersData.value.forEach(insurer => {
      // Count all insurers
      counts.total++;
      
      const daysOverdue = calculateDaysOverdue(insurer, now);
      if (daysOverdue > 0) {
        if (daysOverdue <= 5) {
          counts.warning++;
        } else {
          counts.critical++;
        }
      } else {
        counts.on_time++;
      }
    });
  }
  
  return counts;
});

// Get current date (real or simulated)
const getCurrentDate = () => {
  return testDate.value || new Date();
};

// Handle date changes from the simulator
const handleDateUpdate = (newDate) => {
  testDate.value = newDate;
};

// Get a human-readable label for the status filter
const getStatusFilterLabel = (status) => {
  switch (status) {
    case 'warning':
      return 'Warnung (1-5 Tage überfällig)';
    case 'critical':
      return 'Kritisch (>5 Tage überfällig)';
    case 'on_time':
      return 'Pünktlich';
    default:
      return status;
  }
};

// Clear the status filter
const clearStatusFilter = () => {
  statusFilter.value = 'all';
  console.log('Status filter cleared');
};

// Handle status button clicks from StatusSummary component
const handleStatusClicked = (data) => {
  console.log(`Status clicked: ${data.status}`);
  
  // If the same status is clicked again, clear the filter
  if (statusFilter.value === data.status) {
    clearStatusFilter();
  } else {
    // Otherwise, set the filter to the clicked status
    statusFilter.value = data.status;
    console.log(`Filtering insurers by status: ${data.status}`);
  }
};

// Handle insurer selection
const handleInsurerSelection = (insurer) => {
  console.log('=== handleInsurerSelection ===');
  console.log('Selected insurer:', insurer);
  insurerStore.setSelectedInsurer(insurer);
};

// Handle clearing insurer selection
const handleClearSelection = () => {
  console.log('=== handleClearSelection ===');
  insurerStore.setSelectedInsurer(null);
};

// Handle settlement completion from the detail view
const handleSettlementCompleted = async (event) => {
  console.log('=== handleSettlementCompleted ===');
  console.log('Event received in MainApp.vue:', event);
  console.log('Event handler is running in MainApp.vue');
  
  try {
    if (!event) {
      console.error('No event object received');
      throw new Error('No event object received');
    }
    
    // Destructure with defaults to prevent errors if properties are missing
    const { insurer, newDate, displayDate, last_invoice } = event;
    
    if (!insurer) {
      throw new Error('No insurer data in event');
    }
    
    console.log('Processing settlement for insurer:', insurer.id || insurer.name);
    
    // Log the incoming data
    console.log('Processing insurer data:', JSON.stringify(insurer, null, 2));
    console.log('New date object:', newDate);
    console.log('Last invoice from event:', JSON.stringify(last_invoice, null, 2));
    
    // Ensure newDate is a valid Date object
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      console.error('Invalid date provided:', newDate);
      return;
    }
    
    // Use the last_invoice from the event if available, otherwise create a new one
    const lastInvoice = last_invoice || {
      display: displayDate,
      timestamp: newDate.getTime(),
      date: newDate.toISOString()
    };
    
    console.log('Using last_invoice object:', JSON.stringify(lastInvoice, null, 2));
    
    // Import the new function to update both collections
    const { updateInsurerLastInvoiceDate } = await import('../firebaseInvoices');
    
    // Get the current environment
    const env = currentEnvironment.value || 'test';
    console.log(`Current environment: ${env}`);
    
    // Update both the insurer document and the invoices collection
    await updateInsurerLastInvoiceDate(insurer.id, insurer.name, lastInvoice, env);
    console.log('Firebase update completed for both collections');
    
    // Also update the local store
    await insurerStore.updateInsurerLastInvoice(insurer.id, lastInvoice);
    console.log('Insurer data updated via Pinia store');
    
    // Force a UI update
    await nextTick();
    console.log('UI updated via nextTick');
    
    // Create a new invoice entry for the history
    const invoiceId = `invoice-${Date.now()}`;
    const newInvoice = {
      id: invoiceId,
      date: newDate,
      display: lastInvoice.display || displayDate,
      timestamp: lastInvoice.timestamp || newDate.getTime(),
      amount: insurer.amount || '0.00',
      status: 'Erfolgreich',
      documentType: 'Rechnung'
    };
    
    console.log('Created new invoice entry:', JSON.stringify(newInvoice, null, 2));
    
    // Update the lastInvoices object
    const updatedLastInvoices = {
      ...lastInvoices.value,
      [insurer.id]: [
        newInvoice,
        ...(lastInvoices.value[insurer.id] || []).slice(0, 4) // Keep only the 5 most recent
      ]
    };
    
    // Update the Pinia store with the new invoices
    insurerStore.setLastInvoices(updatedLastInvoices);
    
    console.log('Updated lastInvoices in store');
    
    console.log('=== Settlement completed successfully ===');
    
    // Force a re-render of the components
    await nextTick();
    
  } catch (error) {
    console.error('Error in handleSettlementCompleted:', error);
  }
};

// Log when activeTab changes
watch(activeTab, (newTab, oldTab) => {
  console.log(`Tab changed from ${oldTab} to ${newTab}`);
});

// Environment state
const activeEnvironment = ref(import.meta.env.MODE);

// Handle environment switching
const switchEnvironment = async (newEnvironment) => {
  console.log(`Switching environment from ${activeEnvironment.value} to ${newEnvironment}`);
  
  // Set loading state
  isLoading.value = true;
  insurerStore.setSelectedInsurer(null); // Clear selected insurer
  
  // Update environment
  activeEnvironment.value = newEnvironment;
  
  try {
    // Reload data for the new environment
    await loadData();
    console.log(`Environment switched to ${activeEnvironment.value}`);
  } catch (error) {
    console.error('Error switching environment:', error);
  } finally {
    // Reset loading state
    isLoading.value = false;
  }
};

// Main filtered insurers list
const filteredInsurers = computed(() => {
  if (!insurersData.value) return [];
  
  const now = getCurrentDate();
  let filtered = [...insurersData.value];
  
  // Apply search filter
  if (searchFilter.value.trim()) {
    const searchTerm = searchFilter.value.toLowerCase().trim();
    filtered = filtered.filter(insurer => 
      insurer.name.toLowerCase().includes(searchTerm) ||
      (insurer.id && insurer.id.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(insurer => {
      const daysOverdue = calculateDaysOverdue(insurer, now);
      
      switch (statusFilter.value) {
        case 'warning':
          return daysOverdue > 0 && daysOverdue <= 5;
        case 'critical':
          return daysOverdue > 5;
        case 'on_time':
          return daysOverdue <= 0;
        default:
          return true;
      }
    });
  }
  
  return filtered;
});

// Load data based on environment
const loadInsurersData = async () => {
  isLoading.value = true;
  try {
    // Fetch insurers using the store action
    await insurerStore.fetchInsurers();
    console.log(`Loaded ${insurersData.value.length} insurers for ${activeEnvironment.value}`);
  } catch (error) {
    console.error('Error loading insurers:', error);
  } finally {
    isLoading.value = false;
  }
};

// Set up real-time listener for invoices
let unsubscribeInvoices = null;
const loadLastInvoices = async () => {
  if (unsubscribeInvoices) {
    unsubscribeInvoices();
  }
  
  unsubscribeInvoices = subscribeInvoices((data) => {
    // Update the Pinia store with the fetched data
    insurerStore.setLastInvoices(data || {});
    console.log('Last invoices updated in store:', data);
  });
};

// Load all data based on current environment
const loadData = async () => {
  await loadInsurersData();
  loadLastInvoices();
  console.log('Environment:', activeEnvironment.value);
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
          id: invoice.id
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
      documentType: 'Rechnung',
      status: 'Erfolgreich',
      id: 'sample-invoice-1'
    },
    {
      insurerId: 'sample-2',
      insurerName: 'AXA',
      date: new Date(2025, 5, 10), // June 10, 2025
      amount: '980.50',
      documentType: 'Gutschrift',
      status: 'Erfolgreich',
      id: 'sample-invoice-2'
    },
    {
      insurerId: 'sample-3',
      insurerName: 'Generali',
      date: new Date(2025, 4, 28), // May 28, 2025
      amount: '1560.75',
      documentType: 'Rechnung',
      status: 'Ausstehend',
      id: 'sample-invoice-3'
    },
    {
      insurerId: 'sample-4',
      insurerName: 'HUK-Coburg',
      date: new Date(2025, 4, 20), // May 20, 2025
      amount: '2100.00',
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
  console.log('===== DEBUG INSURER STATUS =====');
  const now = getCurrentDate();
  
  if (insurersData.value && insurersData.value.length > 0) {
    insurersData.value.forEach(insurer => {
      const daysOverdue = calculateDaysOverdue(insurer, now);
      console.log(`Insurer: ${insurer.name}`);
      console.log(`  Last Invoice: ${JSON.stringify(insurer.last_invoice)}`);
      console.log(`  Turnus: ${insurer.turnus}`);
      console.log(`  Days Overdue: ${daysOverdue}`);
      console.log(`  Status Color: ${getStatusColor(insurer)}`);
      console.log('-------------------------');
    });
  } else {
    console.log('No insurers data available');
  }
  
  console.log('Status counts:', statusCounts.value);
  console.log('===== END DEBUG =====');
};

// Initial data loading and cleanup
onMounted(() => {
  loadData();
  // Run debug after data is loaded
  setTimeout(() => {
    debugInsurerStatus();
  }, 2000);
});

onUnmounted(() => {
  if (unsubscribeInvoices) {
    unsubscribeInvoices();
  }
});
</script>

<style>
/* Animation for the slide-in panel */
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}

/* Fade animation for the overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
