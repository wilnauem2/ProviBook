<template>
  <div v-if="insurer" class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40 overflow-y-auto" @click.self="handleClose">

    <!-- Main Insurer Detail Modal -->
    <div class="bg-gray-50 rounded-xl w-[60vw] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all" role="dialog" aria-modal="true" :aria-labelledby="`insurer-name-${insurer.id}`">
      
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white/70 backdrop-blur-lg z-10 border-b border-gray-200 px-6 py-4 sm:px-8">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div v-if="!isEditing || editField !== 'name'" class="flex items-center gap-3">
              <h2 :id="`insurer-name-${insurer.id}`" class="text-xl sm:text-2xl font-bold text-gray-900 truncate">{{ insurer.name }}</h2>
              <button @click="startEditing('name')" class="text-gray-400 hover:text-blue-600 transition-colors duration-200" title="Name bearbeiten">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
              </button>
            </div>
            <div v-else>
              <input v-model="editedName" class="w-full text-xl sm:text-2xl font-bold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Versicherer Name" autofocus/>
              <div class="mt-2 flex justify-end gap-2">
                <button @click="cancelEditing()" class="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Abbrechen</button>
                <button @click="saveField('name')" class="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 sm:gap-4 ml-4">
            <div class="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border" :class="statusInfo.badgeClass">
              <svg class="w-2.5 h-2.5" :class="statusInfo.dotClass" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"></circle></svg>
              <span>{{ statusInfo.text }}</span>
            </div>
            <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              BiPRO
            </span>
            <button @click="confirmDelete" class="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-50" title="Versicherer löschen">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-800 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100" title="Schliessen">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-8">
        <!-- Redesigned Summary Bar -->
        <div class="bg-white rounded-xl shadow-md p-4 mb-8 border border-gray-200/80">
          <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-4">

            <!-- Column 1: Last Invoice -->
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <div>
                <dt class="text-xs font-medium text-gray-500">Letzte Abrechnung</dt>
                <dd class="text-lg font-bold text-gray-900">{{ formattedLastInvoiceDate }}</dd>
              </div>
            </div>

            <!-- Column 2: Turnus -->
            <div class="border-l border-r border-gray-200 px-4">
              <dt class="text-xs font-medium text-gray-500">Turnus</dt>
              <dd class="text-base font-semibold text-gray-800">{{ formattedTurnus }}</dd>
            </div>

            <!-- Column 3: Action -->
            <div class="flex items-center justify-start md:justify-end gap-4">
              <button @click="showDatePicker = true" class="flex-shrink-0 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                Abrechnung erledigt
              </button>
            </div>

          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column: Overview -->
          <div class="space-y-8">
            <!-- Kommentar Card -->
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Kommentar</h3>
                <button @click="startEditing('comment')" class="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">Bearbeiten</button>
              </div>
              <div v-if="isEditing && editField === 'comment'">
                <textarea v-model="editedComment" class="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" rows="4" placeholder="Kommentar hier eingeben..."></textarea>
                <div class="mt-2 flex justify-end gap-2">
                  <button @click="cancelEditing()" class="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Abbrechen</button>
                  <button @click="saveField('comment')" class="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                </div>
              </div>
              <div v-else>
                <p v-if="insurer.comment" class="text-gray-600 whitespace-pre-wrap">{{ insurer.comment }}</p>
                <p v-else class="text-gray-400 italic">Kein Kommentar vorhanden.</p>
              </div>
            </div>

            <!-- Abrechnungsverlauf Card -->
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Abrechnungsverlauf</h3>
              <ul v-if="sortedLocalSettlements.length > 0" class="space-y-3">
                <li v-for="settlement in sortedLocalSettlements" :key="settlement.id" 
                    @click="showSettlementDetails(settlement)"
                    class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer group"
                    :class="{ 'bg-blue-50': settlement.isLastInvoice }">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium" :class="{ 'text-blue-700': settlement.isLastInvoice, 'text-gray-700': !settlement.isLastInvoice }">
                      {{ format(settlement.date.toDate ? settlement.date.toDate() : new Date(settlement.date), 'dd.MM.yyyy') }}
                      <span v-if="settlement.isLastInvoice" class="ml-1 text-xs font-normal text-blue-600">(Aktuell)</span>
                    </span>
                    <svg v-if="settlement.note && !settlement.isLastInvoice" class="w-4 h-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="Mit Kommentar">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <svg v-else-if="settlement.isLastInvoice" class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="Aktuelle Abrechnung">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <button v-if="!settlement.isLastInvoice" @click.stop="confirmSettlementDelete(settlement.id)" class="text-gray-400 hover:text-red-500 transition-colors duration-200" title="Diesen Eintrag löschen">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                  <span v-else class="w-5"></span>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-400 italic">Noch keine Abrechnungen erfasst.</p>
            </div>
          </div>

          <!-- Right Column: Details -->
          <div class="space-y-8">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Details zur Abrechnung</h3>
              <dl class="space-y-4">
                <!-- Turnus -->
                <div>
                  <div class="flex justify-between items-center group">
                    <dt class="text-sm font-medium text-gray-500">Turnus</dt>
                    <button v-if="insurer.turnus" @click="deleteField('turnus')" class="invisible group-hover:visible text-gray-400 hover:text-red-600 transition-opacity duration-200" title="Turnus löschen">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <button @click="startEditing('turnus')" class="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">Bearbeiten</button>
                  </div>
                  <dd v-if="!isEditing || editField !== 'turnus'" class="text-sm text-gray-900 font-semibold">{{ insurer.turnus ? formatTurnus(insurer.turnus) : 'Kein Turnus festgelegt' }}</dd>
                  <div v-else>
                    <select 
                      v-model="editedTurnus" 
                      class="w-32 text-base font-semibold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      autofocus
                    >
                      <option v-for="option in turnusOptions" :key="option" :value="option">
                        {{ option }}
                      </option>
                    </select>
                    <div class="mt-2 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Abbrechen</button>
                      <button @click="saveField('turnus')" class="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Bezugsweg -->
                <div>
                  <div class="flex justify-between items-center group">
                    <dt class="text-sm font-medium text-gray-500">Bezugsweg</dt>
                    <button v-if="insurer.bezugsweg" @click="deleteField('bezugsweg')" class="invisible group-hover:visible text-gray-400 hover:text-red-600 transition-opacity duration-200" title="Bezugsweg löschen">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <button @click="startEditing('bezugsweg')" class="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">Bearbeiten</button>
                  </div>
                  <dd v-if="!isEditing || editField !== 'bezugsweg'" class="text-sm text-gray-900 font-semibold">{{ insurer.bezugsweg || 'Keine Angabe' }}</dd>
                  <div v-else>
                    <select 
                      v-model="editedBezugsweg" 
                      class="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option v-for="option in bezugswegOptions" :key="option" :value="option">
                        {{ option }}
                      </option>
                    </select>
                    <div class="mt-2 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Abbrechen</button>
                      <button @click="saveField('bezugsweg')" class="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Dokumentenart -->
                <div class="pt-4">
                  <div class="flex justify-between items-center group">
                    <dt class="text-sm font-medium text-gray-500">Dokumentenart</dt>
                    <button v-if="insurer.dokumentenart" @click="deleteField('dokumentenart')" class="invisible group-hover:visible text-gray-400 hover:text-red-600 transition-opacity duration-200" title="Dokumentenart löschen">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <button @click="startEditing('dokumentenart')" class="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">Bearbeiten</button>
                  </div>
                  <div v-if="!isEditing || editField !== 'dokumentenart'">
                    <div v-if="insurer.dokumentenart && getNormalizedDocTypes(insurer.dokumentenart).length" class="flex flex-wrap gap-2 mt-2">
                      <span v-for="docType in getNormalizedDocTypes(insurer.dokumentenart)" :key="docType" 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="docTypeColors[docType]?.classes || 'bg-gray-100 text-gray-800'">
                        <svg v-if="docTypeColors[docType]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="docTypeColors[docType]?.icon"></svg>
                        {{ docType }}
                      </span>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic mt-2">Keine Angabe</p>
                  </div>
                  <div v-else>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      <div v-for="docType in allDocTypes" :key="docType" class="flex items-center">
                        <input type="checkbox" :id="`doc-type-${docType}`" :value="docType" v-model="editedDokumentenart" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <label :for="`doc-type-${docType}`" class="ml-2 text-sm text-gray-700">{{ docType }}</label>
                      </div>
                    </div>
                    <div class="mt-3 flex justify-end gap-2">
                      <button @click="cancelEditing()" class="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Abbrechen</button>
                      <button @click="saveField('dokumentenart')" class="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                    </div>
                  </div>
                </div>

                <!-- Vemapool -->
                <div class="pt-4 border-t border-gray-200 mt-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Vemapool</dt>
                      <dd class="text-xs text-gray-500 mt-1">Aktivieren, falls Vemapool-Stempel angezeigt werden soll</dd>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="editedVemapool" class="sr-only peer" @change="saveField('vemapool')">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Picker Modal -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <h3 class="text-lg font-medium mb-4">Abrechnungsdatum wählen</h3>
        <input type="date" v-model="selectedDate" class="w-full p-2 border rounded-md mb-4"/>
        <textarea v-model="settlementNote" class="w-full p-2 border rounded-md mb-4" placeholder="Optionale Notiz..."></textarea>
        <div class="flex justify-end gap-3">
          <button @click="handleCancel" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Abbrechen</button>
          <button @click="handleDateSubmit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Bestätigen</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-medium mb-2">Versicherer löschen?</h3>
        <p class="text-sm text-gray-600 mb-4">Möchten Sie den Versicherer "{{ insurer.name }}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteConfirmation = false" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Abbrechen</button>
          <button @click="deleteInsurer" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Delete Confirmation Modal -->
    <div v-if="showSettlementDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-medium mb-2">Abrechnung löschen?</h3>
        <p class="text-sm text-gray-600 mb-4">Möchten Sie diesen Abrechnungseintrag wirklich löschen?</p>
        <div class="flex justify-end gap-3">
          <button @click="cancelSettlementDelete" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Abbrechen</button>
          <button @click="executeDeleteSettlement" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Löschen</button>
        </div>
      </div>
    </div>

    <!-- Settlement Details Modal -->
    <div v-if="showSettlementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showSettlementModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Abrechnungsdetails</h3>
            <button @click="showSettlementModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Datum</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedSettlement ? format(selectedSettlement.date.toDate ? selectedSettlement.date.toDate() : new Date(selectedSettlement.date), 'dd.MM.yyyy') : '' }}</dd>
            </div>
            
            <div v-if="selectedSettlement?.note">
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ selectedSettlement.note }}</dd>
            </div>
            <div v-else>
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-500 italic">Kein Kommentar vorhanden</dd>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showSettlementModal = false" type="button" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useInsurerStore } from '@/stores/insurerStore.js';
import { useInsurerUtils, allDocTypes, docTypeColors } from '@/composables/useInsurerUtils.js';
import { format, differenceInDays, addDays } from 'date-fns';

