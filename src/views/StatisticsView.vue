<template>
  <div class="space-y-6">
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

const handleFilter = (type, value) => {
  emit(`filter-by-${type}`, value);
};

const handleSelectInsurer = (insurer) => {
  console.log('[StatisticsView] Received select-insurer event:', insurer);
  emit('select-insurer', insurer);
};
</script>
