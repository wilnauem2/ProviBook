<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="status.colorClass"
  >
    {{ status.text }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { useInsurerUtils } from '@/composables/useInsurerUtils';

const { calculateDaysOverdue } = useInsurerUtils();

const props = defineProps({
  insurer: {
    type: Object,
    required: true
  },
  lastInvoice: {
    type: Object,
    default: null
  },
  currentDate: {
    type: Date,
    required: true
  }
});

const status = computed(() => {
  const days = calculateDaysOverdue(props.insurer, props.currentDate);
  
  if (days > 5) {
    return {
      text: `Überfällig (${days} Tage)`,
      colorClass: 'bg-red-100 text-red-800'
    };
  }
  if (days > 0) {
    return {
      text: `Mahnung (${days} Tage)`,
      colorClass: 'bg-yellow-100 text-yellow-800'
    };
  }
  return {
    text: 'Im Zeitplan',
    colorClass: 'bg-green-100 text-green-800'
  };
});
</script>
