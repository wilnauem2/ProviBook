<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-900">Umgebung</h3>
      <div class="mt-2 flex items-center justify-between">
        <span class="text-sm text-gray-600">
          Datenmodus: <span class="font-semibold" :class="isProd ? 'text-red-600' : 'text-green-600'">{{ currentMode === 'production' ? 'Produktion' : 'Test' }}</span>
        </span>
        <button
          @click="toggleMode"
          class="px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="isProd ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500' : 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'"
        >
          Zu {{ isProd ? 'Test' : 'Produktion' }} wechseln
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentMode: {
    type: String,
    required: true,
    validator: (value) => ['production', 'test'].includes(value),
  },
});

const emit = defineEmits(['switch-mode']);

const isProd = computed(() => props.currentMode === 'production');

const toggleMode = () => {
  const newMode = isProd.value ? 'test' : 'production';
  emit('switch-mode', newMode);
};
</script>
