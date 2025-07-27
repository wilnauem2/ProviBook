<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Daten-Sicherung & Wiederherstellung</h2>
    
    <div class="space-y-6">
      <!-- Backup Section -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium mb-3">Sicherung erstellen</h3>
        <p class="text-sm text-gray-600 mb-4">
          Erstellen Sie eine vollständige Sicherung aller Daten in Ihrer Datenbank.
          Die Sicherung wird als JSON-Datei heruntergeladen.
        </p>
        <button
          @click="createBackup"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Wird erstellt...</span>
          <span v-else>Sicherung erstellen</span>
        </button>
      </div>
      
      <!-- Restore Section -->
      <div class="border-b pb-4">
        <h3 class="text-lg font-medium mb-3">Sicherung wiederherstellen</h3>
        <p class="text-sm text-gray-600 mb-4">
          Stellen Sie Daten aus einer zuvor erstellten Sicherung wieder her.
          <span class="font-semibold text-red-600">Achtung: Bestehende Daten können überschrieben werden!</span>
        </p>
        
        <div class="flex items-center space-x-4">
          <input
            type="file"
            ref="fileInput"
            accept=".json"
            @change="handleFileSelect"
            class="hidden"
          />
          <button
            @click="triggerFileInput"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Datei auswählen
          </button>
          <span v-if="selectedFile" class="text-sm text-gray-700">
            {{ selectedFile.name }}
          </span>
        </div>
        
        <div v-if="selectedFile" class="mt-4 space-y-3">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="overwrite"
              v-model="overwriteExisting"
              class="rounded text-blue-600"
            />
            <label for="overwrite" class="text-sm text-gray-700">
              Vorhandene Daten überschreiben
            </label>
          </div>
          
          <button
            @click="restoreBackup"
            :disabled="isRestoring || !selectedFile"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isRestoring">Wird wiederhergestellt...</span>
            <span v-else>Sicherung wiederherstellen</span>
          </button>
        </div>
      </div>
      
      <!-- Status Messages -->
      <div v-if="statusMessage" :class="['p-3 rounded-md', statusType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
        {{ statusMessage }}
      </div>
      
      <!-- Backup Info -->
      <div v-if="backupInfo" class="mt-4 p-3 bg-gray-50 rounded-md text-sm">
        <h4 class="font-medium mb-2">Sicherungsinformationen:</h4>
        <p>Erstellt am: {{ formatDate(backupInfo.timestamp) }}</p>
        <p>Sammlungen: {{ backupInfo.collections.join(', ') }}</p>
        <p>Gesamte Dokumente: {{ backupInfo.totalDocuments }}</p>
      </div>
    </div>
    
    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Sicherung wiederherstellen</h3>
        <p class="mb-6">
          Möchten Sie wirklich die Sicherung wiederherstellen? 
          <span v-if="overwriteExisting" class="font-semibold text-red-600">
            Dies wird alle bestehenden Daten überschreiben!
          </span>
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showConfirmation = false" 
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button 
            @click="confirmRestore"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Ja, wiederherstellen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { backupFirestore, restoreFirestore, handleBackupFileSelect } from '@/utils/firebaseBackup';

const fileInput = ref(null);
const selectedFile = ref(null);
const backupData = ref(null);
const backupInfo = ref(null);
const isLoading = ref(false);
const isRestoring = ref(false);
const overwriteExisting = ref(false);
const statusMessage = ref('');
const statusType = ref('');
const showConfirmation = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = async (event) => {
  try {
    statusMessage.value = '';
    backupInfo.value = null;
    
    if (!event.target.files.length) return;
    
    selectedFile.value = event.target.files[0];
    
    try {
      backupData.value = await handleBackupFileSelect(event);
      backupInfo.value = backupData.value._backupInfo;
      setStatus('Sicherungsdatei erfolgreich geladen', 'success');
    } catch (error) {
      console.error('Error processing backup file:', error);
      setStatus(`Fehler beim Lesen der Sicherungsdatei: ${error.message}`, 'error');
      selectedFile.value = null;
    }
  } catch (error) {
    console.error('Error in handleFileSelect:', error);
    setStatus(`Ein Fehler ist aufgetreten: ${error.message}`, 'error');
  }
};

const createBackup = async () => {
  try {
    isLoading.value = true;
    statusMessage.value = 'Sicherung wird erstellt...';
    statusType.value = 'info';
    
    const backup = await backupFirestore();
    
    // Download the backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('+')[0];
    const filename = `provibook-backup-${timestamp}.json`;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setStatus('Sicherung wurde erfolgreich erstellt und heruntergeladen', 'success');
  } catch (error) {
    console.error('Error creating backup:', error);
    setStatus(`Fehler beim Erstellen der Sicherung: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
};

const restoreBackup = () => {
  if (!backupData.value) {
    setStatus('Keine gültige Sicherungsdatei ausgewählt', 'error');
    return;
  }
  
  if (overwriteExisting.value) {
    showConfirmation.value = true;
  } else {
    confirmRestore();
  }
};

const confirmRestore = async () => {
  showConfirmation.value = false;
  
  if (!backupData.value) {
    setStatus('Keine gültige Sicherungsdatei ausgewählt', 'error');
    return;
  }
  
  try {
    isRestoring.value = true;
    statusMessage.value = 'Sicherung wird wiederhergestellt...';
    statusType.value = 'info';
    
    const result = await restoreFirestore(backupData.value, overwriteExisting.value);
    
    if (result.success) {
      setStatus('Sicherung wurde erfolgreich wiederhergestellt', 'success');
      // Reset form
      selectedFile.value = null;
      backupData.value = null;
      backupInfo.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    } else {
      setStatus(`Wiederherstellung mit Fehlern abgeschlossen: ${result.errors.join('; ')}`, 'error');
    }
  } catch (error) {
    console.error('Error restoring backup:', error);
    setStatus(`Fehler bei der Wiederherstellung: ${error.message}`, 'error');
  } finally {
    isRestoring.value = false;
  }
};

const setStatus = (message, type = 'info') => {
  statusMessage.value = message;
  statusType.value = type;
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (statusMessage.value === message) {
        statusMessage.value = '';
      }
    }, 5000);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unbekannt';
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Date(dateString).toLocaleString('de-DE', options);
};
</script>