const props = defineProps({
  insurer: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  },
  dataMode: {
    type: String,
    default: 'production'
  }
});

const emit = defineEmits(['close', 'delete-insurer', 'settlement-completed', 'update:insurer']);

const insurerStore = useInsurerStore();
const { getStatusColor, getStatusText, calculateDaysOverdue, getNormalizedDocTypes, formatLastInvoice } = useInsurerUtils();

// Compute status info for the current insurer
const statusInfo = computed(() => {
  const daysOverdue = calculateDaysOverdue(props.insurer);
  
  if (daysOverdue > 5) {
    return {
      text: 'Überfällig',
      badgeClass: 'border-red-200 bg-red-50 text-red-800',
      dotClass: 'text-red-500'
    };
  } else if (daysOverdue > 0) {
    return {
      text: 'Fällig',
      badgeClass: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      dotClass: 'text-yellow-500'
    };
  } else {
    return {
      text: 'Aktuell',
      badgeClass: 'border-green-200 bg-green-50 text-green-800',
      dotClass: 'text-green-500'
    };
  }
});

// Editing state
const isEditing = ref(false);
const editField = ref(null);

// State
const localLastInvoice = computed(() => insurerStore.lastInvoices[props.insurer.id]);

const sortedLocalSettlements = computed(() => {
  // Start with a copy of the local settlement history
  let settlements = [...localSettlementHistory.value];
  
  // If we have a last invoice that's not already in the history, include it
  if (localLastInvoice.value && localLastInvoice.value.date) {
    const lastInvoiceDate = localLastInvoice.value.date?.toDate ? 
      localLastInvoice.value.date.toDate() : new Date(localLastInvoice.value.date);
    
    // Check if the last invoice is already in the history
    const isInHistory = settlements.some(settlement => {
      const settlementDate = settlement.date?.toDate ? 
        settlement.date.toDate() : new Date(settlement.date);
      return settlementDate.getTime() === lastInvoiceDate.getTime();
    });
    
    // If not in history, add it
    if (!isInHistory) {
      settlements.push({
        id: 'last_invoice',
        date: localLastInvoice.value.date,
        note: localLastInvoice.value.note || 'Letzte Abrechnung',
        isLastInvoice: true
      });
    }
  }
  
  // Sort by date (newest first)
  return settlements.sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateB - dateA;
  });
});
const localSettlementHistory = ref([]);
const showDatePicker = ref(false);
const selectedDate = ref('');
const settlementNote = ref('');
const showDeleteConfirmation = ref(false);
const showSettlementDeleteConfirmation = ref(false);
const settlementToDeleteId = ref(null);
const showSettlementModal = ref(false);
const selectedSettlement = ref(null);

