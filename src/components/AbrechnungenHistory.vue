<template>
  <div class="abrechnungen-history p-4">
    <!-- Debug info -->
        <!-- Debug info -->
    <div v-if="!props.isProductionBranch" class="bg-blue-50 p-4 mb-6 rounded-lg text-sm">
      <h3 class="font-medium mb-2">Debug Information</h3>
      <p>Anzahl der Abrechnungen: {{ props.abrechnungen ? props.abrechnungen.length : 0 }}</p>
      <p>Gefilterte Abrechnungen: {{ filteredAbrechnungen.length }}</p>
      <p>Sortierfeld: {{ sortField }} ({{ sortAscending ? 'aufsteigend' : 'absteigend' }})</p>
      <p>Aktuelle Seite: {{ currentPage }} / {{ totalPages }}</p>
    </div>
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
          @click="exportToCSV"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
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
import { ref, computed, onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue';
import { format, parseISO, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { saveAs } from 'file-saver';

const props = defineProps({
  abrechnungen: {
    type: Array,
    default: () => []
  },
  isProductionBranch: {
    type: Boolean,
    default: true
  }
});

// Debug log to check incoming props
console.log('AbrechnungenHistory received props:', props.abrechnungen);

// Local state
const searchQuery = ref('');
const sortField = ref('date');
const sortAscending = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDetailsModal = ref(false);
const selectedAbrechnung = ref(null);
const filterDocumentType = ref('');
const filterStatus = ref('');
 // Show debug info by default to help troubleshoot

// Document types and statuses for filters
const documentTypes = computed(() => {
  const types = new Set();
  localAbrechnungen.value.forEach(item => {
    if (item.documentType) {
      types.add(item.documentType);
    }
  });
  return Array.from(types).sort();
});

const statusTypes = computed(() => {
  const statuses = new Set();
  localAbrechnungen.value.forEach(item => {
    if (item.status) {
      statuses.add(item.status);
    }
  });
  return Array.from(statuses).sort();
});

// Ensure abrechnungen is always an array and log its contents
const localAbrechnungen = computed(() => {
  if (!props.abrechnungen) {
    console.warn('Abrechnungen prop is not defined');
    return [];
  }
  
  if (!Array.isArray(props.abrechnungen)) {
    console.warn('Abrechnungen prop is not an array:', props.abrechnungen);
    return [];
  }
  
  console.log('Local abrechnungen:', props.abrechnungen);
  return props.abrechnungen.map(item => ({
    ...item,
    // Ensure all required fields have defaults
    documentType: item.documentType || 'Rechnung',
    status: item.status || 'Erfolgreich',
    reference: item.reference || '',
    amount: item.amount || '',
    notes: item.notes || ''
  }));
});

// Document type styling
const documentTypeStyles = {
  'Rechnung': 'bg-blue-100 text-blue-800',
  'Gutschrift': 'bg-green-100 text-green-800',
  'Stornorechnung': 'bg-red-100 text-red-800',
  'PDF': 'bg-red-100 text-red-800',
  'CSV': 'bg-green-100 text-green-800',
  'XLS': 'bg-blue-100 text-blue-800',
  'XML': 'bg-purple-100 text-purple-800',
  'Papier': 'bg-gray-100 text-gray-800'
};

// Status styling
const statusStyles = {
  'Erfolgreich': 'bg-green-100 text-green-800',
  'Fehlgeschlagen': 'bg-red-100 text-red-800',
  'Ausstehend': 'bg-yellow-100 text-yellow-800',
  'In Bearbeitung': 'bg-blue-100 text-blue-800'
};

const setSort = (field) => {
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value;
  } else {
    sortField.value = field;
    sortAscending.value = true;
  }
};

// Computed properties
const filteredAbrechnungen = computed(() => {
  let result = [...localAbrechnungen.value];
  
  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(abrechnung => 
      (abrechnung.insurer && abrechnung.insurer.toLowerCase().includes(query)) ||
      (abrechnung.reference && abrechnung.reference.toString().toLowerCase().includes(query)) ||
      (abrechnung.notes && abrechnung.notes.toLowerCase().includes(query)) ||
      (abrechnung.amount && abrechnung.amount.toString().toLowerCase().includes(query))
    );
  }
  
  // Apply document type filter
  if (filterDocumentType.value) {
    result = result.filter(abrechnung => 
      abrechnung.documentType === filterDocumentType.value
    );
  }
  
  // Apply status filter
  if (filterStatus.value) {
    result = result.filter(abrechnung => 
      abrechnung.status === filterStatus.value
    );
  }
  
  return result;
});

