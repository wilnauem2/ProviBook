<template>
  <div class="p-4 bg-white rounded-lg shadow mb-4">
    <h3 class="text-lg font-medium mb-4">BiPRO Tester</h3>
    
    <div v-if="insurers.length > 0" class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Wähle einen Versicherer:</label>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="insurer in insurers" 
          :key="insurer.id"
          @click="toggleBiproForInsurer(insurer)"
          class="px-3 py-2 text-sm rounded-md"
          :class="insurer.bipro ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200'"
        >
          {{ insurer.name }}
          <span v-if="insurer.bipro" class="ml-2 text-xs bg-indigo-200 px-1 rounded">BiPRO</span>
        </button>
      </div>
    </div>
    
    <div v-else class="text-gray-500">
      Keine Versicherer gefunden.
    </div>
    
    <div v-if="message" class="mt-4 p-3 rounded" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInsurerStore } from '../stores/insurerStore';

const insurerStore = useInsurerStore();
const { insurers: insurersData, updateInsurer } = insurerStore;

const insurers = computed(() => insurersData.value || []);
const message = ref('');
const messageType = ref('');

const toggleBiproForInsurer = async (insurer) => {
  message.value = '';
  try {
    // Toggle the bipro property
    const newBiproValue = !insurer.bipro;
    const result = await updateInsurer(insurer.id, { bipro: newBiproValue });
    
    if (result) {
      message.value = `BiPRO für ${insurer.name} wurde ${newBiproValue ? 'aktiviert' : 'deaktiviert'}.`;
      messageType.value = 'success';
    } else {
      message.value = `Fehler beim Aktualisieren von ${insurer.name}.`;
      messageType.value = 'error';
    }
  } catch (error) {
    message.value = `Fehler: ${error.message}`;
    messageType.value = 'error';
  }
  
  // Clear message after 3 seconds
  setTimeout(() => {
    message.value = '';
  }, 3000);
};
</script>
