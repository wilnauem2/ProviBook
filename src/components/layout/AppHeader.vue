<template>
<header class="bg-white shadow-sm sticky top-0 z-20">
  <div class="container mx-auto px-4">
    <!-- Top row with title, new button, and view controls -->
    <div class="flex justify-between items-center py-3">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ activeTab === 'history' ? 'Abrechnungen' : 'Versicherer' }}
        </h1>
        <button 
          v-if="activeTab !== 'history'"
          @click="emit('new-insurer')" 
          class="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Neuen Versicherer hinzufügen"
        >
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neu
        </button>
        <div v-if="!isProduction" class="text-xs text-blue-500 font-mono ml-2">Branch: {{ gitBranch }}</div>
      </div>
      
      <div v-if="activeTab !== 'history'" class="flex items-center space-x-3">
        <!-- Date Simulator -->
        <TestDateSimulator
          :modelValue="simulatedDate"
          @update:modelValue="(newValue) => emit('update:simulatedDate', newValue)"
          @change-date="(date) => emit('change-date', date)"
          @reset-date="() => emit('reset-date')"
          class="mr-2"
        />
        
        <!-- View Mode Toggle -->
        <div class="inline-flex rounded-md shadow-sm border border-gray-200 bg-white" role="group">
          <button
            @click="emit('update:view-mode', 'list')"
            :class="[
              'px-3 py-1 text-sm font-medium transition-colors',
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
            title="Listenansicht"
          >
            Liste
          </button>
          <button
            @click="emit('update:view-mode', 'stats')"
            :class="[
              'px-3 py-1 text-sm font-medium transition-colors',
              viewMode === 'stats' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
            title="Statistikansicht"
          >
            Statistik
          </button>
        </div>
        
        <!-- Export Button -->
        <button 
          v-if="viewMode !== 'stats'"
          @click="emit('export-pdf')"
          class="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
          title="Als PDF exportieren"
        >
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="border-b border-gray-200 -mb-px">
      <nav class="flex space-x-8">
        <button
          @click="emit('update:activeTab', 'main')"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
            activeTab === 'main'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Übersicht
          </span>
        </button>
        <button
          @click="emit('update:activeTab', 'history')"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
            activeTab === 'history'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Abrechnungen
          </span>
        </button>
        <button
          @click="emit('update:activeTab', 'settings')"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm focus:outline-none',
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Einstellungen
          </span>
        </button>
      </nav>
    </div>
  </div>
</header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import TestDateSimulator from '@/components/TestDateSimulator.vue';

const props = defineProps({
  isProduction: {
    type: Boolean,
    required: true,
  },
  gitBranch: {
    type: String,
    required: true,
  },
  simulatedDate: {
    type: Date,
    default: null,
  },
  activeTab: {
    type: String,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'stats'].includes(value)
  }
});

const emit = defineEmits([
  'update:activeTab',
  'update:view-mode',
  'new-insurer',
  'export-pdf'
]);
</script>
