<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';
import { calculateDaysOverdue, getStatusColor, getStatusText } from '../utils/insurerUtils'

// Initialize Pinia store
const insurerStore = useInsurerStore();

const showDatePicker = ref(false)
const selectedDate = ref('')
const dateInputRef = ref(null)

// Set initial date to today and log insurer data when component mounts
onMounted(() => {
  // Set default date
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  selectedDate.value = `${year}-${month}-${day}`
  
  // Debug logs
  if (!props.isProductionBranch) console.log('Insurer data:', props.insurer);
  if (props.insurer) {
    if (!props.isProductionBranch) console.log('Dokumentenart:', props.insurer.dokumentenart);
  }
})

const props = defineProps({
  insurer: {
    type: Object,
    required: true
  },
  lastInvoices: {
    type: Array,
    default: () => []
  },
  currentDate: {
    type: [Date, String],
    required: true
  },
  isProductionBranch: {
    type: Boolean,
    default: true
  }
})


const emit = defineEmits(['close', 'settlement-completed'])

const isUpdatingInvoice = ref(false)

const openDatePicker = () => {
  showDatePicker.value = true
  // Focus the date input when the dialog opens
  setTimeout(() => {
    if (dateInputRef.value) {
      dateInputRef.value.focus()
    }
  }, 100)
}

const handleDateSubmit = async (date) => {
  if (!props.isProductionBranch) console.log('=== handleDateSubmit ===');
  
  try {
    if (!props.isProductionBranch) console.log('Starting handleDateSubmit with date:', date);
    
    // Use the provided date or default to today
    const dateToUse = date || selectedDate.value;
    
    if (!dateToUse) {
      if (!props.isProductionBranch) console.error('No date provided');
      return;
    }
    
    if (!props.isProductionBranch) console.log('Input date:', dateToUse);
    
    // Parse the date string to a Date object
    const parsedDate = new Date(dateToUse);
    
    // Set the time to 14:00 local time
    parsedDate.setHours(14, 0, 0, 0);
    
    // Get timestamp for easier comparisons
    const timestamp = parsedDate.getTime();
    
    // Format the date for display (DD.MM.YYYY, HH:MM)
    const formattedDay = String(parsedDate.getDate()).padStart(2, '0');
    const formattedMonth = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = parsedDate.getFullYear();
    const displayDate = `${formattedDay}.${formattedMonth}.${formattedYear}`;
    
    if (!props.isProductionBranch) console.log('Creating date object:', {
      inputDate: dateToUse,
      parsedDate: parsedDate.toString(),
      isoString: parsedDate.toISOString(),
      timestamp,
      displayDate
    });
    
    // Create the last_invoice object
    const lastInvoice = {
      display: displayDate,
      timestamp: timestamp,
      date: parsedDate.toISOString()
    };
    
    if (!props.isProductionBranch) console.log('Created last_invoice object:', JSON.stringify(lastInvoice, null, 2));
    
    try {
      // The 'settlement-completed' event is handled by the parent component to create a new invoice entry.
      // The direct update to the insurer document has been removed to avoid data duplication.

      // Emit the event for the parent component to handle
      const eventData = {
        insurer: props.insurer,
        newDate: parsedDate,
        displayDate,
        last_invoice: lastInvoice
      };
      
      if (!props.isProductionBranch) console.log('Emitting settlement-completed event with data:', JSON.stringify(eventData, null, 2));
      emit('settlement-completed', eventData);
      if (!props.isProductionBranch) console.log('settlement-completed event emitted successfully');
    } catch (error) {
      if (!props.isProductionBranch) console.error('Error updating insurer data:', error);
      throw error; // Re-throw to be caught by the outer catch
    }
    
    if (!props.isProductionBranch) console.log('Date picker closed');
    showDatePicker.value = false;
  } catch (error) {
    if (!props.isProductionBranch) console.error('Error in handleDateSubmit:', error);
    // Log additional error details
    if (error instanceof Error) {
      if (!props.isProductionBranch) console.error('Error name:', error.name);
      if (!props.isProductionBranch) console.error('Error message:', error.message);
      if (!props.isProductionBranch) console.error('Error stack:', error.stack);
    }
    // Re-throw to ensure the error is not silently swallowed
    throw error;
  }
};

const handleCancel = () => {
  showDatePicker.value = false
  // Reset to today's date
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  selectedDate.value = `${year}-${month}-${day}`
}

