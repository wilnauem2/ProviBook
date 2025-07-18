<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="text-gray-800">
        <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          {{ insurers.length }} Einträge
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          v-if="selectedInsurer"
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
          v-for="insurer in sortedInsurers"
          :key="insurer.name"
          :class="[
            'group relative p-6 rounded-xl cursor-pointer',
            'bg-white border border-gray-200',
            'hover:shadow-lg hover:border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
            selectedInsurer?.name === insurer.name
              ? 'ring-2 ring-blue-500 ring-opacity-50 border-transparent transform scale-[0.99] shadow-md'
              : 'hover:scale-[1.01]',
            'h-full min-h-[140px] flex flex-col',
            'transition-all duration-200 hover:shadow-md',
            // Gray out tiles with complete: false
            isInsurerIncomplete(insurer) ? 'incomplete-tile opacity-50 grayscale' : ''
          ]"
          @click="selectInsurer(insurer)"
          @keydown.enter="selectInsurer(insurer)"
          tabindex="0"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full rounded-l-lg"
            :class="{
              'bg-red-500': getStatusColor(insurer) === 'red',
              'bg-yellow-500': getStatusColor(insurer) === 'yellow',
              'bg-green-500': getStatusColor(insurer) === 'green' || getStatusColor(insurer) === 'gray'
            }"
          ></div>
          
          <div class="flex flex-1 flex-col h-full">
            <!-- Header with logo/initials and name -->
            <div class="flex items-start justify-between mb-3 min-w-0">
              <div class="flex items-center min-w-0">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
                     :class="{
                       'bg-red-500': getStatusColor(insurer) === 'red',
                       'bg-yellow-500': getStatusColor(insurer) === 'yellow',
                       'bg-blue-500': getStatusColor(insurer) === 'green' || getStatusColor(insurer) === 'gray'
                     }">
                  {{ getInitials(insurer.name) }}
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                  {{ insurer.name }}
                </h3>
              </div>
              
              <!-- Status badge -->
              <span 
                v-if="isInsurerIncomplete(insurer)"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-gray-100 text-gray-800"
              >
                Unvollständig
              </span>
              <span 
                v-else-if="getStatusColor(insurer) === 'red'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-red-100 text-red-800"
              >
                Überfällig (>5 Tage)
              </span>
              <span 
                v-else-if="getStatusColor(insurer) === 'yellow'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-yellow-100 text-yellow-800"
              >
                {{ getStatusText(insurer) }}
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
                    <div class="font-medium">{{ insurer.turnus }}</div>
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
                <div v-if="insurer.last_invoice" class="flex items-start">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Letzte Rechnung</div>
                    <div class="font-medium" :class="isOverdue(insurer) ? 'text-red-600' : 'text-green-600'">
                      {{ formatLastInvoice(insurer.last_invoice) }}
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
              <!-- CSV -->
              <span v-if="insurer.dokumentenart && insurer.dokumentenart.includes('CSV')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </span>
              
              <!-- PDF -->
              <span v-if="insurer.dokumentenart && insurer.dokumentenart.includes('PDF')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </span>
              
              <!-- XLS -->
              <span v-if="insurer.dokumentenart && insurer.dokumentenart.includes('XLS')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </span>
              
              <!-- XML -->
              <span v-if="insurer.dokumentenart && insurer.dokumentenart.includes('XML')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                XML
              </span>
              
              <!-- Papier -->
              <span v-if="insurer.dokumentenart && insurer.dokumentenart.includes('Papier')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Papier
              </span>
              
              <!-- Fallback if no formats are specified -->
              <span v-if="!insurer.dokumentenart || insurer.dokumentenart.length === 0" class="text-xs text-gray-500">
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
import { computed } from 'vue';
import { format, add } from 'date-fns';
import { de } from 'date-fns/locale';
import InsurerStatus from './InsurerStatus.vue';
import { calculateDaysOverdue } from '../utils/insurerUtils';

const props = defineProps({
  insurers: { type: Array, required: true },
  sortBy: { type: String, default: 'name' },
  lastInvoices: { type: Object, required: true },
  currentDate: { type: Date, required: true },
  selectedInsurer: { type: Object, default: null }
});

const emit = defineEmits(['select-insurer', 'clear-selection']);

const sortedInsurers = computed(() => {
  if (!props.insurers) return [];
  const sorted = [...props.insurers];
  sorted.sort((a, b) => {
    switch (props.sortBy) {
      case 'date': {
        const dateA = props.lastInvoices[a.id]?.datum ? new Date(props.lastInvoices[a.id].datum.seconds * 1000) : new Date(0);
        const dateB = props.lastInvoices[b.id]?.datum ? new Date(props.lastInvoices[b.id].datum.seconds * 1000) : new Date(0);
        return dateB - dateA;
      }
      case 'overdue': {
        const overdueA = calculateDaysOverdue(a, props.lastInvoices[a.id], props.currentDate);
        const overdueB = calculateDaysOverdue(b, props.lastInvoices[b.id], props.currentDate);
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
  return insurer.complete === false;
};

const getStatusColor = (insurer) => {
  if (isInsurerIncomplete(insurer)) return 'gray';
  const days = calculateDaysOverdue(insurer, props.lastInvoices[insurer.id], props.currentDate);
  if (days > 5) return 'red';
  if (days > 0) return 'yellow';
  return 'green';
};

const getStatusText = (insurer) => {
  const days = calculateDaysOverdue(insurer, props.lastInvoices[insurer.id], props.currentDate);
  if (days > 0) {
    return `${days} ${days === 1 ? 'Tag' : 'Tage'} überfällig`;
  }
  return 'Anstehend';
};

const isOverdue = (insurer) => {
  const days = calculateDaysOverdue(insurer, props.lastInvoices[insurer.id], props.currentDate);
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
  if (!lastInvoice || !lastInvoice.datum) return 'N/A';
  return formatDate(lastInvoice.datum);
};
</script>