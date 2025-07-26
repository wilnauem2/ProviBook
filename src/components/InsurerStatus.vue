<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="status.colorClass"
  >
    {{ status.text }}
  </span>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useInsurerUtils } from '@/composables/useInsurerUtils.js';

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
  },
  lastInvoices: {
    type: Object,
    default: () => ({})
  }
});

// Debug props
onMounted(() => {
  console.group('InsurerStatus mounted');
  console.log('Insurer:', props.insurer?.name || 'Unknown');
  console.log('currentDate:', props.currentDate);
  console.log('currentDate type:', Object.prototype.toString.call(props.currentDate));
  console.log('lastInvoices:', props.lastInvoices);
  console.groupEnd();
});

// Watch for changes to currentDate
watch(() => props.currentDate, (newDate) => {
  console.group('InsurerStatus - currentDate changed');
  console.log('Insurer:', props.insurer?.name || 'Unknown');
  console.log('New currentDate:', newDate);
  console.log('New currentDate type:', Object.prototype.toString.call(newDate));
  console.groupEnd();
}, { deep: true });

// Watch for changes to lastInvoices
watch(() => props.lastInvoices, (newInvoices) => {
  console.group('InsurerStatus - lastInvoices changed');
  console.log('Insurer:', props.insurer?.name || 'Unknown');
  console.log('New lastInvoices:', newInvoices);
  console.groupEnd();
}, { deep: true });

const status = computed(() => {
  console.group(`Status calculation for ${props.insurer?.name || 'unknown'}`);
  console.log('Using currentDate:', props.currentDate);
  console.log('Insurer turnus:', props.insurer?.turnus);
  
  try {
    const days = calculateDaysOverdue(props.insurer, props.currentDate, props.lastInvoices);
    console.log('Calculated days overdue:', days);
    
    let result;
    if (days > 5) {
      result = {
        text: `Überfällig (${days} Tage)`,
        colorClass: 'bg-red-100 text-red-800'
      };
    } else if (days > 0) {
      result = {
        text: `Mahnung (${days} Tage)`,
        colorClass: 'bg-yellow-100 text-yellow-800'
      };
    } else {
      result = {
        text: 'Im Zeitplan',
        colorClass: 'bg-green-100 text-green-800'
      };
    }
    
    console.log('Status result:', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('Error calculating status:', error);
    console.groupEnd();
    return {
      text: 'Fehler',
      colorClass: 'bg-gray-100 text-gray-800'
    };
  }
});
</script>
