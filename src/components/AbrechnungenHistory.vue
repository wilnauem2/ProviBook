<template>
  <div class="abrechnungen-history p-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Vergangene Abrechnungen</h2>
        <p class="text-sm text-gray-500 mt-1">Zeigt alle gespeicherten Abrechnungen</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="relative">
          <select 
            v-model="filterDocumentType"
            class="appearance-none bg-white pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle Dokumententypen</option>
            <option v-for="type in documentTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div class="relative">
          <select 
            v-model="filterStatus"
            class="appearance-none bg-white pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle Status</option>
            <option v-for="status in statusTypes" :key="status" :value="status">{{ getStatusText({ status }) }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <button 
          @click="refreshData"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap mr-2"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aktualisieren
        </button>
        
        <button 
          @click="exportToCSV"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
    
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div class="w-full sm:w-1/3">
            <label for="search" class="sr-only">Versicherung suchen</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="Versicherung suchen..."
              />
            </div>
          </div>
          
          <div class="flex items-center space-x-4 w-full sm:w-auto">
            <div class="relative">
              <select 
                v-model="sortField" 
                class="appearance-none bg-white pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Nach Datum</option>
                <option value="insurer">Nach Versicherung</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button 
              @click="sortAscending = !sortAscending"
              class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              :title="sortAscending ? 'Aufsteigend' : 'Absteigend'"
            >
              <svg 
                class="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                :class="{ 'transform rotate-180': !sortAscending }"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="setSort('date')"
              >
                <div class="flex items-center">
                  Datum
                  <SortIndicator :active="sortField === 'date'" :ascending="sortAscending" />
                </div>
              </th>
              <th 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="setSort('insurer')"
              >
                <div class="flex items-center">
                  Versicherung
                  <SortIndicator :active="sortField === 'insurer'" :ascending="sortAscending" />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokumententyp
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abrechnungsweg
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="(abrechnung, index) in paginatedAbrechnungen" 
              :key="index" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(abrechnung.date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ abrechnung.insurerName || abrechnung.insurer || 'Unbekannt' }}
                </div>
                <div v-if="abrechnung.reference" class="text-xs text-gray-500">
                  {{ abrechnung.reference }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  v-if="getDocumentType(abrechnung)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getDocumentTypeClass(abrechnung)"
                >
                  {{ getDocumentType(abrechnung) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ abrechnung.abrechnungsweg }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="showDetails(abrechnung)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Details
                </button>
                <button 
                  v-if="abrechnung.downloadUrl"
                  @click="downloadDocument(abrechnung)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Herunterladen
                </button>
              </td>
            </tr>
            <tr v-if="filteredAbrechnungen.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                Keine Einträge gefunden.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Zurück
          </button>
          <div class="text-sm text-gray-700 mx-4 flex items-center">
            Seite {{ currentPage }} von {{ totalPages }}
          </div>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Weiter
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Zeige <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              bis <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredAbrechnungen.length) }}</span>
              von <span class="font-medium">{{ filteredAbrechnungen.length }}</span> Ergebnissen
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Vorherige</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page === '...'"
                  disabled
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  {{ page }}
                </button>
                <button
                  v-else
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentPage === page 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              <button 
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Nächste</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Teleport the modal to body to avoid rendering issues -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
          </Transition>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Abrechnungsdetails
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div v-if="selectedAbrechnung" class="space-y-4">
                        <div>
                          <dt class="text-sm font-medium text-gray-500">Versicherung</dt>
                          <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.insurer }}</dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">Datum & Uhrzeit</dt>
                          <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedAbrechnung.date) }}, {{ formatTime(selectedAbrechnung.date) }} Uhr</dd>
                        </div>
                        <div v-if="selectedAbrechnung.reference">
                          <dt class="text-sm font-medium text-gray-500">Referenz</dt>
                          <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.reference }}</dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">Dokumententyp</dt>
                          <dd class="mt-1">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getDocumentTypeClass(selectedAbrechnung)">
                              {{ getDocumentType(selectedAbrechnung) || 'Nicht angegeben' }}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt class="text-sm font-medium text-gray-500">Status</dt>
                          <dd class="mt-1">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(selectedAbrechnung)">
                              {{ getStatusText(selectedAbrechnung) }}
                            </span>
                          </dd>
                        </div>
                        <div v-if="selectedAbrechnung.amount">
                          <dt class="text-sm font-medium text-gray-500">Betrag</dt>
                          <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.amount }} €</dd>
                        </div>
                        <div v-if="selectedAbrechnung.notes">
                          <dt class="text-sm font-medium text-gray-500">Notizen</dt>
                          <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ selectedAbrechnung.notes }}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <button 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="closeModal"
                >
                  Schließen
                </button>
                <button 
                  v-if="selectedAbrechnung?.downloadUrl"
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="downloadDocument(selectedAbrechnung)"
                >
                  Herunterladen
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAbrechnungStore } from '../stores/abrechnungStore'
import SortIndicator from './SortIndicator.vue'

