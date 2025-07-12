<template>
  <div class="app-container">
    <div class="tabs mb-4">
      <button 
        @click="activeTab = 'main'" 
        :class="{ 'border-b-2 border-blue-500 text-blue-600': activeTab === 'main' }"
        class="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        Übersicht
      </button>
      <button 
        @click="activeTab = 'history'" 
        :class="{ 'border-b-2 border-blue-500 text-blue-600': activeTab === 'history' }"
        class="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        Abrechnungsverlauf
      </button>
    </div>
    <div v-if="activeTab === 'main'" class="content">
      <div class="header-container sticky-header">
      <div class="w-full bg-white shadow-sm">
        <!-- Title Section - Always at the very top -->
        <div class="w-full text-center py-3 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Provisionenbuchungen</h1>
        </div>
        
        <!-- Content below title -->
        <div class="flex flex-col gap-2 px-4 py-3">
          
          <!-- Environment and User Info Section -->
          <div class="flex flex-col items-center gap-3 mt-1">
            <div class="environment-switch">
              <select v-model="currentEnvironment" 
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="production" class="text-gray-700">Produktion</option>
                <option value="test" class="text-gray-700">Test</option>
              </select>
            </div>
            
            <div class="flex items-center gap-3 flex-wrap justify-center">
              <span class="text-sm text-gray-600 whitespace-nowrap">Angemeldet als: {{ username }}</span>
              <button 
                @click="logout"
                class="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm flex items-center"
                aria-label="Abmelden"
              >
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Abmelden
              </button>
            </div>
          </div>
          <div class="status-summary flex flex-col gap-4 md:flex-row md:gap-4">
            <div class="status-item yellow flex-1 min-w-[200px]">
              <span class="status-dot"></span>
              <span class="count">{{ statusCounts.yellow }}</span>
              <span class="label">1-5 Tage überfällig</span>
            </div>
            <div class="status-item red flex-1 min-w-[200px]">
              <span class="status-dot"></span>
              <span class="count">{{ statusCounts.red }}</span>
              <span class="label">> 5 Tage überfällig</span>
            </div>
            <div class="status-total flex-1 min-w-[200px]">
              <span class="label">Gesamt überfällig:</span>
              <span class="count">{{ statusCounts.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TestDateSimulator v-model="testDate" v-if="currentEnvironment === 'test' && activeTab === 'main'" @update:modelValue="handleDateUpdate" class="mt-4" />
    <div class="content">
      <div class="insurer-list">
        <div class="search-bar">
          <div class="relative">
            <input 
              v-model="searchFilter" 
              type="text" 
              placeholder="Suche nach Versicherung..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Suche nach Versicherung"
              :aria-invalid="searchError"
              @input="validateSearch"
            />
            <button 
              @click="clearSearch" 
              :disabled="!searchFilter"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50"
              aria-label="Suche löschen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div class="sort-options">
          <div class="relative">
            <select v-model="sortOption" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name">Name</option>
              <option value="last_invoice">Letzte Abrechnung</option>
              <option value="status">Status</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div class="insurer-grid">
          <div
            v-for="insurer in filteredInsurers"
            :key="insurer.name"
            class="insurer-card"
            :class="{ selected: selectedInsurer === insurer, complete: insurer.complete, incomplete: !insurer.complete }"
            @click="handleInsurerClick(insurer)"
            :aria-selected="selectedInsurer === insurer"
            :aria-label="`Versicherung ${insurer.name} anzeigen`"
          >
            <div class="insurer-info">
               <div class="flex flex-col justify-between">
                 <div>
                   <h3 class="text-xl font-semibold mb-1">{{ insurer.name }}</h3>
                   <p class="status" :class="getStatusColor(insurer, getCurrentDate())">
                     {{ getStatusText(insurer, getCurrentDate()) }}
                   </p>
                 </div>
                 <div class="flex gap-2 justify-end">
                   <span v-if="insurer.bezugsweg?.split(',').some(v => v.trim().toLowerCase() === 'bi-pro' || v.trim().toLowerCase() === 'bipro')" 
                         class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     BiPRO
                   </span>
                   <span v-if="insurer.dokumentenart?.split(',').some(v => v.trim().toLowerCase() === 'pdf')" 
                         class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     PDF
                   </span>
                   <span v-if="insurer.dokumentenart?.split(',').some(v => v.trim().toLowerCase() === 'csv')" 
                         class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     CSV
                   </span>
                   <!-- Turnus tags -->
                   <span v-if="insurer.turnus?.match(/7-tägig/i)"
                         class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     7
                   </span>
                   <span v-else-if="insurer.turnus?.match(/14-tägig/i)"
                         class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     14
                   </span>
                   <span v-else-if="insurer.turnus?.match(/31-tägig/i)"
                         class="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     31
                   </span>
                   <!-- Checkmark for complete insurers -->
                   <span v-if="insurer.complete" 
                         class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     ✓
                   </span>
                   <!-- Kommentar tag -->
                   <span v-if="insurer.kommentar" 
                         class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                     K
                   </span>
                 </div>
               </div>

            </div>
            <div class="insurer-details">
              <p v-if="insurer.last_invoice" class="text-sm">
                <span class="font-medium text-gray-600">Letzte Abrechnung:</span> {{ formatLastInvoiceDate(insurer.last_invoice) }}
              </p>
              <p class="text-sm">
                <span class="font-medium text-gray-600">Bezugsweg:</span> {{ insurer.bezugsweg || 'Keine Angabe' }}
              </p>
              <p class="text-sm">
                <span class="font-medium text-gray-600">Dokumentenart:</span> {{ insurer.dokumentenart || 'Keine Angabe' }}
              </p>
              <p class="text-sm">
                <span class="font-medium text-gray-600">Turnus:</span> {{ insurer.turnus || 'Keine Angabe' }}
              </p>
              <p class="text-sm">
                <span class="font-medium text-gray-600">Kommentar:</span> {{ insurer.kommentar || 'Keine Angabe' }}
              </p>
            </div>
            
            <!-- Loading state -->
            <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="insurer-detail" v-if="selectedInsurer">
        <InsurerDetail 
          :insurer="selectedInsurer" 
          @close="selectedInsurer = null"
          @settlement-completed="handleSettlementCompleted"
        />
      </div>
      </div>
    </div>
    
    <!-- Abrechnungen History View -->
    <div v-if="activeTab === 'history'" class="content">
      <AbrechnungenHistory :abrechnungen="formattedAbrechnungen" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AbrechnungenHistory from './AbrechnungenHistory.vue'
import { useRouter, useRoute } from 'vue-router'
import { currentEnvironment, getInsurersData, getFirestoreNames } from '../config/environment'
import InsurerDetail from './InsurerDetail.vue'
import { calculateDaysOverdue, isOverdue, getStatusColor, getStatusText, formatLastInvoiceDate } from '../utils/insurerUtils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import TestDateSimulator from './TestDateSimulator.vue'
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore'

// Helper function to log raw Firestore data for debugging
const logRawFirestoreData = async () => {
  try {
    console.log('Fetching raw Firestore data...');
    const { COLLECTION_NAME, DOC_NAME } = getFirestoreNames(currentEnvironment.value);
    const docRef = doc(collection(getFirestore(), COLLECTION_NAME), DOC_NAME);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Raw Firestore data:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.log('No data found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    throw error;
  }
};

const router = useRouter()
const route = useRoute()

// Authentication state
const isAuthenticated = computed(() => {
  return localStorage.getItem('authToken') !== null
})

// User info
const username = ref(localStorage.getItem('username') || '')

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('username')
  router.push('/login')
}

const searchFilter = ref('')
const activeTab = ref('main');
const selectedInsurer = ref(null);
const insurersData = ref([]);
const isLoading = ref(true);
const lastInvoices = ref({});
const sortOption = ref('name')

// Status counts
const statusCounts = computed(() => {
  const now = getCurrentDate()
  const counts = {
    yellow: 0,
    red: 0,
    total: 0
  }
  
  filteredInsurers.value.forEach(insurer => {
    const daysOverdue = calculateDaysOverdue(insurer, now)
    if (daysOverdue > 0) {
      counts.total++
      if (daysOverdue <= 5) {
        counts.yellow++
      } else {
        counts.red++
      }
    }
  })
  
  return counts
})

// Test date simulation
const testDate = ref(new Date())

// Custom date function that uses test date in test mode
const getCurrentDate = () => {
  // Always return a fresh Date object
  const now = currentEnvironment.value === 'test' ? new Date(testDate.value.getTime()) : new Date()
  console.log('Current date:', now)
  return now
}

const handleDateUpdate = (newDate) => {
  console.log('Date updated to:', newDate)
  testDate.value = new Date(newDate)
}

// Initialize with current date
watch(testDate, (newDate) => {
  console.log('Test date changed to:', newDate)
  // Update the filtered insurers to trigger re-render
})



// Watch for environment changes
watch(currentEnvironment, () => {
  console.log('Environment changed to:', currentEnvironment.value)
  // Reset test date when switching to production
  if (currentEnvironment.value !== 'test') {
    testDate.value = new Date()
  }
})

// Watch for changes in insurersData, searchFilter, and testDate
watch([insurersData, searchFilter, testDate], () => {
  // Update the filtered insurers to trigger re-render

}, { deep: true })

// Load insurers data based on environment
const loadInsurersData = async () => {
  try {
    const data = await getInsurersData()
    // Make sure we have proper date handling
    const processedData = JSON.parse(JSON.stringify(data), (key, value) => {
      // If this is a date string in the expected format, convert it to a Date object
      if (typeof value === 'string' && /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/.test(value)) {
        const [datePart, timePart] = value.split(', ');
        const [day, month, year] = datePart.split('.').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const date = new Date(year, month - 1, day, hours, minutes);
        
        // Return an object with both the display string and timestamp
        return {
          display: value,
          timestamp: date.getTime(),
          toJSON: () => value // Ensure proper serialization
        };
      }
      return value;
    });
    
    // Ensure each insurer has an invoices array
    const insurersWithInvoices = processedData.map(insurer => {
      // If invoices array doesn't exist, initialize it with last_invoice if available
      if (!insurer.invoices) {
        return {
          ...insurer,
          invoices: insurer.last_invoice ? [insurer.last_invoice] : []
        };
      }
      return insurer;
    });
    
    insurersData.value = insurersWithInvoices;
  } catch (error) {
    console.error('Error loading insurers data:', error)
  }
}

// Load last invoices from Firestore via Firebase
import { fetchInvoices, saveInvoices, subscribeInvoices } from '../firebaseInvoices'

// Set up real-time listener for last_invoices
let unsubscribeInvoices = null;

// Helper function to update insurers with invoice data
const updateInsurersWithInvoiceData = (insurers, invoicesData) => {
  console.log('=== Updating insurers with invoice data ===');
  console.log('Raw invoices data:', JSON.parse(JSON.stringify(invoicesData)));
  
  // If we have the new format with allInvoices, use that
  if (invoicesData.allInvoices) {
    console.log('Processing allInvoices data');
    
    return insurers.map(insurer => {
      if (!insurer || !insurer.name) {
        console.warn('Skipping invalid insurer:', insurer);
        return insurer;
      }
      
      // Get all invoices for this insurer
      let allInvoices = [];
      const insurerInvoices = invoicesData.allInvoices[insurer.name];
      
      console.log(`\n--- Processing insurer: ${insurer.name} ---`);
      console.log('Current insurer data:', JSON.parse(JSON.stringify(insurer)));
      
      // Handle both array format and object format
      if (Array.isArray(insurerInvoices)) {
        console.log(`Found ${insurerInvoices.length} invoices in array format`);
        allInvoices = insurerInvoices.map(inv => {
          if (!inv) return null;
          
          // If it's already an object with display and timestamp, use it as is
          if (typeof inv === 'object' && inv !== null && inv.display) {
            return {
              display: inv.display,
              date: inv.date || new Date().toISOString(),
              timestamp: inv.timestamp || new Date().getTime()
            };
          }
          
          // If it's a string, convert it to the object format
          if (typeof inv === 'string') {
            return {
              display: inv,
              date: new Date().toISOString(),
              timestamp: new Date().getTime()
            };
          }
          
          // For any other format, convert to string
          return {
            display: String(inv),
            date: new Date().toISOString(),
            timestamp: new Date().getTime()
          };
        }).filter(Boolean); // Remove any null entries
      } 
      // If it's not an array but exists, wrap it in an array
      else if (insurerInvoices) {
        console.log('Found single invoice (non-array format):', insurerInvoices);
        allInvoices = [{
          display: typeof insurerInvoices === 'object' 
            ? (insurerInvoices.display || JSON.stringify(insurerInvoices))
            : String(insurerInvoices),
          date: insurerInvoices.date || new Date().toISOString(),
          timestamp: insurerInvoices.timestamp || new Date().getTime()
        }];
      }
      
      // Get the most recent invoice (first in the array)
      const lastInvoice = allInvoices.length > 0 ? allInvoices[0] : null;
      
      console.log(`Processed ${insurer.name}:`, {
        allInvoices: JSON.parse(JSON.stringify(allInvoices)),
        lastInvoice: JSON.parse(JSON.stringify(lastInvoice))
      });
      
      // Create the updated insurer with all invoices
      const updatedInsurer = {
        ...insurer,
        invoices: allInvoices
      };
      
      // Only update last_invoice if we have invoices
      if (lastInvoice) {
        updatedInsurer.last_invoice = lastInvoice.display;
        updatedInsurer.last_invoice_timestamp = lastInvoice.timestamp;
      }
      
      return updatedInsurer;
    });
  }
  
  // Fallback to lastInvoices for backward compatibility
  console.log('No allInvoices found, falling back to lastInvoices');
  return insurers.map(insurer => {
    const lastInvoice = invoicesData.lastInvoices?.[insurer.name];
    
    // If we have a last_invoice, make sure it's in the invoices array
    let invoices = [...(insurer.invoices || [])];
    if (lastInvoice) {
      // Check if this invoice already exists in the array
      const invoiceExists = invoices.some(inv => {
        const invStr = typeof inv === 'object' ? inv.display : String(inv);
        const lastInvStr = typeof lastInvoice === 'object' ? lastInvoice.display : String(lastInvoice);
        return invStr === lastInvStr;
      });
      
      // If it doesn't exist, add it to the beginning of the array
      if (!invoiceExists) {
        invoices.unshift({
          display: typeof lastInvoice === 'object' ? lastInvoice.display : String(lastInvoice),
          date: new Date().toISOString(),
          timestamp: new Date().getTime()
        });
      }
    }
    
    return {
      ...insurer,
      last_invoice: lastInvoice || insurer.last_invoice,
      invoices: invoices,
      last_invoice_timestamp: lastInvoice 
        ? (typeof lastInvoice === 'object' && lastInvoice.timestamp 
            ? lastInvoice.timestamp 
            : new Date(
                typeof lastInvoice === 'string' 
                  ? lastInvoice.split(', ').reverse().join('T')
                  : lastInvoice
              ).getTime())
        : insurer.last_invoice_timestamp
    };
  });
};

// Debug function to log raw Firestore data
const logRawFirestoreData = async () => {
  try {
    console.log('Fetching raw Firestore data...');
    const data = await fetchInvoices(currentEnvironment.value);
    console.log('Raw Firestore data:', JSON.parse(JSON.stringify(data)));
    
    // Log structure of the data
    if (data) {
      console.log('Data structure:');
      if (data.allInvoices) {
        console.log('allInvoices keys:', Object.keys(data.allInvoices));
        Object.entries(data.allInvoices).forEach(([insurer, invoices]) => {
          console.log(`Insurer ${insurer} has ${Array.isArray(invoices) ? invoices.length : 'non-array'} invoices:`, invoices);
        });
      }
      if (data.lastInvoices) {
        console.log('lastInvoices:', data.lastInvoices);
      }
    }
  } catch (error) {
    console.error('Error fetching raw Firestore data:', error);
  }
};

// Load last invoices from Firestore
const loadLastInvoices = async () => {
  // Log raw Firestore data for debugging
  await logRawFirestoreData();
  
  // Set up real-time listener for future updates first
  if (unsubscribeInvoices) {
    console.log('Unsubscribing from previous invoice updates');
    unsubscribeInvoices();
  }
  
  console.log('Setting up real-time invoice listener...');
  unsubscribeInvoices = subscribeInvoices((data) => {
    console.log('Received real-time invoice update:', data);
    
    if (data) {
      // Update lastInvoices for backward compatibility
      lastInvoices.value = data.lastInvoices || {};
      
      // Update the local state with the new invoice data
      insurersData.value = updateInsurersWithInvoiceData(insurersData.value, data);
      
      // Update the selected insurer if it exists
      if (selectedInsurer.value) {
        const updatedInsurer = insurersData.value.find(i => i.name === selectedInsurer.value.name);
        if (updatedInsurer) {
          selectedInsurer.value = { ...updatedInsurer };
        }
      }
    }
  }, currentEnvironment.value);
  
  // Now load the initial data
  try {
    console.log('Loading last invoices from Firestore...');
    const data = await fetchInvoices(currentEnvironment.value);
    
    if (data) {
      console.log('Fetched invoice data from Firestore:', JSON.parse(JSON.stringify(data)));
      
      // Update lastInvoices for backward compatibility
      lastInvoices.value = data.lastInvoices || {};
      
      // Update the local state with the new invoice data
      insurersData.value = updateInsurersWithInvoiceData(insurersData.value, data);
      
      console.log('Updated insurers data:', JSON.parse(JSON.stringify(insurersData.value)));
      
      // Update the selected insurer if it exists
      if (selectedInsurer.value) {
        const updatedInsurer = insurersData.value.find(i => i.name === selectedInsurer.value.name);
        if (updatedInsurer) {
          selectedInsurer.value = { ...updatedInsurer };
          console.log('Updated selected insurer:', JSON.parse(JSON.stringify(selectedInsurer.value)));
        }
      }
    } else {
      console.log('No invoice data found in Firestore');
    }
  } catch (error) {
    console.error('Error loading invoices:', error);
  }
};

// Load all data based on current environment
const loadData = async () => {
  isLoading.value = true
  try {
    await Promise.all([loadInsurersData(), loadLastInvoices()])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
}

// Initial load and subscribe to real-time updates
import { onUnmounted } from 'vue'
onMounted(() => {
  loadData()
  loadLastInvoices()
})
onUnmounted(() => {
  if (unsubscribeInvoices) unsubscribeInvoices();
})

// Watch for real-time updates to lastInvoices and update insurersData accordingly
watch(lastInvoices, (newVal) => {
  if (!insurersData.value || !newVal) return;
  // Always replace the array for Vue reactivity
  insurersData.value = insurersData.value.map(insurer => ({
    ...insurer,
    last_invoice: newVal[insurer.name] || ''
  }));
  console.log('Updated insurersData:', insurersData.value);
});

const filteredInsurers = computed(() => {
  // Clone the data to avoid mutations
  let filtered = [...insurersData.value]
  
  // Apply search filter
  if (searchFilter.value) {
    const searchLower = searchFilter.value.toLowerCase()
    filtered = filtered.filter(insurer => 
      insurer.name.toLowerCase().includes(searchLower) ||
      (insurer.turnus && insurer.turnus.toLowerCase().includes(searchLower)) ||
      (insurer.last_invoice && insurer.last_invoice.toLowerCase().includes(searchLower))
    )
  }
  
  // Sort by selected option
  switch (sortOption.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'status':
      filtered.sort((a, b) => {
        const statusA = getStatusColor(a, getCurrentDate())
        const statusB = getStatusColor(b, getCurrentDate())
        return statusA.localeCompare(statusB)
      })
      break
    case 'last_invoice':
      filtered.sort((a, b) => {
        const getDate = (item) => {
          if (!item.last_invoice) return new Date(0); // Very old date for null/undefined
          
          // Handle the new object format
          if (typeof item.last_invoice === 'object' && item.last_invoice !== null) {
            if (item.last_invoice.timestamp) {
              return new Date(item.last_invoice.timestamp);
            }
            if (item.last_invoice.display) {
              return new Date(item.last_invoice.display.split(', ').reverse().join('T'));
            }
            return new Date(0);
          }
          
          // Handle the old string format
          if (typeof item.last_invoice === 'string') {
            return new Date(item.last_invoice.split(', ').reverse().join('T'));
          }
          
          return new Date(0);
        };
        
        const dateA = getDate(a);
        const dateB = getDate(b);
        return dateB.getTime() - dateA.getTime();
      })
      break
  }

  return filtered
})

// Parse a date string in the format "DD.MM.YYYY, HH:mm" or "DD.MM.YYYY"
const parseDateString = (dateStr) => {
  if (!dateStr) return new Date(0);
  
  try {
    // Handle the format "DD.MM.YYYY, HH:mm"
    if (dateStr.includes(',')) {
      const [datePart, timePart] = dateStr.split(',').map(s => s.trim());
      const [day, month, year] = datePart.split('.').map(Number);
      
      let hours = 0, minutes = 0;
      if (timePart) {
        [hours, minutes] = timePart.split(':').map(Number);
      }
      
      // Note: Month is 0-indexed in JavaScript Date
      return new Date(year, month - 1, day, hours, minutes);
    } 
    // Handle the format "DD.MM.YYYY"
    else if (dateStr.includes('.')) {
      const [day, month, year] = dateStr.split('.').map(Number);
      return new Date(year, month - 1, day);
    }
    // Fallback to default Date parsing
    else {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date(0) : date;
    }
  } catch (e) {
    console.warn('Failed to parse date:', dateStr, e);
    return new Date(0);
  }
};



// Format all invoices for the history view
const formattedAbrechnungen = computed(() => {
  const allAbrechnungen = [];
  
  console.log('MainApp - Formatting abrechnungen from insurers:', JSON.parse(JSON.stringify(insurersData.value)));
  
  // Debug: Check if we have data
  if (!insurersData.value || insurersData.value.length === 0) {
    console.warn('MainApp - No insurers data available');
    return [];
  }
  
  insurersData.value.forEach(insurer => {
    if (!insurer) return;
    
    console.log(`MainApp - Processing insurer: ${insurer.name}`, insurer);
    
    try {
      // Process invoices array if it exists
      if (Array.isArray(insurer.invoices) && insurer.invoices.length > 0) {
        console.log(`Processing ${insurer.invoices.length} invoices for ${insurer.name}:`, insurer.invoices);
        
        insurer.invoices.forEach((invoiceDate, index) => {
          try {
            if (!invoiceDate) return;
            
            // Handle both string and object formats
            let dateString, displayDate, timestamp;
            
            if (typeof invoiceDate === 'object' && invoiceDate !== null) {
              // Handle object format
              dateString = invoiceDate.date || invoiceDate.display || JSON.stringify(invoiceDate);
              displayDate = invoiceDate.display || dateString;
              timestamp = invoiceDate.timestamp || parseDateString(dateString);
            } else {
              // Handle string format
              dateString = String(invoiceDate);
              displayDate = dateString;
              timestamp = parseDateString(dateString);
            }
            
            // Only add if we have a valid date
            if (dateString) {
              const entry = {
                insurer: insurer.name,
                date: displayDate,
                timestamp: timestamp,
                raw: invoiceDate
              };
              
              allAbrechnungen.push(entry);
              console.log(`Added invoice ${index + 1} for ${insurer.name}:`, entry);
            }
          } catch (e) {
            console.error(`Error processing invoice ${index} for ${insurer.name}:`, invoiceDate, e);
          }
        });
      } 
      // Fallback to last_invoice for backward compatibility
      else if (insurer.last_invoice) {
        console.log(`Using last_invoice for ${insurer.name}:`, insurer.last_invoice);
        
        let dateString, displayDate, timestamp;
        
        if (typeof insurer.last_invoice === 'object' && insurer.last_invoice !== null) {
          dateString = insurer.last_invoice.date || insurer.last_invoice.display || JSON.stringify(insurer.last_invoice);
          displayDate = insurer.last_invoice.display || dateString;
          timestamp = insurer.last_invoice.timestamp || parseDateString(dateString);
        } else {
          dateString = String(insurer.last_invoice);
          displayDate = dateString;
          timestamp = parseDateString(dateString);
        }
        
        // Only add if we have a valid date
        if (dateString) {
          allAbrechnungen.push({
            insurer: insurer.name,
            date: displayDate,
            timestamp: timestamp,
            raw: insurer.last_invoice
          });
        }
      }
    } catch (e) {
      console.error(`Error processing insurer ${insurer.name}:`, e);
    }
  });
  
  console.log('All abrechnungen before sorting:', JSON.parse(JSON.stringify(allAbrechnungen)));
  
  // Sort by timestamp (newest first) - ensure we have valid timestamps
  const sorted = [...allAbrechnungen].sort((a, b) => {
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    return timeB - timeA;
  });
  
  console.log('Sorted abrechnungen:', JSON.parse(JSON.stringify(sorted)));
  
  return sorted;
});

// Watch for environment changes
watch(currentEnvironment, async () => {
  await loadData()
})
// (Removed forced re-render watcher. Vue will now handle updates reactively.)

const handleInsurerClick = (insurer) => {
  if (selectedInsurer.value === insurer) {
    selectedInsurer.value = null
  } else {
    selectedInsurer.value = insurer
  }
}

const handleSearchInput = (event) => {
  searchFilter.value = event.target.value
}

const clearSearch = () => {
  searchFilter.value = ''
}

const saveToJson = async () => {
  try {
    console.log('\n=== Starting saveToJson ===');
    
    if (!selectedInsurer.value) {
      console.warn('No insurer selected, saving all insurers data');
    } else {
      console.log('Selected insurer:', selectedInsurer.value.name);
      
      // Update local state
      const insurerIndex = insurersData.value.findIndex(i => i && i.name === selectedInsurer.value.name);
      if (insurerIndex !== -1) {
        console.log('Updating local state for insurer:', selectedInsurer.value.name);
        insurersData.value[insurerIndex] = { ...selectedInsurer.value };
      } else {
        console.warn('Selected insurer not found in insurersData');
      }
    }

    // Prepare data for saving
    const lastInvoicesObj = {}; // For backward compatibility
    const allInvoicesObj = {};  // For storing all invoices

    console.log('\n--- Processing insurers data ---');
    console.log('Total insurers:', insurersData.value.length);
    console.log('Current environment:', currentEnvironment.value);

    insurersData.value.forEach((insurer, index) => {
      if (!insurer || !insurer.name) {
        console.warn(`Skipping invalid insurer at index ${index}:`, insurer);
        return;
      }
      
      console.log(`\n--- Processing insurer: ${insurer.name} (${index + 1}/${insurersData.value.length}) ---`);
      console.log('Raw insurer data:', JSON.parse(JSON.stringify(insurer)));
      
      // Initialize the invoices array for this insurer
      let invoicesToSave = [];
      
      // If we have an array of invoices, use it
      if (Array.isArray(insurer.invoices) && insurer.invoices.length > 0) {
        console.log(`Found ${insurer.invoices.length} invoices in the 'invoices' array`);
        console.log('Invoices array:', JSON.parse(JSON.stringify(insurer.invoices)));
        invoicesToSave = [...insurer.invoices];
      } 
      // Fallback to last_invoice if no invoices array exists
      else if (insurer.last_invoice) {
        console.log(`No 'invoices' array found, using 'last_invoice' for ${insurer.name}`);
        console.log('last_invoice value:', insurer.last_invoice);
        
        // Handle different formats of last_invoice
        if (typeof insurer.last_invoice === 'object' && insurer.last_invoice !== null) {
          console.log('last_invoice is an object, normalizing...');
          invoicesToSave = [{
            display: insurer.last_invoice.display || JSON.stringify(insurer.last_invoice),
            date: insurer.last_invoice.date || new Date().toISOString(),
            timestamp: insurer.last_invoice.timestamp || new Date().getTime()
          }];
        } else {
          // It's a string or other primitive
          console.log('last_invoice is a primitive, converting to object...');
          invoicesToSave = [{
            display: String(insurer.last_invoice),
            date: new Date().toISOString(),
            timestamp: new Date().getTime()
          }];
        }
        console.log('Created invoice entry from last_invoice:', invoicesToSave[0]);
      } else {
        console.log(`No invoices or last_invoice found for ${insurer.name}`);
      }
      
      // Store the most recent invoice for backward compatibility
      if (invoicesToSave.length > 0) {
        const mostRecentInvoice = invoicesToSave[0];
        lastInvoicesObj[insurer.name] = typeof mostRecentInvoice === 'object' 
          ? mostRecentInvoice.display 
          : String(mostRecentInvoice);
        
        console.log(`Set last_invoice for ${insurer.name}:`, lastInvoicesObj[insurer.name]);
      } else {
        console.log(`No invoices to save for ${insurer.name}`);
      }
      
      // Store all invoices in the standardized format
      allInvoicesObj[insurer.name] = invoicesToSave.map((invoice, index) => {
        let processedInvoice;
        
        if (typeof invoice === 'object' && invoice !== null) {
          processedInvoice = {
            display: invoice.display || String(invoice),
            date: invoice.date || new Date().toISOString(),
            timestamp: invoice.timestamp || new Date().getTime()
          };
        } else {
          processedInvoice = {
            display: String(invoice),
            date: new Date().toISOString(),
            timestamp: new Date().getTime()
          };
        }
        
        console.log(`  Invoice ${index + 1}:`, processedInvoice);
        return processedInvoice;
      });
      
      console.log(`Processed ${allInvoicesObj[insurer.name].length} invoices for ${insurer.name}`);
      console.log('lastInvoices entry:', lastInvoicesObj[insurer.name] || 'undefined');
      console.log('allInvoices entries:', allInvoicesObj[insurer.name]);
    });

    console.log('\n=== Prepared data for saving ===');
    const saveData = {
      lastInvoices: lastInvoicesObj,
      allInvoices: allInvoicesObj
    };
    
    console.log('Data to save:', JSON.stringify(saveData, null, 2));
    console.log('Environment:', currentEnvironment.value);

    try {
      console.log('\n=== Starting Firestore save operation ===');
      
      // Log the data we're about to save
      console.log('Calling saveInvoices with:', {
        data: saveData,
        environment: currentEnvironment.value
      });
      
      // Save both lastInvoices (for backward compatibility) and allInvoices
      const saveResult = await saveInvoices(saveData, currentEnvironment.value);
      
      console.log('Save operation completed. Result:', saveResult);
      console.log('[Save] Successfully saved invoices to environment:', currentEnvironment.value);
      
      try {
        // Log the raw Firestore data after saving
        console.log('\n=== Fetching Firestore data for verification ===');
        const rawData = await logRawFirestoreData();
        console.log('Raw Firestore data after save:', rawData);
        
        // Reload data after successful save to ensure consistency
        console.log('\n=== Reloading insurers data ===');
        await loadInsurersData();
        
        console.log('\n=== Save operation completed successfully ===');
        return true; // Indicate success
      } catch (error) {
        console.error('Error in save operation verification:', error);
        // Even if verification fails, the save might have succeeded
        // So we'll still return true but log the error
        return true;
      }
    } catch (error) {
      console.error('[Save] Error writing invoices:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in saveToJson:', error);
    alert(`Fehler beim Speichern der Daten:\n${error.message}\nDetails:\n${error.stack}`);
  }
};

const handleSettlementCompleted = async ({ insurer, newDate, displayDate }) => {
  try {
    console.log('=== Starting handleSettlementCompleted ===');
    console.log('Insurer:', insurer.name);
    console.log('New date:', displayDate);
    
    // Create a new invoice entry
    const newInvoice = {
      date: newDate.toISOString(),
      display: displayDate,
      timestamp: newDate.getTime()
    };
    
    console.log('New invoice object:', newInvoice);
    
    // Get the current insurer data
    const index = insurersData.value.findIndex(i => i.name === insurer.name);
    if (index === -1) {
      console.error('Insurer not found:', insurer.name);
      return;
    }
    
    const currentInsurer = JSON.parse(JSON.stringify(insurersData.value[index]));
    console.log('Current insurer data (before update):', currentInsurer);
    
    // Ensure we have an array of invoices
    const currentInvoices = Array.isArray(currentInsurer.invoices) 
      ? [...currentInsurer.invoices] 
      : [];
    
    console.log('Current invoices (before adding new one):', currentInvoices);
    
    // Check if this exact date already exists to prevent duplicates
    const dateExists = currentInvoices.some(invoice => {
      const invoiceDate = typeof invoice === 'object' 
        ? (invoice.display || String(invoice))
        : String(invoice);
      return invoiceDate === displayDate;
    });
    
    if (dateExists) {
      console.log('This date already exists in the invoices:', displayDate);
      return;
    }
    
    // Create the updated insurer with the new invoice
    const updatedInvoices = [newInvoice, ...currentInvoices];
    console.log('Updated invoices array:', updatedInvoices);
    
    const updatedInsurer = {
      ...currentInsurer,
      last_invoice: displayDate,
      last_invoice_timestamp: newDate.getTime(),
      last_invoice_date: newDate.toISOString(),
      invoices: updatedInvoices
    };

    console.log('Updated insurer data (before saving):', updatedInsurer);
    
    // Update the insurers data - create a new array to trigger reactivity
    const updatedInsurers = insurersData.value.map(ins => 
      ins.name === insurer.name ? updatedInsurer : ins
    );
    
    // Update the reactive state
    insurersData.value = updatedInsurers;
    
    console.log('Saving to Firestore...');
    
    try {
      // Save the updated data to Firestore
      console.log('Calling saveToJson()...');
      const success = await saveToJson();
      
      if (success) {
        console.log('Save successful, showing success message');
        alert('Daten erfolgreich gespeichert');
        // Close the detail view
        selectedInsurer.value = null;
      } else {
        console.warn('Save did not return success');
      }
      
      console.log('Successfully saved and updated UI');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('Fehler beim Speichern: ' + error.message);
    }
    
    console.log('=== Completed handleSettlementCompleted ===');
    
  } catch (error) {
    console.error('Error in handleSettlementCompleted:', error);
    alert('Fehler beim Speichern der Abrechnung: ' + error.message);
  }
}

const handleUpdateLastInvoice = ({ insurerName, lastInvoice }) => {
  const insurer = insurersData.value.find(i => i.name === insurerName)
  if (insurer) {
    insurer.last_invoice = lastInvoice
    saveToJson()
  }
}

// Make functions globally available
window.calculateDaysOverdue = calculateDaysOverdue;
window.getStatusColor = getStatusColor;
window.getStatusText = getStatusText;
window.formatLastInvoiceDate = formatLastInvoiceDate;
window.logRawFirestoreData = logRawFirestoreData;

// Initialize the app
onMounted(() => {
  loadInsurersData();
  // Make the logRawFirestoreData function available globally
  window.logRawFirestoreData = logRawFirestoreData;
});
</script>

<style>
:root {
  --primary-color: #2c3e50;
  --primary-light: #34495e;
  --success-color: #2ecc71;
  --warning-color: #f1c40f;
  --danger-color: #e74c3c;
  --info-color: #3498db;
  --gray-color: #95a5a6;
  --bg-color: #ecf0f1;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  background-color: var(--bg-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.app-container {
  max-width: 1400px;
  margin: 20px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.header h1 {
  font-size: 2.5em;
  color: var(--primary-color);
  font-weight: 700;
}

.environment-switch {
  display: flex;
  gap: 10px;
  align-items: center;
}

.environment-switch label {
  color: var(--gray-color);
  font-weight: 500;
}

.status-summary {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem 0;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

/* Mobile stacking */
@media (max-width: 768px) {
  .header-container {
    padding: 1.5rem 0;
  }

  .header-container .flex {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-container .flex:first-child {
    flex-direction: column;
    align-items: center;
  }

  .header-container .flex:last-child {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .status-summary {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem 0;
  }

  .status-item,
  .status-total {
    flex: 1 0 100%;
    min-width: 100%;
    max-width: 100%;
    padding: 1rem;
  }

  .status-item .count,
  .status-total .count {
    font-size: 1.1rem;
  }
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.875rem;
  background: #f8fafc;
  transition: all 0.2s ease;
  cursor: pointer;
  flex: 1 1 200px;
  min-width: 200px;
  max-width: 350px;
}

.status-total {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.875rem;
  background: #f8fafc;
  font-weight: 600;
  flex: 1 1 200px;
  min-width: 200px;
  max-width: 350px;
}

.status {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
}

.status::before {
  content: '';
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-dot:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status-item.yellow .status-dot {
  background-color: #fbbf24;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.status-item.red .status-dot {
  background-color: #ef4444;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.status-item.green .status-dot {
  background-color: #10b981;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.status-total {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.875rem;
  background: #f8fafc;
  font-weight: 600;
  flex: 1 1 200px;
  min-width: 200px;
  max-width: 350px;
}

.status-total .count {
  font-size: 1.25rem;
  color: #1f2937;
}

.content {
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: 2.5rem;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.875rem;
  background-color: white;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.search-bar input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.search-bar input:invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.sort-options {
  margin-bottom: 2.5rem;
  position: relative;
}

.sort-options select {
  width: 100%;
  padding: 1rem 3rem 1rem 1.25rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  appearance: none;
}

.sort-options select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.sort-options select::-ms-expand {
  display: none;
}

.sort-options::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #6b7280;
  pointer-events: none;
}

.insurer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.insurer-card {
  background: white;
  border-radius: 1.25rem;
  padding: 1.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.insurer-card.incomplete {
  opacity: 0.5;
  filter: saturate(0.7);
}

.insurer-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.insurer-card.selected {
  background: #f3f4f6;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  opacity: 1 !important;
}

.insurer-card.complete {
  border-left: 4px solid #10b981;
  opacity: 1 !important;
}

.insurer-info h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
  line-height: 1.2;
}

.status {
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
  text-align: center;
  font-size: 0.875rem;
}

.status::before {
  content: '';
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status.yellow {
  background-color: #fef9c3;
  color: #713f12;
}

.status.yellow::before {
  background-color: #fbbf24;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.status.red {
  background-color: #fee2e2;
  color: #991b1b;
}

.status.red::before {
  background-color: #ef4444;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.status.green {
  background-color: #dcfce7;
  color: #059669;
}

.status.green::before {
  background-color: #10b981;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.insurer-details {
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 1.5rem;
  line-height: 1.5;
}

.insurer-details p {
  margin: 0.75rem 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.insurer-details .font-medium {
  color: #6b7280;
  min-width: 120px;
}

/* Loading state */
.insurer-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.insurer-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e5e5;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .status-summary {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .content {
    padding: 1.5rem;
  }
  
  .insurer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .insurer-card {
    padding: 1.25rem;
  }
  
  .insurer-info h3 {
    font-size: 1.25rem;
  }
  
  .status {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.insurer-card {
  animation: fadeIn 0.3s ease-out;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .app-container {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .insurer-card {
    background: #111827;
    border-color: #374151;
  }

  .status-item,
  .status-total {
    background: #1f2937;
  }

  .status-dot {
    filter: brightness(0.9);
  }

  .status {
    color: #f3f4f6;
  }

  .status::before {
    box-shadow: none;
  }

  .insurer-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
}

/* Focus states */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* High contrast mode */
@media (forced-colors: active) {
  .status-dot {
    forced-color-adjust: none;
  }

  .status {
    background: Highlight;
    color: HighlightText;
  }
}

.header-container {
  position: sticky;
  top: 0;
  z-index: 10;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  left: 0;
  right: 0;
  width: 100%;
  background-color: white;
}

.content {
  padding-top: 1rem;
}

.insurer-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 20px;
  overflow-y: auto;
}

.insurer-detail h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.insurer-detail .close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--gray-color);
}

.insurer-detail .close-button:hover {
  color: var(--primary-color);
}

.insurer-detail .section {
  margin-bottom: 20px;
}

.insurer-detail .section h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.insurer-detail .form-group {
  margin-bottom: 15px;
}

.insurer-detail label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--primary-color);
}

.insurer-detail input,
.insurer-detail select,
.insurer-detail textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
}

.insurer-detail textarea {
  height: 100px;
  resize: vertical;
}

.insurer-detail button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: var(--info-color);
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.insurer-detail button:hover {
  background-color: #2980b9;
}

@media (max-width: 1024px) {
  .insurer-detail {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
  }
}
</style>