// Form fields
const editedName = ref('');
const editedComment = ref('');
const editedTurnus = ref('');
const editedBezugsweg = ref('');
const editedDokumentenart = ref([]);
const editedVemapool = ref(false);

// Options
const turnusOptions = ['7-tägig', '14-tägig', '31-tägig', 'Jährlich'];
const bezugswegOptions = ['E-Mail', 'Post', 'BiPRO', 'Maklerportal/GetMyInvoices', 'Sonstiges'];

// Initialize form fields when insurer changes
watch(() => props.insurer, (newInsurer) => {
  if (newInsurer) {
    editedName.value = newInsurer.name || '';
    editedComment.value = newInsurer.comment || '';
    editedTurnus.value = newInsurer.turnus || '';
    editedBezugsweg.value = newInsurer.bezugsweg || '';
    editedDokumentenart.value = getNormalizedDocTypes(newInsurer.dokumentenart);
    editedVemapool.value = newInsurer.vemapool || false;
  }
}, { immediate: true });

// Helper function to check if a field is empty
const isFieldEmpty = (field) => {
  return field === undefined || field === null || field === '' || (Array.isArray(field) && field.length === 0);
};

const handleClose = () => {
  emit('close');
};

const showSettlementDetails = (settlement) => {
  selectedSettlement.value = settlement;
  showSettlementModal.value = true;
};

