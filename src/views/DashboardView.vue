<template>
  <div 
    class="grid grid-cols-1 lg:grid-cols-4 gap-6"
    :class="{ 'filter blur-sm': selectedInsurer }"
  >
    <!-- Left Sidebar -->
    <div class="lg:col-span-1 space-y-4">
      <!-- Inlined StatusSummary -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">Statusübersicht</h3>
          <div class="mt-2 space-y-2">
            <button @click="$emit('status-clicked', 'all')" :class="['w-full text-left p-2 rounded-md text-sm', statusFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100']">Alle</button>
            <button @click="$emit('status-clicked', 'warning')" :class="['w-full text-left p-2 rounded-md text-sm flex justify-between items-center', statusFilter === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-100']"><span>Mahnung</span> <span class="font-bold">{{ statusCounts.warning }}</span></button>
            <button @click="$emit('status-clicked', 'critical')" :class="['w-full text-left p-2 rounded-md text-sm flex justify-between items-center', statusFilter === 'critical' ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100']"><span>Kritisch</span> <span class="font-bold">{{ statusCounts.critical }}</span></button>
          </div>
        </div>
      </div>
      
      <!-- Inlined SearchBar -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4">
          <input 
            type="text" 
            :value="searchFilter" 
            @input="$emit('update:searchFilter', $event.target.value)" 
            placeholder="Versicherer suchen..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
            <!-- Inlined TestDateSimulator -->
      <div v-if="!isProduction" class="bg-white rounded-lg shadow p-4">
        <label for="simulated-date" class="block text-sm font-medium text-gray-700 mb-1">Test-Datum</label>
        <div class="flex items-center space-x-2">
          <button @click="$emit('change-date', -1)" class="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">&#x25C0;</button>
          <input 
            type="date" 
            id="simulated-date"
            :value="simulatedDate ? simulatedDate.toISOString().split('T')[0] : ''"
            @input="$emit('update:simulatedDate', new Date($event.target.value))"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button @click="$emit('change-date', 1)" class="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">&#x25B6;</button>
        </div>
        <button @click="$emit('reset-date')" class="mt-2 w-full text-center text-sm text-blue-600 hover:underline">Heute</button>
      </div>

      <!-- Inlined EnvironmentUserInfo -->
      <div v-if="!isProduction" class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-sm text-gray-600">Modus: <span class="font-semibold">{{ dataMode }}</span></p>
        <button @click="$emit('switch-mode')" class="mt-2 text-sm text-blue-600 hover:underline">Wechseln</button>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="lg:col-span-3">
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-lg font-medium text-gray-900">Versicherer</h2>
            <div v-if="statusFilter !== 'all'" class="ml-3 flex items-center">
              <span class="text-sm text-gray-500">Filter:</span>
              <span class="ml-1 px-2 py-1 text-xs rounded-full" :class="statusFilterClass">{{ statusFilterLabel }}</span>
              <button @click="$emit('clear-status-filter')" class="ml-1 text-gray-400 hover:text-gray-600" title="Filter zurücksetzen">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="$emit('create-insurer')" class="mr-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">+ Neuer Versicherer</button>
            <div class="inline-flex">
              <select :value="sortOption" @input="$emit('update:sortOption', $event.target.value)" class="form-select appearance-none rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option value="name">Name</option>
                <option value="date">Letztes Abrechnungsdatum</option>
                <option value="overdue">Tage überfällig</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="py-12 flex justify-center">
          <div class="animate-pulse flex space-x-4 items-center">
            <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
            <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
            <div class="h-3 w-3 bg-blue-400 rounded-full"></div>
            <div class="text-sm text-gray-500">Laden...</div>
          </div>
        </div>
        <div v-else>
          <InsurerList
            :insurers="filteredInsurers" 
            :sortBy="sortOption"
            :lastInvoices="lastInvoices"
            :currentDate="currentDate"
            :selectedInsurer="selectedInsurer"
            @select-insurer="$emit('select-insurer', $event)"
            @clear-selection="$emit('clear-selection')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import InsurerList from '@/components/InsurerList.vue';

const props = defineProps({
  isLoading: Boolean,
  isProduction: Boolean,
  filteredInsurers: Array,
  statusCounts: Object,
  statusFilter: String,
  searchFilter: String,
  simulatedDate: Date,
  dataMode: String,
  sortOption: String,
  lastInvoices: Object,
  currentDate: Date,
  selectedInsurer: Object,
});

defineEmits([
  'status-clicked',
  'update:searchFilter',
  'update:simulatedDate',
  'switch-mode',
  'clear-status-filter',
  'create-insurer',
  'update:sortOption',
  'select-insurer',
  'clear-selection',
  'change-date',
  'reset-date',
]);

const statusFilterLabel = computed(() => {
  const labels = {
    warning: 'Mahnung',
    critical: 'Überfällig',
    on_time: 'Im Zeitplan',
  };
  return labels[props.statusFilter] || '';
});

const statusFilterClass = computed(() => ({
  'bg-yellow-100 text-yellow-800': props.statusFilter === 'warning',
  'bg-red-100 text-red-800': props.statusFilter === 'critical',
  'bg-green-100 text-green-800': props.statusFilter === 'on_time',
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
