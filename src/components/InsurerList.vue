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
      <div class="insurer-grid gap-3">
        <div
          v-for="insurer in insurers"
          :key="insurer.name"
          :class="[
            'group relative p-4 rounded-xl cursor-pointer transition-all duration-200',
            'bg-white border border-gray-200',
            'hover:shadow-md hover:border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
            selectedInsurer?.name === insurer.name
              ? 'ring-2 ring-blue-500 ring-opacity-50 border-transparent transform scale-[0.99] shadow-md'
              : 'hover:scale-[1.01]'
          ]"
          @click="selectInsurer(insurer)"
          @keydown.enter="selectInsurer(insurer)"
          tabindex="0"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1 h-full rounded-l-lg"
            :class="isOverdue(insurer) ? 'bg-red-500' : 'bg-green-500'"
          ></div>
          
          <div class="flex items-start justify-between pl-2">
            <div class="flex-1 min-w-0 pr-2">
              <h3 class="font-medium text-gray-900 truncate text-sm group-hover:text-blue-600 transition-colors">
                {{ insurer.name }}
              </h3>
             
              <!-- Additional information -->
              <div class="mt-1.5 space-y-1">
                <div v-if="insurer.turnus" class="flex items-center text-xs text-gray-500">
                  <svg class="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ insurer.turnus }}
                </div>
               
                <div v-if="insurer.last_invoice" class="flex items-center text-xs">
                  <span class="flex items-center" :class="isOverdue(insurer) ? 'text-red-600' : 'text-green-600'">
                    <svg v-if="isOverdue(insurer)" class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ formatLastInvoice(insurer.last_invoice) }}
                  </span>
                </div>
              </div>
            </div>
           
            <!-- Status indicator with tooltip -->
            <div class="relative group/status">
              <div 
                class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                :class="isOverdue(insurer) ? 'bg-red-500' : 'bg-green-500'"
              ></div>
              <div class="absolute right-0 mt-1 w-48 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/status:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {{ isOverdue(insurer) ? 'Überfällig' : 'Aktuell' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { calculateDaysOverdue, isOverdue } from '../utils/dateUtils'

// Add smooth scrolling to selected insurer
const containerRef = ref(null);
const selectedInsurerRef = ref(null);

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
  if (props.selectedInsurer) {
    // Small timeout to ensure the DOM is updated
    setTimeout(scrollToSelected, 100);
  }
});

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