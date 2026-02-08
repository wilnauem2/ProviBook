<template>
  <div class="h-full flex flex-col">
    <!-- Active Filters (only visible when filters are active) -->
    <div v-if="activeZustellungswegFilter || activeTurnusFilter || activeDokumentenartFilter" class="flex flex-wrap items-center gap-2 mb-4">
      <div v-if="activeZustellungswegFilter" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
        {{ activeZustellungswegFilter }}
        <button @click="activeZustellungswegFilter = null" class="ml-1 text-blue-500 hover:text-blue-700">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="activeTurnusFilter" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-100">
        {{ activeTurnusFilter }}
        <button @click="activeTurnusFilter = null" class="ml-1 text-green-500 hover:text-green-700">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="activeDokumentenartFilter" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-100">
        {{ activeDokumentenartFilter }}
        <button @click="activeDokumentenartFilter = null" class="ml-1 text-purple-500 hover:text-purple-700">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <button 
        @click="clearAllFilters"
        class="text-xs text-gray-500 hover:text-gray-700 flex items-center"
      >
        <svg class="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Alle löschen
      </button>
    </div>

    <!-- Conditional Content -->
    <div v-if="viewMode === 'stats'" class="flex-1">
      <InsurerStats 
        :insurers="safeInsurers" 
        class="h-full overflow-y-auto"
        @filter-by-zustellungsweg="handleZustellungswegFilter"
        @filter-by-turnus="handleTurnusFilter"
        @filter-by-dokumentenart="handleDokumentenartFilter"
      />
    </div>
    <div v-else class="flex-1 flex flex-col">
      <div class="flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <!-- PDF Export Dialog -->
          <div v-if="showExportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 class="text-lg font-medium text-gray-900 mb-4">PDF-Export</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
                  <select v-model="exportSortBy" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="name">Nach Name (A-Z)</option>
                    <option value="turnus">Nach Turnus</option>
                    <option value="zustellungsweg">Nach Zustellungsweg</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    @click="showExportDialog = false" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Abbrechen
                  </button>
                  <button 
                    @click="confirmExport" 
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    PDF erstellen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-0">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
              <div class="relative w-12 h-12">
                <div class="absolute inset-0 rounded-full border-[3px] border-slate-200"></div>
                <div class="absolute inset-0 rounded-full border-[3px] border-brand-500 border-t-transparent animate-spin"></div>
              </div>
              <div class="text-sm font-medium text-slate-500">Lade Versicherer...</div>
            </div>

            <!-- No Results -->
            <div v-else-if="!isLoading && safeInsurers.length === 0" class="text-center py-20">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base font-semibold text-slate-900">Keine Versicherer gefunden</h3>
              <p class="mt-1 text-sm text-slate-500">Es wurden keine Versicherer in der Datenbank gefunden.</p>
            </div>

            <!-- Insurers Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div 
                v-for="insurer in insurersWithStatus" 
                :key="insurer.id"
                @click="emit('select-insurer', insurer)"
                class="group relative bg-white rounded-xl border border-slate-200/80 overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-soft hover:border-slate-300/80"
                :class="{
                  'ring-2 ring-brand-500 ring-offset-1 border-brand-200': safeSelectedInsurer && safeSelectedInsurer.id === insurer.id,
                }"
              >
                <!-- Status indicator bar at top -->
                <div class="h-[3px]" :class="{
                  'bg-red-500': insurer.status === 'critical',
                  'bg-amber-400': insurer.status === 'warning',
                  'bg-emerald-500': insurer.status === 'on_time',
                  'bg-slate-200': insurer.status === 'no_invoice'
                }"></div>

                <!-- Red Overlay for VEMA/FEMA Pool Cards -->
                <div 
                  v-if="hasPool(insurer, 'VEMA') || hasPool(insurer, 'FEMA')"
                  class="absolute inset-0 bg-red-500/[0.04] pointer-events-none z-0"
                ></div>
                
                <!-- VEMA/FEMA Pool Badge - Centered Watermark -->
                <div 
                  v-if="hasPool(insurer, 'VEMA') || hasPool(insurer, 'FEMA')"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                >
                  <div class="pool-stamp opacity-40">
                    {{ getPoolName(insurer) }} POOL
                  </div>
                </div>
                
                <div class="flex flex-col h-full p-4 relative z-5">
                  <!-- Header Row: Name + Status -->
                  <div class="flex items-start justify-between gap-2 mb-3">
                    <h3 class="text-[15px] font-semibold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                      {{ insurer.name }}
                    </h3>
                    <span 
                      v-if="insurer.status !== 'no_invoice'"
                      class="flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-md tracking-wide uppercase"
                      :class="{
                        'bg-red-50 text-red-700 border border-red-200': insurer.status === 'critical',
                        'bg-amber-50 text-amber-700 border border-amber-200': insurer.status === 'warning',
                        'bg-emerald-50 text-emerald-700 border border-emerald-200': insurer.status === 'on_time'
                      }"
                    >
                      {{ {
                        critical: 'Überfällig',
                        warning: 'Fällig',
                        on_time: 'Aktuell'
                      }[insurer.status] || '' }}
                    </span>
                  </div>
                  
                  <!-- Document Type Badges -->
                  <div v-if="insurer.dokumentenart" class="flex flex-wrap gap-1 mb-3">
                    <template v-if="Array.isArray(insurer.dokumentenart)">
                      <span 
                        v-for="(docType, index) in insurer.dokumentenart" 
                        :key="index"
                        class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded"
                        :class="getDocTypeClasses(docType)"
                      >
                        {{ docType }}
                      </span>
                    </template>
                    <template v-else-if="typeof insurer.dokumentenart === 'string' && insurer.dokumentenart.includes(',')">
                      <span 
                        v-for="(docType, index) in insurer.dokumentenart.split(',').map(d => d.trim())" 
                        :key="index"
                        class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded"
                        :class="getDocTypeClasses(docType)"
                      >
                        {{ docType }}
                      </span>
                    </template>
                    <template v-else-if="typeof insurer.dokumentenart === 'string'">
                      <span 
                        class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded"
                        :class="getDocTypeClasses(insurer.dokumentenart)"
                      >
                        {{ insurer.dokumentenart }}
                      </span>
                    </template>
                  </div>
                  
                  <!-- No Invoice Warning -->
                  <div v-if="insurer.status === 'no_invoice'" class="mb-3 px-2.5 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                    <p class="text-[11px] font-medium text-amber-700">Keine Abrechnung vorhanden</p>
                  </div>
                  
                  <!-- Key Info Grid -->
                  <div class="mt-auto pt-3 border-t border-slate-100 space-y-2">
                    <!-- Next due date -->
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] text-slate-400 font-medium">Fällig</span>
                      <span class="text-[12px] font-semibold text-slate-900 tabular-nums">{{ formatNextDue(insurer) }}</span>
                    </div>
                    
                    <!-- Last invoice -->
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] text-slate-400 font-medium">Letzte Abr.</span>
                      <span class="text-[12px] font-medium text-slate-600 tabular-nums">{{ formatLastInvoice(insurerStore.lastInvoices[insurer.id]) || 'Keine' }}</span>
                    </div>
                    
                    <!-- Turnus + Zustellungsweg Row -->
                    <div class="flex items-center justify-between">
                      <span v-if="insurer.turnus" class="text-[11px] text-slate-400">
                        <span class="font-medium">{{ insurer.turnus }}d</span>
                      </span>
                      <span v-if="getSafeZustellungsweg(insurer)" class="text-[11px]">
                        <template v-if="getSafeZustellungsweg(insurer).toLowerCase() === 'bipro'">
                          <span class="inline-flex items-center text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">BiPRO</span>
                        </template>
                        <template v-else>
                          <span class="text-slate-500 font-medium">{{ getSafeZustellungsweg(insurer) }}</span>
                        </template>
                      </span>
                    </div>
                  </div>

                  <!-- Login-Informationen & Abrechnungswege -->
                  <div v-if="hasExtraInfo(insurer)" class="mt-3 pt-3 border-t border-slate-100 space-y-2">

                    <!-- Login-Informationen -->
                    <div v-if="insurer.loginInfo?.type || insurer.loginInfo?.customNotes" class="bg-brand-50/50 border border-brand-100/60 rounded-lg px-2.5 py-2 space-y-1">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-3 h-3 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                        <span class="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Login</span>
                      </div>
                      <div v-if="insurer.loginInfo?.type" class="text-[11px] font-semibold text-brand-700">{{ getLoginTypeLabel(insurer.loginInfo.type) }}</div>
                      <div v-if="insurer.loginInfo?.customNotes" class="text-[11px] text-slate-600 leading-snug">{{ insurer.loginInfo.customNotes }}</div>
                    </div>

                    <!-- Abrechnungswege -->
                    <div v-if="insurer.abrechnungswege?.csv?.enabled || insurer.abrechnungswege?.pdf?.enabled" class="space-y-1.5">

                      <!-- CSV/Excel -->
                      <div v-if="insurer.abrechnungswege?.csv?.enabled" class="bg-emerald-50/50 border border-emerald-100/60 rounded-lg px-2.5 py-2 space-y-1">
                        <div class="flex items-center gap-1.5">
                          <svg class="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">CSV/Excel</span>
                        </div>
                        <div v-if="insurer.abrechnungswege.csv.link" class="text-[11px] relative z-20">
                          <a :href="insurer.abrechnungswege.csv.link.startsWith('http') ? insurer.abrechnungswege.csv.link : 'https://' + insurer.abrechnungswege.csv.link" target="_blank" rel="noopener" @click.stop class="text-brand-600 hover:text-brand-700 underline decoration-brand-300 hover:decoration-brand-500 break-all leading-snug inline-block cursor-pointer">{{ insurer.abrechnungswege.csv.link }}</a>
                        </div>
                        <div v-if="insurer.abrechnungswege.csv.description" class="text-[11px] text-slate-600 leading-snug">{{ insurer.abrechnungswege.csv.description }}</div>
                      </div>

                      <!-- PDF -->
                      <div v-if="insurer.abrechnungswege?.pdf?.enabled" class="bg-red-50/50 border border-red-100/60 rounded-lg px-2.5 py-2 space-y-1">
                        <div class="flex items-center gap-1.5">
                          <svg class="w-3 h-3 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                          <span class="text-[10px] font-bold text-red-500 uppercase tracking-wider">PDF</span>
                        </div>
                        <div v-if="insurer.abrechnungswege.pdf.link" class="text-[11px] relative z-20">
                          <a :href="insurer.abrechnungswege.pdf.link.startsWith('http') ? insurer.abrechnungswege.pdf.link : 'https://' + insurer.abrechnungswege.pdf.link" target="_blank" rel="noopener" @click.stop class="text-brand-600 hover:text-brand-700 underline decoration-brand-300 hover:decoration-brand-500 break-all leading-snug inline-block cursor-pointer">{{ insurer.abrechnungswege.pdf.link }}</a>
                        </div>
                        <div v-if="insurer.abrechnungswege.pdf.description" class="text-[11px] text-slate-600 leading-snug">{{ insurer.abrechnungswege.pdf.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { exportDetailedOverviewPdf } from '@/utils/exportPdf'
import InsurerStats from './InsurerStats.vue'
import { format, add, isAfter, isToday } from 'date-fns'
import { de } from 'date-fns/locale'
import { useInsurerUtils } from '@/composables/useInsurerUtils';
import { useInsurerStore } from '@/stores/insurerStore';
import InsurerStatus from './InsurerStatus.vue'

// Document type colors to match the detail view
const docTypeColors = {
  'PDF': 'bg-red-100 text-red-800',
  'CSV': 'bg-blue-100 text-blue-800',
  'XLS': 'bg-green-100 text-green-800',
  'XML': 'bg-yellow-100 text-yellow-800',
  'Papier': 'bg-gray-100 text-gray-800',
  'VEMA Pool': 'bg-purple-100 text-purple-800',
  'FEMA Pool': 'bg-indigo-100 text-indigo-800'
};

// Helper function to check if insurer is in a specific pool
const hasPool = (insurer, poolName) => {
  console.group(`Checking for pool '${poolName}' in insurer: ${insurer?.name || 'unknown'}`);
  
  if (!insurer) {
    console.log('No insurer provided');
    console.groupEnd();
    return false;
  }
  
  // Log all properties of the insurer for debugging
  console.log('Insurer properties:', Object.keys(insurer));
  
  // Check vemapool property first (direct boolean check)
  if (insurer.vemapool !== undefined) {
    console.log(`Found 'vemapool' property:`, insurer.vemapool);
    if (poolName.toUpperCase() === 'VEMA' && insurer.vemapool === true) {
      console.log('VEMA pool is active for this insurer');
      console.groupEnd();
      return true;
    }
  }
  
  // Check various possible property names and formats
  const possiblePoolProperties = [
    'vemapool', 'vema_pool', 'vema-pool', 'vemapool',
    'pool', 'pool_name', 'poolName', 'poolType', 'pool_type',
    'verband', 'association', 'gruppe'
  ];
  
  // Also check for properties that might contain pool info in their values
  const allProperties = Object.entries(insurer);
  
  for (const [key, value] of allProperties) {
    // Skip non-string and non-boolean values (except for vemapool which we already checked)
    if (typeof value !== 'string' && typeof value !== 'boolean') continue;
    
    // Check if the property name indicates it might contain pool info
    const normalizedKey = key.toLowerCase();
    const isPoolProperty = possiblePoolProperties.some(prop => 
      normalizedKey.includes(prop.toLowerCase())
    );
    
    // For string values, check if the value contains the pool name
    if (typeof value === 'string' && 
        (isPoolProperty || value.toUpperCase().includes(poolName.toUpperCase()))) {
      console.log(`Found potential pool match in property '${key}':`, value);
      
      const isMatch = value.toUpperCase().includes(poolName.toUpperCase());
      console.log(`Value '${value}' includes '${poolName}':`, isMatch);
      
      if (isMatch) {
        console.groupEnd();
        return true;
      }
    }
  }
  
  console.log('No matching pool information found');
  console.groupEnd();
  return false;
};

// Helper function to get the pool badge class
const getPoolBadgeClass = (insurer) => {
  if (hasPool(insurer, 'VEMA')) return 'pool-stamp vema-stamp';
  if (hasPool(insurer, 'FEMA')) return 'pool-stamp fema-stamp';
  return '';
};

// Helper function to get the pool display name
const getPoolName = (insurer) => {
  if (hasPool(insurer, 'VEMA')) return 'VEMA';
  if (hasPool(insurer, 'FEMA')) return 'FEMA';
  return '';
};

// Login type labels
const loginTypeLabels = {
  direct_login: 'Direkter Login im Maklerportal',
  username_password: 'Direkter Login im Maklerportal',
  easylogin: 'EasyLogin',
  certificate: 'Zertifikat',
  other: 'Sonstiges'
};
const getLoginTypeLabel = (type) => loginTypeLabels[type] || type;

// Check if insurer has any extra info (login or abrechnungswege) to show
const hasExtraInfo = (insurer) => {
  const hasLogin = insurer.loginInfo?.type || insurer.loginInfo?.customNotes;
  const hasCsv = insurer.abrechnungswege?.csv?.enabled;
  const hasPdf = insurer.abrechnungswege?.pdf?.enabled;
  return hasLogin || hasCsv || hasPdf;
};

// Helper function to get the appropriate classes for a document type
const getDocTypeClasses = (docType) => {
  if (!docType) return 'bg-gray-100 text-gray-800'; // Default for unknown types
  
  // Try exact match first
  const exactMatch = docTypeColors[docType];
  if (exactMatch) return exactMatch;
  
  // Try case-insensitive match
  const upperDocType = docType.toUpperCase();
  for (const [key, value] of Object.entries(docTypeColors)) {
    if (key.toUpperCase() === upperDocType) {
      return value;
    }
  }
  
  // Default fallback
  return 'bg-gray-100 text-gray-800';
};

// Initialize utils
const { calculateNextSettlementDate } = useInsurerUtils();
const insurerStore = useInsurerStore();

// Inject currentDate from MainApp for guaranteed reactivity
const injectedCurrentDate = inject('currentDate', null);


// Props
const props = defineProps({
  insurers: {
    type: Array,
    default: () => []
  },
  selectedInsurer: {
    type: [Object, null],
    default: null
  },
  currentDate: {
    type: [Date, Object],
    default: () => new Date()
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  statusFilter: {
    type: String,
    default: null
  },
  sortOption: {
    type: String,
    default: 'name'
  },
  sortBy: {
    type: String,
    default: 'name'
  },
  lastInvoices: {
    type: Object,
    default: () => ({})
  }
})

// Debug log for currentDate
console.log('InsurerList - currentDate:', props.currentDate)

// Emits
const emit = defineEmits(['select-insurer', 'clear-selection'])

// Methods
function handleZustellungswegFilter(zustellungsweg) {
  console.log('handleZustellungswegFilter called with:', zustellungsweg);
  
  // Normalize the value for comparison
  const currentFilter = activeZustellungswegFilter.value;
  const currentNormalized = currentFilter ? currentFilter.toString().trim().toLowerCase() : null;
  const newNormalized = zustellungsweg ? zustellungsweg.toString().trim().toLowerCase() : null;
  
  if (currentNormalized === newNormalized) {
    // Clicking the same filter again removes it
    console.log('Removing zustellungsweg filter');
    activeZustellungswegFilter.value = null;
  } else {
    // Apply the new filter and switch to list view
    console.log('Setting zustellungsweg filter to:', zustellungsweg);
    activeZustellungswegFilter.value = zustellungsweg;
    viewMode.value = 'list';
  }
  
  console.log('Active zustellungsweg filter after update:', activeZustellungswegFilter.value);
}

function handleTurnusFilter(turnus) {
  console.log('handleTurnusFilter called with:', turnus);
  
  // Normalize the value for comparison
  const currentFilter = activeTurnusFilter.value;
  const currentNormalized = currentFilter ? currentFilter.toString().trim().toLowerCase() : null;
  const newNormalized = turnus ? turnus.toString().trim().toLowerCase() : null;
  
  if (currentNormalized === newNormalized) {
    // Clicking the same filter again removes it
    console.log('Removing turnus filter');
    activeTurnusFilter.value = null;
  } else {
    // Apply the new filter and switch to list view
    console.log('Setting turnus filter to:', turnus);
    activeTurnusFilter.value = turnus;
    viewMode.value = 'list';
  }
  
  console.log('Active turnus filter after update:', activeTurnusFilter.value);
}

function handleDokumentenartFilter(dokumentenart) {
  console.log('handleDokumentenartFilter called with:', dokumentenart);
  
  // Normalize the value for comparison
  const currentFilter = activeDokumentenartFilter.value;
  const currentNormalized = currentFilter ? currentFilter.toString().trim().toLowerCase() : null;
  const newNormalized = dokumentenart ? dokumentenart.toString().trim().toLowerCase() : null;
  
  if (currentNormalized === newNormalized) {
    // Clicking the same filter again removes it
    console.log('Removing dokumentenart filter');
    activeDokumentenartFilter.value = null;
  } else {
    // Apply the new filter and switch to list view
    console.log('Setting dokumentenart filter to:', dokumentenart);
    activeDokumentenartFilter.value = dokumentenart;
    viewMode.value = 'list';
  }
  
  console.log('Active dokumentenart filter after update:', activeDokumentenartFilter.value);
}

// Refs
const activeTurnusFilter = ref(null)
const activeDokumentenartFilter = ref(null)
const viewMode = ref('list')
const showExportDialog = ref(false)
const exportSortBy = ref('name')
const scrollContainer = ref(null)
const activeZustellungswegFilter = ref(null)

// Debug
onMounted(() => {
  console.log('InsurerList mounted')
  console.log('viewMode:', viewMode.value)
  console.log('props.insurers:', props.insurers)
  console.log('safeInsurers:', safeInsurers.value)
  console.log('isLoading:', props.isLoading)
})

// Computed
const effectiveCurrentDate = computed(() => {
  if (injectedCurrentDate && injectedCurrentDate.value) {
    return injectedCurrentDate.value;
  }
  return props.currentDate;
});

const insurersWithStatus = computed(() => {
  if (!props.insurers) return [];
  return props.insurers.map(insurer => ({
    ...insurer,
    status: insurerStore.getInsurerStatus(insurer, effectiveCurrentDate.value)
  }));
});

const safeInsurers = computed(() => {
  console.group('safeInsurers computed');
  
  // Process insurers with additional data and filtering
  function processInsurers(insurers) {
    // If no insurers, return empty array
    if (!insurers || !Array.isArray(insurers)) {
      console.log('[SAFE_INSURERS] No insurers or invalid data');
      return [];
    }
    
    // Add test pool data to the first insurer for debugging
    if (insurers.length > 0) {
      // Create a copy of the first insurer with test pool data
      const firstInsurer = { 
        ...insurers[0],
        pool: 'VEMA',  // Test pool data
        pool_name: 'VEMA Pool',
        verband: 'VEMA Verband'
      };
      
      // Create a new array with the modified first insurer
      const modifiedInsurers = [firstInsurer, ...insurers.slice(1)];
      console.log('[SAFE_INSURERS] First insurer with test pool data:', firstInsurer);
      
      // Use the modified array for further processing
      return modifiedInsurers;
    }
    
    return insurers;
  }

  console.log('[SAFE_INSURERS] Raw insurers prop:', props.insurers);
  
  if (!props.insurers) {
    console.warn('[SAFE_INSURERS] No insurers array found in props');
    console.groupEnd();
    return [];
  }
  
  // Process the insurers with the test data
  const processedInsurers = processInsurers(props.insurers);
  
  console.log(`[SAFE_INSURERS] Processed ${processedInsurers.length} insurers`);
  
  // Log detailed info about the first insurer if available
  if (processedInsurers.length > 0) {
    const firstInsurer = processedInsurers[0];
    console.log('[SAFE_INSURERS] First insurer sample:', {
      id: firstInsurer.id,
      name: firstInsurer.name,
      hasLastInvoice: !!firstInsurer.last_invoice,
      pool: firstInsurer.pool,
      keys: Object.keys(firstInsurer)
    });
    
    // Log all insurers with their pool property
    console.log('[SAFE_INSURERS] All insurers pool status:', 
      processedInsurers.map(i => ({
        name: i.name,
        pool: i.pool,
        hasPoolProperty: 'pool' in i
      }))
    );
  } else {
    console.log('[SAFE_INSURERS] No insurers in the array');
  }
  
  // Use the processed insurers with test data for filtering
  let filteredInsurers = [...processedInsurers];
  
  // Apply status filter if active
  if (props.statusFilter) {
    console.log('[SAFE_INSURERS] Applying status filter:', props.statusFilter);
    filteredInsurers = filteredInsurers.filter(insurer => {
      const status = insurer.status;
      const filterValue = props.statusFilter.toLowerCase().trim();
      const matches = status === filterValue;
      console.log(`[SAFE_INSURERS] Insurer ${insurer.name || insurer.id}:`, {
        status,
        filterValue,
        matches,
        hasLastInvoice: !!insurer.last_invoice,
        lastInvoiceDate: insurer.last_invoice?.date,
        turnus: insurer.turnus
      });
      return matches;
    });
    console.log(`[SAFE_INSURERS] After status filter: ${filteredInsurers.length} insurers`);
  }
  
  // Apply zustellungsweg filter if active - case insensitive and trimmed comparison
  if (activeZustellungswegFilter.value) {
    const filterValue = activeZustellungswegFilter.value.toString().trim().toLowerCase();
    const isNichtAngegeben = filterValue === 'nicht angegeben' || filterValue === '';
    
    console.log('Filtering for zustellungsweg:', {
      filterValue,
      isNichtAngegeben,
      activeFilter: activeZustellungswegFilter.value,
      filteredInsurersCount: filteredInsurers.length
    });
    
    filteredInsurers = filteredInsurers.filter(insurer => {
      const zustellungsweg = getSafeZustellungsweg(insurer);
      const normalizedZustellungsweg = zustellungsweg ? zustellungsweg.toString().trim().toLowerCase() : 'nicht angegeben';
      
      console.log('Checking insurer:', {
        id: insurer.id,
        name: insurer.name,
        rawZustellungsweg: insurer.zustellungsweg,
        safeZustellungsweg: zustellungsweg,
        normalizedZustellungsweg,
        matches: normalizedZustellungsweg === filterValue
      });
      
      return isNichtAngegeben 
        ? !normalizedZustellungsweg || normalizedZustellungsweg === 'nicht angegeben' || normalizedZustellungsweg === ''
        : normalizedZustellungsweg === filterValue;
    });
    
    console.log('After zustellungsweg filter:', filteredInsurers.length, 'insurers remaining');
  }
  
  // Apply dokumentenart filter if active
  if (activeDokumentenartFilter.value) {
    const dokumentenartValue = activeDokumentenartFilter.value.toString().trim().toLowerCase();
    console.log('Filtering for dokumentenart:', dokumentenartValue);
    
    filteredInsurers = filteredInsurers.filter(insurer => {
      const dokumentenart = insurer.dokumentenart || '';
      const normalizedDokumentenart = dokumentenart.toString().trim().toLowerCase();
      
      console.log('Checking insurer:', {
        id: insurer.id,
        name: insurer.name,
        dokumentenart: dokumentenart,
        normalizedDokumentenart,
        matches: normalizedDokumentenart.includes(dokumentenartValue)
      });
      
      return normalizedDokumentenart.includes(dokumentenartValue);
    });
    
    console.log('After dokumentenart filter:', filteredInsurers.length, 'insurers remaining');
  }
  
  // Apply turnus filter if active
  if (activeTurnusFilter.value) {
    const turnusValue = activeTurnusFilter.value.toString().trim().toLowerCase();
    console.log('Filtering for turnus:', turnusValue);
    
    filteredInsurers = filteredInsurers.filter(insurer => {
      const turnus = insurer.turnus?.toString().trim().toLowerCase() || 'nicht angegeben';
      return turnus === turnusValue;
    });
  }
  
  // Sort insurers
  const sortedInsurers = [...filteredInsurers].sort((a, b) => {
    if (props.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (props.sortBy === 'status') {
      const statusA = getStatus(a, effectiveCurrentDate.value);
      const statusB = getStatus(b, effectiveCurrentDate.value);
      return statusA.localeCompare(statusB);
    }
    return 0;
  });
  
  // Log detailed info about the first insurer for debugging
  if (props.insurers.length > 0) {
    console.log('--- First Insurer Debug Info ---');
    const sampleInsurer = props.insurers[0];
    console.log('Sample insurer:', sampleInsurer);
  }
  
  console.log(`Returning ${sortedInsurers.length} insurers`);
  console.groupEnd();
  return sortedInsurers;
});

// Helper function to safely get Zustellungsweg from insurer object
const getSafeZustellungsweg = (insurer) => {
  const z = insurer?.zustellungsweg || insurer?.zustellweg || insurer?.bezugsweg;
  if (!z) return '';
  if (typeof z === 'string') return z;
  if (Array.isArray(z)) {
    const first = z[0];
    if (typeof first === 'object' && first) return first.value || first.label || first.name || '';
    return first || '';
  }
  if (typeof z === 'object') return z.value || z.label || z.name || '';
  return String(z);
};

// Helper function to safely access properties from Proxy objects
const getInsurerProperty = (insurer, prop) => {
  try {
    // Try direct access first
    if (insurer[prop] !== undefined) return insurer[prop];
    
    // Try with Vue's reactive proxy
    if (insurer._rawValue && insurer._rawValue[prop] !== undefined) {
      return insurer._rawValue[prop];
    }
    
    // Try with common proxy patterns
    if (insurer.$ && insurer.$[prop] !== undefined) return insurer.$[prop];
    if (insurer.target && insurer.target[prop] !== undefined) return insurer.target[prop];
    
    return undefined;
  } catch (e) {
    console.warn('Error accessing property:', prop, 'on insurer:', insurer);
    return undefined;
  }
};

const safeSelectedInsurer = computed(() => {
  console.log('safeSelectedInsurer computed - selectedInsurer:', props.selectedInsurer);
  return props.selectedInsurer || null;
});

const formatLastInvoice = (lastInvoice) => {
  try {
    if (!lastInvoice) return 'Keine Abrechnung';
    if (typeof lastInvoice === 'string') {
      const trimmed = lastInvoice.trim();
      if (!trimmed) return 'Keine Abrechnung';
      return trimmed;
    }
    if (typeof lastInvoice === 'object' && lastInvoice !== null) {
      if (lastInvoice.display) return lastInvoice.display;
      if (lastInvoice.seconds) return formatDate(new Date(lastInvoice.seconds * 1000));
      if (lastInvoice.date) return formatDate(lastInvoice.date);
      if (lastInvoice.datum) return formatDate(lastInvoice.datum);
    }
    return 'Keine Abrechnung';
  } catch (error) {
    console.error('Error formatting last invoice:', error);
    return 'Keine Abrechnung';
  }
}

const formatDate = (dateValue) => {
  try {
    if (!dateValue) return ''
    let date
    
    if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
      date = dateValue.toDate()
    } else if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      date = new Date(dateValue.seconds * 1000)
    } else {
      date = new Date(dateValue)
    }

    if (isNaN(date.getTime())) return 'Ungültiges Datum'
    
    return format(date, 'dd.MM.yyyy', { locale: de })
  } catch (error) {
    console.error('Error in formatDate:', error, 'Value:', dateValue)
    return 'Fehler beim Formatieren'
  }
}

// Format next due date for display on the card header
const formatNextDue = (insurer) => {
  try {
    if (!insurer) {
      return '–';
    }

    const insurerStore = useInsurerStore();
    const lastInvoice = insurer.last_invoice || insurerStore.lastInvoices[insurer.id];

    if (!lastInvoice) {
      return 'Keine Abrechnung';
    }

    // Extract date value from various possible formats (same logic as formatLastInvoice)
    let dateValue;
    
    // Handle direct string format (e.g., "11.10.2025")
    if (typeof lastInvoice === 'string') {
      dateValue = lastInvoice.trim();
      if (!dateValue) return 'Keine Abrechnung';
    }
    // Handle object formats
    else if (typeof lastInvoice === 'object' && lastInvoice !== null) {
      if (lastInvoice.display) {
        dateValue = lastInvoice.display;
      } else if (lastInvoice.seconds) {
        dateValue = lastInvoice; // Will be handled by parseToDate
      } else if (lastInvoice.date) {
        dateValue = lastInvoice.date;
      } else if (lastInvoice.datum) {
        dateValue = lastInvoice.datum;
      } else {
        return 'Keine Abrechnung';
      }
    } else {
      return 'Keine Abrechnung';
    }

    // Parse the extracted date value to a Date object
    let lastDateValue = parseToDate(dateValue);
    
    if (!lastDateValue || !(lastDateValue instanceof Date) || isNaN(lastDateValue.getTime())) {
      return 'Ungültiges Datum';
    }

    // Parse turnus to days
    let turnusDays = 7; // default
    if (insurer.turnus) {
      const turnusStr = String(insurer.turnus);
      // Extract number from formats like '7', '7-tägig', '31-tägig', 'Jährlich'
      const match = turnusStr.match(/\d+/);
      if (match) {
        turnusDays = parseInt(match[0], 10);
      } else if (turnusStr.toLowerCase().includes('jährlich')) {
        turnusDays = 365;
      }
    }
    
    // Calculate next date
    const nextDate = new Date(lastDateValue);
    nextDate.setDate(nextDate.getDate() + turnusDays);

    return format(nextDate, 'dd.MM.yyyy', { locale: de });
  } catch (e) {
    console.error('[formatNextDue] Exception:', e);
    return 'Fehler';
  }
}

// Helper function to parse various date formats to a Date object
const parseToDate = (dateValue) => {
  try {
    if (!dateValue) return null;
    
    // Handle Firestore Timestamp with toDate method
    if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
      return dateValue.toDate();
    }
    
    // Handle Firestore Timestamp with seconds property
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      return new Date(dateValue.seconds * 1000);
    }
    
    // Handle Date object
    if (dateValue instanceof Date) {
      return new Date(dateValue);
    }
    
    // Handle string formats
    if (typeof dateValue === 'string') {
      const trimmed = dateValue.trim();
      
      // Handle DD.MM.YYYY format
      if (trimmed.includes('.')) {
        const parts = trimmed.split('.');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const year = parseInt(parts[2], 10);
          return new Date(year, month, day);
        }
      }
      
      // Try ISO format or other standard formats
      return new Date(trimmed);
    }
    
    // Fallback
    return new Date(dateValue);
  } catch (e) {
    console.error('Error in parseToDate:', e);
    return null;
  }
}

