<template>
  <div class="abrechnungen-history p-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <div class="flex items-center">
          <h2 class="text-2xl font-bold text-gray-800">Vergangene Abrechnungen</h2>
          <span 
            class="ml-3 px-2 py-1 text-xs font-medium rounded-full" 
            :class="abrechnungStore.dataMode === 'production' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'"
          >
            {{ abrechnungStore.dataMode === 'production' ? 'Produktion' : 'Test' }}
          </span>
          <!-- Note: Environment mapping has been swapped, so 'production' mode uses test data and vice versa -->
        </div>
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
          <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aktualisieren
        </button>
        
        <button 
          @click="runDiagnostic"
          class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap mr-2"
        >
          <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Diagnose
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
      
      <!-- Loading indicator and Load More button -->
      <div class="px-6 py-4 flex justify-center items-center space-x-4">
        <div v-if="isLoadingMore" class="flex items-center text-gray-500">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Lade Daten...
        </div>
        <button 
          v-if="hasMoreData && !isLoadingMore" 
          @click="loadMoreData"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          Mehr laden
        </button>
        <div v-if="!hasMoreData && paginatedAbrechnungen.length > 0 && !isLoadingMore" class="text-sm text-gray-500">
          Alle {{ paginatedAbrechnungen.length }} Einträge geladen
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAbrechnungStore } from '../stores/abrechnungStore';
import SortIndicator from './SortIndicator.vue';

const abrechnungStore = useAbrechnungStore();

// Pagination and lazy loading state
const isLoadingMore = ref(false);
const hasMoreData = ref(true);
const itemsPerPage = 10; // Match this with the limit in the store

// Filter and sort state
const filterDocumentType = ref('');
const filterStatus = ref('');
const searchQuery = ref('');
const sortField = ref('date');
const sortAscending = ref(false);

// Document types and status types for filtering
const documentTypes = ['Rechnung', 'Mahnung', 'Gutschrift', 'Sonstiges'];
const statusTypes = ['pending', 'processed', 'rejected'];

