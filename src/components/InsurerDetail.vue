<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-start pt-10 z-40" @click.self="emit('close')">
    <div class="relative max-w-2xl w-full bg-white rounded-lg shadow-xl transform transition-all duration-300 m-4">
      <!-- Close Button -->
      <button @click="emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="p-6">
        <!-- Header -->
        <div class="mb-6 border-b pb-4 border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">{{ insurer.name }}</h2>
          <div class="flex items-center gap-3 mt-2">
            <div class="w-3 h-3 rounded-full" :class="getStatusColor(insurer, currentDate)"></div>
            <span class="text-sm font-medium" :class="getStatusColor(insurer, currentDate).replace('bg-', 'text-').replace('-500', '-600')">
              {{ getStatusText(insurer, currentDate) }}
            </span>
          </div>
        </div>

        <!-- Abrechnung Details -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsdetails</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="insurer.turnus" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="font-medium text-blue-800">Turnus</span>
              </div>
              <p class="text-gray-600">{{ formattedTurnus }}</p>
            </div>
            <div v-if="insurer.bezugsweg" class="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span class="font-medium text-teal-800">Standard-Dokumentenweg</span>
              </div>
              <p class="text-gray-600">{{ insurer.bezugsweg }}</p>
            </div>
            <div v-if="insurer.dokumentenart && insurer.dokumentenart.length > 0" class="p-4 bg-indigo-50 rounded-lg border border-indigo-200 md:col-span-2">
              <div class="flex items-center mb-3">
                <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span class="font-medium text-indigo-800">Standard-Formate</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-if="insurer.dokumentenart.includes('CSV')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>CSV</span>
                <span v-if="insurer.dokumentenart.includes('PDF')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0112.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF</span>
                <span v-if="insurer.dokumentenart.includes('XLS')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Excel</span>
                <span v-if="insurer.dokumentenart.includes('XML')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>XML</span>
                <span v-if="insurer.dokumentenart.includes('Papier')" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Papier</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Letzte Abrechnung -->
        <div v-if="insurer.last_invoice" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Letzte Abrechnung</h3>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span class="font-medium text-gray-800">Datum</span>
            </div>
            <p class="text-gray-600">{{ formattedLastInvoice }}</p>
          </div>
        </div>

        <!-- Abrechnungshistorie -->
        <div v-if="lastInvoices.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungshistorie</h3>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumentenart</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumentenweg</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in lastInvoices" :key="invoice.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatSettlementDate(invoice.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex flex-wrap gap-2">
                      <span v-if="invoice.dokumentenart && invoice.dokumentenart.includes('CSV')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">CSV</span>
                      <span v-if="invoice.dokumentenart && invoice.dokumentenart.includes('PDF')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">PDF</span>
                      <span v-if="invoice.dokumentenart && invoice.dokumentenart.includes('XLS')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Excel</span>
                      <span v-if="invoice.dokumentenart && invoice.dokumentenart.includes('XML')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">XML</span>
                      <span v-if="invoice.dokumentenart && invoice.dokumentenart.includes('Papier')" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Papier</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ invoice.bezugsweg || insurer.bezugsweg }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
          <button @click="openDatePicker" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Abrechnung erfolgt
          </button>
          <button @click="emit('close')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none">
            Schliessen
          </button>
        </div>
      </div>

      <!-- Date Picker Dialog -->
      <div v-if="showDatePicker" class="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm">
          <h3 class="text-lg font-semibold mb-4">Datum der Abrechnung</h3>
          <input type="date" ref="dateInputRef" v-model="selectedDate" class="w-full p-2 border rounded-md mb-4">
          <div class="flex justify-end space-x-3">
            <button type="button" @click="handleCancel" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
            <button type="button" @click="handleDateSubmit()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Bestätigen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';
import { getStatusColor, getStatusText } from '../utils/insurerUtils';

// Initialize Pinia store
const insurerStore = useInsurerStore();

const showDatePicker = ref(false);
const selectedDate = ref('');
const dateInputRef = ref(null);

// Set initial date to today and log insurer data when component mounts
onMounted(() => {
  // Set default date
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  selectedDate.value = `${year}-${month}-${day}`;

  // Debug logs
  if (!props.isProductionBranch) console.log('Insurer data:', props.insurer);
  if (props.insurer) {
    if (!props.isProductionBranch) console.log('Dokumentenart:', props.insurer.dokumentenart);
  }
});

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
});

const emit = defineEmits(['close', 'settlement-completed']);

const openDatePicker = () => {
  showDatePicker.value = true;
  // Focus the date input when the dialog opens
  setTimeout(() => {
    if (dateInputRef.value) {
      dateInputRef.value.focus();
    }
  }, 100);
};

