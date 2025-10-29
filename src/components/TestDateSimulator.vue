<template>
  <div class="bg-yellow-50 p-2 rounded-md border border-yellow-200 text-sm">
    <div class="flex items-center space-x-2">
      <!-- Previous Day Button -->
      <button
        @click="navigateDay(-1)"
        class="p-1 text-gray-600 hover:bg-yellow-100 rounded-full transition-colors"
        title="Previous day"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <!-- Date Display and Picker -->
      <div class="relative">
        <input
          type="date"
          :value="formattedDate"
          @input="updateDate($event.target.value)"
          class="border rounded px-2 py-1 text-xs w-32 bg-white"
        />
        <span class="absolute -bottom-5 left-0 right-0 text-xs text-center text-gray-500">
          {{ relativeDate }}
        </span>
      </div>
      
      <!-- Next Day Button -->
      <button
        @click="navigateDay(1)"
        class="p-1 text-gray-600 hover:bg-yellow-100 rounded-full transition-colors"
        title="Next day"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <!-- Today Button (only shown when not today) -->
      <button
        v-if="!isToday"
        @click="goToToday"
        class="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors whitespace-nowrap"
        title="Go to today"
      >
        Heute
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date()
  }
});

const emit = defineEmits(['update:modelValue', 'changeDate', 'resetDate']);

// Computed properties
const formattedDate = computed(() => {
  const date = props.modelValue || new Date();
  return date.toISOString().split('T')[0];
});

const today = new Date();
today.setHours(0, 0, 0, 0);

const isToday = computed(() => {
  if (!props.modelValue) return false;
  const date = new Date(props.modelValue);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
});

const relativeDate = computed(() => {
  if (!props.modelValue) return '';
  
  const date = new Date(props.modelValue);
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
});

// Methods
function updateDate(dateString) {
  if (!dateString) return;
  const newDate = new Date(dateString);
  emit('update:modelValue', newDate);  
  emit('changeDate', newDate);
}

function navigateDay(days) {
  const newDate = new Date(props.modelValue || new Date());
  newDate.setDate(newDate.getDate() + days);
  emit('update:modelValue', newDate);
  emit('changeDate', newDate);
}

function goToToday() {
  const today = new Date();
  emit('update:modelValue', today);
  emit('changeDate', today);
}

function resetDate() {
  emit('resetDate');
}
</script>
