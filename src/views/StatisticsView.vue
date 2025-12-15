<template>
  <div class="space-y-6">
    <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Statistiken</h1>
        <p class="text-sm text-gray-500">Übersicht über die Versicherer-Datenbasis.</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="px-2 py-1 bg-gray-100 rounded">
          Datenstand: {{ formattedCurrentDate }}
        </span>
      </div>
    </header>

    <section>
      <InsurerStats
        :insurers="actualInsurers"
        :current-date="currentDate"
        @filter-by-zustellungsweg="handleFilter('zustellungsweg', $event)"
        @filter-by-turnus="handleFilter('turnus', $event)"
        @filter-by-dokumentenart="handleFilter('dokumentenart', $event)"
        @select-insurer="handleSelectInsurer"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InsurerStats from '@/components/InsurerStats.vue';

const emit = defineEmits(['filter-by-zustellungsweg', 'filter-by-turnus', 'filter-by-dokumentenart', 'select-insurer', 'clear-all-filters']);

const props = defineProps({
  filteredInsurers: { type: Array, default: () => [] },
  insurers: { type: Array, default: () => [] },
  statusCounts: { type: Object, default: () => ({}) },
  statusFilter: { type: String, default: 'all' },
  searchFilter: { type: String, default: '' },
  currentDate: { type: [Date, String, Number], default: () => new Date() },
  simulatedDate: { type: [Date, String, Number], default: null }
});

const actualInsurers = computed(() => props.filteredInsurers || props.insurers || []);

const formattedCurrentDate = computed(() => {
  try {
    const date = props.currentDate ? new Date(props.currentDate) : new Date();
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Unbekannt';
  }
});

const handleFilter = (type, value) => {
  emit(`filter-by-${type}`, value);
};

const handleSelectInsurer = (insurer) => {
  console.log('[StatisticsView] Received select-insurer event:', insurer);
  emit('select-insurer', insurer);
};
</script>
