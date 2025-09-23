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
            'group relative overflow-hidden rounded-xl bg-white border border-gray-100',
            'transition-all duration-200 ease-in-out transform',
            'hover:shadow-lg hover:border-transparent hover:ring-2 hover:ring-blue-100',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
            safeSelectedInsurer?.id === insurer.id ? 'ring-2 ring-blue-500 ring-opacity-50 border-blue-200 bg-blue-50/30' : 'hover:border-gray-200 hover:shadow-sm',
            isInsurerIncomplete(insurer) ? 'opacity-80 grayscale' : '',
            'cursor-pointer'
          ]"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full"
            :class="{
              'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
              'bg-yellow-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
              'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green',
              'bg-gray-300': !insurerStatuses.get(insurer.id)?.status
            }"
          ></div>
          
          <div class="p-5">
            <!-- Header with logo/initials and name -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start space-x-3 min-w-0">
                <!-- Initials Avatar -->
                <div 
                  class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  :class="{
                    'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
                    'bg-yellow-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
                    'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green',
                    'bg-blue-500': !insurerStatuses.get(insurer.id)?.status
                  }"
                >
                  {{ getInitials(insurer.name) }}
                </div>
                
                <!-- Name and Access Methods -->
                <div class="min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {{ insurer.name }}
                  </h3>
                  <!-- Access Method Badges -->
                  <div class="flex flex-wrap gap-1.5 mt-1">
                    <!-- BiPRO Badge -->
                    <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-50 text-purple-700 border border-purple-100">
                      <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      BiPRO
                      <span v-if="insurer.bipro_version" class="ml-1 font-normal text-purple-600">{{ insurer.bipro_version }}</span>
                    </span>
                    
                    <!-- per Port Badge -->
                    <span v-if="insurer.bezugsweg === 'per Port'" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                      per Port
                    </span>
                    
                    <!-- per Mail Badge -->
                    <span v-else-if="insurer.bezugsweg === 'per Mail'" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      per Mail
                    </span>
                    
                    <!-- GetMyInvoices (GMI) Badge -->
                    <span v-else-if="insurer.bezugsweg === 'Maklerportal/GetMyInvoices' || insurer.bezugsweg === 'Maklerportal / GetMyInvoices'" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      GetMyInvoices
                    </span>
                  </div>
                </div>
              </div>

              <!-- Status Badge -->
              <div class="flex-shrink-0 ml-2">
                <span 
                  v-if="insurerStatuses.get(insurer.id)?.status === 'red'"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100"
                >
                  <span class="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                  {{ insurerStatuses.get(insurer.id)?.text || 'Überfällig' }}
                </span>
                <span 
                  v-else-if="insurerStatuses.get(insurer.id)?.status === 'yellow'"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100"
                >
                  <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
                  {{ insurerStatuses.get(insurer.id)?.text || 'Fällig' }}
                </span>
                <span 
                  v-else
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100"
                >
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                  {{ insurerStatuses.get(insurer.id)?.text || 'Aktuell' }}
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
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex flex-wrap items-center gap-3">
                <!-- BiPRO Support -->
                <span v-if="insurer.bipro_support" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  <svg class="w-3.5 h-3.5 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  BiPRO Support
                </span>
                
                <!-- Document Type Badges -->
                <template v-if="insurer.dokumentenart && insurer.dokumentenart.length > 0">
                  <span 
                    v-for="(doc, index) in getNormalizedDocTypes(insurer.dokumentenart)" 
                    :key="'doc-'+index"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-red-100 text-red-800 border border-red-200': doc.includes('PDF'),
                      'bg-green-100 text-green-800 border border-green-200': doc.includes('CSV'),
                      'bg-blue-100 text-blue-800 border border-blue-200': !doc.includes('PDF') && !doc.includes('CSV')
                    }"
                  >
                    <template v-if="doc.includes('PDF')">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12h8v1H8zM8 15h8v1H8zM8 18h5v1H8z" fill="currentColor"/>
                      </svg>
                    </template>
                    <template v-else-if="doc.includes('CSV')">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12h8v1H8zM8 15h8v1H8zM8 18h5v1H8z" fill="currentColor"/>
                      </svg>
                    </template>
                    {{ doc }}
                  </span>
                </template>
              </div>
            </div>
            
            <!-- Footer with actions -->
            <div class="mt-3 pt-2 border-t border-gray-100 flex justify-end items-center">
              <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Details anzeigen
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