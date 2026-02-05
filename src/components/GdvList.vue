<template>
  <div class="h-full flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center p-8 space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div class="text-gray-500">Lade GDV-Daten...</div>
        </div>

        <!-- No Results -->
        <div v-else-if="!isLoading && safeGdvEntries.length === 0" class="text-center p-8">
          <div class="mb-4 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Keine GDV-Einträge gefunden</h3>
          <p class="mt-1 text-sm text-gray-500">
            Erstellen Sie einen neuen GDV-Eintrag um zu beginnen.
          </p>
        </div>

        <!-- GDV Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="gdv in gdvEntriesWithStatus" 
            :key="gdv.id"
            @click="emit('select-gdv', gdv)"
            class="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1"
            :class="{
              'ring-2 ring-blue-500 shadow-lg': selectedGdv && selectedGdv.id === gdv.id,
              'shadow hover:shadow-xl': !(selectedGdv && selectedGdv.id === gdv.id),
              'border-l-4 border-red-500': gdv.status === 'critical',
              'border-l-4 border-yellow-500': gdv.status === 'warning',
              'border-l-4 border-green-500': gdv.status === 'on_time',
              'border-l-4 border-gray-400': gdv.status === 'no_import' || gdv.status === 'no_data'
            }"
          >
            <!-- No GDV Data Overlay -->
            <div 
              v-if="!gdv.delivers_gdv"
              class="absolute inset-0 bg-gray-500/10 pointer-events-none z-0"
            ></div>
            
            <div class="flex flex-col h-full p-5 relative z-5">
              <!-- Status Badge (Top Right) -->
              <div 
                class="absolute top-3 right-3 px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-sm shadow-lg tracking-wide"
                :class="{
                  'bg-red-500/90 text-white': gdv.status === 'critical',
                  'bg-yellow-500/90 text-white': gdv.status === 'warning',
                  'bg-green-500/90 text-white': gdv.status === 'on_time',
                  'bg-gray-400/90 text-white': gdv.status === 'no_import',
                  'bg-gray-300/90 text-gray-700': gdv.status === 'no_data'
                }"
              >
                {{ statusLabels[gdv.status] || 'Unbekannt' }}
              </div>
              
              <!-- Header with name -->
              <div class="mb-3 pr-24">
                <h3 class="text-lg font-extrabold text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                  {{ gdv.name }}
                </h3>
              </div>
              
              <!-- Versandarten Badges -->
              <div class="mt-2 flex flex-wrap gap-2">
                <template v-if="gdv.versandarten && gdv.versandarten.length > 0">
                  <span 
                    v-for="(versandart, index) in gdv.versandarten" 
                    :key="index"
                    class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
                    :class="getVersandartClasses(versandart)"
                  >
                    {{ versandart }}
                  </span>
                </template>
              </div>
              
              <!-- Info Grid -->
              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <!-- Frequenz -->
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="truncate">{{ gdv.frequency || '-' }}</span>
                </div>
                
                <!-- Bestandsart -->
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span class="truncate">{{ gdv.bestandsart || '-' }}</span>
                </div>
              </div>
              
              <!-- Last Import -->
              <div class="mt-4 pt-3 border-t border-gray-100">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Zuletzt eingespielt:</span>
                  <span class="font-medium" :class="getLastImportColor(gdv)">
                    {{ formatLastImport(gdv.last_import) }}
                  </span>
                </div>
                <div v-if="gdv.daysSinceImport !== null" class="mt-1 text-xs text-gray-400">
                  vor {{ gdv.daysSinceImport }} {{ gdv.daysSinceImport === 1 ? 'Tag' : 'Tagen' }}
                </div>
              </div>
              
              <!-- GDV Delivery Status -->
              <div v-if="!gdv.delivers_gdv" class="mt-3 text-center">
                <span class="text-xs text-gray-500 italic">Keine GDV-Daten</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGdvStore } from '@/stores/gdvStore';

const props = defineProps({
  gdvEntries: {
    type: Array,
    default: () => []
  },
  currentDate: {
    type: Date,
    default: () => new Date()
  },
  selectedGdv: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select-gdv']);

const gdvStore = useGdvStore();

const statusLabels = {
  critical: 'Überfällig',
  warning: 'Fällig',
  on_time: 'Aktuell',
  no_import: 'Kein Import',
  no_data: 'Keine GDV-Daten'
};

// Safe getter for GDV entries
const safeGdvEntries = computed(() => {
  return Array.isArray(props.gdvEntries) ? props.gdvEntries : [];
});

// Add status to each GDV entry
const gdvEntriesWithStatus = computed(() => {
  return safeGdvEntries.value.map(gdv => ({
    ...gdv,
    status: gdvStore.getGdvStatus(gdv, props.currentDate),
    daysSinceImport: gdvStore.calculateDaysSinceImport(gdv, props.currentDate)
  }));
});

// Get classes for versandart badges
const getVersandartClasses = (versandart) => {
  const classMap = {
    'BiPRO': 'bg-blue-100 text-blue-800 border border-blue-200',
    'E-Mail': 'bg-green-100 text-green-800 border border-green-200',
    'Portal': 'bg-purple-100 text-purple-800 border border-purple-200'
  };
  return classMap[versandart] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

// Format last import date
const formatLastImport = (lastImport) => {
  if (!lastImport) return '-';
  
  let date;
  if (lastImport?.toDate) {
    date = lastImport.toDate();
  } else if (lastImport instanceof Date) {
    date = lastImport;
  } else if (typeof lastImport === 'string') {
    date = new Date(lastImport);
  } else {
    return '-';
  }
  
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Get color for last import based on status
const getLastImportColor = (gdv) => {
  const status = gdv.status;
  if (status === 'critical') return 'text-red-600';
  if (status === 'warning') return 'text-yellow-600';
  if (status === 'on_time') return 'text-green-600';
  return 'text-gray-600';
};
</script>
