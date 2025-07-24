<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="text-gray-800">
        <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          {{ safeInsurers.length }} Einträge
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          v-if="safeSelectedInsurer"
          @click="$emit('clear-selection')"
          class="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Auswahl aufheben
        </button>
      </div>
    </div>
   
    <div class="flex-1 overflow-y-auto w-full -mr-3 pr-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-3">
        <div
          v-for="insurer in (sortedInsurers || [])"
          :key="insurer.id"
          @click="emit('select-insurer', insurer)"
          class="relative group cursor-pointer"
          :class="[
            'group relative p-6 rounded-xl cursor-pointer',
            'bg-white border border-gray-200',
            'hover:shadow-lg hover:border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
            safeSelectedInsurer?.name === insurer.name
              ? 'ring-2 ring-blue-500 ring-opacity-50 border-transparent transform scale-[0.99] shadow-md'
              : 'hover:scale-[1.01]',
            'h-full min-h-[140px] flex flex-col',
            'transition-all duration-200 hover:shadow-md',
            isInsurerIncomplete(insurer) ? 'opacity-50 grayscale' : ''
          ]"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full rounded-l-lg"
            :class="insurer && utils && utils.getStatusColor ? utils.getStatusColor(insurer, props.currentDate, safeLastInvoices) : ''"
          ></div>
          
          <div class="flex flex-1 flex-col h-full">
            <!-- Header with logo/initials and name -->
            <div class="flex items-start justify-between mb-3 min-w-0">
              <div class="flex items-center min-w-0">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
                     :class="{
                       'bg-red-500': utils.getStatusCode(insurer, props.currentDate, props.lastInvoices) === 'red',
                       'bg-yellow-500': utils.getStatusCode(insurer, props.currentDate, props.lastInvoices) === 'yellow',
                       'bg-blue-500': utils.getStatusCode(insurer, props.currentDate, props.lastInvoices) === 'green'
                     }">
                  {{ getInitials(insurer.name) }}
                </div>
                <div class="flex items-center">
                  <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                    {{ insurer.name }}
                  </h3>
                  <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    BiPRO
                    <span v-if="insurer.bipro_version" class="ml-1 opacity-90 text-xs">{{ insurer.bipro_version }}</span>
                  </span>
                </div>
              </div>
              
              <!-- Status badge -->
              <span 
                v-if="isInsurerIncomplete(insurer)"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-gray-100 text-gray-800"
              >
                Unvollständig
              </span>
              <span 
                v-else-if="utils.getStatusCode(insurer, props.currentDate, props.lastInvoices) === 'red'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-red-100 text-red-800"
              >
                Überfällig (>5 Tage)
              </span>
              <span 
                v-else-if="utils.getStatusCode(insurer, props.currentDate, props.lastInvoices) === 'yellow'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-yellow-100 text-yellow-800"
              >
                                {{ utils.getStatusText(insurer, props.currentDate, props.lastInvoices) }}
              </span>
              <span 
                v-else
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-green-100 text-green-800"
              >
                Aktuell
              </span>
            </div>
            
            <!-- Main content -->
            <div class="flex-1 grid grid-cols-2 gap-3 text-sm">
              <!-- Left column -->
              <div class="space-y-2">
                <div v-if="insurer.turnus" class="flex items-start">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Turnus</div>
                    <div class="font-medium">{{ insurer.turnus && String(insurer.turnus).match(/\d+/)?.[0] ? `${String(insurer.turnus).match(/\d+/)[0]}-tägig` : insurer.turnus.includes('-tägig') ? insurer.turnus : '' }}</div>
                  </div>
                </div>
                
                <div v-if="insurer.contact_person" class="flex items-start">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Ansprechpartner</div>
                    <div class="font-medium">{{ insurer.contact_person }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Right column -->
              <div class="space-y-2">
                <div class="flex items-start">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Letzte Rechnung</div>
                    <div class="font-medium" :class="isOverdue(insurer) ? 'text-red-600' : 'text-green-600'">
                      {{ insurer && formatLastInvoice ? formatLastInvoice(safeLastInvoices[insurer.id] || (insurer.last_invoice !== null ? insurer.last_invoice : null)) : '' }}
                    </div>
                  </div>
                </div>
                
                <div v-if="insurer.next_due" class="flex items-start">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Fällig am</div>
                    <div class="font-medium">{{ formatDate(insurer.next_due) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- File format tags -->
            <div class="mt-3 flex flex-wrap gap-2">
              <!-- BiPRO -->
              <span v-if="insurer.bipro_support" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="font-semibold">BiPRO</span>
                <span v-if="insurer.bipro_version" class="ml-1 opacity-75">{{ insurer.bipro_version }}</span>
              </span>

              <!-- Document Types -->
              <span v-for="docType in getNormalizedDocTypes(insurer.dokumentenart)" :key="docType" 
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                    :class="docTypeColors[docType]?.classes || 'bg-gray-100 text-gray-800'">
                <svg v-if="docTypeColors[docType]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="docTypeColors[docType]?.icon"></svg>
                {{ docType }}
              </span>
              
              <!-- Fallback if no formats are specified -->
              <span v-if="getNormalizedDocTypes(insurer.dokumentenart).length === 0" class="text-xs text-gray-500">
                Keine Formate angegeben
              </span>
            </div>

            <!-- Footer with actions -->
            <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
              <span class="text-xs text-gray-500">
                Zuletzt aktualisiert: {{ formatDate(insurer.updated_at || new Date()) }}
              </span>
              <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Details anzeigen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Incomplete tile styling with diagonal stripes */
.incomplete-tile {
  position: relative;
  overflow: hidden;
}

.incomplete-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.05),
    rgba(0, 0, 0, 0.05) 10px,
    rgba(0, 0, 0, 0.1) 10px,
    rgba(0, 0, 0, 0.1) 20px
  );
  pointer-events: none;
  z-index: 1;
}
</style>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { format, add } from 'date-fns';
import { de } from 'date-fns/locale';
import InsurerStatus from './InsurerStatus.vue';
import { useInsurerUtils, docTypeColors } from '@/composables/useInsurerUtils';

