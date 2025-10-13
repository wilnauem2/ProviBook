<template>
  <div class="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
      <div 
        v-if="icon" 
        class="p-2 rounded-lg"
        :class="`bg-${color}-100 text-${color}-600`"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
    </div>
    <div class="flex items-baseline">
      <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
      <p v-if="percentage" class="ml-2 text-sm font-medium text-gray-500">{{ percentage }}</p>
    </div>
    <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'blue'
  },
  percentage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
