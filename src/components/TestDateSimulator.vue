<template>
  <div class="test-date-simulator bg-white rounded-lg border border-gray-200 p-3 shadow-sm" v-if="currentEnvironment === 'test'">
    <div class="flex flex-col space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Test Datum</span>
        <button 
          @click="resetDate" 
          class="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
        >
          Heute
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="decreaseDate" 
          :disabled="!canDecrease"
          class="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-sm font-medium text-gray-900 flex-1 text-center">{{ formatDate(testDate) }}</span>
        <button 
          @click="increaseDate" 
          :disabled="!canIncrease"
          class="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const currentEnvironment = import.meta.env.MODE;
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

const props = defineProps({
  modelValue: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['update:modelValue'])

const testDate = ref(props.modelValue)

const canDecrease = computed(() => testDate.value > new Date('2023-01-01'))
const canIncrease = computed(() => testDate.value < new Date('2025-12-31'))

const formatDate = (date) => {
  const formatted = format(date, 'dd.MM.yyyy', { locale: de })
  console.log('Formatted date:', formatted)
  return formatted
}

const decreaseDate = () => {
  if (canDecrease.value) {
    const newDate = new Date(testDate.value.getTime() - 24 * 60 * 60 * 1000)
    console.log('Decreasing date to:', newDate)
    testDate.value = newDate
    emit('update:modelValue', newDate)
    
    // Force re-render
    setTimeout(() => {
      testDate.value = newDate
      emit('update:modelValue', newDate)
    }, 0)
  }
}

const increaseDate = () => {
  if (canIncrease.value) {
    const newDate = new Date(testDate.value.getTime() + 24 * 60 * 60 * 1000)
    console.log('Increasing date to:', newDate)
    testDate.value = newDate
    emit('update:modelValue', newDate)
    
    // Force re-render
    setTimeout(() => {
      testDate.value = newDate
      emit('update:modelValue', newDate)
    }, 0)
  }
}

const resetDate = () => {
  // Get the current date from the browser
  const now = new Date()
  console.log('Resetting to:', now)
  
  // Update the date immediately
  testDate.value = now
  emit('update:modelValue', now)
  
  // Force a re-render
  setTimeout(() => {
    testDate.value = now
    emit('update:modelValue', now)
  }, 0)
}

watch(() => props.modelValue, (newDate) => {
  console.log('Model value changed to:', newDate)
  testDate.value = new Date(newDate.getTime())
})
</script>

<style scoped>
.test-date-simulator {
  width: 100%;
  max-width: 100%;
  transition: all 0.2s ease;
}

.test-date-simulator:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
