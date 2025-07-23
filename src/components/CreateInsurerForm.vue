<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity flex justify-center items-center z-50" @click.self="$emit('close')">
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-5 border-b border-gray-200 rounded-t-lg">
        <h3 class="text-xl font-semibold text-gray-900">
          Neuen Versicherer anlegen
        </h3>
        <button @click="$emit('close')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="md:col-span-2">
              <label for="insurer-name" class="block mb-2 text-sm font-medium text-gray-900">Name des Versicherers</label>
              <input type="text" id="insurer-name" v-model="insurerData.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="z.B. Allianz" required>
            </div>
            
            <!-- Comment -->
            <div class="md:col-span-2">
              <label for="insurer-comment" class="block mb-2 text-sm font-medium text-gray-900">Kommentar</label>
              <textarea id="insurer-comment" v-model="insurerData.comment" rows="4" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Kommentar zum Versicherer hinzufügen..."></textarea>
            </div>

            <!-- Turnus -->
            <div>
              <label for="insurer-turnus" class="block mb-2 text-sm font-medium text-gray-900">Turnus (in Tagen)</label>
              <input type="number" id="insurer-turnus" v-model.number="insurerData.turnus" min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
            </div>

            <!-- Bezugsweg -->
            <div>
              <label for="insurer-bezugsweg" class="block mb-2 text-sm font-medium text-gray-900">Standard-Dokumentenweg</label>
              <input type="text" id="insurer-bezugsweg" v-model="insurerData.bezugsweg" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="z.B. E-Mail">
            </div>
          </div>

          <!-- Dokumentenart -->
          <div>
            <label class="block mb-3 text-sm font-medium text-gray-900">Standard-Formate</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="docType in availableDokumentenarten" :key="docType">
                <label class="inline-flex items-center w-full">
                  <input type="checkbox" :value="docType" v-model="insurerData.dokumentenart" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50">
                  <span class="ml-3 text-sm font-medium text-gray-700">{{ docType }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Speichern</button>
          <button @click="$emit('close')" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['close', 'save']);

const insurerData = ref({
  name: '',
  comment: '', // New comment field
  turnus: 30, // Default to 30 days
  bezugsweg: 'E-Mail',
  dokumentenart: ['PDF']
});

const availableDokumentenarten = ['CSV', 'PDF', 'XLS', 'XML', 'Papier'];

const handleSubmit = () => {
  if (!insurerData.value.name || !insurerData.value.turnus) {
    alert('Name und Turnus des Versicherers sind erforderlich.');
  } else {
    emit('save', { ...insurerData.value });
  }
};
</script>