const sortedAbrechnungen = computed(() => {
  return [...filteredAbrechnungen.value].sort((a, b) => {
    let comparison = 0;
    
    if (sortField.value === 'date') {
      // Use timestamp if available, otherwise parse the date string
      const dateA = a.timestamp || new Date(a.date);
      const dateB = b.timestamp || new Date(b.date);
      comparison = dateA - dateB;
    } else if (sortField.value === 'insurer') {
      comparison = (a.insurer || '').localeCompare(b.insurer || '');
    } else if (sortField.value === 'documentType') {
      comparison = (a.documentType || '').localeCompare(b.documentType || '');
    } else if (sortField.value === 'status') {
      comparison = (a.status || '').localeCompare(b.status || '');
    } else if (sortField.value === 'amount') {
      // Convert amounts to numbers for proper comparison
      const amountA = parseFloat(a.amount) || 0;
      const amountB = parseFloat(b.amount) || 0;
      comparison = amountA - amountB;
    }
    
    return sortAscending.value ? comparison : -comparison;
  });
});

// Pagination
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedAbrechnungen.value.length / itemsPerPage.value));
});

const paginatedAbrechnungen = computed(() => {
  try {
    if (!sortedAbrechnungen.value || !Array.isArray(sortedAbrechnungen.value)) {
      console.warn('sortedAbrechnungen is not an array:', sortedAbrechnungen.value);
      return [];
    }
    
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    console.log(`Pagination: page ${currentPage.value}, showing items ${start}-${end} of ${sortedAbrechnungen.value.length}`);
    return sortedAbrechnungen.value.slice(start, end);
  } catch (error) {
    console.error('Error in paginatedAbrechnungen:', error);
    return [];
  }
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  // Always show first page
  pages.push(1);
  
  // Calculate range around current page
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);
  
  // Adjust if we're near the start or end
  if (current <= 3) {
    end = Math.min(4, total - 1);
  } else if (current >= total - 2) {
    start = Math.max(total - 3, 2);
  }
  
  // Add ellipsis if needed
  if (start > 2) pages.push('...');
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < total) pages.push(i);
  }
  
  // Add ellipsis if needed
  if (end < total - 1) pages.push('...');
  
  // Always show last page if there is more than one page
  if (total > 1) pages.push(total);
  
  return pages;
});

const parseGermanDate = (dateString) => {
  // Handle German date format: DD.MM.YYYY, HH:mm
  const [datePart] = dateString.split(','); // Only take the date part
  const [day, month, year] = datePart.split('.').map(Number);
  
  // Note: Month is 0-indexed in JavaScript Date
  return new Date(year, month - 1, day);
};

// Helper functions
const formatDate = (dateString) => {
  try {
    let date;
    
    // Handle different date formats
    if (typeof dateString === 'string') {
      // Handle German format: DD.MM.YYYY, HH:mm
      if (dateString.match(/^\d{2}\.\d{2}\.\d{4}(, \d{2}:\d{2})?$/)) {
        date = parseGermanDate(dateString);
      } 
      // Handle ISO format
      else if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateString);
      }
      // Handle other formats
      else {
        date = new Date(dateString);
      }
    } else if (dateString instanceof Date) {
      date = dateString;
    } else if (dateString && dateString.toDate) {
      // Handle Firestore timestamp
      date = dateString.toDate();
    } else {
      throw new Error('Unsupported date format');
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return format(date, 'dd.MM.yyyy');
  } catch (e) {
    console.warn('Failed to format date:', dateString, e);
    return dateString || 'Ungültiges Datum';
  }
};

const formatTime = (dateString) => {
  try {
    let date;
    
    // Handle different date formats
    if (typeof dateString === 'string') {
      // Handle German format: DD.MM.YYYY, HH:mm
      if (dateString.match(/, \d{2}:\d{2}$/)) {
        const timePart = dateString.split(', ')[1];
        return timePart;
      }
      // Handle ISO format
      else if (dateString.match(/\d{2}:\d{2}(:\d{2})?/)) {
        date = parseISO(dateString);
      }
      // Handle other formats
      else {
        date = new Date(dateString);
      }
    } else if (dateString instanceof Date) {
      date = dateString;
    } else if (dateString && dateString.toDate) {
      // Handle Firestore timestamp
      date = dateString.toDate();
    } else {
      return '';
    }
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return format(date, 'HH:mm');
  } catch (e) {
    console.warn('Failed to format time:', dateString, e);
    return '';
  }
};

const getDocumentType = (abrechnung) => {
  return abrechnung.documentType || 'Rechnung';
};