const handleUpdateLastInvoice = (newDate) => {
  emit('update-last-invoice', { insurerName: props.insurer.name, lastInvoice: newDate })
}

const formattedLastInvoice = computed(() => {
  if (!props.isProductionBranch) console.log('formattedLastInvoice called with:', props.insurer.last_invoice);
  
  if (!props.insurer.last_invoice) {
    if (!props.isProductionBranch) console.log('No last_invoice, returning empty string');
    return '';
  }
  
  let dateStr = '';
  const lastInvoice = props.insurer.last_invoice;
  
  // Handle the object format with display property
  if (typeof lastInvoice === 'object' && lastInvoice !== null) {
    if (!props.isProductionBranch) console.log('last_invoice is an object with keys:', Object.keys(lastInvoice));
    
    // If we have a date property that's an ISO string
    if (lastInvoice.date) {
      if (!props.isProductionBranch) console.log('Using date property (ISO):', lastInvoice.date);
      const date = new Date(lastInvoice.date);
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        if (!props.isProductionBranch) console.log('Formatted date from ISO string:', dateStr);
      }
    }
    // Fall back to display property
    else if (lastInvoice.display) {
      if (!props.isProductionBranch) console.log('Using display property:', lastInvoice.display);
      dateStr = lastInvoice.display.split(',')[0].trim();
      if (!props.isProductionBranch) console.log('Extracted date from display:', dateStr);
    } 
    // Fall back to timestamp
    else if (lastInvoice.timestamp) {
      if (!props.isProductionBranch) console.log('Using timestamp property:', lastInvoice.timestamp);
      const date = new Date(Number(lastInvoice.timestamp));
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        if (!props.isProductionBranch) console.log('Formatted date from timestamp:', dateStr);
      }
    }
  } 
  // Handle string format (backward compatibility)
  else if (typeof lastInvoice === 'string' && lastInvoice.trim() !== '') {
    if (!props.isProductionBranch) console.log('last_invoice is a string:', lastInvoice);
    // If it's an ISO date string
    if (lastInvoice.includes('T') && !isNaN(Date.parse(lastInvoice))) {
      const date = new Date(lastInvoice);
      dateStr = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (!props.isProductionBranch) console.log('Formatted ISO date string:', dateStr);
    } else {
      // Try to extract date part from other string formats
      dateStr = lastInvoice.split(',')[0].trim();
      if (!props.isProductionBranch) console.log('Extracted date from string:', dateStr);
    }
  }
  
  // If we don't have a date string, return empty
  if (!dateStr) {
    if (!props.isProductionBranch) console.log('No date string extracted, returning empty string');
    return '';
  }
  
  if (!props.isProductionBranch) console.log('Final date string to format:', dateStr);
  
  // Try to parse the date in different formats
  try {
    // Try DD.MM.YYYY format
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        if (!props.isProductionBranch) console.log('Invalid date from DD.MM.YYYY format, returning as is');
        return dateStr;
      }
      
      // Format the date in German format (DD.MM.YYYY)
      const formatted = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      if (!props.isProductionBranch) console.log('Formatted date from DD.MM.YYYY:', formatted);
      return formatted;
    }
    
    // Try to parse as ISO string or other format
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const formatted = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (!props.isProductionBranch) console.log('Formatted date from Date object:', formatted);
      return formatted;
    }
    
    if (!props.isProductionBranch) console.log('Could not parse date, returning as is:', dateStr);
    return dateStr;
    
  } catch (e) {
    if (!props.isProductionBranch) console.error('Error formatting date:', e);
    // Return the original string without time part if possible
    const result = dateStr.split(' ')[0].split(',')[0].trim();
    if (!props.isProductionBranch) console.log('Error case, returning:', result);
    return result;
  }
});

const formattedTurnus = computed(() => {
  if (!props.insurer.turnus) return ''
  return props.insurer.turnus.replace(/-/g, '-')
})
</script>

