<template>
  <div class="settings-view">
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Einstellungen</h2>
        
        <div class="space-y-8">
          <!-- Backup & Restore Section -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Daten-Sicherung</h3>
            <p class="text-sm text-gray-600 mb-4">
              Hier können Sie eine Sicherung Ihrer Daten erstellen oder eine vorhandene Sicherung wiederherstellen.
            </p>
            <BackupSettings />
          </div>
          
          <!-- App Version -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Version</h3>
            <p class="text-sm text-gray-600">
              ProviBook v{{ appVersion }}
              <span v-if="!isProduction" class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Entwicklungsversion
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BackupSettings from '@/components/BackupSettings.vue';

const props = defineProps({
  isProduction: {
    type: Boolean,
    required: true,
  },
  gitBranch: {
    type: String,
    default: 'main',
  },
});

const appVersion = ref(import.meta.env.VITE_APP_VERSION || '1.0.0');
</script>

<style scoped>
.settings-view {
  min-height: calc(100vh - 120px);
}

.form-radio {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}
</style>