// Computed properties for filtered and sorted data
const filteredAbrechnungen = computed(() => {
  return abrechnungStore.abrechnungen.filter(abrechnung => {
    const matchesDocType = !filterDocumentType.value || abrechnung.documentType === filterDocumentType.value;
    const matchesStatus = !filterStatus.value || abrechnung.status === filterStatus.value;
    const matchesSearch = !searchQuery.value || 
      (abrechnung.insurerName && abrechnung.insurerName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (abrechnung.reference && abrechnung.reference.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    return matchesDocType && matchesStatus && matchesSearch;
  });
});

// Use the filtered data directly since we're using server-side pagination
const paginatedAbrechnungen = computed(() => filteredAbrechnungen.value);

// Load more data function for lazy loading
const loadMoreData = () => {
  if (isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  
  abrechnungStore.fetchMoreAbrechnungen({
    documentType: filterDocumentType.value || undefined,
    status: filterStatus.value || undefined
  })
    .then(result => {
      hasMoreData.value = abrechnungStore.hasMorePages() && result.length >= itemsPerPage;
      isLoadingMore.value = false;
    })
    .catch(error => {
      console.error('Error loading more data:', error);
      isLoadingMore.value = false;
    });
};

// Diagnostic function
const runDiagnostic = async () => {
  console.log('🔍 Running comprehensive Firestore diagnostic...');
  
  try {
    // Get direct references to both subcollections to examine structure
    const { getFirestore, collection, collectionGroup, query, getDocs, limit } = await import('firebase/firestore');
    const db = getFirestore();
    
    // Check production collection structure
    console.log('🔍 EXAMINING PRODUCTION COLLECTION STRUCTURE');
    const prodQuery = query(collectionGroup(db, 'invoice-history'), limit(5));
    const prodSnapshot = await getDocs(prodQuery);
    
    console.log(`Found ${prodSnapshot.docs.length} documents in 'invoice-history'`);
    prodSnapshot.docs.forEach(doc => {
      console.log('PROD DOCUMENT:', {
        id: doc.id,
        path: doc.ref.path,
        parentCollection: doc.ref.parent.id,
        parentPath: doc.ref.parent.path,
        data: doc.data()
      });
    });
    
    // Check test collection structure
    console.log('🔍 EXAMINING TEST COLLECTION STRUCTURE');
    const testQuery = query(collectionGroup(db, 'invoice-history-test'), limit(5));
    const testSnapshot = await getDocs(testQuery);
    
    console.log(`Found ${testSnapshot.docs.length} documents in 'invoice-history-test'`);
    testSnapshot.docs.forEach(doc => {
      console.log('TEST DOCUMENT:', {
        id: doc.id,
        path: doc.ref.path,
        parentCollection: doc.ref.parent.id,
        parentPath: doc.ref.parent.path,
        data: doc.data()
      });
    });
    
    // Also run the store's diagnostic function if available
    if (typeof abrechnungStore.diagnoseEnvironmentIssue === 'function') {
      abrechnungStore.diagnoseEnvironmentIssue();
    }
    
    // Check current store state
    console.log('🔍 CURRENT STORE STATE:', {
      dataMode: abrechnungStore.dataMode,
      abrechnungenCount: abrechnungStore.abrechnungen?.length || 0
    });
    
  } catch (error) {
    console.error('Error in diagnostic function:', error);
  }
};

// Initial data loading
const loadInitialData = () => {
  isLoadingMore.value = true;
  abrechnungStore.resetPagination();
  
  abrechnungStore.fetchAbrechnungen({
    documentType: filterDocumentType.value || undefined,
    status: filterStatus.value || undefined
  })
    .then(result => {
      hasMoreData.value = abrechnungStore.hasMorePages() && result.length >= itemsPerPage;
      isLoadingMore.value = false;
    })
    .catch(error => {
      console.error('Error loading initial data:', error);
      isLoadingMore.value = false;
    });
};

// Refresh data function
const refreshData = () => {
  loadInitialData();
};

// Format date function
const formatDate = (date) => {
  if (!date) return 'Kein Datum';
  
  try {
    // Handle Firestore Timestamp objects
    if (date && typeof date.toDate === 'function') {
      date = date.toDate();
    }
    
    // Handle numeric timestamps
    if (typeof date === 'number') {
      date = new Date(date);
    }
    
    // Handle string dates
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Ungültiges Datum';
    }
    
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return 'Ungültiges Datum';
  }
};

// Helper functions for document types and status
const getDocumentType = (abrechnung) => {
  return abrechnung.documentType || 'Sonstiges';
};

const getDocumentTypeClass = (abrechnung) => {
  const type = getDocumentType(abrechnung);
  switch (type) {
    case 'Rechnung': return 'bg-blue-100 text-blue-800';
    case 'Mahnung': return 'bg-red-100 text-red-800';
    case 'Gutschrift': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = ({ status }) => {
  switch (status) {
    case 'pending': return 'Ausstehend';
    case 'processed': return 'Verarbeitet';
    case 'rejected': return 'Abgelehnt';
    default: return status || 'Unbekannt';
  }
};

// Sort function
const setSort = (field) => {
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value;
  } else {
    sortField.value = field;
    sortAscending.value = true;
  }
  
  // Reset pagination and reload data when sort changes
  loadInitialData();
};

// Export to CSV function
const exportToCSV = () => {
  const headers = ['Datum', 'Versicherung', 'Referenz', 'Dokumententyp', 'Status', 'Abrechnungsweg'];
  const data = filteredAbrechnungen.value.map(a => [
    formatDate(a.date),
    a.insurerName || a.insurer || 'Unbekannt',
    a.reference || '',
    getDocumentType(a),
    getStatusText({ status: a.status }),
    a.abrechnungsweg || ''
  ]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  data.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
  });
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `abrechnungen_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Show details function
const showDetails = (abrechnung) => {
  // Implement details view logic here
  console.log('Show details for:', abrechnung);
};

// Download document function
const downloadDocument = (abrechnung) => {
  if (abrechnung.downloadUrl) {
    window.open(abrechnung.downloadUrl, '_blank');
  }
};

// Watch for filter changes to reset pagination and reload data
watch([filterDocumentType, filterStatus, searchQuery], () => {
  loadInitialData();
});

// Watch for dataMode changes from the store to reload data when environment toggle changes
watch(() => abrechnungStore.dataMode, (newMode) => {
  console.log('Environment changed to:', newMode);
  loadInitialData();
});

// Load data on component mount
onMounted(() => {
  loadInitialData();
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
