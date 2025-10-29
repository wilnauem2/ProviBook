<template>
  <div class="w-full">
    <!-- Main Content Area -->
    <div class="w-full">
      <div class="bg-white shadow sm:rounded-md">
        <div class="border-b border-gray-200 px-4 py-4 sm:px-6 bg-white sticky top-0 z-20">
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="flex items-center">
              <h2 class="text-lg font-medium text-gray-900">Versicherer</h2>
            </div>
            <!-- Date Simulator (Moved to header) -->
            <div v-if="!isProduction" class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Test-Datum:</span>
              <div class="flex items-center space-x-1">
                <button @click="$emit('change-date', -1)" class="p-1 text-gray-600 hover:bg-gray-100 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <input 
                  type="date" 
                  :value="currentDate ? new Date(currentDate).toISOString().split('T')[0] : ''"
                  @input="handleDateInput($event.target.value)"
                  class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button @click="$emit('change-date', 1)" class="p-1 text-gray-600 hover:bg-gray-100 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button @click="$emit('reset-date')" class="ml-1 text-xs text-blue-600 hover:underline whitespace-nowrap">
                  Heute
                </button>
              </div>
            </div>
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
          </div>
        </div>
        <div v-else>
            <InsurerList 
            :insurers="filteredInsurers"
            :current-date="currentDate"
            :selected-insurer="selectedInsurer"
            :is-loading="isLoading"
            @select-insurer="$emit('select-insurer', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, onBeforeMount, onMounted, watch } from 'vue';
import InsurerList from '@/components/InsurerList.vue';

// Debug logging (only in development)
if (import.meta.env.DEV) {
  onBeforeMount(() => {
    console.log('DashboardView wird geladen');
    console.log('Props:', {
      isLoading: props.isLoading,
      statusCounts: props.statusCounts,
      statusFilter: props.statusFilter,
      hasStatusCounts: !!props.statusCounts
    });
  });
}

const props = defineProps({
  isLoading: Boolean,
  filteredInsurers: {
    type: Array,
    default: () => []
  },
  statusCounts: {
    type: Object,
    default: () => ({
      critical: 0,
      warning: 0,
      on_time: 0
    })
  },
  statusFilter: {
    type: String,
    default: 'all'
  },
  searchFilter: {
    type: String,
    default: ''
  },
  simulatedDate: {
    type: Date,
    default: null
  },
  currentDate: {
    type: Date,
    required: true
  },
  sortOption: {
    type: String,
    default: 'name'
  },
  lastInvoices: {
    type: Object,
    default: () => ({})
  },
  selectedInsurer: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  'status-clicked',
  'update:searchFilter',
  'update:simulatedDate',
  'clear-status-filter',
  'create-insurer',
  'update:sortOption',
  'select-insurer',
  'clear-selection',
  'change-date',
  'reset-date',
]);

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('de-DE');
};

// Handle date input changes
const handleDateInput = (dateString) => {
  if (!dateString) return;
  const newDate = new Date(dateString);
  if (!isNaN(newDate.getTime())) {
    emit('change-date', newDate.getTime());
  }
};

// Status filter label
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

// Debug currentDate prop (only in development)
if (import.meta.env.DEV) {
  onMounted(() => {
    console.log('DashboardView mounted with currentDate:', props.currentDate);
    console.log('currentDate type:', Object.prototype.toString.call(props.currentDate));
  });

  watch(() => props.currentDate, (newDate) => {
    console.log('DashboardView currentDate changed to:', newDate);
    console.log('New date type:', Object.prototype.toString.call(newDate));
  });
}
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
