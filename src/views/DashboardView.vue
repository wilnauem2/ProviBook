<template>
  <div class="w-full">
    <div class="w-full">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <button @click="$emit('create-insurer')" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Neuer Versicherer
          </button>
          <div class="inline-flex">
            <select :value="sortOption" @input="$emit('update:sortOption', $event.target.value)" class="form-select appearance-none rounded-lg border border-slate-200 bg-white text-sm text-slate-700 px-3 py-2 pr-8 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all">
              <option value="name">Name</option>
              <option value="date">Letztes Abrechnungsdatum</option>
              <option value="overdue">Tage überfällig</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Date Simulator -->
          <div v-if="!isProduction" class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <span class="text-[11px] font-medium text-amber-700">Test:</span>
            <button @click="$emit('change-date', -1)" class="p-0.5 text-amber-600 hover:bg-amber-100 rounded transition-colors">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <input 
              type="date" 
              :value="currentDate ? new Date(currentDate).toISOString().split('T')[0] : ''"
              @input="handleDateInput($event.target.value)"
              class="text-xs border border-amber-200 rounded-md px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 text-amber-800"
            />
            <button @click="$emit('change-date', 1)" class="p-0.5 text-amber-600 hover:bg-amber-100 rounded transition-colors">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <button @click="$emit('reset-date')" class="text-[10px] font-medium text-amber-700 hover:text-amber-900 ml-0.5">Heute</button>
          </div>
          <!-- Active Status Filter -->
          <div v-if="statusFilter !== 'all'" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border" :class="statusFilterClass">
            <span class="text-xs font-medium">{{ statusFilterLabel }}</span>
            <button @click="$emit('clear-status-filter')" class="p-0.5 hover:bg-black/5 rounded transition-colors" title="Filter zurücksetzen">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-[3px] border-slate-200"></div>
          <div class="absolute inset-0 rounded-full border-[3px] border-brand-500 border-t-transparent animate-spin"></div>
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
  'bg-amber-50 text-amber-700 border-amber-200': props.statusFilter === 'warning',
  'bg-red-50 text-red-700 border-red-200': props.statusFilter === 'critical',
  'bg-emerald-50 text-emerald-700 border-emerald-200': props.statusFilter === 'on_time',
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
