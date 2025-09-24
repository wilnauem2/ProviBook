<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col space-y-2 mb-4">
      <div class="flex items-center justify-between">
        <div class="text-gray-800">
          <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {{ safeInsurers.length }} Einträge
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            v-if="safeSelectedInsurer"
            @click="$emit('clear-selection')"
            class="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors"
          >
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Auswahl aufheben
          </button>
        </div>
      
      </div>
      
      <!-- Delivery Method Statistics -->
      <div v-if="safeInsurers.length > 0" class="flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <div class="flex items-center">
          <span class="font-medium">Zustellwege:</span>
        </div>
        <div v-if="deliveryStats.bipro > 0" class="flex items-center bg-blue-50 px-2 py-0.5 rounded-full">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
          <span>{{ deliveryStats.bipro }} BIPRO</span>
        </div>
        <div v-if="deliveryStats.email > 0" class="flex items-center bg-green-50 px-2 py-0.5 rounded-full">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
          <span>{{ deliveryStats.email }} E-Mail</span>
        </div>
        <div v-if="deliveryStats.post > 0" class="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
          <span class="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></span>
          <span>{{ deliveryStats.post }} Post</span>
        </div>
        <div v-if="deliveryStats.portal > 0" class="flex items-center bg-purple-50 px-2 py-0.5 rounded-full">
          <span class="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>
          <span>{{ deliveryStats.portal }} Portal/GMI</span>
        </div>
      </div>
    </div>
   
    <div ref="scrollContainer" class="flex-1 overflow-y-auto w-full -mr-3 pr-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div
          v-for="insurer in (sortedInsurers || [])"
          :key="insurer.id"
          v-safe-card="{ insurer }"
          @click="emit('select-insurer', insurer)"
          :class="[
            'group relative overflow-hidden rounded-2xl border',
            'transition-all duration-300 ease-out transform',
            'hover:shadow-xl hover:-translate-y-0.5',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            safeSelectedInsurer?.id === insurer.id ? 'ring-2 ring-opacity-50' : 'hover:shadow-md',
            isInsurerIncomplete(insurer) ? 'opacity-80 grayscale' : '',
            'cursor-pointer hover:z-10',
            'transform-gpu', // Enable GPU acceleration for smoother animations
            insurerStatuses.get(insurer.id)?.status === 'red' ? 'bg-red-50 border-red-100 focus:ring-red-500' :
            insurerStatuses.get(insurer.id)?.status === 'yellow' ? 'bg-amber-50 border-amber-100 focus:ring-amber-500' :
            insurerStatuses.get(insurer.id)?.status === 'green' ? 'bg-green-50 border-green-100 focus:ring-green-500' :
            'bg-white border-gray-200 focus:ring-gray-500',
            safeSelectedInsurer?.id === insurer.id ? 'ring-blue-500' : ''
          ]"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:h-5/6 group-hover:top-1/12 group-hover:rounded-b-md"
            :class="{
              'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
              'bg-amber-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
              'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green',
              'bg-gray-500': !insurerStatuses.get(insurer.id)?.status
            }"
          ></div>
          
          <div class="p-6 relative">
            <!-- Decorative corner accent -->
            <div 
              class="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-5"
              :class="{
                'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
                'bg-amber-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
                'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green',
                'bg-gray-500': !insurerStatuses.get(insurer.id)?.status
              }"
            ></div>
            
            <!-- Header with title and status -->
            <div class="flex items-start justify-between mb-4 relative">
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 flex items-center">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-500">
                  {{ insurer.name }}
                </span>
                <span v-if="insurer.bipro_support" class="ml-2 text-blue-500 group-hover:animate-pulse" title="BiPRO Support">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 12l8 10 8-10-8-10zm0 2.8L18.4 12 12 19.2 5.6 12 12 4.8z"/>
                  </svg>
                </span>
              </h3>
              
              <!-- Status indicator with pulse animation -->
              <div class="flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm"
                  :class="{
                    'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200': insurerStatuses.get(insurer.id)?.status === 'red',
                    'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200': insurerStatuses.get(insurer.id)?.status === 'yellow',
                    'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200': insurerStatuses.get(insurer.id)?.status === 'green',
                    'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200': !insurerStatuses.get(insurer.id)?.status,
                    'animate-pulse': [insurerStatuses.get(insurer.id)?.status === 'red', insurerStatuses.get(insurer.id)?.status === 'yellow'].some(Boolean)
                  }"
                >
                  <span class="relative flex h-2.5 w-2.5 mr-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="{
                      'bg-red-400': insurerStatuses.get(insurer.id)?.status === 'red',
                      'bg-amber-400': insurerStatuses.get(insurer.id)?.status === 'yellow',
                      'bg-green-400': insurerStatuses.get(insurer.id)?.status === 'green',
                      'bg-gray-400': !insurerStatuses.get(insurer.id)?.status
                    }"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="{
                      'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
                      'bg-amber-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
                      'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green',
                      'bg-gray-500': !insurerStatuses.get(insurer.id)?.status
                    }"></span>
                  </span>
                  {{ insurerStatuses.get(insurer.id)?.status === 'red' ? 'Überfällig' : 
                     insurerStatuses.get(insurer.id)?.status === 'yellow' ? 'Fällig' : 
                     insurerStatuses.get(insurer.id)?.status === 'green' ? 'Aktuell' : 'Unbekannt' }}
                </span>
              </div>
            </div>
            
            <!-- Main content -->
            <div class="grid grid-cols-2 gap-4 text-sm mt-4 relative">
              <!-- Vemapool Stamp -->
              <div v-if="insurer.vemapool" class="absolute right-0 top-0 pointer-events-none z-10">
                <div class="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm px-4 py-2 transform -rotate-12 shadow-lg rounded">
                  VEMAPOOL
                </div>
              </div>
              
              <!-- Left column -->
              <div class="space-y-3">
                <div v-if="insurer.turnus" class="flex items-start">
                  <div class="bg-blue-50 p-1.5 rounded-lg mr-3">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-0.5">Turnus</div>
                    <div class="font-medium text-gray-900">
                      {{ formatTurnus(insurer.turnus) || 'Nicht angegeben' }}
                    </div>
                  </div>
                </div>
                
                <div v-if="insurer.contact_person" class="flex items-start">
                  <div class="bg-blue-50 p-1.5 rounded-lg mr-3">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-0.5">Ansprechpartner</div>
                    <div class="font-medium text-gray-900">{{ insurer.contact_person }}</div>
                  </div>
                </div>
              </div>

              <!-- Right column -->
              <div class="space-y-3">
                <div class="flex items-start">
                  <div class="bg-blue-50 p-1.5 rounded-lg mr-3">
                    <template v-if="!insurer.zustellungsweg && !insurer.zustellweg && !insurer.bezugsweg">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </template>
                    <template v-else>
                      <template v-if="getZustellungswegType(insurer) === 'bipro'">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </template>
                      <template v-else-if="getZustellungswegType(insurer) === 'mail'">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </template>
                      <template v-else-if="getZustellungswegType(insurer) === 'post'">
                        <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </template>
                      <template v-else-if="getZustellungswegType(insurer) === 'maklerportal'">
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </template>
                    </template>
                    <template v-else>
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </template>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-0.5">Zustellungsweg</div>
                    <div class="font-medium text-gray-900 flex items-center">
                      <span>{{ formatZustellungsweg(insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg || '') }}</span>
                      <template v-if="getZustellungswegType(insurer) === 'bipro' && (insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg) && !(insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg || '').toString().toLowerCase().includes('bipro')">
                        <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          BiPRO
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Document Type Badges with Fade-in Animation -->
            <div class="mt-5 pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Document Type Badges -->
                <template v-if="insurer.dokumentenart && insurer.dokumentenart.length > 0">
                  <span 
                    v-for="(doc, index) in getNormalizedDocTypes(insurer.dokumentenart)" 
                    :key="'doc-'+index"
                    class="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm transform transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm"
                    :class="{
                      'bg-red-50/80 text-red-700 border-red-100 hover:bg-red-100/80': doc.includes('PDF'),
                      'bg-green-50/80 text-green-700 border-green-100 hover:bg-green-100/80': doc.includes('CSV'),
                      'bg-blue-50/80 text-blue-700 border-blue-100 hover:bg-blue-100/80': !doc.includes('PDF') && !doc.includes('CSV')
                    }"
                  >
                    <template v-if="doc.includes('PDF')">
                      <svg class="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12h8v1H8zM8 15h8v1H8zM8 18h5v1H8z" fill="currentColor"/>
                      </svg>
                    </template>
                    <template v-else-if="doc.includes('CSV')">
                      <svg class="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12h8v1H8zM8 15h8v1H8zM8 18h5v1H8z" fill="currentColor"/>
                      </svg>
                    </template>
                    {{ doc }}
                  </span>
                </template>
                
                <!-- Empty state -->
                <span v-else class="text-xs text-gray-400 italic">Keine Dokumente</span>
              </div>
              
              <!-- Last Invoice & Next Settlement -->
              <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="bg-gray-50/50 rounded-lg p-3 group-hover:bg-gray-100/50 transition-colors duration-300">
                  <div class="text-xs font-medium text-gray-500 mb-1 flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Letzte Rechnung
                  </div>
                  <div class="font-medium text-gray-900 text-sm">
                    {{ formatLastInvoice(insurer.last_invoice) || '–' }}
                  </div>
                </div>
                
                <div 
                  class="rounded-lg p-3 transition-colors duration-300"
                  :class="{
                    'bg-red-50/80 group-hover:bg-red-100/50': insurerStatuses.get(insurer.id)?.status === 'red',
                    'bg-amber-50/80 group-hover:bg-amber-100/50': insurerStatuses.get(insurer.id)?.status === 'yellow',
                    'bg-green-50/80 group-hover:bg-green-100/50': insurerStatuses.get(insurer.id)?.status === 'green',
                    'bg-blue-50/80 group-hover:bg-blue-100/30': !insurerStatuses.get(insurer.id)?.status
                  }"
                >
                  <div class="text-xs font-medium flex items-center"
                    :class="{
                      'text-red-600': insurerStatuses.get(insurer.id)?.status === 'red',
                      'text-amber-600': insurerStatuses.get(insurer.id)?.status === 'yellow',
                      'text-green-600': insurerStatuses.get(insurer.id)?.status === 'green',
                      'text-blue-600': !insurerStatuses.get(insurer.id)?.status
                    }"
                  >
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nächste Fälligkeit
                  </div>
                  <div v-if="!insurer.turnus" class="text-sm text-gray-500">
                    Kein Turnus angegeben
                  </div>
                  <div v-else>
                    <div class="font-semibold text-sm"
                      :class="{
                        'text-red-800': insurerStatuses.get(insurer.id)?.status === 'red',
                        'text-amber-800': insurerStatuses.get(insurer.id)?.status === 'yellow',
                        'text-green-800': insurerStatuses.get(insurer.id)?.status === 'green',
                        'text-blue-800': !insurerStatuses.get(insurer.id)?.status
                      }"
                    >
                      <template v-if="insurerStatuses.get(insurer.id)?.nextSettlementDate">
                        {{ formatNextSettlementDate(insurerStatuses.get(insurer.id).nextSettlementDate) }}
                      </template>
                      <template v-else-if="insurer.next_due">
                        {{ formatNextSettlementDate(insurer.next_due) }}
                      </template>
                      <template v-else>
                        Kein Fälligkeitsdatum
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer with actions -->
            <div class="mt-4 pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
              <button class="w-full flex items-center justify-between text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group/button">
                <span>Details anzeigen</span>
                <svg class="w-4 h-4 ml-1 transform group-hover/button:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed, onMounted, watch, ref, onErrorCaptured } from 'vue';
  import { format, add, isAfter, isToday } from 'date-fns';
  import { de } from 'date-fns/locale';
  import { useInsurerUtils } from '@/composables/useInsurerUtils';
  import InsurerStatus from './InsurerStatus.vue';
  
  // Initialize utils once at the top
  const utils = useInsurerUtils();
  
  const props = defineProps({
    insurers: { type: Array, default: () => [] },
    sortBy: { type: String, default: 'name' },
    lastInvoices: { type: Object, default: () => ({}) },
    currentDate: { type: Date, default: () => new Date() },
    selectedInsurer: { type: Object, default: () => null },
    isLoading: { type: Boolean, default: false }
  });

  const emit = defineEmits(['select-insurer', 'clear-selection']);

  // Global error handler for the component
  onErrorCaptured((err, instance, info) => {
    console.error('Error in component:', err);
    console.error('Error info:', info);
    return false; // Prevent the error from propagating further
  });

  // Directive to catch errors in individual cards
  const vSafeCard = {
    mounted(el, binding) {
      try {
        // This will help identify which card is causing the error
        console.log('Rendering card for insurer:', binding.value.insurer?.id, binding.value.insurer?.name);
      } catch (error) {
        console.error('Error in card renderer:', error, 'Insurer:', binding.value.insurer);
      }
    }
  };

  const scrollContainer = ref(null);

  // Initialize deliveryStats with default values
  const defaultDeliveryStats = {
    bipro: 0,
    email: 0,
    post: 0,
    portal: 0
  };

  // Calculate delivery method statistics
  const deliveryStats = computed(() => {
    if (!safeInsurers.value || !Array.isArray(safeInsurers.value)) {
      return { ...defaultDeliveryStats };
    }

    const stats = { ...defaultDeliveryStats };

    safeInsurers.value.forEach(insurer => {
      const zustellungsweg = (insurer.zustellungsweg || '').toLowerCase();
      
      if (zustellungsweg.includes('bipro')) {
        stats.bipro++;
      } else if (zustellungsweg.includes('mail') || zustellungsweg.includes('e-mail')) {
        stats.email++;
      } else if (zustellungsweg.includes('post') || zustellungsweg.includes('brief')) {
        stats.post++;
      } else if (zustellungsweg.includes('portal') || zustellungsweg.includes('gmi') || zustellungsweg.includes('get my invoices')) {
        stats.portal++;
      }
    });

    return stats;
  });

  const safeInsurers = computed(() => {
    if (!props.insurers || !Array.isArray(props.insurers)) {
      console.warn('insurers prop is not an array or is undefined, defaulting to empty array');
      return [];
    }
    return props.insurers.filter(insurer => insurer != null);
  });

  const safeSelectedInsurer = computed(() => {
    return props.selectedInsurer || null;
  });

  const safeLastInvoices = computed(() => {
    return props.lastInvoices || {};
  });

  const sortedInsurers = computed(() => {
    const insurers = safeInsurers.value || [];
    if (!Array.isArray(insurers)) return [];

    const sorted = [...insurers];

    sorted.forEach(insurer => {
      if (insurer.bipro === undefined) {
        insurer.bipro = insurer.name?.toLowerCase().includes('allianz') || 
                        insurer.name?.toLowerCase().includes('axa') || 
                        insurer.name?.toLowerCase().includes('ergo');
      }
    });

    sorted.sort((a, b) => {
      switch (props.sortBy) {
        case 'date': {
          const lastInvoiceA = props.lastInvoices?.[a.id];
          const lastInvoiceB = props.lastInvoices?.[b.id];
          const dateA = lastInvoiceA?.datum?.seconds ? new Date(lastInvoiceA.datum.seconds * 1000) : new Date(0);
          const dateB = lastInvoiceB?.datum?.seconds ? new Date(lastInvoiceB.datum.seconds * 1000) : new Date(0);
          return dateB - dateA;
        }
        case 'overdue': {
          const overdueA = utils.calculateDaysOverdue(a, props.currentDate, props.lastInvoices);
          const overdueB = utils.calculateDaysOverdue(b, props.currentDate, props.lastInvoices);
          return overdueB - overdueA;
        }
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  });

  const selectInsurer = (insurer) => {
    emit('select-insurer', insurer);
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isInsurerIncomplete = (insurer) => {
    if (!insurer) return true;

    const isFieldEmpty = (field) => {
      if (field === null || field === undefined) return true;
      if (typeof field === 'string') return field.trim() === '';
      return false;
    };

    const turnusEmpty = isFieldEmpty(insurer.turnus);
    const bezugswegEmpty = isFieldEmpty(insurer.bezugsweg);
    const dokArtEmpty = utils.getNormalizedDocTypes(insurer.dokumentenart).length === 0;

    return turnusEmpty || bezugswegEmpty || dokArtEmpty;
  };

  // Removed debug code

  // Use the calculateNextSettlementDate from useInsurerUtils instead of the local function

  // Format the next settlement date for display
  const formatNextSettlementDate = (date) => {
    try {
      if (!date) {
        console.log('No date provided');
        return 'Kein Datum verfügbar';
      }

      // Get the current date from props or use current date
      const currentDate = props.currentDate ? new Date(props.currentDate) : new Date();
      currentDate.setHours(12, 0, 0, 0);
      
      // Parse the input date
      let dateObj;
      
      if (date instanceof Date) {
        dateObj = new Date(date);
      } else if (date && typeof date === 'object') {
        // Handle Firestore timestamps
        if (date.toDate && typeof date.toDate === 'function') {
          dateObj = date.toDate();
        } else if (date.seconds) {
          dateObj = new Date(date.seconds * 1000);
        } else if (date.date?.seconds) {
          dateObj = new Date(date.date.seconds * 1000);
        } else if (date._seconds) {
          dateObj = new Date(date._seconds * 1000);
        } else if (date instanceof Object) {
          // Try to parse as a date string if it's an object with date properties
          dateObj = new Date(date);
        } else {
          dateObj = new Date(date);
        }
      } else {
        // Try to parse as a date string
        dateObj = new Date(date);
      }
      
      // If we still don't have a valid date, return an error message
      if (isNaN(dateObj.getTime())) {
        console.log('Invalid date object:', date);
        return 'Ungültiges Datum';
      }
      
      // Set time to noon to avoid timezone issues
      dateObj.setHours(12, 0, 0, 0);
      
      console.log('Current date:', currentDate.toISOString());
      console.log('Due date:', dateObj.toISOString());
      
      // Calculate difference in days
      const timeDiff = dateObj.getTime() - currentDate.getTime();
      const diffDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      
      console.log('Difference in days:', diffDays);
      
      // Format the date for display
      const formattedDate = format(dateObj, 'dd.MM.yyyy');
      
      // Return appropriate message based on the difference
      if (diffDays < 0) {
        const daysOverdue = Math.abs(diffDays);
        return `Überfällig seit ${formattedDate} (${daysOverdue} Tag${daysOverdue !== 1 ? 'e' : ''})`;
      } else if (diffDays === 0) {
        return `Heute, ${formattedDate}`;
      } else {
        return `${formattedDate} (in ${diffDays} Tag${diffDays !== 1 ? 'en' : ''})`;
      }
    } catch (error) {
      return 'Fehler beim Formatieren des Datums';
    }
  };

  const insurerStatuses = computed(() => {
    // Get a stable reference to the current date
    const currentDate = props.currentDate ? new Date(props.currentDate) : new Date();
    currentDate.setHours(12, 0, 0, 0);
    
    const statusMap = new Map();
    safeInsurers.value.forEach(insurer => {
      try {
        // Get the next settlement date
        const nextSettlementDate = utils.calculateNextSettlementDate(insurer, currentDate);
        
        // Calculate days until next settlement
        let daysUntilNext = null;
        if (nextSettlementDate) {
          const nextDate = new Date(nextSettlementDate);
          nextDate.setHours(12, 0, 0, 0);
          
          const timeDiff = nextDate.getTime() - currentDate.getTime();
          daysUntilNext = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        }
        
        // Get status information
        const statusInfo = utils.getStatusCode(insurer, currentDate);
        
        // Create the status object with all necessary information
        const statusObj = {
          status: statusInfo || 'unknown',
          color: utils.getStatusColor(insurer, currentDate),
          text: utils.getStatusText(insurer, currentDate),
          nextSettlementDate: nextSettlementDate ? new Date(nextSettlementDate) : null,
          daysUntilNext: daysUntilNext
        };
        
        statusMap.set(insurer.id, statusObj);
      } catch (error) {
        statusMap.set(insurer.id, {
          status: 'error',
          color: 'gray',
          text: 'Fehler bei der Berechnung',
          nextSettlementDate: null,
          daysUntilNext: null
        });
      }
    });
    
    return statusMap;
  });

  onMounted(() => {
    // Component mounted
  });
  
  // Watch for changes to the insurers prop
  watch(() => props.insurers, () => {
    // Handle insurers data changes if needed
  }, { immediate: true, deep: true });

  watch(() => props.currentDate, () => {
    // Handle currentDate changes if needed
  }, { deep: true });

  const getNormalizedDocTypes = (docArt) => {
    if (!docArt) return [];
    
    try {
      // If it's an array, process each item
      if (Array.isArray(docArt)) {
        return docArt
          .map(item => {
            if (typeof item === 'string') return item.trim().toUpperCase();
            if (item && typeof item === 'object') {
              // Try to find a string value in the object
              const strValue = Object.values(item).find(v => typeof v === 'string');
              return strValue ? strValue.trim().toUpperCase() : null;
            }
            return String(item).trim().toUpperCase();
          })
          .filter(Boolean);
      }
      
      // If it's a string, split by comma
      if (typeof docArt === 'string') {
        return docArt.split(',')
          .map(t => t.trim().toUpperCase())
          .filter(Boolean);
      }
      
      // For any other type, convert to string
      return [String(docArt).trim().toUpperCase()].filter(Boolean);
      
    } catch (error) {
      console.error('Error processing document types:', error);
      return [];
    }
  };

  const isOverdue = (insurer) => {
    const days = utils.calculateDaysOverdue(insurer, props.currentDate);
    return days > 0;
  };

  const formatDate = (dateValue) => {
    try {
      if (!dateValue) {
        console.log('formatDate: No date value provided');
        return '';
      }
      
      let date;
      
      // Handle Firestore Timestamp
      if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
        date = dateValue.toDate();
      } 
      // Handle Firestore timestamp object
      else if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
        date = new Date(dateValue.seconds * 1000);
      } 
      // Handle string or number
      else {
        date = new Date(dateValue);
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('formatDate: Invalid date value:', dateValue);
        return 'Ungültiges Datum';
      }
      
      return format(date, 'dd.MM.yyyy', { locale: de });
    } catch (error) {
      console.error('Error in formatDate:', error, 'Value:', dateValue);
      return 'Fehler beim Formatieren';
    }
  };

  // Format turnus for display
  const formatTurnus = (turnus) => {
    if (!turnus) return 'Nicht angegeben';
    
    // If it's a number, assume it's days
    if (!isNaN(turnus)) {
      return `${turnus} Tage`;
    }
    
    // If it's a string, try to parse it
    const turnusStr = String(turnus).toLowerCase();
    
    if (turnusStr.includes('tag') || turnusStr.includes('day')) {
      const days = turnusStr.match(/\d+/);
      return days ? `${days[0]} Tage` : turnus;
    }
    
    return turnus;
  };

  // Get the type of zustellungsweg for icon display
  const getZustellungswegType = (insurer) => {
    const zustellungsweg = (insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg || '').toString().toLowerCase().trim();
    
    if (!zustellungsweg) return '';
    
    if (zustellungsweg.includes('bipro') || insurer.bipro) {
      return 'bipro';
    } else if (zustellungsweg.includes('mail') || zustellungsweg.includes('e-mail') || zustellungsweg === 'email') {
      return 'mail';
    } else if (zustellungsweg.includes('post') || zustellungsweg.includes('brief')) {
      return 'post';
    } else if (zustellungsweg.includes('makler') || zustellungsweg.includes('gmi') || zustellungsweg.includes('getmyinvoices')) {
      return 'maklerportal';
    }
    
    return '';
  };

  // Format Zustellungsweg for display
  const formatZustellungsweg = (zustellungsweg) => {
    // Handle null, undefined, or empty string
    if (!zustellungsweg && zustellungsweg !== '') return 'Nicht angegeben';
    
    // Convert to string, handle case where zustellungsweg is 0 or false
    const zustellungswegStr = zustellungsweg !== null && zustellungsweg !== undefined ? zustellungsweg.toString() : '';
    const zustellungswegLower = zustellungswegStr.toLowerCase().trim();
    
    // If the string is empty after trimming, return 'Nicht angegeben'
    if (zustellungswegLower === '') return 'Nicht angegeben';
    
    // Map common variations to display values
    const displayMap = {
      'bipro': 'BiPRO',
      'mail': 'E-Mail',
      'email': 'E-Mail',
      'e-mail': 'E-Mail',
      'post': 'Per Post',
      'brief': 'Per Post',
      'maklerportal': 'Maklerportal/GetMyInvoices',
      'getmyinvoices': 'Maklerportal/GetMyInvoices',
      'gmi': 'Maklerportal/GetMyInvoices',
      'per post': 'Per Post'
    };
    
    // Check for exact matches first
    if (displayMap[zustellungswegLower]) {
      return displayMap[zustellungswegLower];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(displayMap)) {
      if (zustellungswegLower.includes(key)) {
        return value;
      }
    }
    
    // If no match found, return original value or 'Nicht angegeben' if empty
    return zustellungswegStr || 'Nicht angegeben';
  };

  const formatLastInvoice = (lastInvoice) => {
    try {
      if (!lastInvoice) {
        return 'Keine Abrechnung';
      }

      // Handle string values directly
      if (typeof lastInvoice === 'string') {
        return lastInvoice.trim() || 'Keine Abrechnung';
      }

      // Handle object values
      if (typeof lastInvoice === 'object' && lastInvoice !== null) {
        // Handle object with display property
        if (lastInvoice.display) {
          return lastInvoice.display;
        }
        
        // Handle Firestore timestamp
        if (lastInvoice.seconds) {
          return formatDate(new Date(lastInvoice.seconds * 1000));
        }
        
        // Handle object with datum or date property
        if (lastInvoice.datum || lastInvoice.date) {
          return formatDate(lastInvoice.datum || lastInvoice.date);
        }
      }
      
      // Default fallback
      return 'Keine Abrechnung';
    } catch (error) {
      console.error('Error formatting last invoice:', error);
      return 'Keine Abrechnung';
    }
  };
</script>