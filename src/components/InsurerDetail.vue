<template>
  <div class="relative w-full bg-white h-full">
    <!-- Close Button -->
    <button @click="emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none z-10">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <div class="p-6">
        <!-- Header -->
        <div class="mb-6 border-b pb-4 border-gray-200">
          <div class="flex items-center justify-between">
            <h2 v-if="isEditing && editField === 'name'" class="text-2xl font-bold text-gray-900 flex-grow">
              <input 
                v-model="editedName" 
                class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Versicherer Name"
              />
              <div class="flex justify-end mt-3 space-x-2">
                <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
                <button @click="saveField('name')" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
              </div>
            </h2>
            <div v-else class="flex items-center w-full">
              <div class="flex items-center flex-grow">
                <h2 class="text-2xl font-bold text-gray-900">{{ insurer.name }}</h2>
                <button 
                  @click="startEditing('name')" 
                  class="text-blue-600 hover:text-blue-800 focus:outline-none ml-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
            <!-- Turnus Field -->
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span class="font-medium text-blue-800">Turnus</span>
                </div>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('turnus')" 
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'turnus'">
                <select 
                  v-model="editedTurnus" 
                  class="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="wöchentlich">Wöchentlich</option>
                  <option value="alle 2 Wochen">Alle 2 Wochen</option>
                  <option value="monatlich">Monatlich</option>
                </select>
                <div class="flex justify-end mt-3 space-x-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
                  <button @click="saveField('turnus')" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                </div>
              </div>
              <p v-else class="text-gray-600">{{ formattedTurnus }}</p>
            </div>
            
            <!-- Standard-Dokumentenweg Field -->
            <div class="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span class="font-medium text-teal-800">Standard-Dokumentenweg</span>
                </div>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('bezugsweg')" 
                  class="text-teal-600 hover:text-teal-800 focus:outline-none"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'bezugsweg'">
                <select 
                  v-model="editedBezugsweg" 
                  class="w-full p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="E-Mail">E-Mail</option>
                  <option value="Maklerportal">Maklerportal</option>
                  <option value="Post">Post</option>
                  <option value="Bipro">Bipro</option>
                </select>
                <div class="flex justify-end mt-3 space-x-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
                  <button @click="saveField('bezugsweg')" class="px-3 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700">Speichern</button>
                </div>
              </div>
              <p v-else class="text-gray-600">{{ insurer.bezugsweg || 'Nicht angegeben' }}</p>
            </div>
            
            <!-- Standard-Formate Field -->
            <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200 md:col-span-2">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span class="font-medium text-indigo-800">Standard-Formate</span>
                </div>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('dokumentenart')" 
                  class="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'dokumentenart'">
                <div class="flex flex-wrap gap-3">
                  <div v-for="format in availableFormats" :key="format" class="flex items-center">
                    <input 
                      type="checkbox" 
                      :id="`format-${format}`" 
                      :value="format" 
                      v-model="editedDokumentenart"
                      class="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                    >
                    <label :for="`format-${format}`" class="ml-2 text-sm text-gray-700">{{ format }}</label>
                  </div>
                </div>
                <div class="flex justify-end mt-3 space-x-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
                  <button @click="saveField('dokumentenart')" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Speichern</button>
                </div>
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <span v-if="!insurer.dokumentenart || insurer.dokumentenart.length === 0 || filteredFormats.length === 0" class="text-gray-500">Keine Formate angegeben</span>
                <span v-else v-for="format in filteredFormats" :key="format" 
                  :class="getFormatClass(format)"
                  class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium">
                  {{ format }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Letzte Abrechnung -->
        <div v-if="insurer.last_invoice" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Letzte Abrechnung</h3>
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-medium text-gray-800">Datum</span>
            </div>
            <p class="text-gray-600">{{ formattedLastInvoice }}</p>
          </div>
        </div>

        <!-- Abrechnungshistorie -->
        <div v-if="settlementHistory.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungshistorie</h3>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notiz</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in settlementHistory" :key="invoice.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatSettlementDate(invoice.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.note || '-' }}</td>
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
                    <button @click="handleClose" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none">
            Schliessen
          </button>
        </div>
      </div>

      <!-- Date Picker Dialog -->
      <div v-if="showDatePicker" class="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm">
          <h3 class="text-lg font-semibold mb-4">Datum der Abrechnung</h3>
          <input type="date" ref="dateInputRef" v-model="selectedDate" class="w-full p-2 border rounded-md mb-2">
          <textarea v-model="settlementNote" placeholder="Notiz hinzufügen..." class="w-full p-2 border rounded-md mb-4" rows="3"></textarea>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="handleCancel" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
            <button type="button" @click="handleDateSubmit()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Bestätigen</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';
import { getStatusColor, getStatusText } from '../utils/insurerUtils';

// Initialize Pinia store
const insurerStore = useInsurerStore();
const settlementHistory = computed(() => insurerStore.settlementHistory);

// Edit mode state
const isEditing = ref(false);
const editField = ref(null);
const editedName = ref('');
const editedTurnus = ref('');
const editedBezugsweg = ref('');
const editedDokumentenart = ref([]);
const availableFormats = ['CSV', 'PDF', 'Paper', 'XLS', 'XML', 'Papier'];

// Format helpers
const getFormatClass = (format) => {
  switch(format) {
    case 'CSV': return 'bg-blue-100 text-blue-800';
    case 'PDF': return 'bg-red-100 text-red-800';
    case 'Paper': return 'bg-yellow-100 text-yellow-800';
    case 'XLS': return 'bg-green-100 text-green-800';
    case 'XML': return 'bg-purple-100 text-purple-800';
    case 'Papier': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const filteredFormats = computed(() => {
  if (!props.insurer || !props.insurer.dokumentenart) return [];
  
  // Filter out single letters and only keep valid format names
  const validFormats = ['CSV', 'PDF', 'Paper', 'XLS', 'XML', 'Papier'];
  return props.insurer.dokumentenart.filter(format => 
    validFormats.includes(format) && format.length > 1
  );
});

const formattedTurnus = computed(() => {
  if (props.insurer && typeof props.insurer.turnus === 'number') {
    return `${props.insurer.turnus} Tage`;
  }
  return props.insurer.turnus; // Fallback for old string data
});

const showDatePicker = ref(false);
const selectedDate = ref('');
const settlementNote = ref('');
const dateInputRef = ref(null);

// Edit mode functions
const startEditing = (field) => {
  isEditing.value = true;
  editField.value = field;
  
  // Initialize edit values from current insurer data
  if (field === 'name') {
    editedName.value = props.insurer.name || '';
  } else if (field === 'turnus') {
    editedTurnus.value = props.insurer.turnus || 'monatlich';
  } else if (field === 'bezugsweg') {
    editedBezugsweg.value = props.insurer.bezugsweg || 'E-Mail';
  } else if (field === 'dokumentenart') {
    editedDokumentenart.value = props.insurer.dokumentenart ? [...props.insurer.dokumentenart] : [];
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editField.value = null;
};

const saveField = async (field) => {
  if (!props.isProductionBranch) console.log(`Saving ${field} field`);
  
  try {
    let updateData = {};
    
    if (field === 'name') {
      updateData = { name: editedName.value };
    } else if (field === 'turnus') {
      updateData = { turnus: editedTurnus.value };
    } else if (field === 'bezugsweg') {
      updateData = { bezugsweg: editedBezugsweg.value };
    } else if (field === 'dokumentenart') {
      updateData = { dokumentenart: editedDokumentenart.value };
    }
    
    if (Object.keys(updateData).length > 0) {
      if (!props.isProductionBranch) console.log('Update data:', updateData);
      
      const success = await insurerStore.updateInsurer(props.insurer.id, updateData);
      
      if (success) {
        if (!props.isProductionBranch) console.log(`${field} updated successfully`);
      } else {
        if (!props.isProductionBranch) console.error(`Failed to update ${field}`);
      }
    }
  } catch (error) {
    if (!props.isProductionBranch) console.error(`Error saving ${field}:`, error);
  } finally {
    isEditing.value = false;
    editField.value = null;
  }
};

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
    insurerStore.fetchSettlementHistory(props.insurer.id);
  }
});

const props = defineProps({
  insurer: {
    type: Object,
    required: true
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

watch(() => props.insurer, (newInsurer) => {
  if (newInsurer && newInsurer.id) {
    insurerStore.fetchSettlementHistory(newInsurer.id);
  }
}, { immediate: true });

const handleClose = () => {
  emit('close');
};

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
      date: parsedDate.toISOString(),
      note: settlementNote.value
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
    settlementNote.value = ''; // Reset note on submit
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
  settlementNote.value = ''; // Reset note on cancel
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