const startEditing = (field) => {
  isEditing.value = true;
  editField.value = field;
  
  switch(field) {
    case 'name':
      editedName.value = props.insurer.name || '';
      break;
    case 'comment':
      editedComment.value = props.insurer.comment || '';
      break;
    case 'turnus':
      editedTurnus.value = props.insurer.turnus || '';
      break;
    case 'bezugsweg':
      editedBezugsweg.value = props.insurer.bezugsweg || '';
      break;
    case 'dokumentenart':
      editedDokumentenart.value = getNormalizedDocTypes(props.insurer.dokumentenart);
      break;
    case 'vemapool':
      editedVemapool.value = props.insurer.vemapool || false;
      break;
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editField.value = null;
};

const formatTurnus = (turnus) => {
  if (!turnus) return 'Kein Turnus festgelegt';
  
  // If it's already in the correct format, return as is
  if (String(turnus).includes('-tägig') || turnus === 'Jährlich') {
    return turnus;
  }
  
  // Otherwise, try to extract the number and add '-tägig'
  const days = String(turnus).replace(/[^0-9]/g, '');
  return days ? `${days}-tägig` : turnus;
};

const formattedTurnus = computed(() => {
  return formatTurnus(props.insurer.turnus);
});

const deleteField = async (field) => {
  try {
    await insurerStore.updateInsurer(props.insurer.id, { [field]: null });
    // Update local state
    if (field === 'dokumentenart') {
      editedDokumentenart.value = [];
    }
  } catch (err) {
    console.error('Error deleting field:', err);
  }
};

const saveField = async (field) => {
  try {
    let updateData = {};
    
    switch(field) {
      case 'name':
        updateData.name = editedName.value.trim();
        break;
      case 'comment':
        updateData.comment = editedComment.value.trim();
        break;
      case 'turnus':
        // Save the exact value from the dropdown
        updateData.turnus = editedTurnus.value;
        // Update the local insurer object to trigger a re-render
        props.insurer.turnus = editedTurnus.value;
        // Force update the formattedTurnus computed property
        formattedTurnus.value = formatTurnus(editedTurnus.value);
        break;
      case 'bezugsweg':
        updateData.bezugsweg = editedBezugsweg.value;
        break;
      case 'dokumentenart':
        updateData.dokumentenart = editedDokumentenart.value;
        break;
      case 'vemapool':
        updateData.vemapool = editedVemapool.value;
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await insurerStore.updateInsurer(props.insurer.id, updateData);
    }
    
    cancelEditing();
  } catch (err) {
    console.error('Error saving field:', err);
  }
};

const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};

