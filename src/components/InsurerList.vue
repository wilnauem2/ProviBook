<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">
        Versicherer
        <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          {{ insurers.length }}
        </span>
      </h2>
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
          v-for="insurer in insurers"
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
            'transition-all duration-200 hover:shadow-md'
          ]"
          @click="selectInsurer(insurer)"
          @keydown.enter="selectInsurer(insurer)"
          tabindex="0"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full rounded-l-lg"
            :class="isOverdue(insurer) ? 'bg-red-500' : 'bg-green-500'"
          ></div>
          
          <div class="flex flex-1 flex-col h-full">
            <!-- Header with logo/initials and name -->
            <div class="flex items-start justify-between mb-3 min-w-0">
              <div class="flex items-center min-w-0">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3" 
                     :class="isOverdue(insurer) ? 'bg-red-500' : 'bg-blue-500'">
                  {{ getInitials(insurer.name) }}
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                  {{ insurer.name }}
                </h3>
              </div>
              
              <!-- Status badge -->
              <span 
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2"
                :class="isOverdue(insurer) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'"
              >
                {{ isOverdue(insurer) ? 'Überfällig' : 'Aktuell' }}
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
</style>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { calculateDaysOverdue, isOverdue } from '../utils/dateUtils'

// Add smooth scrolling to selected insurer
const containerRef = ref(null);
const selectedInsurerRef = ref(null);

// Get initials from insurer name
const getInitials = (name) => {
  if (!name) return '--';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Scroll to selected insurer when it changes
const scrollToSelected = () => {
  if (selectedInsurerRef.value) {
    selectedInsurerRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  }
};

// Watch for selectedInsurer changes and scroll to it
onMounted(() => {
  // Debug logs
  console.log('InsurerList mounted with insurers:', props.insurers);
  if (props.insurers && props.insurers.length > 0) {
    console.log('First insurer data:', props.insurers[0]);
    console.log('First insurer dokumentenart:', props.insurers[0].dokumentenart);
  }
  
  // Scroll to selected insurer if needed
  if (props.selectedInsurer) {
    // Use nextTick to ensure the DOM is updated
    nextTick(() => {
      scrollToSelected();
    });
  }
});

// Format date to DD.MM.YYYY format
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format last invoice date to show only the date part
const formatLastInvoice = (dateValue) => {
  try {
    // If value is null or undefined, return empty string
    if (dateValue == null) return ''
    
    // Handle the case where dateValue is a Proxy object with a raw property
    if (dateValue.raw) {
      const date = new Date(dateValue.raw)
      if (!isNaN(date.getTime())) {
        return formatDateWithRelative(date)
      }
    }
    
    // Handle the case where dateValue is an object with display and timestamp
    if (typeof dateValue === 'object') {
      // Try to get the display property if it exists
      if (dateValue.display && typeof dateValue.display === 'string') {
        return dateValue.display.split(',')[0].trim()
      }
      
      // Try to get the timestamp if it exists
      if (dateValue.timestamp) {
        const date = new Date(Number(dateValue.timestamp))
        if (!isNaN(date.getTime())) {
          return formatDateWithRelative(date)
        }
      }
      
      // If we have a toISOString method, use that
      if (typeof dateValue.toISOString === 'function') {
        const date = new Date(dateValue.toISOString())
        if (!isNaN(date.getTime())) {
          return formatDateWithRelative(date)
        }
      }
    }
    
    // Handle the case where dateValue is a string
    if (typeof dateValue === 'string') {
      // If it's already in the format DD.MM.YYYY, return it as is
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateValue.trim())) {
        return dateValue.trim()
      }
      
      // Try to parse it as a date string
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return formatDateWithRelative(date)
      }
      
      // If it's in format 'DD.MM.YYYY, HH:mm', extract just the date part
      const dateMatch = dateValue.match(/^(\d{1,2}\.\d{1,2}\.\d{4})/)
      if (dateMatch && dateMatch[1]) {
        return dateMatch[1]
      }
      
      return dateValue.split(',')[0].trim()
    }
    
    // Last resort: try to convert to string and parse
    try {
      const str = String(dateValue)
      if (str !== '[object Object]') {
        const datePart = str.split(',')[0].trim()
        if (datePart) return datePart
      }
    } catch (e) {
      console.error('Error converting dateValue to string:', e)
    }
    
    // If we get here, we couldn't format the date
    return ''
  } catch (e) {
    console.error('Error in formatLastInvoice:', e)
    return ''
  }
}

// Helper function to format a date with relative text (heute, gestern, etc.)
const formatDateWithRelative = (date) => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) return ''
    
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time part for accurate day comparison
    
    // Create a date object with time set to 00:00:00 for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = Math.abs(now - dateOnly)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    // Format the date in German format (DD.MM.YYYY)
    const formattedDate = dateOnly.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    if (diffDays === 0) {
      return `heute (${formattedDate})`
    } else if (diffDays === 1) {
      return `gestern (${formattedDate})`
    } else if (diffDays < 7) {
      return `vor ${diffDays} Tagen (${formattedDate})`
    } else {
      return formattedDate
    }
  } catch (e) {
    console.error('Error in formatDateWithRelative:', e)
    return ''
  }
}

const props = defineProps({
  insurers: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedInsurer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-insurer', 'clear-selection'])

const selectInsurer = (insurer) => {
  if (props.selectedInsurer?.name === insurer.name) {
    emit('clear-selection');
  } else {
    emit('select-insurer', insurer);
  }
  
  // Update the selected insurer ref for scrolling
  nextTick(() => {
    selectedInsurerRef.value = document.querySelector('[data-selected="true"]');
  });
}

// Add a ref to the selected insurer for scrolling
const getInsurerRef = (insurer) => {
  return props.selectedInsurer?.name === insurer.name ? selectedInsurerRef : null;
};

// Add data attribute for selected insurer
const getInsurerDataAttrs = (insurer) => ({
  'data-selected': props.selectedInsurer?.name === insurer.name,
  'ref': props.selectedInsurer?.name === insurer.name ? 'selectedInsurerRef' : null
});
</script>