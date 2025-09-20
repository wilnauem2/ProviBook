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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-3">
        <div
          v-for="insurer in (sortedInsurers || [])"
          :key="insurer.id"
          @click="emit('select-insurer', insurer)"
          class="relative group cursor-pointer"
          :class="[
            'group relative p-6 rounded-xl cursor-pointer',
            'bg-white border border-gray-200',
            'hover:shadow-lg hover:border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
            safeSelectedInsurer?.name === insurer.name
              ? 'ring-2 ring-blue-500 ring-opacity-50 border-transparent transform scale-[0.99] shadow-md'
              : 'hover:scale-[1.01]',
            'h-full min-h-[140px] flex flex-col',
            'transition-all duration-200 hover:shadow-md',
            isInsurerIncomplete(insurer) ? 'opacity-50 grayscale' : ''
          ]"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 w-1.5 h-full rounded-l-lg"
            :class="{
              'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
              'bg-yellow-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
              'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green'
            }"
          ></div>
          
          <div class="flex flex-1 flex-col h-full">
            <!-- Header with logo/initials and name -->
            <div class="flex items-start justify-between mb-3 min-w-0">
              <div class="flex items-center min-w-0">
                <div 
                  class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3"
                  :class="{
                    'bg-red-500': insurerStatuses.get(insurer.id)?.status === 'red',
                    'bg-yellow-500': insurerStatuses.get(insurer.id)?.status === 'yellow',
                    'bg-green-500': insurerStatuses.get(insurer.id)?.status === 'green'
                  }"
                >
                  {{ getInitials(insurer.name) }}
                </div>
                <div class="flex items-center">
                  <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                    {{ insurer.name }}
                  </h3>
                  <span v-if="insurer.bipro || insurer.bezugsweg === 'BiPRO'" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    BiPRO
                    <span v-if="insurer.bipro_version" class="ml-1 opacity-90 text-xs">{{ insurer.bipro_version }}</span>
                  </span>
                </div>
              </div>
              
              <!-- Status badge -->
              <span 
                v-if="isInsurerIncomplete(insurer)"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-gray-100 text-gray-800"
              >
                Unvollständig
              </span>
              <span 
                v-else-if="insurerStatuses.get(insurer.id)?.status === 'red'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-red-100 text-red-800"
              >
                {{ insurerStatuses.get(insurer.id)?.text || 'Überfällig' }}
              </span>
              <span 
                v-else-if="insurerStatuses.get(insurer.id)?.status === 'yellow'"
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-yellow-100 text-yellow-800"
              >
                {{ insurerStatuses.get(insurer.id)?.text || 'Fällig' }}
              </span>
              <span 
                v-else
                class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 bg-green-100 text-green-800"
              >
                {{ insurerStatuses.get(insurer.id)?.text || 'Aktuell' }}
              </span>
            </div>
            
            <!-- Main content -->
            <div class="flex-1 grid grid-cols-2 gap-4 text-sm relative">
              <!-- Vemapool Stamp -->
              <div v-if="insurer.vemapool" class="absolute inset-0 pointer-events-none z-10">
                <div class="absolute right-24 top-4 w-72 h-20 bg-red-600 text-white font-bold text-xl flex items-center justify-center transform rotate-12 shadow-lg rounded-md">
                  VEMAPOOL
                </div>
              </div>
              <!-- Left column -->
              <div class="space-y-2">
                <div v-if="insurer.turnus" class="flex items-start">
                  <svg class="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Turnus</div>
                    <div>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {{ insurer.turnus || 'No turnus' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div v-if="insurer.contact_person" class="flex items-start">
                  <svg class="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Ansprechpartner</div>
                    <div class="font-medium text-slate-700 truncate max-w-[14rem]">{{ insurer.contact_person }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Right column -->
              <div class="space-y-2">
                <div class="flex items-start">
                  <svg class="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Letzte Abrechnung</div>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border"
                      :class="isOverdue(insurer) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'"
                    >
                      {{ insurer && formatLastInvoice ? formatLastInvoice(safeLastInvoices[insurer.id] || (insurer.last_invoice !== null ? insurer.last_invoice : null)) : '' }}
                    </span>
                  </div>
                </div>
                
                <div v-if="insurer.next_due" class="flex items-start">
                  <svg class="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div class="text-xs text-gray-500">Fällig am</div>
                    <div class="font-medium">{{ formatDate(insurer.next_due) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- File format tags -->
            <div class="mt-3 flex flex-wrap gap-2">
              <!-- BiPRO -->
              <span v-if="insurer.bipro_support" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="font-semibold">BiPRO</span>
                <span v-if="insurer.bipro_version" class="ml-1 opacity-75">{{ insurer.bipro_version }}</span>
              </span>

              <!-- Document Types -->
              <template v-if="insurer.name === 'Test-Versicherer 9' || insurer.name === 'Drupal A'">
                <!-- Debug info for specific insurers -->
                <div class="w-full text-xs text-red-600 bg-yellow-50 p-1 mb-1 rounded">
                  <div>Debug for {{ insurer.name }}:</div>
                  <div>Raw dokumentenart: {{ JSON.stringify(insurer.dokumentenart) }}</div>
                  <div>Processed types: {{ JSON.stringify(getNormalizedDocTypes(insurer.dokumentenart)) }}</div>
                </div>
              </template>
              
              <span v-for="docType in getNormalizedDocTypes(insurer.dokumentenart)" :key="docType" 
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                    :class="docTypeColors[docType]?.classes || 'bg-gray-100 text-gray-800'">
                <svg v-if="docTypeColors[docType]?.icon" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="docTypeColors[docType]?.icon"></svg>
                {{ docType }}
              </span>
              
              <!-- Fallback if no formats are specified -->
              <span v-if="getNormalizedDocTypes(insurer.dokumentenart).length === 0" class="text-xs text-gray-500">
                Keine Formate angegeben
              </span>
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

  watch(() => props.insurers, () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  }, { deep: true });

  watch(() => props.currentDate, (newDate) => {
    console.group('InsurerList - currentDate changed');
    console.log('New currentDate:', newDate);
    console.log('Sample insurer status:', 
      props.insurers.length > 0 ? 
      utils.getStatusText(props.insurers[0], newDate, props.lastInvoices) : 'No insurers');
    console.groupEnd();
  }, { deep: true });

  const getNormalizedDocTypes = (docArt) => {
    if (!docArt) {
      return [];
    }
    
    let types = [];
    
    if (Array.isArray(docArt)) {
      types = docArt.flatMap(item => {
        if (typeof item === 'string') {
          const result = item.split(',').map(s => s.trim()).filter(Boolean);
          return result;
        } else if (item && typeof item === 'object') {
          if (item.documentType) {
            const result = Array.isArray(item.documentType) 
              ? item.documentType.map(t => String(t).trim()).filter(Boolean)
              : [String(item.documentType).trim()].filter(Boolean);
            return result;
          }
          const result = Object.entries(item)
            .map(([key, value]) => {
              return String(value).trim();
            })
            .filter(Boolean);
          return result;
        }
        return [];
      });
    } else if (typeof docArt === 'string') {
      types = docArt.split(',').map(s => s.trim()).filter(Boolean);
    } else if (docArt && typeof docArt === 'object') {
      if (docArt.documentType) {
        types = Array.isArray(docArt.documentType)
          ? docArt.documentType.map(t => String(t).trim())
          : [String(docArt.documentType).trim()];
      } else {
        types = Object.entries(docArt)
          .map(([key, value]) => {
            return String(value).trim();
          })
          .filter(Boolean);
      }
    }

    const normalized = types
      .map(t => t.toUpperCase())
      .filter(t => t && t !== ',');
      
    const deduped = [...new Set(normalized)];
    
    return deduped;
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
  
  // Make formatTurnus available in the template
  return {
    formatTurnus
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