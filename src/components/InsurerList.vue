<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
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
   
    <div ref="scrollContainer" class="flex-1 overflow-y-auto w-full -mr-3 pr-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div
          v-for="insurer in (sortedInsurers || [])"
          :key="insurer.id"
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
            'bg-gray-50 border-gray-100 focus:ring-gray-500',
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
                <div v-if="insurer.last_invoice" class="flex items-start">
                  <div class="bg-blue-50 p-1.5 rounded-lg mr-3">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-0.5">Letzte Rechnung</div>
                    <div class="font-medium text-gray-900">
                      {{ formatLastInvoice(insurer.last_invoice) }}
                    </div>
                  </div>
                </div>
                
                <div v-if="getNextSettlementDate(insurer)" class="flex items-start">
                  <div class="bg-blue-50 p-1.5 rounded-lg mr-3">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-0.5">Nächste Fälligkeit</div>
                    <div class="font-medium text-gray-900">
                      {{ formatDate(getNextSettlementDate(insurer)) }}
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
                
                <div class="bg-blue-50/50 rounded-lg p-3 group-hover:bg-blue-100/30 transition-colors duration-300">
                  <div class="text-xs font-medium text-blue-600 mb-1 flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Bezugsweg
                  </div>
                  <div class="font-semibold text-blue-800 text-sm">
                    {{ insurer.bezugsweg || 'Nicht angegeben' }}
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
  import { defineProps, defineEmits, computed, onMounted, watch, ref } from 'vue';
  import { format, add } from 'date-fns';
  import { de } from 'date-fns/locale';
  import InsurerStatus from './InsurerStatus.vue';
  import { useInsurerUtils, docTypeColors } from '@/composables/useInsurerUtils';

  const props = defineProps({
    insurers: { type: Array, default: () => [] },
    sortBy: { type: String, default: 'name' },
    lastInvoices: { type: Object, default: () => ({}) },
    currentDate: { type: Date, default: () => new Date() },
    selectedInsurer: { type: Object, default: () => null },
    isLoading: { type: Boolean, default: false }
  });

  const emit = defineEmits(['select-insurer', 'clear-selection']);

  const scrollContainer = ref(null);

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
          const { calculateDaysOverdue } = useInsurerUtils();
          const overdueA = calculateDaysOverdue(a, props.currentDate, props.lastInvoices);
          const overdueB = calculateDaysOverdue(b, props.currentDate, props.lastInvoices);
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

  const getNextSettlementDate = (insurer) => {
    const lastInvoice = props.lastInvoices[insurer.id];
    if (!lastInvoice || !lastInvoice.datum) return 'N/A';
    const lastDate = new Date(lastInvoice.datum.seconds * 1000);
    const nextDate = add(lastDate, { days: insurer.turnus });
    return format(nextDate, 'dd.MM.yyyy', { locale: de });
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

  const utils = useInsurerUtils();

  const insurerStatuses = computed(() => {
    return new Map(safeInsurers.value.map(insurer => [
      insurer.id,
      {
        status: utils.getStatusCode(insurer, props.currentDate, safeLastInvoices.value),
        color: utils.getStatusColor(insurer, props.currentDate, safeLastInvoices.value),
        text: utils.getStatusText(insurer, props.currentDate, safeLastInvoices.value)
      }
    ]));
  });

  onMounted(() => {
    console.group('InsurerList mounted');
    console.log('currentDate prop:', props.currentDate);
    console.log('currentDate type:', Object.prototype.toString.call(props.currentDate));
    console.log('lastInvoices:', props.lastInvoices);
    console.groupEnd();
  });

  watch(() => props.insurers, (newValue) => {
    console.log('Insurers updated:', newValue);
    // Log the first insurer's doc_art if it exists
    if (newValue && newValue.length > 0) {
      console.log('First insurer doc_art:', newValue[0].doc_art);
      console.log('First insurer keys:', Object.keys(newValue[0]));
      
      // Log all insurers and their doc_art
      console.log('All insurers doc_art:');
      newValue.forEach((insurer, index) => {
        console.log(`Insurer ${index} (${insurer.name || 'unnamed'}):`, insurer.doc_art);
      });
    } else {
      console.log('No insurers data available');
    }
  }, { immediate: true, deep: true });

  watch(() => props.currentDate, (newDate) => {
    console.group('InsurerList - currentDate changed');
    console.log('New currentDate:', newDate);
    console.log('Sample insurer status:', 
      props.insurers.length > 0 ? 
      utils.getStatusText(props.insurers[0], newDate, props.lastInvoices) : 'No insurers');
    console.groupEnd();
  }, { deep: true });

  const getNormalizedDocTypes = (docArt) => {
    console.log('getNormalizedDocTypes input:', docArt);
    
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
    const days = utils.calculateDaysOverdue(insurer, props.currentDate, props.lastInvoices);
    return days > 0;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    let date;
    if (dateValue.seconds) { 
      date = new Date(dateValue.seconds * 1000);
    } else {
      date = new Date(dateValue);
    }
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  // Format turnus for display
  const formatTurnus = (turnus) => {
    if (!turnus) return '';
    // If it's already in the format 'X-tägig' or 'Jährlich', return as is
    if (String(turnus).includes('-tägig') || turnus === 'Jährlich') {
      return turnus;
    }
    // Otherwise, try to extract number and add '-tägig'
    const days = String(turnus).replace(/[^0-9]/g, '');
    return days ? `${days}-tägig` : turnus;
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