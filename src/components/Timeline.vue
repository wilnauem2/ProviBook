<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h3 class="text-lg font-semibold text-gray-800">Aktivitätsverlauf</h3>
      <p class="text-sm text-gray-500 mt-1">Chronologische Übersicht aller Ereignisse</p>
    </div>

    <!-- Timeline -->
    <div class="timeline-wrapper">
      <div v-if="sortedEvents.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-2 text-sm text-gray-500">Noch keine Aktivitäten vorhanden</p>
      </div>

      <div v-else class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <!-- Timeline Events -->
        <div class="space-y-6">
          <div
            v-for="event in sortedEvents"
            :key="event.id"
            class="relative flex gap-4 group"
          >
            <!-- Timeline Dot -->
            <div class="relative flex-shrink-0">
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                :class="getEventIconClasses(event.type)"
              >
                <component :is="getEventIcon(event.type)" class="w-7 h-7" />
              </div>
              <!-- Status Badge for Settlement Events -->
              <div
                v-if="event.isLastInvoice"
                class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm"
                title="Aktuelle Abrechnung"
              >
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>

            <!-- Event Content Card -->
            <div class="flex-1 pb-8">
              <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md cursor-pointer group"
                :class="{ 'ring-2 ring-blue-400': event.isLastInvoice }"
                @click="$emit('event-click', event)"
              >
                <!-- Event Header -->
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h4 class="text-base font-semibold text-gray-900 flex items-center gap-2">
                      {{ event.title }}
                      <span
                        v-if="event.isLastInvoice"
                        class="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                      >
                        Aktuell
                      </span>
                    </h4>
                    <p class="text-sm text-gray-500 mt-0.5">
                      {{ formatDate(event.date) }}
                      <span v-if="event.time" class="ml-1">• {{ event.time }}</span>
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-medium px-2.5 py-1 rounded-full"
                      :class="getEventBadgeClasses(event.type)"
                    >
                      {{ getEventTypeLabel(event.type) }}
                    </span>
                    <!-- Delete Button -->
                    <button
                      v-if="event.deletable !== false && event.type === 'settlement' && !event.isLastInvoice"
                      @click.stop="$emit('delete-event', event)"
                      class="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600 transition-all duration-200"
                      title="Aktivität löschen"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Event Description -->
                <p v-if="event.description" class="text-sm text-gray-600 mt-2">
                  {{ event.description }}
                </p>

                <!-- Event Note/Comment -->
                <div v-if="event.note" class="mt-3 p-3 bg-gray-50 rounded-md border-l-4 border-gray-300">
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    <p class="text-sm text-gray-700 whitespace-pre-line">{{ event.note }}</p>
                  </div>
                </div>

                <!-- Event Metadata -->
                <div v-if="event.metadata" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="(value, key) in event.metadata"
                    :key="key"
                    class="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    <span class="font-medium">{{ key }}:</span>
                    <span class="ml-1">{{ value }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  showRelativeTime: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['event-click', 'delete-event']);

// Sort events by date (newest first)
const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateB - dateA;
  });
});

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  
  if (props.showRelativeTime) {
    return formatDistanceToNow(d, { addSuffix: true, locale: de });
  }
  
  return format(d, 'dd. MMMM yyyy', { locale: de });
};

// Get event type label
const getEventTypeLabel = (type) => {
  const labels = {
    settlement: 'Abrechnung',
    edit: 'Änderung',
    creation: 'Erstellt',
    note: 'Notiz',
    status: 'Status',
    document: 'Dokument',
  };
  return labels[type] || type;
};

// Get event icon component
const getEventIcon = (type) => {
  const icons = {
    settlement: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      }),
    ]),
    edit: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      }),
    ]),
    creation: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      }),
    ]),
    note: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      }),
    ]),
    status: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      }),
    ]),
    document: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      }),
    ]),
  };
  return icons[type] || icons.note;
};

// Get event icon background classes
const getEventIconClasses = (type) => {
  const classes = {
    settlement: 'bg-green-100 text-green-600',
    edit: 'bg-blue-100 text-blue-600',
    creation: 'bg-purple-100 text-purple-600',
    note: 'bg-yellow-100 text-yellow-600',
    status: 'bg-indigo-100 text-indigo-600',
    document: 'bg-red-100 text-red-600',
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};

// Get event badge classes
const getEventBadgeClasses = (type) => {
  const classes = {
    settlement: 'bg-green-100 text-green-700',
    edit: 'bg-blue-100 text-blue-700',
    creation: 'bg-purple-100 text-purple-700',
    note: 'bg-yellow-100 text-yellow-700',
    status: 'bg-indigo-100 text-indigo-700',
    document: 'bg-red-100 text-red-700',
  };
  return classes[type] || 'bg-gray-100 text-gray-700';
};
</script>

<style scoped>
.timeline-container {
  @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200;
}

.timeline-header {
  @apply mb-6 pb-4 border-b border-gray-200;
}

.timeline-wrapper {
  @apply relative;
}

/* Smooth transitions */
.timeline-container * {
  transition: all 0.2s ease-in-out;
}
</style>