const getDocumentTypeClass = (abrechnung) => {
  const type = (abrechnung.documentType || '').toLowerCase();
  switch (type) {
    case 'gutschrift':
      return 'bg-purple-100 text-purple-800';
    case 'rechnung':
      return 'bg-blue-100 text-blue-800';
    case 'mahnung':
      return 'bg-red-100 text-red-800';
    case 'gutschriftsanfrage':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (abrechnung) => {
  if (!abrechnung.status) return 'Unbekannt';
  const statusMap = {
    'success': 'Erfolgreich',
    'pending': 'Ausstehend',
    'failed': 'Fehlgeschlagen',
    'erfolgreich': 'Erfolgreich',
    'ausstehend': 'Ausstehend',
    'fehlgeschlagen': 'Fehlgeschlagen',
    'bezahlt': 'Bezahlt',
    'offen': 'Offen',
    'storniert': 'Storniert',
    'teilweise_bezahlt': 'Teilweise bezahlt'
  };
  return statusMap[abrechnung.status.toLowerCase()] || abrechnung.status;
};

const getStatusClass = (abrechnung) => {
  if (!abrechnung.status) return 'bg-gray-100 text-gray-800';
  const status = abrechnung.status.toLowerCase();
  
  // Status that indicate success
  if (['erfolgreich', 'success', 'bezahlt'].includes(status)) {
    return 'bg-green-100 text-green-800';
  }
  
  // Status that indicate warning/attention needed
  if (['ausstehend', 'pending', 'offen', 'teilweise_bezahlt'].includes(status)) {
    return 'bg-yellow-100 text-yellow-800';
  }
  
  // Status that indicate error/failure
  if (['fehlgeschlagen', 'failed', 'storniert'].includes(status)) {
    return 'bg-red-100 text-red-800';
  }
  
  // Default for unknown status
  return 'bg-gray-100 text-gray-800';
};

const showDetails = (abrechnung) => {
  // Close any open modal first to ensure clean state
  if (showDetailsModal.value) {
    showDetailsModal.value = false;
    // Small delay to allow the modal to close before reopening
    setTimeout(() => {
      selectedAbrechnung.value = { ...abrechnung };
      showDetailsModal.value = true;
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }, 50);
  } else {
    selectedAbrechnung.value = { ...abrechnung };
    showDetailsModal.value = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
};

const closeModal = () => {
  showDetailsModal.value = false;
  // Re-enable body scroll when modal is closed
  document.body.style.overflow = 'auto';
  // Small delay before clearing to allow transition
  setTimeout(() => {
    selectedAbrechnung.value = null;
  }, 300);
};

// Close modal when pressing escape
const handleEscape = (e) => {
  if (e.key === 'Escape' && showDetailsModal.value) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = 'auto';
});

const downloadDocument = async (abrechnung) => {
  try {
    if (abrechnung.downloadUrl) {
      // If it's a direct URL, open in new tab
      window.open(abrechnung.downloadUrl, '_blank');
    } else if (abrechnung.file) {
      // If it's a file object, create a download
      const url = URL.createObjectURL(abrechnung.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Abrechnung_${abrechnung.insurer}_${formatDate(abrechnung.date)}.${getDocumentType(abrechnung).toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading document:', error);
    alert('Fehler beim Herunterladen des Dokuments');
  }
};

const exportToCSV = () => {
  try {
    const headers = [
      'Datum',
      'Uhrzeit',
      'Versicherung',
      'Dokumententyp',
      'Status',
      'Referenz',
      'Betrag',
      'Notizen',
      'Dokument-URL'
    ];
    
    const csvContent = [
      headers.join(';'),
      ...sortedAbrechnungen.value.map(abrechnung => {
        const date = abrechnung.timestamp ? new Date(abrechnung.timestamp) : parseDate(abrechnung.date);
        const formattedDate = date ? format(date, 'dd.MM.yyyy') : '';
        const formattedTime = date ? format(date, 'HH:mm') : '';
        
        return [
          formattedDate,
          formattedTime,
          `"${abrechnung.insurer || ''}"`,
          `"${getDocumentType(abrechnung)}"`,
          `"${getStatusText(abrechnung)}"`,
          `"${abrechnung.reference || ''}"`,
          `"${abrechnung.amount ? parseFloat(abrechnung.amount).toFixed(2).replace('.', ',') : '0,00'}"`,
          `"${(abrechnung.notes || '').replace(/"/g, '""')}"`,
          `"${abrechnung.downloadUrl || ''}"`
        ].join(';');
      })
    ].join('\n');
    
    const blob = new Blob([
      '\uFEFF', // UTF-8 BOM for Excel
      csvContent
    ], { type: 'text/csv;charset=utf-8;' });
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const filename = `Abrechnungen_${today}.csv`;
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Fehler beim Exportieren der Daten: ' + error.message);
  }
};

// Watch for search query changes to reset to first page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Watch for changes in abrechnungen prop
watch(() => props.abrechnungen, (newVal) => {
  console.log('abrechnungen prop changed:', newVal);
}, { deep: true });

// Watch for abrechnungen changes to reset to first page
watch(() => props.abrechnungen, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.sort-arrow {
  transition: transform 0.2s ease-in-out;
}
.sort-arrow.asc {
  transform: rotate(180deg);
}
</style>
