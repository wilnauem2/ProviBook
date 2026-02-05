<template>
  <div class="w-full">
    <!-- Main Content Area -->
    <div class="w-full">
      <div class="bg-white shadow sm:rounded-md">
        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 bg-white sticky top-0 z-20">
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="flex items-center">
              <h2 class="text-lg font-medium text-gray-900">GDV-Daten</h2>
            </div>
            <div v-if="statusFilter !== 'all'" class="flex items-center">
              <span class="text-sm text-gray-500">Filter:</span>
              <span class="ml-1 px-2 py-1 text-xs rounded-full" :class="statusFilterClass">{{ statusFilterLabel }}</span>
              <button @click="$emit('clear-status-filter')" class="ml-1 text-gray-400 hover:text-gray-600" title="Filter zurücksetzen">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center mt-3">
            <button @click="$emit('create-gdv')" class="mr-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              + Neuer GDV-Eintrag
            </button>
            <button 
              v-if="filteredGdvEntries.length === 0"
              @click="cloneFromInsurers"
              :disabled="isCloning"
              class="mr-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {{ isCloning ? 'Kopiere...' : 'Aus Abrechnung kopieren' }}
            </button>
            <div class="inline-flex">
              <select :value="sortOption" @input="$emit('update:gdv-sort-option', $event.target.value)" class="form-select appearance-none rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="name">Name</option>
                <option value="date">Letzter Import</option>
                <option value="overdue">Tage überfällig</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="py-12 flex justify-center">
          <div class="animate-pulse flex space-x-4 items-center">
            <div class="h-3 w-3 bg-indigo-400 rounded-full"></div>
            <div class="h-3 w-3 bg-indigo-400 rounded-full"></div>
          </div>
        </div>
        <div v-else>
          <GdvList 
            :gdv-entries="filteredGdvEntries"
            :current-date="currentDate"
            :selected-gdv="selectedGdv"
            :is-loading="isLoading"
            @select-gdv="$emit('select-gdv', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import GdvList from '@/components/GdvList.vue';
import { useGdvStore } from '@/stores/gdvStore';

const gdvStore = useGdvStore();
const isCloning = ref(false);

const cloneFromInsurers = async () => {
  isCloning.value = true;
  try {
    const count = await gdvStore.cloneInsurersToGdv();
    alert(`${count} Versicherer wurden erfolgreich kopiert!`);
  } catch (err) {
    console.error('Error cloning insurers:', err);
    alert('Fehler beim Kopieren: ' + err.message);
  } finally {
    isCloning.value = false;
  }
};

const props = defineProps({
  isLoading: Boolean,
  filteredGdvEntries: {
    type: Array,
    default: () => []
  },
  statusFilter: {
    type: String,
    default: 'all'
  },
  searchFilter: {
    type: String,
    default: ''
  },
  currentDate: {
    type: Date,
    required: true
  },
  sortOption: {
    type: String,
    default: 'name'
  },
  selectedGdv: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  'update:searchFilter',
  'clear-status-filter',
  'create-gdv',
  'update:gdv-sort-option',
  'select-gdv',
  'clear-selection'
]);

// Status filter label
const statusFilterLabel = computed(() => {
  const labels = {
    warning: 'Fällig',
    critical: 'Überfällig',
    on_time: 'Aktuell',
    no_import: 'Kein Import',
    no_data: 'Keine GDV-Daten'
  };
  return labels[props.statusFilter] || '';
});

const statusFilterClass = computed(() => ({
  'bg-yellow-100 text-yellow-800': props.statusFilter === 'warning',
  'bg-red-100 text-red-800': props.statusFilter === 'critical',
  'bg-green-100 text-green-800': props.statusFilter === 'on_time',
  'bg-gray-100 text-gray-800': props.statusFilter === 'no_import' || props.statusFilter === 'no_data'
}));
</script>

<style scoped>
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
