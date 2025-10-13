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
        :insurers="insurers"
        :current-date="currentDate"
        @filter-by-zustellungsweg="$emit('filter-by-zustellungsweg', $event)"
        @filter-by-turnus="$emit('filter-by-turnus', $event)"
        @filter-by-dokumentenart="$emit('filter-by-dokumentenart', $event)"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InsurerStats from '@/components/InsurerStats.vue';

const props = defineProps({
  insurers: {
    type: Array,
    default: () => [],
  },
  statusCounts: {
    type: Object,
    default: () => ({}),
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  searchFilter: {
    type: String,
    default: '',
  },
  simulatedDate: {
    type: [Date, String, Number],
    default: null,
  },
  currentDate: {
    type: [Date, String, Number],
    default: () => new Date(),
  },
});

defineEmits([
  'filter-by-zustellungsweg',
  'filter-by-turnus',
  'filter-by-dokumentenart',
]);

const formattedCurrentDate = computed(() => {
  const date = props.currentDate ? new Date(props.currentDate) : new Date();
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('de-DE');
});
</script>