const exportToPdf = () => {
  console.log('Export button clicked, opening dialog')
  showExportDialog.value = true
}

const confirmExport = async () => {
  try {
    console.log('Starting PDF export with sort by:', exportSortBy.value)
    console.log('Number of insurers to export:', safeInsurers.value?.length)
    await exportDetailedOverviewPdf(safeInsurers.value, exportSortBy.value)
    showExportDialog.value = false
  } catch (error) {
    console.error('Error exporting PDF:', error)
  }
}

// Debug function to check first insurer's data
const debugFirstInsurer = () => {
  if (props.insurers && props.insurers.length > 0) {
    const firstInsurer = props.insurers[0];
    console.group('First Insurer Debug Info');
    console.log('First Insurer:', firstInsurer);
    console.log('Has pool property:', 'pool' in firstInsurer);
    console.log('All properties:', Object.keys(firstInsurer));
    console.groupEnd();
    
    // Force check for VEMA pool
    console.log('Checking for VEMA pool...');
    hasPool(firstInsurer, 'VEMA');
  } else {
    console.log('No insurers available to debug');
  }
};

// Lifecycle
onMounted(() => {
  console.group('InsurerList - onMounted');
  console.log('Component mounted with props:', {
    insurersCount: props.insurers ? props.insurers.length : 0,
    isLoading: props.isLoading,
    currentDate: props.currentDate,
    selectedInsurer: props.selectedInsurer
  });
  console.log('View mode:', viewMode.value);
  
  // Log first insurer details if available
  if (props.insurers && props.insurers.length > 0) {
    console.log('First insurer sample:', {
      id: props.insurers[0].id,
      name: props.insurers[0].name,
      lastInvoice: props.insurers[0].lastInvoice
    });
  }
  
  console.groupEnd();
});

