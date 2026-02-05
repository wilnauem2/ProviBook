<template>
  <div class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ gdv.name }}</h2>
          <div class="flex items-center space-x-2 mt-0.5">
            <span 
              class="px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="statusClasses"
            >
              {{ statusLabel }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleEdit"
          class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          :title="isEditing ? 'Abbrechen' : 'Bearbeiten'"
        >
          <svg v-if="!isEditing" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button 
          @click="showDeleteConfirm = true"
          class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Löschen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button 
          @click="$emit('close')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Schließen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Edit Form -->
      <div v-if="isEditing" class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Versicherer-Name</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <!-- Liefert GDV-Daten -->
          <div>
            <label class="flex items-center space-x-3">
              <input 
                v-model="editForm.delivers_gdv" 
                type="checkbox" 
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Liefert GDV-Daten</span>
            </label>
          </div>
          
          <!-- Versandarten (Mehrfachauswahl) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Versandart(en)</label>
            <div class="flex flex-wrap gap-3">
              <label v-for="option in versandartOptions" :key="option" class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  :value="option"
                  :checked="editForm.versandarten?.includes(option)"
                  @change="toggleVersandart(option)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{{ option }}</span>
              </label>
            </div>
          </div>
          
          <!-- Portal-Link -->
          <div v-if="editForm.versandarten?.includes('Portal')">
            <label class="block text-sm font-medium text-gray-700 mb-1">Portal-Link</label>
            <input 
              v-model="editForm.portal_link" 
              type="url" 
              placeholder="https://..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <!-- Frequenz -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Frequenz</label>
            <select 
              v-model="editForm.frequency" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Bitte wählen --</option>
              <option v-for="freq in frequencyOptions" :key="freq" :value="freq">{{ freq }}</option>
            </select>
          </div>
          
          <!-- Bestandsart -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bestandsart</label>
            <select 
              v-model="editForm.bestandsart" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Bitte wählen --</option>
              <option v-for="art in bestandsartOptions" :key="art" :value="art">{{ art }}</option>
            </select>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button 
            @click="toggleEdit"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button 
            @click="saveChanges"
            :disabled="isSaving"
            class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Speichern...' : 'Speichern' }}
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-else class="p-6 space-y-6">
        <!-- Info Cards -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Liefert GDV-Daten</div>
            <div class="text-lg font-semibold" :class="gdv.delivers_gdv ? 'text-green-600' : 'text-gray-400'">
              {{ gdv.delivers_gdv ? 'Ja' : 'Nein' }}
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Frequenz</div>
            <div class="text-lg font-semibold text-gray-900">{{ gdv.frequency || '-' }}</div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Bestandsart</div>
            <div class="text-lg font-semibold text-gray-900">{{ gdv.bestandsart || '-' }}</div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Zuletzt eingespielt</div>
            <div class="text-lg font-semibold" :class="lastImportColor">
              {{ formatDate(gdv.last_import) || '-' }}
            </div>
          </div>
        </div>
        
        <!-- Versandarten -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-2">Versandart(en)</div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(versandart, index) in (gdv.versandarten || [])" 
              :key="index"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full"
              :class="getVersandartClasses(versandart)"
            >
              {{ versandart }}
            </span>
            <span v-if="!gdv.versandarten || gdv.versandarten.length === 0" class="text-gray-400">
              Keine angegeben
            </span>
          </div>
        </div>
        
        <!-- Portal-Link -->
        <div v-if="gdv.portal_link" class="bg-gray-50 rounded-lg p-4">
          <div class="text-xs text-gray-500 uppercase tracking-wide mb-2">Portal-Link</div>
          <a 
            :href="gdv.portal_link" 
            target="_blank" 
            class="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            {{ gdv.portal_link }}
            <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        
        <!-- Mark as Imported Button -->
        <div class="flex justify-center pt-4">
          <button 
            @click="showImportDialog = true"
            :disabled="!gdv.delivers_gdv"
            class="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Als eingespielt markieren</span>
          </button>
        </div>
        
        <!-- Import History -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Import-Verlauf
          </h3>
          
          <div v-if="isLoadingHistory" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          
          <div v-else-if="importHistory.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Noch keine Importe erfasst</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="entry in importHistory" 
              :key="entry.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div class="font-medium text-gray-900">{{ formatDate(entry.date) }}</div>
                  <div v-if="entry.notes" class="text-sm text-gray-500">{{ entry.notes }}</div>
                </div>
              </div>
              <button 
                @click="deleteHistoryEntry(entry.id)"
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Löschen"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Dialog -->
    <div v-if="showImportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">GDV-Daten als eingespielt markieren</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Datum</label>
            <input 
              v-model="importForm.date" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notizen (optional)</label>
            <textarea 
              v-model="importForm.notes" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="z.B. Besonderheiten, Anzahl Datensätze..."
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="showImportDialog = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button 
            @click="confirmImport"
            :disabled="isImporting"
            class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ isImporting ? 'Speichern...' : 'Bestätigen' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">GDV-Eintrag löschen?</h3>
        <p class="text-gray-600 mb-6">
          Möchten Sie den Eintrag "{{ gdv.name }}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button 
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ isDeleting ? 'Löschen...' : 'Löschen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useGdvStore } from '@/stores/gdvStore';

const props = defineProps({
  gdv: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'update:gdv', 'gdv-deleted']);

const gdvStore = useGdvStore();

// State
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isImporting = ref(false);
const isLoadingHistory = ref(false);
const showDeleteConfirm = ref(false);
const showImportDialog = ref(false);
const importHistory = ref([]);

// Options
const versandartOptions = ['BiPRO', 'E-Mail', 'Portal'];
const frequencyOptions = ['täglich', 'wöchentlich', '14-tägig', 'monatlich'];
const bestandsartOptions = ['Gesamtbestand', 'Änderungsbestand'];

// Edit form
const editForm = ref({
  name: '',
  delivers_gdv: true,
  versandarten: [],
  portal_link: '',
  frequency: '',
  bestandsart: ''
});

// Import form
const importForm = ref({
  date: new Date().toISOString().split('T')[0],
  notes: ''
});

// Computed
const statusLabel = computed(() => {
  const labels = {
    critical: 'Überfällig',
    warning: 'Fällig',
    on_time: 'Aktuell',
    no_import: 'Kein Import',
    no_data: 'Keine GDV-Daten'
  };
  const status = gdvStore.getGdvStatus(props.gdv);
  return labels[status] || 'Unbekannt';
});

const statusClasses = computed(() => {
  const status = gdvStore.getGdvStatus(props.gdv);
  const classes = {
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    on_time: 'bg-green-100 text-green-800',
    no_import: 'bg-gray-100 text-gray-800',
    no_data: 'bg-gray-100 text-gray-600'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
});

const lastImportColor = computed(() => {
  const status = gdvStore.getGdvStatus(props.gdv);
  if (status === 'critical') return 'text-red-600';
  if (status === 'warning') return 'text-yellow-600';
  if (status === 'on_time') return 'text-green-600';
  return 'text-gray-900';
});

// Methods
const toggleEdit = () => {
  if (!isEditing.value) {
    // Initialize form with current values
    editForm.value = {
      name: props.gdv.name || '',
      delivers_gdv: props.gdv.delivers_gdv ?? true,
      versandarten: [...(props.gdv.versandarten || [])],
      portal_link: props.gdv.portal_link || '',
      frequency: props.gdv.frequency || '',
      bestandsart: props.gdv.bestandsart || ''
    };
  }
  isEditing.value = !isEditing.value;
};

const toggleVersandart = (option) => {
  const index = editForm.value.versandarten.indexOf(option);
  if (index === -1) {
    editForm.value.versandarten.push(option);
  } else {
    editForm.value.versandarten.splice(index, 1);
  }
};

const saveChanges = async () => {
  isSaving.value = true;
  try {
    await gdvStore.updateGdvEntry(props.gdv.id, editForm.value);
    emit('update:gdv', { ...props.gdv, ...editForm.value });
    isEditing.value = false;
  } catch (err) {
    console.error('Error saving GDV entry:', err);
    alert('Fehler beim Speichern: ' + err.message);
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    await gdvStore.deleteGdvEntry(props.gdv.id);
    emit('gdv-deleted');
    emit('close');
  } catch (err) {
    console.error('Error deleting GDV entry:', err);
    alert('Fehler beim Löschen: ' + err.message);
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const confirmImport = async () => {
  isImporting.value = true;
  try {
    await gdvStore.markAsImported(props.gdv.id, {
      date: new Date(importForm.value.date),
      notes: importForm.value.notes
    });
    
    // Refresh history
    await loadHistory();
    
    // Reset form
    importForm.value = {
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
    
    showImportDialog.value = false;
    
    // Emit update
    emit('update:gdv', {
      ...props.gdv,
      last_import: new Date(importForm.value.date)
    });
  } catch (err) {
    console.error('Error marking as imported:', err);
    alert('Fehler beim Speichern: ' + err.message);
  } finally {
    isImporting.value = false;
  }
};

const loadHistory = async () => {
  isLoadingHistory.value = true;
  try {
    importHistory.value = await gdvStore.fetchImportHistory(props.gdv.id);
  } catch (err) {
    console.error('Error loading history:', err);
  } finally {
    isLoadingHistory.value = false;
  }
};

const deleteHistoryEntry = async (historyId) => {
  if (!confirm('Diesen Eintrag wirklich löschen?')) return;
  
  try {
    await gdvStore.deleteImportHistoryEntry(props.gdv.id, historyId);
    importHistory.value = importHistory.value.filter(h => h.id !== historyId);
  } catch (err) {
    console.error('Error deleting history entry:', err);
    alert('Fehler beim Löschen: ' + err.message);
  }
};

const formatDate = (date) => {
  if (!date) return null;
  
  let d;
  if (date?.toDate) {
    d = date.toDate();
  } else if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    return null;
  }
  
  if (isNaN(d.getTime())) return null;
  
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getVersandartClasses = (versandart) => {
  const classMap = {
    'BiPRO': 'bg-blue-100 text-blue-800',
    'E-Mail': 'bg-green-100 text-green-800',
    'Portal': 'bg-purple-100 text-purple-800'
  };
  return classMap[versandart] || 'bg-gray-100 text-gray-800';
};

// Load history on mount
onMounted(() => {
  loadHistory();
});

// Reload history when GDV changes
watch(() => props.gdv.id, () => {
  loadHistory();
});
</script>

<style scoped>
.z-60 {
  z-index: 60;
}
</style>
