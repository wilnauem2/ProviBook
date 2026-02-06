<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h3 class="text-base font-semibold text-slate-900">Aktivitätsverlauf</h3>
      <p class="text-xs text-slate-400 mt-0.5">Chronologische Übersicht aller Ereignisse</p>
    </div>

    <!-- Timeline -->
    <div class="timeline-wrapper">
      <div v-if="sortedEvents.length === 0" class="text-center py-12">
        <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center">
          <svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-sm text-slate-500">Noch keine Aktivitäten vorhanden</p>
      </div>

      <div v-else class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-5 top-0 bottom-0 w-px bg-slate-200"></div>

        <!-- Timeline Events -->
        <div class="space-y-4">
          <div
            v-for="event in sortedEvents"
            :key="event.id"
            class="relative flex gap-3 group animate-fade-in"
          >
            <!-- Timeline Dot -->
            <div class="relative flex-shrink-0">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
                :class="getEventIconClasses(event.type)"
              >
                <component :is="getEventIcon(event.type)" class="w-5 h-5" />
              </div>
              <!-- Status Badge for Settlement Events -->
              <div
                v-if="event.isLastInvoice"
                class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white"
                title="Aktuelle Abrechnung"
              >
                <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>

            <!-- Event Content Card -->
            <div class="flex-1 pb-4">
              <div
                class="bg-white rounded-xl border border-slate-200/80 p-3.5 transition-all duration-200 hover:shadow-soft hover:border-slate-300/80 cursor-pointer"
                :class="{ 'ring-1 ring-brand-200 border-brand-200 bg-brand-50/30': event.isLastInvoice }"
                @click="$emit('event-click', event)"
              >
                <!-- Event Header -->
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <span class="truncate">{{ event.title }}</span>
                      <span
                        v-if="event.isLastInvoice"
                        class="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded"
                      >
                        Aktuell
                      </span>
                    </h4>
                    <p class="text-xs text-slate-400 mt-0.5">
                      {{ formatDate(event.date) }}
                      <span v-if="event.time" class="ml-1">{{ event.time }}</span>
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      class="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      :class="getEventBadgeClasses(event.type)"
                    >
                      {{ getEventTypeLabel(event.type) }}
                    </span>
                    <!-- Delete Button -->
                    <button
                      v-if="event.deletable !== false && event.type === 'settlement' && !event.isLastInvoice"
                      @click.stop="$emit('delete-event', event)"
                      class="p-1 hover:bg-red-50 rounded-md text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      title="Aktivität löschen"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Event Description -->
                <p v-if="event.description" class="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {{ event.description }}
                </p>

                <!-- Event Note/Comment -->
                <div v-if="event.note" class="mt-2.5 px-3 py-2 bg-slate-50 rounded-lg border-l-2 border-slate-300">
                  <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{{ event.note }}</p>
                </div>

                <!-- Event Metadata -->
                <div v-if="event.metadata" class="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="(value, key) in event.metadata"
                    :key="key"
                    class="inline-flex items-center text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium"
                  >
                    {{ key }}: <span class="ml-0.5 text-slate-700">{{ value }}</span>
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
  @apply bg-white p-5 rounded-2xl border border-slate-200/80;
}

.timeline-header {
  @apply mb-5 pb-3 border-b border-slate-100;
}

.timeline-wrapper {
  @apply relative;
}
</style>
