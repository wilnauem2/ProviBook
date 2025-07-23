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

    </div>

    <!-- Search -->
    <div class="mb-4">
      <div class="relative w-full sm:max-w-xs">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Versicherung oder Referenz..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>



    <!-- Abrechnungen Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th @click="setSort('date')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center">Datum <SortIndicator :sort-field="sortField" field-name="date" :sort-ascending="sortAscending" /></div>
              </th>
              <th @click="setSort('insurerName')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center">Versicherung/Referenz <SortIndicator :sort-field="sortField" field-name="insurerName" :sort-ascending="sortAscending" /></div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumententyp</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abrechnungsweg</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="abrechnung in paginatedAbrechnungen" 
              :key="abrechnung.id" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ formatDate(abrechnung.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ abrechnung.insurerName || 'Unbekannt' }}</div>
                <div v-if="abrechnung.reference" class="text-xs text-gray-500">{{ abrechnung.reference }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <template v-if="Array.isArray(abrechnung.dokumentenart)">
                    <span v-for="format in abrechnung.dokumentenart" :key="format"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                          :class="docTypeColors[format.toUpperCase()]?.classes || 'bg-gray-100 text-gray-800'">
                      <svg v-if="docTypeColors[format.toUpperCase()]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="docTypeColors[format.toUpperCase()]?.icon"></svg>
                      {{ format }}
                    </span>
                  </template>
                  <template v-else-if="abrechnung.dokumentenart">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                          :class="docTypeColors[abrechnung.dokumentenart.toUpperCase()]?.classes || 'bg-gray-100 text-gray-800'">
                      <svg v-if="docTypeColors[abrechnung.dokumentenart.toUpperCase()]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="docTypeColors[abrechnung.dokumentenart.toUpperCase()]?.icon"></svg>
                      {{ abrechnung.dokumentenart }}
                    </span>
                  </template>
                </div>
              </td>
              <td v-if="abrechnung.abrechnungsweg" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      :class="wegTypeStyles[abrechnung.abrechnungsweg]?.classes || 'bg-gray-100 text-gray-800'">
                  <svg v-if="wegTypeStyles[abrechnung.abrechnungsweg]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="wegTypeStyles[abrechnung.abrechnungsweg]?.icon"></svg>
                  {{ abrechnung.abrechnungsweg }}
                </span>
              </td>
              <td v-else class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="showDetails(abrechnung)" class="text-blue-600 hover:text-blue-900 mr-4">Details</button>
                <button v-if="abrechnung.downloadUrl" @click="downloadDocument(abrechnung)" class="text-indigo-600 hover:text-indigo-900">Herunterladen</button>
              </td>
            </tr>
            <tr v-if="paginatedAbrechnungen.length === 0 && !isLoadingMore">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Keine Einträge gefunden.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="px-6 py-4 flex justify-center items-center space-x-4">
        <div v-if="isLoading && paginatedAbrechnungen.length === 0" class="flex items-center text-gray-500">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Lade Daten...</span>
        </div>
        <button v-if="hasMoreData && !isLoading" @click="loadMoreData" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Mehr laden
        </button>
        <div v-if="isLoading && paginatedAbrechnungen.length > 0" class="text-sm text-gray-500">Lade mehr...</div>
        <div v-if="!hasMoreData && !isLoading && paginatedAbrechnungen.length > 0" class="text-sm text-gray-500">
          Alle Einträge geladen
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAbrechnungStore } from '@/stores/abrechnungStore';
import { docTypeColors } from '@/composables/useInsurerUtils';
import SortIndicator from './SortIndicator.vue';

const abrechnungStore = useAbrechnungStore();

// Use the store's loading state directly
const isLoading = computed(() => abrechnungStore.isLoading);
const hasMoreData = computed(() => abrechnungStore.hasMorePages);

const searchQuery = ref('');
const sortField = ref('date');
const sortAscending = ref(false);

// The list of invoices is now directly from the store
const paginatedAbrechnungen = computed(() => abrechnungStore.abrechnungen);

const loadInitialData = () => {
  const options = {
    forceRefresh: true,
    filters: {
      searchQuery: searchQuery.value,
      sortField: sortField.value,
      sortAscending: sortAscending.value
    }
  };
  abrechnungStore.fetchAbrechnungen(options)
    .catch(error => console.error(`Error loading initial data:`, error));
};

const loadMoreData = () => {
  if (isLoading.value || !hasMoreData.value) return;
  const options = {
    forceRefresh: false, // This is the key difference
    filters: {
      searchQuery: searchQuery.value,
      sortField: sortField.value,
      sortAscending: sortAscending.value
    }
  };
  abrechnungStore.fetchAbrechnungen(options)
    .catch(error => console.error(`Error loading more data:`, error));
};

const setSort = (field) => {
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value;
  } else {
    sortField.value = field;
    sortAscending.value = true;
  }
  loadInitialData();
};

// Debounce search input
let searchTimeout = null;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadInitialData();
  }, 300);
});

// Watch for environment changes
watch(() => abrechnungStore.dataMode, (newMode) => {
  console.log('Environment changed to:', newMode);
  loadInitialData();
});

// Initial data load on component mount
onMounted(() => {
  // Only fetch if the list is empty to avoid refetching on tab switch
  if (abrechnungStore.abrechnungen.length === 0) {
    loadInitialData();
  }
});

// --- Helper Functions ---

const wegTypeStyles = {
  'BiPRO': { classes: 'bg-purple-100 text-purple-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>' },
  'Maklerportal': { classes: 'bg-blue-100 text-blue-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4-4 4"></path>' },
  'E-Mail': { classes: 'bg-yellow-100 text-yellow-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>' },
  'Post': { classes: 'bg-orange-100 text-orange-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>' }
};

const formatDate = (date) => {
  if (!date) return 'Kein Datum';
  try {
    const d = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return 'Ungültiges Datum';
    return d.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch (e) {
    return 'Datum ungültig';
  }
};

const downloadDocument = (abrechnung) => {
  if (abrechnung.downloadUrl) window.open(abrechnung.downloadUrl, '_blank');
};
</script>

<style scoped>
/* Minimal styles, relying on TailwindCSS */
</style>