const abrechnungStore = useAbrechnungStore()
const props = defineProps({
  isProduction: {
    type: Boolean,
    default: true
  },
  abrechnungen: {
    type: Array,
    default: () => []
  }
})

// Initialize store with correct environment
onMounted(() => {
  console.log('🔍 AbrechnungenHistory mounted with isProduction:', props.isProduction);
  console.log('🔍 Current environment mode:', props.isProduction ? 'production' : 'test');
  console.log('🔍 Props abrechnungen length:', props.abrechnungen?.length || 0);
  console.log('🔍 Store abrechnungen length:', abrechnungStore.abrechnungen?.length || 0);
  console.log('🔍 Current abrechnungStore dataMode:', abrechnungStore.dataMode);
  
  // IMPORTANT: Do NOT override the dataMode that was set in MainApp.vue
  // We'll use the existing dataMode from the store instead of forcing it based on isProduction
  
  // Only fetch data if we don't have any yet
  if (!abrechnungStore.abrechnungen || abrechnungStore.abrechnungen.length === 0) {
    console.log('🔍 AbrechnungenHistory: No data found, fetching from Firestore...');
    console.log('🔍 Using existing dataMode:', abrechnungStore.dataMode);
    
    // Use the current dataMode from the store
    abrechnungStore.fetchAbrechnungen({ forceRefresh: true })
      .then(result => {
        console.log('🔍 Data fetch completed');
        console.log('🔍 Store now has', abrechnungStore.abrechnungen?.length || 0, 'abrechnungen');
      })
      .catch(error => {
        console.error('❌ Error fetching data:', error);
      });
  } else {
    console.log('🔍 AbrechnungenHistory: Data already loaded, using existing data');
  }
})

// Computed properties
const filteredAbrechnungen = computed(() => {
  return abrechnungStore.filterAbrechnungen({
    documentType: filterDocumentType.value,
    status: filterStatus.value,
    search: searchQuery.value
  })
})

const sortedAbrechnungen = computed(() => {
  return abrechnungStore.sortAbrechnungen(
    filteredAbrechnungen.value,
    sortField.value,
    sortAscending.value
  )
})

const paginatedAbrechnungen = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedAbrechnungen.value.slice(start, end)
})

// Document types for filtering and display
const documentTypes = {
  INVOICE: { value: 'invoice', label: 'Rechnung', class: 'bg-blue-100 text-blue-800' },
  REMINDER: { value: 'reminder', label: 'Mahnung', class: 'bg-yellow-100 text-yellow-800' },
  STATEMENT: { value: 'statement', label: 'Kontoauszug', class: 'bg-green-100 text-green-800' },
  OTHER: { value: 'other', label: 'Sonstiges', class: 'bg-gray-100 text-gray-800' }
};

// Status types for filtering and display
const statusTypes = {
  PAID: { value: 'paid', label: 'Bezahlt', class: 'bg-green-100 text-green-800' },
  PENDING: { value: 'pending', label: 'Ausstehend', class: 'bg-yellow-100 text-yellow-800' },
  OVERDUE: { value: 'overdue', label: 'Überfällig', class: 'bg-red-100 text-red-800' },
  PROCESSING: { value: 'processing', label: 'In Bearbeitung', class: 'bg-blue-100 text-blue-800' }
}

