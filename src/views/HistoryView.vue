<template>
  <div :class="{ 'filter blur-sm': selectedInsurer }">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Abrechnungsverlauf</h2>
        <div class="text-sm text-gray-500">
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Lade Daten...
          </span>
          <span v-else>
            {{ abrechnungen.length }} Einträge geladen
            <span v-if="hasMorePages"> (weitere verfügbar)</span>
          </span>
        </div>
      </div>

      <div v-if="abrechnungen && abrechnungen.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versicherer</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referenz</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumenttyp</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notiz</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="!isLoading && abrechnungen.length > 0">
              <tr 
                v-for="abrechnung in abrechnungen" 
                :key="abrechnung.id" 
                @click="handleAbrechnungClick(abrechnung)"
                class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(abrechnung.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ abrechnung.insurer || 'Unbekannt' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ abrechnung.reference || 'Keine Referenz' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ abrechnung.documentType || 'Unbekannt' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      statusClass(abrechnung.status), 
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ abrechnung.status || 'Unbekannt' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <span>{{ abrechnung.note || 'Keine Notiz' }}</span>
                    <span v-if="abrechnung.note" class="ml-2 text-blue-500 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                <p v-if="abrechnungStore.isLoading">Lade Abrechnungen...</p>
                <p v-else>Keine Abrechnungen gefunden.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Load more trigger (invisible element for intersection observer) -->
      <div ref="loadMoreTrigger" class="h-1 w-full"></div>

      <!-- Load More Button -->
      <div v-if="hasMorePages" class="px-6 py-4 border-t text-center">
        <button 
          @click="loadMore" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Lade mehr...
          </span>
          <span v-else>Mehr laden</span>
        </button>
      </div>
    </div>

    <div v-if="dataMode === 'test'" class="bg-white shadow rounded-lg p-6 mt-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Test-Aktionen</h3>
      <div class="flex justify-center">
        <button @click="$emit('create-sample-data')" :disabled="isCreatingSampleData" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg v-if="isCreatingSampleData" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isCreatingSampleData ? 'Erstelle Testdaten...' : 'Testdaten erstellen' }}
        </button>
      </div>
    </div>

    <!-- Abrechnung Details Modal -->
    <div v-if="showAbrechnungModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showAbrechnungModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Abrechnungsdetails</h3>
            <button @click="showAbrechnungModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Datum</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedAbrechnung?.date) }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.reference">
              <dt class="text-sm font-medium text-gray-500">Referenz</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.reference }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.documentType">
              <dt class="text-sm font-medium text-gray-500">Dokumententyp</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.documentType }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.status">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span :class="statusClass(selectedAbrechnung.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedAbrechnung.status }}
                </span>
              </dd>
            </div>
            
            <div v-if="selectedAbrechnung?.note">
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ selectedAbrechnung.note }}</dd>
            </div>
            <div v-else>
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-500 italic">Kein Kommentar vorhanden</dd>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showAbrechnungModal = false" type="button" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import { format } from 'date-fns';
import { useAbrechnungStore } from '@/stores/abrechnungStore';

// Initialize store
const abrechnungStore = useAbrechnungStore();

// Emit events
const emit = defineEmits(['create-sample-data']);

// Component props
const props = defineProps({
  selectedInsurer: {
    type: Object,
    default: null
  },
  dataMode: {
    type: String,
    default: 'production'
  },
  isCreatingSampleData: {
    type: Boolean,
    default: false
  }
});

// Local state
const showAbrechnungModal = ref(false);
const selectedAbrechnung = ref(null);
const isMounted = ref(false);
const observer = ref(null);
const loadMoreTrigger = ref(null);

// Computed properties
const abrechnungen = computed(() => abrechnungStore.abrechnungen || []);
const isLoading = computed(() => abrechnungStore.isLoading || false);
const hasMorePages = computed(() => abrechnungStore.hasMorePages || false);

// Watch for dataMode changes
watch(() => props.dataMode, async (newMode, oldMode) => {
  if (newMode !== oldMode && isMounted.value) {
    console.log(`Data mode changed from ${oldMode} to ${newMode}, refreshing data...`);
    await reloadData();
  }
}, { immediate: true });

// Component lifecycle hooks
onMounted(async () => {
  isMounted.value = true;
  console.log('HistoryView mounted, initializing...');
  
  // Initialize IntersectionObserver for infinite scroll
  setupInfiniteScroll();
  
  // Load initial data if needed
  if (abrechnungStore.abrechnungen.length === 0 || 
      (props.dataMode && props.dataMode !== abrechnungStore.dataMode)) {
    await reloadData();
  }
});

onBeforeUnmount(() => {
  // Clean up observer
  if (observer.value) {
    observer.value.disconnect();
  }
});

// Methods
const reloadData = async () => {
  if (isLoading.value) return;
  
  try {
    console.log('Reloading data...');
    await abrechnungStore.resetPagination();
    await abrechnungStore.fetchAbrechnungen({ forceRefresh: true });
    console.log('Data reloaded. Total items:', abrechnungen.value.length);
  } catch (error) {
    console.error('Error reloading data:', error);
  }
};

const loadMore = async () => {
  if (isLoading.value || !hasMorePages.value) return;
  
  try {
    console.log('Loading more Abrechnungen...');
    await abrechnungStore.loadMoreAbrechnungen();
    console.log('More data loaded. Total items:', abrechnungen.value.length);
  } catch (error) {
    console.error('Error loading more Abrechnungen:', error);
  }
};

const setupInfiniteScroll = () => {
  // Use IntersectionObserver to detect when to load more items
  const options = {
    root: null, // viewport
    rootMargin: '20px',
    threshold: 0.1
  };

  observer.value = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !abrechnungStore.isLoading) {
      await loadMore();
    }
  }, options);

  // Start observing the load more trigger element
  if (loadMoreTrigger.value) {
    observer.value.observe(loadMoreTrigger.value);
  }
};

const handleAbrechnungClick = (abrechnung) => {
  selectedAbrechnung.value = abrechnung;
  showAbrechnungModal.value = true;
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Kein Datum';
  
  try {
    let date;
    
    // Handle Firestore Timestamp
    if (dateValue.toDate) {
      date = dateValue.toDate();
    } 
    // Handle ISO string
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    // Assume it's already a Date object
    else if (dateValue instanceof Date) {
      date = dateValue;
    } 
    // Handle timestamp number
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    // Handle invalid date
    else {
      console.warn('Unsupported date format:', dateValue);
      return 'Ungültiges Datum';
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateValue);
      return 'Ungültiges Datum';
    }
    
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateValue);
    return 'Fehler';
  }
};

const statusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('erfolg') || statusLower.includes('success') || statusLower.includes('abgeschlossen')) {
    return 'bg-green-100 text-green-800';
  } else if (statusLower.includes('fehler') || statusLower.includes('error') || statusLower.includes('fehlgeschlagen')) {
    return 'bg-red-100 text-red-800';
  } else if (statusLower.includes('warn') || statusLower.includes('warning') || statusLower.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
};
</script>
