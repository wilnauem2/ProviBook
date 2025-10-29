<template>
  <div class="space-y-6">
    <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Statistiken</h1>
        <p class="text-sm text-gray-500">Übersicht über die Versicherer-Datenbasis.</p>
        <div v-if="process.env.NODE_ENV === 'development'" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div>Debug: {{ insurers.length }} Versicherer geladen</div>
          <div v-if="insurers.length > 0">
            Erster Eintrag: {{ JSON.stringify(getSampleInsurer(insurers[0])) }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="px-2 py-1 bg-gray-100 rounded">
          Datenstand: {{ formattedCurrentDate }}
        </span>
      </div>
    </header>

    <section>
      <div v-if="!insurers || insurers.length === 0" class="p-4 bg-red-50 text-red-700 rounded-md">
        Keine Versichererdaten verfügbar. Bitte überprüfen Sie die Datenquelle.
      </div>
      <InsurerStats
        v-else
        :insurers="processedInsurers"
        :current-date="currentDate"
        @filter-by-zustellungsweg="handleFilter('zustellungsweg', $event)"
        @filter-by-turnus="handleFilter('turnus', $event)"
        @filter-by-dokumentenart="handleFilter('dokumentenart', $event)"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import InsurerStats from '@/components/InsurerStats.vue';

const emit = defineEmits([
  'filter-by-zustellungsweg',
  'filter-by-turnus',
  'filter-by-dokumentenart'
]);

// Debug function to get a sample insurer with safe properties
const getSampleInsurer = (insurer) => {
  if (!insurer) return null;
  
  return {
    id: insurer.id,
    name: insurer.name || 'Unbenannt',
    dokumentenart: insurer.dokumentenart || 'Keine',
    zustellungsweg: insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg || 'Keiner',
  };
};

// Define props
const props = defineProps({
  insurers: {
    type: Array,
    default: () => [],
    validator: (value) => {
      if (!Array.isArray(value)) {
        console.error('Invalid insurers prop: Expected array, got', typeof value);
        return false;
      }
      return true;
    }
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
  currentDate: {
    type: [Date, String, Number],
    default: () => new Date(),
  },
  simulatedDate: {
    type: [Date, String, Number],
    default: null,
  },
});

// Process insurers before passing to child component
const processedInsurers = computed(() => {
  if (!props.insurers || !Array.isArray(props.insurers)) {
    console.error('Invalid insurers data:', props.insurers);
    return [];
  }
  
  return props.insurers.map(insurer => ({
    ...insurer,
    dokumentenart: insurer.dokumentenart || null,
    zustellungsweg: insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg || null,
  }));
});

// Format current date for display
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
    console.error('Error formatting date:', e);
    return 'Unbekannt';
  }
});

// Handle filter events
const handleFilter = (type, value) => {
  console.log(`Filtering by ${type}:`, value);
  emit(`filter-by-${type}`, value);
};

// Debug log when component is mounted
onMounted(() => {
  console.log('StatisticsView mounted with insurers:', props.insurers);
  if (props.insurers?.length > 0) {
    console.log('Sample insurer data:', getSampleInsurer(props.insurers[0]));
  }
});
</script>
