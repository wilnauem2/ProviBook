<template>
  <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-lg border border-gray-200 shadow-xs">
    <div class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="text-sm font-medium text-gray-600">Umgebung</span>
      </div>
      
      <div class="inline-flex rounded-lg overflow-hidden border border-gray-200" role="group">
        <button
          v-for="env in environments"
          :key="env.id"
          @click="switchEnvironment(env.id)"
          :class="[
            'px-4 py-2 text-sm font-medium flex items-center transition-colors duration-150',
            currentEnvironment === env.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50',
            env.id === 'production' ? 'border-r border-gray-200' : ''
          ]"
        >
          <svg v-if="env.id === 'production'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
          {{ env.label }}
        </button>
      </div>
    </div>
    
    <div class="flex items-center space-x-3">
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {{ username.charAt(0).toUpperCase() }}
        </div>
        <div class="ml-2 text-sm text-gray-700">
          <div class="font-medium">{{ username }}</div>
        </div>
      </div>
      <div class="h-6 border-l border-gray-200"></div>
      <button
        @click="handleLogout"
        class="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors duration-150"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Abmelden
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentEnvironment: {
    type: String,
    required: true,
    validator: (value) => ['production', 'test'].includes(value)
  },
  username: {
    type: String,
    required: true,
    default: 'Benutzer'
  }
});

const emit = defineEmits(['update:currentEnvironment', 'logout']);

const environments = [
  { id: 'production', label: 'Produktion' },
  { id: 'test', label: 'Test' }
];

const switchEnvironment = (envId) => {
  console.log(`Switching environment to: ${envId}`);
  emit('update:currentEnvironment', envId);
};

const handleLogout = () => {
  emit('logout');
};
</script>