<template>
  <div class="max-w-2xl w-full bg-white rounded-lg shadow-xl transform transition-all duration-300">
    <div class="p-6">
      <!-- No header needed here as it's already in the parent component -->
      <div class="mb-6"></div>

      <!-- Status -->
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full" :class="{
            'bg-red-500': getStatusColor(insurer) === 'red',
            'bg-yellow-500': getStatusColor(insurer) === 'yellow',
            'bg-green-500': getStatusColor(insurer) === 'green',
            'bg-gray-300': getStatusColor(insurer) === 'gray'
          }"></div>
          <span class="text-sm font-medium" :class="{
            'text-red-600': getStatusColor(insurer) === 'red',
            'text-yellow-600': getStatusColor(insurer) === 'yellow',
            'text-green-600': getStatusColor(insurer) === 'green',
            'text-gray-500': getStatusColor(insurer) === 'gray'
          }">
            {{ getStatusText(insurer) }}
          </span>
        </div>
      </div>

      <!-- Abrechnung -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnung</h3>
        <div class="space-y-4">
          <div v-if="insurer.turnus" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium text-blue-800">Turnus</span>
            </div>
            <p class="text-gray-600">{{ formattedTurnus }}</p>
          </div>

          <div v-if="insurer.bezugsweg" class="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium text-teal-800">Bezugsweg</span>
            </div>
            <p class="text-gray-600">{{ insurer.bezugsweg }}</p>
          </div>

          <!-- File Formats -->
          <div v-if="insurer.dokumentenart && insurer.dokumentenart.length > 0" class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium text-indigo-800">Verfügbare Formate</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-if="insurer.dokumentenart.includes('CSV')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </span>
              <span v-if="insurer.dokumentenart.includes('PDF')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </span>
              <span v-if="insurer.dokumentenart.includes('XLS')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </span>
              <span v-if="insurer.dokumentenart.includes('XML')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                XML
              </span>
              
              <!-- Papier -->
              <span v-if="insurer.dokumentenart.includes('Papier')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Papier
              </span>
            </div>
          </div>

          <div v-if="insurer.dokumentenart" class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="font-medium text-yellow-800">Dokumentenart</span>
            </div>
            <p class="text-gray-600">{{ insurer.dokumentenart }}</p>
          </div>

          <div v-if="insurer.kontakt" class="p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-medium text-red-800">Kontakt</span>
            </div>
            <p class="text-gray-600">{{ insurer.kontakt }}</p>
          </div>

          <div v-if="insurer.login" class="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span class="font-medium text-orange-800">Login</span>
            </div>
            <p class="text-gray-600">{{ insurer.login }}</p>
          </div>
        </div>
      </div>

      <!-- Letzte Abrechnung -->
      <div v-if="insurer.last_invoice" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Letzte Abrechnung</h3>
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">

          
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="font-medium text-green-800">Datum</span>
          </div>
          <div class="mt-4 text-sm">
            <div class="font-medium text-gray-700">Letzte Abrechnung:</div>
            <div class="text-gray-600" v-if="props.insurer.last_invoice">
              {{ props.insurer.last_invoice.display || 
                 (props.insurer.last_invoice.date ? new Date(props.insurer.last_invoice.date).toLocaleDateString('de-DE') : '') }}
            </div>
            <div class="text-gray-600" v-else>
              Keine Abrechnung vorhanden
            </div>
            

          </div>
        </div>
      </div>

      <!-- Anweisungen -->
      <div v-if="insurer.instructions" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Anweisungen</h3>
        <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium text-purple-800">Anweisungen</span>
          </div>
          <p class="text-gray-600 whitespace-pre-line">{{ insurer.instructions }}</p>
        </div>
      </div>

      <!-- Kommentar -->
      <div v-if="insurer.kommentar" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Kommentar</h3>
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium text-gray-800">Kommentar</span>
          </div>
          <p class="text-gray-600 whitespace-pre-line">{{ insurer.kommentar }}</p>
        </div>
      </div>

      <!-- Abrechnung Button -->
      <div class="mt-6 space-y-4">
        <button
          @click="openDatePicker"
          class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Abrechnung soeben erfolgt
        </button>
      </div>

      <!-- Date Picker Dialog -->
      <div v-if="showDatePicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsdatum auswählen</h3>
          
          <div class="mb-4">
            <label for="settlementDate" class="block text-sm font-medium text-gray-700 mb-2">
              Datum der Abrechnung:
            </label>
            <input
              ref="dateInputRef"
              type="date"
              id="settlementDate"
              v-model="selectedDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              @keyup.enter="() => handleDateSubmit()"
            >
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Abbrechen
            </button>
            <button
              type="button"
              @click="() => handleDateSubmit()"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!selectedDate"
            >
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