const props = defineProps({
  insurers: { type: Array, default: () => [] },
  sortBy: { type: String, default: 'name' },
  lastInvoices: { type: Object, default: () => ({}) },
  currentDate: { type: Date, default: () => new Date() },
  selectedInsurer: { type: Object, default: () => null }
});

// Create safe computed properties with proper defaults
const safeInsurers = computed(() => {
  return Array.isArray(props.insurers) ? props.insurers : [];
});

const safeSelectedInsurer = computed(() => {
  return props.selectedInsurer || null;
});

const safeLastInvoices = computed(() => {
  return props.lastInvoices || {};
});

const emit = defineEmits(['select-insurer', 'clear-selection']);

const sortedInsurers = computed(() => {
  const insurers = safeInsurers.value || [];
  if (!Array.isArray(insurers)) return [];
  
  // Make a deep copy of the insurers array to avoid reactivity issues
  const sorted = [...insurers];

  
  // Ensure BiPRO property is set for display purposes
  sorted.forEach(insurer => {
    // Set default bipro property if not defined
    if (insurer.bipro === undefined) {
      // Set bipro to true for every third insurer to demonstrate the tag
      insurer.bipro = insurer.name?.toLowerCase().includes('allianz') || 
                      insurer.name?.toLowerCase().includes('axa') || 
                      insurer.name?.toLowerCase().includes('ergo');
    }
  });
  
  // Sort the insurers
  sorted.sort((a, b) => {
    switch (props.sortBy) {
      case 'date': {
        const lastInvoiceA = props.lastInvoices?.[a.id];
        const lastInvoiceB = props.lastInvoices?.[b.id];
        const dateA = lastInvoiceA?.datum?.seconds ? new Date(lastInvoiceA.datum.seconds * 1000) : new Date(0);
        const dateB = lastInvoiceB?.datum?.seconds ? new Date(lastInvoiceB.datum.seconds * 1000) : new Date(0);
        return dateB - dateA;
      }
      case 'overdue': {
        const { calculateDaysOverdue } = useInsurerUtils();
        const overdueA = utils.calculateDaysOverdue(a, props.currentDate, props.lastInvoices);
        const overdueB = utils.calculateDaysOverdue(b, props.currentDate, props.lastInvoices);
        return overdueB - overdueA;
      }
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });
  
  return sorted;
});

const selectInsurer = (insurer) => {
  emit('select-insurer', insurer);
};

const getNextSettlementDate = (insurer) => {
  const lastInvoice = props.lastInvoices[insurer.id];
  if (!lastInvoice || !lastInvoice.datum) return 'N/A';
  const lastDate = new Date(lastInvoice.datum.seconds * 1000);
  const nextDate = add(lastDate, { days: insurer.turnus });
  return format(nextDate, 'dd.MM.yyyy', { locale: de });
};

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const isInsurerIncomplete = (insurer) => {
  if (!insurer) return true;

  const isFieldEmpty = (field) => {
    if (field === null || field === undefined) return true;
    if (typeof field === 'string') return field.trim() === '';
    // For non-string, non-array types (like numbers for turnus), if they exist, they are not empty.
    return false;
  };

  const turnusEmpty = isFieldEmpty(insurer.turnus);
  const bezugswegEmpty = isFieldEmpty(insurer.bezugsweg);
  // For dokumentenart, we check if the *normalized* list is empty.
  const dokArtEmpty = utils.getNormalizedDocTypes(insurer.dokumentenart).length === 0;

  return turnusEmpty || bezugswegEmpty || dokArtEmpty;
};

const utils = useInsurerUtils();

const getNormalizedDocTypes = (docArt) => {
  if (!docArt) return [];
  
  let types = [];
  if (Array.isArray(docArt)) {
    // Handles messy arrays like ['C','S','V',',','PDF'] by filtering for valid, multi-character types.
    types = docArt.filter(d => typeof d === 'string' && d.trim().length > 1 && d.trim() !== ',');
  } else if (typeof docArt === 'string') {
    // Handles string formats like "CSV, PDF"
    types = docArt.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Return a unique set of uppercase types to avoid duplicates and ensure consistency.
  return [...new Set(types.map(t => t.toUpperCase()))];
};



const isOverdue = (insurer) => {
  const days = utils.calculateDaysOverdue(insurer, props.currentDate, props.lastInvoices);
  return days > 0;
};

const formatDate = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (dateValue.seconds) { // Firestore timestamp
    date = new Date(dateValue.seconds * 1000);
  } else {
    date = new Date(dateValue);
  }
  if (isNaN(date.getTime())) return '';
  return format(date, 'dd.MM.yyyy', { locale: de });
};

const formatLastInvoice = (lastInvoice) => {
  // Handle null or undefined explicitly
  if (lastInvoice === null || lastInvoice === undefined) {
    return 'Keine Abrechnung';
  }

  // Priority 1: Object with a 'display' property.
  if (typeof lastInvoice === 'object' && lastInvoice.display) {
    return lastInvoice.display;
  }

  // Priority 2: Object with a 'datum' or 'date' property (likely a Firestore timestamp).
  if (typeof lastInvoice === 'object' && (lastInvoice.datum || lastInvoice.date)) {
    return formatDate(lastInvoice.datum || lastInvoice.date);
  }

  // Priority 3: A simple string that is not an array or object representation.
  if (typeof lastInvoice === 'string' && lastInvoice.trim() && !lastInvoice.includes('[') && !lastInvoice.includes('{')) {
      return lastInvoice;
  }

  // Fallback for all other cases (arrays, other objects).
  return 'Keine Abrechnung';
};
</script>