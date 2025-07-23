<template>
  <div>
    <!-- Main Insurer Detail Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto py-10">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-y-auto shadow-xl">
        <div class="p-8">
          <!-- Header with Name and Status -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div class="flex-1 min-w-0 mb-4 sm:mb-0">
              <div class="flex items-center">
                <div v-if="!isEditing || editField !== 'name'" class="flex-1">
                  <h2 class="text-2xl font-bold text-gray-900 truncate">{{ insurer.name }}</h2>
                </div>
                <div v-else class="flex-1">
                  <input 
                    v-model="editedName" 
                    class="w-full p-3 text-2xl font-bold border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Versicherer Name"
                    autofocus
                  />
                </div>
                <button 
                  v-if="!isEditing || editField !== 'name'" 
                  @click="startEditing('name')" 
                  class="ml-3 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                  title="Name bearbeiten"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div v-if="isEditing && editField === 'name'" class="mt-3 flex justify-end">
                <button @click="cancelEditing()" class="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3">Abbrechen</button>
                <button @click="saveField('name')" class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">Speichern</button>
              </div>
              
              <div class="flex items-center space-x-4">
                <!-- BiPRO Badge if applicable -->
                <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg border border-blue-200 shadow-sm flex items-center">
                  <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  BiPRO
                </span>
                
                <!-- Delete Button -->
                <button 
                  @click="confirmDelete" 
                  class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-2 transition-colors duration-200 hover:bg-red-50"
                  title="Versicherer löschen"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 mt-4">
              <div class="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                <div class="w-3 h-3 rounded-full mr-2" :class="getStatusColor(insurer, currentDate)"></div>
                <span class="text-sm font-medium text-gray-700">{{ getStatusText(insurer, currentDate) }}</span>
              </div>
              <span v-if="insurer.bipro" class="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg border border-blue-200 shadow-sm flex items-center">
                <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="font-semibold">BiPRO</span>
                <span v-if="insurer.bipro_version" class="ml-1 opacity-75">{{ insurer.bipro_version }}</span>
              </span>
            </div>
          </div>

          <!-- Commentary Section -->
          <div class="mb-8 border-b pb-6 border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Kommentar</h3>
              <button v-if="!isEditing || editField !== 'comment'" 
                @click="startEditing('comment')" 
                class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                title="Kommentar bearbeiten"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div v-if="isEditing && editField === 'comment'">
              <textarea 
                v-model="editedComment" 
                class="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                rows="4"
                placeholder="Kommentar hinzufügen..."
                autofocus
              ></textarea>
              <div class="mt-3 flex justify-end">
                <button @click="cancelEditing()" class="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-3">Abbrechen</button>
                <button @click="saveField('comment')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
              </div>
            </div>
            <div v-else>
              <p v-if="insurer.comment" class="text-gray-700">{{ insurer.comment }}</p>
              <p v-else class="text-gray-500 italic">Kein Kommentar vorhanden</p>
            </div>
          </div>

          <!-- Abrechnung Details -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsdetails
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Turnus Field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium">Turnus</span>
                  <button 
                    v-if="!isEditing" 
                    @click="startEditing('turnus')" 
                    class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                    title="Turnus bearbeiten"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div v-if="isEditing && editField === 'turnus'">
                  <select 
                    v-model="editedTurnus" 
                    class="w-full p-2 border border-gray-300 rounded"
                    autofocus
                  >
                    <option value="monatlich">Monatlich</option>
                    <option value="quartalsweise">Quartalsweise</option>
                    <option value="halbjährlich">Halbjährlich</option>
                    <option value="jährlich">Jährlich</option>
                  </select>
                  <div class="mt-3 flex justify-end">
                    <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                    <button @click="saveField('turnus')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                  </div>
                </div>
                <p v-else class="text-gray-700">{{ formattedTurnus }}</p>
              </div>
              
              <!-- Standard-Dokumentenweg Field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium">Standard-Dokumentenweg</span>
                  <button 
                    v-if="!isEditing" 
                    @click="startEditing('bezugsweg')" 
                    class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                    title="Standard-Dokumentenweg bearbeiten"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div v-if="isEditing && editField === 'bezugsweg'">
                  <select 
                    v-model="editedBezugsweg" 
                    class="w-full p-2 border border-gray-300 rounded"
                    autofocus
                  >
                    <option value="E-Mail">E-Mail</option>
                    <option value="Post">Post</option>
                    <option value="BiPRO">BiPRO</option>
                    <option value="Extranet">Extranet</option>
                  </select>
                  <div class="mt-3 flex justify-end">
                    <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                    <button @click="saveField('bezugsweg')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                  </div>
                </div>
                <p v-else class="text-gray-700">{{ insurer.bezugsweg || 'Nicht festgelegt' }}</p>
              </div>
              
              <!-- Standard-Formate Field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium">Standard-Formate</span>
                  <button 
                    v-if="!isEditing" 
                    @click="startEditing('dokumentenart')" 
                    class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1.5 transition-colors duration-200"
                    title="Standard-Formate bearbeiten"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div v-if="isEditing && editField === 'dokumentenart'">
                  <div class="space-y-2">
                    <div v-for="format in availableFormats" :key="format.value" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :id="`format-${format.value}`" 
                        :value="format.value" 
                        v-model="editedDokumentenart"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      >
                      <label :for="`format-${format.value}`" class="ml-2 block text-sm text-gray-700">{{ format.label }}</label>
                    </div>
                  </div>
                  <div class="mt-3 flex justify-end">
                    <button @click="cancelEditing()" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded mr-2">Abbrechen</button>
                    <button @click="saveField('dokumentenart')" class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Speichern</button>
                  </div>
                </div>
                <div v-else class="flex flex-wrap gap-2">
                  <span 
                    v-for="format in formattedDokumentenart" 
                    :key="format" 
                    class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md border border-gray-200"
                  >
                    {{ format }}
                  </span>
                  <span v-if="!formattedDokumentenart.length" class="text-gray-500 italic">Keine Formate festgelegt</span>
                </div>
              </div>
              
              <!-- Letzte Abrechnung Field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium">Letzte Abrechnung</span>
                </div>
                <div class="flex items-center">
                  <p class="text-gray-700">{{ formattedLastSettlement }}</p>
                  <span v-if="insurer.settlement_note" class="ml-2 text-gray-500 text-sm italic">({{ insurer.settlement_note }})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
            <button @click="openDatePicker" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Abrechnung erfolgt
            </button>
                      <button @click="handleClose" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none">
              Schliessen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Picker Dialog -->
    <div v-if="showDatePicker" class="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm">
        <h3 class="text-lg font-semibold mb-4">Datum der Abrechnung</h3>
        <input type="date" ref="dateInputRef" v-model="selectedDate" class="w-full p-2 border rounded-md mb-2">
        <textarea v-model="settlementNote" placeholder="Notiz hinzufügen..." class="w-full p-2 border rounded-md mb-4" rows="3"></textarea>
        <div class="flex justify-end space-x-3">
          <button type="button" @click="handleCancel" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Abbrechen</button>
          <button type="button" @click="handleDateSubmit()" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Bestätigen</button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <div class="flex items-center mb-6">
          <div class="bg-red-100 p-2 rounded-full mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Versicherer löschen</h3>
        </div>
        <p class="text-gray-700 mb-8">Sind Sie sicher, dass Sie den Versicherer <span class="font-semibold">"{{ insurer.name }}"</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="flex justify-end space-x-4">
          <button @click="showDeleteConfirmation = false" class="px-5 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Abbrechen
          </button>
          <button @click="deleteInsurer()" class="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
            Löschen bestätigen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>