<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ activeTab === 'history' ? 'Abrechnungen' : 'Versicherungsübersicht' }}
        </h1>
        <div v-if="!isProduction" class="text-xs text-blue-500 font-mono ml-4">Branch: {{ gitBranch }}</div>
      </div>
      
      <div class="border-b border-gray-200 -mb-px">
        <nav class="flex space-x-8">
          <button
            @click="$emit('update:activeTab', 'main')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
              activeTab === 'main'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Übersicht
          </button>
          <button
            @click="$emit('update:activeTab', 'history')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Abrechnungen
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isProduction: {
    type: Boolean,
    required: true,
  },
  gitBranch: {
    type: String,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
});

defineEmits(['update:activeTab']);
</script>
