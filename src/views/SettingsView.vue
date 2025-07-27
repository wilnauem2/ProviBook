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
          
          <!-- Environment Settings -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Umgebung</h3>
            <div class="flex items-center">
              <span class="mr-4 text-sm font-medium text-gray-700">Datenmodus:</span>
              <div class="flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    class="form-radio" 
                    :value="'production'"
                    :checked="dataMode === 'production'"
                    @change="switchEnvironment('production')"
                  >
                  <span class="ml-2">Produktion</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    class="form-radio" 
                    :value="'test'"
                    :checked="dataMode === 'test'"
                    @change="switchEnvironment('test')"
                  >
                  <span class="ml-2">Test</span>
                </label>
              </div>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Aktueller Modus: {{ dataMode === 'production' ? 'Produktion' : 'Test' }}
            </p>
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
import { ref, computed, onMounted } from 'vue';
import { useInsurerStore } from '@/stores/insurerStore';
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

const emit = defineEmits(['switch-mode']);

const insurerStore = useInsurerStore();
const dataMode = computed(() => insurerStore.dataMode);
const appVersion = ref(import.meta.env.VITE_APP_VERSION || '1.0.0');

const switchEnvironment = (mode) => {
  emit('switch-mode', mode);
};
</script>

<style scoped>
.settings-view {
  min-height: calc(100vh - 120px);
}

.form-radio {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}
</style>