// Watchers
watch(() => props.insurers, (newInsurers, oldInsurers) => {
  console.group('InsurerList - insurers watcher');
  console.log('Insurers prop changed:', {
    oldLength: oldInsurers?.length || 0,
    newLength: newInsurers?.length || 0,
    newInsurers: newInsurers
  });
  console.groupEnd();
}, { immediate: true, deep: true });

watch(() => props.currentDate, (newDate, oldDate) => {
  console.log('Current date changed:', { oldDate, newDate });
}, { deep: true });

watch(() => props.selectedInsurer, (newSelected, oldSelected) => {
  console.log('Selected insurer changed:', { 
    oldId: oldSelected?.id, 
    newId: newSelected?.id 
  });
}, { deep: true });
</script>

<style scoped>
.pool-stamp {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 2.8rem;
  font-size: 2.25rem;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 9999px;
  border: 6px solid rgba(220, 38, 38, 0.3);
  color: rgba(220, 38, 38, 0.85);
  background: rgba(254, 226, 226, 0.7);
  letter-spacing: 0.08em;
  box-shadow: 0 22px 42px rgba(220, 38, 38, 0.2);
  transform: rotate(-25deg);
  transform-origin: center;
  pointer-events: none;
}

.pool-stamp::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 3px dashed rgba(220, 38, 38, 0.35);
  pointer-events: none;
}

.vema-stamp {
  color: rgba(30, 64, 175, 0.9);
  border-color: rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.92), rgba(221, 214, 254, 0.88));
  box-shadow: 0 24px 46px rgba(59, 130, 246, 0.25);
}

.vema-stamp::after {
  border-color: rgba(49, 89, 196, 0.4);
}

.fema-stamp {
  color: rgba(76, 29, 149, 0.9);
  border-color: rgba(124, 58, 237, 0.5);
  background: linear-gradient(135deg, rgba(233, 213, 255, 0.92), rgba(196, 181, 253, 0.88));
  box-shadow: 0 24px 46px rgba(124, 58, 237, 0.25);
}

.fema-stamp::after {
  border-color: rgba(91, 33, 182, 0.4);
}
</style>