const visiblePages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
})

const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(filteredAbrechnungen.value.length / itemsPerPage))

// Filter states
const filterDocumentType = ref('')
const filterStatus = ref('')
const searchQuery = ref('')
const sortField = ref('date')
const sortAscending = ref(true)

// UI state
const isLoading = ref(false)

// Methods
const setSort = (field) => {
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value
  } else {
    sortField.value = field
    sortAscending.value = true
  }
}

const getStatusText = (abrechnung) => {
  const statusMap = {
    'pending': 'Ausstehend',
    'completed': 'Abgeschlossen',
    'error': 'Fehler'
  }
  return statusMap[abrechnung.status] || abrechnung.status
}

const getDocumentType = (abrechnung) => {
  return abrechnung.documentType || 'Unbekannt'
}

const getDocumentTypeClass = (abrechnung) => {
  const type = abrechnung.documentType || 'unknown'
  const typeMap = {
    'invoice': 'bg-blue-100 text-blue-800',
    'remittance': 'bg-green-100 text-green-800',
    'rejection': 'bg-red-100 text-red-800',
    'unknown': 'bg-gray-100 text-gray-800'
  }
  return typeMap[type] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return 'Kein Datum'
  
  let dateObj
  
  try {
    // Handle Firestore timestamp objects (with seconds and nanoseconds)
    if (date && typeof date === 'object' && date.seconds !== undefined) {
      dateObj = new Date(date.seconds * 1000)
    } 
    // Handle Date objects
    else if (date instanceof Date) {
      dateObj = date
    }
    // Handle timestamp numbers
    else if (typeof date === 'number') {
      dateObj = new Date(date)
    }
    // Handle ISO strings and other string formats
    else if (typeof date === 'string') {
      // Try to parse the date string
      dateObj = new Date(date)
    }
    else {
      // Fallback for other formats
      dateObj = new Date(date)
    }
    
    // Check if date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return 'Ungültiges Datum'
    }
    
    return dateObj.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error, date)
    return 'Fehler beim Formatieren'
  }
}

const showDetails = (abrechnung) => {
  // Implement details view logic
  console.log('Showing details for:', abrechnung)
}

const downloadDocument = (abrechnung) => {
  if (!abrechnung.downloadUrl) return
  window.open(abrechnung.downloadUrl, '_blank')
}

const refreshData = async () => {
  try {
    console.log('Refreshing Abrechnungen data from Firestore...');
    isLoading.value = true;
    
    // Force a fresh fetch from Firestore using the current environment
    await abrechnungStore.fetchAbrechnungen({ forceRefresh: true });
    
    console.log(`Refreshed data: ${abrechnungStore.abrechnungen.length} Abrechnungen loaded`);
    
    // Reset to first page
    currentPage.value = 1;
    
    // Show success message
    alert(`Daten erfolgreich aktualisiert. ${abrechnungStore.abrechnungen.length} Abrechnungen geladen.`);
  } catch (error) {
    console.error('Error refreshing data:', error);
    alert('Fehler beim Aktualisieren der Daten: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const exportToCSV = () => {
  try {
    const csvContent = [
      // Header row
      'Datum,Versicherung,Dokumententyp,Abrechnungsweg,Status',
      // Data rows
      ...filteredAbrechnungen.value.map(abrechnung => {
        return [
          formatDate(abrechnung.date),
          abrechnung.insurerName || abrechnung.insurer || 'Unbekannt',
          abrechnung.documentType || 'Unbekannt',
          abrechnung.abrechnungsweg || 'Unbekannt',
          abrechnung.status || 'Unbekannt'
        ].join(',')
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'abrechnungen.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Fehler beim Exportieren der Daten: ' + error.message);
  }
};

// Watch for search query changes to reset to first page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Watch for changes in store data to reset to first page
watch(() => abrechnungStore.filteredAbrechnungen, () => {
  currentPage.value = 1;
}, { deep: true });

</script>

<style scoped>
.sort-arrow {
  transition: transform 0.2s ease-in-out;
}
.sort-arrow.asc {
  transform: rotate(180deg);
}
</style>
