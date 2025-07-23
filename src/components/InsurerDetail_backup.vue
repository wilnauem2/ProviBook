<template>
  <!-- Main container -->
  <div>
    <!-- Main Insurer Detail Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto py-10">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-y-auto shadow-xl">
        <div class="p-8">
        <!-- Header with Name and Status -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div class="flex-1 min-w-0 mb-4 sm:mb-0">
            <div class="flex items-center">
              <div v-if="!isEditing || editField !== 'name'" class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 truncate">{{ insurer.name }}</h2>
              </div>
              <div v-else class="flex-1">
                <input 
                  v-model="editedName" 
                  class="w-full p-3 text-2xl font-bold border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="Versicherer Name"
                  autofocus
                />
              </div>
              <button 
                v-if="!isEditing || editField !== 'name'" 
                @click="startEditing('name')" 
                class="ml-3 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                title="Name bearbeiten"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div v-if="isEditing && editField === 'name'" class="mt-3 flex justify-end">
              <button @click="cancelEditing()" class="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3">Abbrechen</button>
              <button @click="saveField('name')" class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">Speichern</button>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- BiPRO Badge if applicable -->
              <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg border border-blue-200 shadow-sm flex items-center">
                <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                BiPRO
              </span>
              
              <!-- Delete Button -->
              <button 
                @click="confirmDelete" 
                class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-2 transition-colors duration-200 hover:bg-red-50"
                title="Versicherer löschen"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 mt-4">
            <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
              <div class="w-3 h-3 rounded-full mr-2" :class="getStatusColor(insurer, currentDate)"></div>
              <span class="text-sm font-medium" :class="getStatusColor(insurer, currentDate).replace('bg-', 'text-').replace('-500', '-700')">
                {{ getStatusText(insurer, currentDate) }}
              </span>
            </div>
            <!-- BiPRO Tag -->
            <span v-if="insurer.bipro" class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-sm">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="font-semibold">BiPRO</span>
              <span v-if="insurer.bipro_version" class="ml-1 opacity-75">{{ insurer.bipro_version }}</span>
            </span>
          </div>
        </div>

        <!-- Commentary Section -->
        <div class="mb-8 border-b pb-6 border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Kommentar</h3>
            <button v-if="!isEditing || editField !== 'comment'" 
              @click="startEditing('comment')" 
              class="text-blue-600 hover:text-blue-800 focus:outline-none"
              title="Kommentar bearbeiten"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          
          <div v-if="isEditing && editField === 'comment'">
            <textarea 
              v-model="editedComment" 
              class="w-full p-2 border border-gray-300 rounded"
              rows="4"
              placeholder="Kommentar zum Versicherer hinzufügen..."
              autofocus
            ></textarea>
            <div class="flex justify-end mt-2">
              <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
              <button @click="saveField('comment')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
            </div>
          </div>
          <div v-else>
            <p v-if="insurer.comment" class="text-gray-700">{{ insurer.comment }}</p>
            <p v-else class="text-gray-500 italic">Kein Kommentar vorhanden</p>
          </div>
        </div>

        <!-- Abrechnung Details -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsdetails
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Turnus Field -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">Turnus</span>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('turnus')" 
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Turnus bearbeiten"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'turnus'">
                <select 
                  v-model="editedTurnus" 
                  class="w-full p-2 border border-gray-300 rounded"
                  autofocus
                >
                  <option value="wöchentlich">Wöchentlich</option>
                  <option value="alle 2 Wochen">Alle 2 Wochen</option>
                  <option value="monatlich">Monatlich</option>
                </select>
                <div class="flex justify-end mt-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                  <button @click="saveField('turnus')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                </div>
              </div>
              <p v-else class="text-gray-700">{{ formattedTurnus }}</p>
            </div>
            
            <!-- Standard-Dokumentenweg Field -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">Standard-Dokumentenweg</span>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('bezugsweg')" 
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Dokumentenweg bearbeiten"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'bezugsweg'">
                <select 
                  v-model="editedBezugsweg" 
                  class="w-full p-2 border border-gray-300 rounded"
                  autofocus
                >
                  <option value="E-Mail">E-Mail</option>
                  <option value="Maklerportal">Maklerportal</option>
                  <option value="Post">Post</option>
                  <option value="BiPRO">BiPRO</option>
                </select>
                <div class="flex justify-end mt-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                  <button @click="saveField('bezugsweg')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                </div>
              </div>
              <p v-else class="text-gray-700">{{ insurer.bezugsweg || 'Nicht festgelegt' }}</p>
            </div>
            
            <!-- Standard-Formate Field -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">Standard-Formate</span>
                <button 
                  v-if="!isEditing" 
                  @click="startEditing('dokumentenart')" 
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                  title="Formate bearbeiten"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'dokumentenart'">
                <div class="mb-2">
                  <div v-for="(format, index) in availableFormats" :key="index" class="flex items-center mb-1">
                    <input 
                      type="checkbox" 
                      :id="`format-${index}`" 
                      :value="format" 
                      v-model="editedDokumentenart"
                      class="mr-2"
                    >
                    <label :for="`format-${index}`" class="text-sm">{{ format }}</label>
                  </div>
                </div>
                <div class="flex justify-end mt-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                  <button @click="saveField('dokumentenart')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                </div>
              </div>
              <div v-else>
                <div v-if="insurer.dokumentenart && insurer.dokumentenart.length">
                  <span 
                    v-for="(format, index) in insurer.dokumentenart" 
                    :key="index"
                    class="inline-block mr-2 mb-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {{ format }}
                  </span>
                </div>
                <p v-else class="text-gray-500 italic">Keine Formate festgelegt</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Letzte Abrechnung -->
        <div v-if="insurer.last_invoice" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Letzte Abrechnung
          </h3>
          <div class="p-5 bg-amber-50 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-sm font-medium text-amber-800 mb-2">Datum</p>
                <p class="text-gray-700 font-medium">{{ formatLastInvoice(insurer.last_invoice) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-amber-800 mb-2">Status</p>
                <div class="flex items-center bg-white px-3 py-1.5 rounded-lg shadow-sm inline-flex border border-gray-200">
                  <div class="w-3 h-3 rounded-full mr-2" :class="getStatusColor(insurer, currentDate)"></div>
                  <span class="font-medium" :class="getStatusColor(insurer, currentDate).replace('bg-', 'text-').replace('-500', '-700')">{{ getStatusText(insurer, currentDate) }}</span>
                </div>
              </div>
            </div>
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
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <div class="flex items-center mb-6">
          <div class="bg-red-100 p-2 rounded-full mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Versicherer löschen</h3>
        </div>
        <p class="text-gray-700 mb-8">Sind Sie sicher, dass Sie den Versicherer <span class="font-semibold">"{{ insurer.name }}"</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="flex justify-end space-x-4">
          <button @click="showDeleteConfirmation = false" class="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Abbrechen
          </button>
          <button @click="deleteInsurer()" class="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
            Löschen bestätigen
          </button>
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
const editedComment = ref('');
const editedTurnus = ref('');
const editedBezugsweg = ref('');
const editedDokumentenart = ref([]);
const availableFormats = ['CSV', 'PDF', 'Paper', 'XLS', 'XML', 'Papier'];

// Delete confirmation state
const showDeleteConfirmation = ref(false);

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
  if (!props.insurer) return [];
  
  // Ensure dokumentenart is an array
  const dokumentenart = Array.isArray(props.insurer.dokumentenart) 
    ? props.insurer.dokumentenart 
    : (props.insurer.dokumentenart ? [props.insurer.dokumentenart] : []);
  
  // Filter out single letters and only keep valid format names
  const validFormats = ['CSV', 'PDF', 'Paper', 'XLS', 'XML', 'Papier'];
  return dokumentenart.filter(format => 
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

// BiPRO status toggle
const toggleBiproStatus = async () => {
  try {
    const newBiproValue = !props.insurer.bipro;
    const result = await insurerStore.updateInsurer(props.insurer.id, { bipro: newBiproValue });
    if (result) {
      // Success notification could be added here
      console.log(`BiPRO für ${props.insurer.name} wurde ${newBiproValue ? 'aktiviert' : 'deaktiviert'}.`);
    } else {
      console.error(`Fehler beim Aktualisieren von ${props.insurer.name}.`);
    }
  } catch (error) {
    console.error(`Fehler: ${error.message}`);
  }
};

// Delete insurer functionality
const deleteInsurer = async () => {
  try {
    console.log(`Deleting insurer: ${props.insurer.id} - ${props.insurer.name}`);
    
    // Call the store's deleteInsurer method
    const success = await insurerStore.deleteInsurer(props.insurer.id);
    
    if (success) {
      console.log('Insurer deleted successfully');
      
      // Close the confirmation dialog
      showDeleteConfirmation.value = false;
      
      // Emit an event to notify the parent component
      emit('insurer-deleted', props.insurer.id);
      
      // Close the detail view
      emit('close');
    } else {
      console.error('Failed to delete insurer');
      // Could add error handling UI here
    }
  } catch (error) {
    console.error('Error deleting insurer:', error);
    // Could add error handling UI here
  }
};

// Edit mode functions
const startEditing = (field) => {
  isEditing.value = true;
  editField.value = field;
  
  // Initialize edit values from current insurer data
  if (field === 'name') {
    editedName.value = props.insurer.name || '';
  } else if (field === 'comment') {
    editedComment.value = props.insurer.comment || '';
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
    } else if (field === 'comment') {
      updateData = { comment: editedComment.value };
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