const handleDateSubmit = async (date) => {
  if (!props.isProductionBranch) console.log('=== handleDateSubmit ===');

  try {
    if (!props.isProductionBranch) console.log('Starting handleDateSubmit with date:', date);

    const dateToUse = date || selectedDate.value;

    if (!dateToUse) {
      if (!props.isProductionBranch) console.error('No date provided');
      return;
    }

    if (!props.isProductionBranch) console.log('Input date:', dateToUse);

    const parsedDate = new Date(dateToUse);
    parsedDate.setHours(14, 0, 0, 0);

    const timestamp = parsedDate.getTime();

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

    const lastInvoice = {
      display: displayDate,
      timestamp: timestamp,
      date: parsedDate.toISOString()
    };

    if (!props.isProductionBranch) console.log('Created last_invoice object:', JSON.stringify(lastInvoice, null, 2));

    try {
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
      throw error;
    }

    if (!props.isProductionBranch) console.log('Date picker closed');
    showDatePicker.value = false;
  } catch (error) {
    if (!props.isProductionBranch) console.error('Error in handleDateSubmit:', error);
    if (error instanceof Error) {
      if (!props.isProductionBranch) console.error('Error name:', error.name);
      if (!props.isProductionBranch) console.error('Error message:', error.message);
      if (!props.isProductionBranch) console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

const handleCancel = () => {
  showDatePicker.value = false;
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  selectedDate.value = `${year}-${month}-${day}`;
};

const formattedLastInvoice = computed(() => {
  if (!props.isProductionBranch) console.log('formattedLastInvoice called with:', props.insurer.last_invoice);

  if (!props.insurer.last_invoice) {
    if (!props.isProductionBranch) console.log('No last_invoice, returning empty string');
    return '';
  }

  let dateStr = '';
  const lastInvoice = props.insurer.last_invoice;

  if (typeof lastInvoice === 'object' && lastInvoice !== null) {
    if (!props.isProductionBranch) console.log('last_invoice is an object with keys:', Object.keys(lastInvoice));

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
    } else if (lastInvoice.display) {
      if (!props.isProductionBranch) console.log('Using display property:', lastInvoice.display);
      dateStr = lastInvoice.display.split(',')[0].trim();
      if (!props.isProductionBranch) console.log('Extracted date from display:', dateStr);
    } else if (lastInvoice.timestamp) {
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
  } else if (typeof lastInvoice === 'string' && lastInvoice.trim() !== '') {
    if (!props.isProductionBranch) console.log('last_invoice is a string:', lastInvoice);
    if (lastInvoice.includes('T') && !isNaN(Date.parse(lastInvoice))) {
      const date = new Date(lastInvoice);
      dateStr = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (!props.isProductionBranch) console.log('Formatted ISO date string:', dateStr);
    } else {
      dateStr = lastInvoice.split(',')[0].trim();
      if (!props.isProductionBranch) console.log('Extracted date from string:', dateStr);
    }
  }

  if (!dateStr) {
    if (!props.isProductionBranch) console.log('No date string extracted, returning empty string');
    return '';
  }

  if (!props.isProductionBranch) console.log('Final date string to format:', dateStr);

  try {
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('.').map(Number);
      const date = new Date(year, month - 1, day);

      if (isNaN(date.getTime())) {
        if (!props.isProductionBranch) console.log('Invalid date from DD.MM.YYYY format, returning as is');
        return dateStr;
      }

      const formatted = date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (!props.isProductionBranch) console.log('Formatted date from DD.MM.YYYY:', formatted);
      return formatted;
    }

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
    const result = dateStr.split(' ')[0].split(',')[0].trim();
    if (!props.isProductionBranch) console.log('Error case, returning:', result);
    return result;
  }
});

const formattedTurnus = computed(() => {
  if (!props.insurer.turnus) return '';
  return props.insurer.turnus.replace(/-/g, '-');
});

const formatSettlementDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  
  let dateString = '';
  if (typeof dateValue === 'object' && dateValue.toDate) {
    // Handle Firebase Timestamp
    dateString = dateValue.toDate().toISOString();
  } else {
    dateString = String(dateValue);
  }

  // Aggressively take the first part of the string, assuming it's the date
  const datePart = dateString.split(' ')[0].split('T')[0].split(',')[0];

  try {
    const date = new Date(datePart);
    if (isNaN(date.getTime())) {
      return datePart; // Return the cleaned string if it's not a valid date
    }
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return datePart; // Return the cleaned part as a fallback
  }
};
</script>