const deleteInsurer = async () => {
  const success = await insurerStore.deleteInsurer(props.insurer.id);
  if (success) {
    showDeleteConfirmation.value = false;
    emit('delete-insurer', props.insurer.id);
    handleClose();
  }
};

const confirmSettlementDelete = (settlementId) => {
  settlementToDeleteId.value = settlementId;
  showSettlementDeleteConfirmation.value = true;
};

const cancelSettlementDelete = () => {
  settlementToDeleteId.value = null;
  showSettlementDeleteConfirmation.value = false;
};

const executeDeleteSettlement = async () => {
  if (settlementToDeleteId.value) {
    await insurerStore.deleteSettlement(props.insurer.id, settlementToDeleteId.value);
    
    // Manually update local state for immediate UI feedback
    localSettlementHistory.value = localSettlementHistory.value.filter(s => s.id !== settlementToDeleteId.value);
    
    // Check if this was the last settlement and update UI accordingly
    if (localSettlementHistory.value.length === 0) {
      // If we just deleted the last settlement, ensure the localLastInvoice is updated
      // This is redundant with the store update but ensures UI consistency
      emit('settlement-completed', { insurer: props.insurer, last_invoice: null });
    }
    
    cancelSettlementDelete();
  }
};

const handleCancel = () => {
  showDatePicker.value = false;
  settlementNote.value = '';
};

const handleDateSubmit = async () => {
  if (!selectedDate.value) return;

  const newInvoiceData = {
    date: new Date(selectedDate.value),
    note: settlementNote.value,
  };

  // This function returns the newly created settlement with its ID
  const newSettlement = await insurerStore.addInvoiceToHistory(props.insurer.id, newInvoiceData);

  if (newSettlement) {
    // Emit event for parent component
    emit('settlement-completed', { insurer: props.insurer, last_invoice: newSettlement });

    // Manually and directly update the local state to guarantee reactivity.
    // The localLastInvoice is now a computed property and updates automatically.
    localSettlementHistory.value.unshift(newSettlement);
  }

  handleCancel(); // Close picker after submission
};


// Fetch settlement history when component mounts or dataMode changes
const fetchSettlements = async () => {
  if (props.insurer?.id) {
    await insurerStore.fetchSettlementHistory(props.insurer.id);
    localSettlementHistory.value = [...(insurerStore.settlementHistories[props.insurer.id] || [])];
  }
};

// Watch for changes to insurer or dataMode
watch([() => props.insurer, () => props.dataMode], () => {
  fetchSettlements();
}, { immediate: true, deep: true });









onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  selectedDate.value = `${year}-${month}-${day}`;
});
</script>
