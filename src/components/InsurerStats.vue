<template>
  <!-- PDF Export Button - Above the card -->
  <div class="mb-2">
    <button 
      @click="exportToPdf"
      class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Als PDF exportieren
    </button>
  </div>
  
  <div class="p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg">
    <!-- Distributions (high visibility) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Zustellungsweg Distribution -->
      <div class="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center mb-5">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Zustellungswege</h3>
        </div>
        <div v-if="sortedZustellungswege.length" class="space-y-4">
          <div v-for="row in sortedZustellungswege" :key="row.name" class="group cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-all" @click="emit('filter-by-zustellungsweg', row.name)">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-bold text-gray-900 group-hover:text-blue-700 tracking-tight">{{ row.name }}</span>
              <span class="text-gray-600 font-semibold">{{ row.count }} · <span class="text-blue-600 font-extrabold">{{ percent(row.count, stats.total) }}</span></span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div class="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700" :style="{ width: percentNumber(row.count, stats.total) + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 text-center py-8">Keine Daten verfügbar</div>
      </div>

      <!-- Dokumentenformate Distribution -->
      <div class="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center mb-5">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Dokumentenformate</h3>
        </div>
        <div v-if="sortedDocTypes.length" class="space-y-4">
          <div v-for="row in sortedDocTypes" :key="row.name" class="group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all" @click="emit('filter-by-dokumentenart', row.name)">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-bold text-gray-900 group-hover:text-purple-700 tracking-tight">{{ row.name }}</span>
              <span class="text-gray-600 font-semibold">{{ row.count }} · <span class="text-purple-600 font-extrabold">{{ percent(row.count, stats.total) }}</span></span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div class="h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 group-hover:from-purple-600 group-hover:to-purple-700" :style="{ width: percentNumber(row.count, stats.total) + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 text-center py-8">Keine Daten verfügbar</div>
      </div>
    </div>
    
    <!-- Incomplete Cards Section -->
    <div class="mt-8 bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Unvollständige Einträge <span class="text-amber-600 font-extrabold">({{ uniqueIncompleteInsurers.length || 0 }})</span></h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Missing Document Types -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-xl border border-amber-200 shadow-sm">
          <h4 class="font-medium text-amber-800 mb-2">Ohne Dokumentenart ({{ insurersWithoutDocType.length || 0 }})</h4>
          <div v-if="insurersWithoutDocType.length > 0" class="space-y-2">
            <div v-for="insurer in insurersWithoutDocType" :key="insurer.id" 
                 class="flex items-center justify-between p-2 hover:bg-amber-100 rounded">
              <span class="text-sm font-medium text-gray-700">{{ insurer.name || 'Unbenannter Eintrag' }}</span>
              <button @click="handleSelectInsurer(insurer)" 
                      class="text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50 transition-colors">
                Bearbeiten
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-amber-700">Keine Einträge ohne Dokumentenart vorhanden</p>
        </div>
        
        <!-- Missing Delivery Method -->
        <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 class="font-medium text-amber-800 mb-2">Ohne Zustellungsweg ({{ insurersWithoutZustellungsweg.length || 0 }})</h4>
          <div v-if="insurersWithoutZustellungsweg.length > 0" class="space-y-2">
            <div v-for="insurer in insurersWithoutZustellungsweg" :key="insurer.id"
                 class="flex items-center justify-between p-2 hover:bg-amber-100 rounded">
              <span class="text-sm font-medium text-gray-700">{{ insurer.name || 'Unbenannter Eintrag' }}</span>
              <button @click="handleSelectInsurer(insurer)" 
                      class="text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50 transition-colors">
                Bearbeiten
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-amber-700">Keine Einträge ohne Zustellungsweg vorhanden</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useInsurerStore } from '@/stores/insurerStore.js';
import { useInsurerUtils } from '@/composables/useInsurerUtils.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const emit = defineEmits(['filter-by-zustellungsweg', 'filter-by-turnus', 'filter-by-dokumentenart', 'select-insurer']);

const props = defineProps({
  insurers: {
    type: Array,
    required: true,
    default: () => []
  },
  currentDate: {
    type: [Date, String, Number],
    default: () => new Date()
  }
});

const insurerStore = useInsurerStore();

// Handler for selecting an insurer
const handleSelectInsurer = (insurer) => {
  console.log('[InsurerStats] Bearbeiten clicked for:', insurer.name, insurer);
  emit('select-insurer', insurer);
};

// Debug function to log insurer data
const debugIncompleteInsurers = (insurers) => {
  console.log('=== DEBUG: Checking incomplete insurers ===');
  console.log('Total insurers:', insurers.length);
  
  insurers.forEach((insurer, index) => {
    if (!insurer) return;
    
    const docTypes = normalizeDocTypes(insurer.dokumentenart);
    const zustellungsweg = getSafeZustellungsweg(insurer);
    const normalizedZustellungsweg = normalizeZustellungsweg(zustellungsweg);
    
    const isMissingDocType = docTypes.length === 0;
    const isMissingZustellungsweg = !zustellungsweg || zustellungsweg.trim() === '' || normalizedZustellungsweg === 'Nicht angegeben';
    
    if (isMissingDocType || isMissingZustellungsweg) {
      console.log(`\nInsurer ${index + 1}:`, insurer.name || 'Unnamed Insurer');
      console.log('Document Types:', insurer.dokumentenart, '→', docTypes, isMissingDocType ? 'MISSING' : 'OK');
      console.log('Zustellungsweg:', {
        raw: insurer.zustellungsweg || insurer.zustellweg || insurer.bezugsweg,
        safe: zustellungsweg,
        normalized: normalizedZustellungsweg,
        status: isMissingZustellungsweg ? 'MISSING' : 'OK'
      });
    }
  });
  console.log('=== END DEBUG ===');
};

// Enhanced function to check for missing document types
const isMissingDocType = (insurer) => {
  if (!insurer) return false;
  
  // Debug log for the current insurer being checked
  const debugLog = [];
  const shouldDebug = process.env.NODE_ENV === 'development';
  
  if (shouldDebug) {
    debugLog.push(`Checking insurer: ${insurer.name || 'Unnamed'} (ID: ${insurer.id})`);
    debugLog.push(`Raw dokumentenart:`, insurer.dokumentenart);
  }
  
  // Check if dokumentenart is missing, null, empty array, or empty string
  if (!insurer.dokumentenart || 
      (Array.isArray(insurer.dokumentenart) && insurer.dokumentenart.length === 0) ||
      (typeof insurer.dokumentenart === 'string' && insurer.dokumentenart.trim() === '')) {
    if (shouldDebug) debugLog.push('Missing dokumentenart - returning true');
    return true;
  }
  
  // Check if normalization results in empty array
  const docTypes = normalizeDocTypes(insurer.dokumentenart);
  const isEmpty = docTypes.length === 0;
  
  if (shouldDebug) {
    debugLog.push(`Normalized docTypes:`, docTypes);
    debugLog.push(`Is empty: ${isEmpty}`);
    console.log(debugLog.join('\n'));
  }
  
  return isEmpty;
};

// Enhanced function to check for missing delivery method
const isMissingZustellungsweg = (insurer) => {
  if (!insurer) return false;
  
  // Debug log for the current insurer being checked
  const debugLog = [];
  const shouldDebug = process.env.NODE_ENV === 'development';
  
  if (shouldDebug) {
    debugLog.push(`Checking insurer: ${insurer.name || 'Unnamed'} (ID: ${insurer.id})`);
    debugLog.push(`Raw zustellungsweg:`, insurer.zustellungsweg);
    debugLog.push(`Raw zustellweg:`, insurer.zustellweg);
    debugLog.push(`Raw bezugsweg:`, insurer.bezugsweg);
  }
  
  // Check all possible field names for delivery method
  const hasNoZustellungsweg = !insurer.zustellungsweg && 
                            !insurer.zustellweg && 
                            !insurer.bezugsweg;
  
  // If all fields are missing, it's definitely missing
  if (hasNoZustellungsweg) {
    if (shouldDebug) debugLog.push('No zustellungsweg found - returning true');
    return true;
  }
  
  // Check the normalized value
  const zustellungsweg = getSafeZustellungsweg(insurer);
  const normalized = normalizeZustellungsweg(zustellungsweg);
  const isMissing = !zustellungsweg || 
                   zustellungsweg.trim() === '' || 
                   normalized === 'Nicht angegeben' ||
                   normalized === 'nicht angegeben';
  
  if (shouldDebug) {
    debugLog.push(`Safe zustellungsweg: ${zustellungsweg}`);
    debugLog.push(`Normalized: ${normalized}`);
    debugLog.push(`Is missing: ${isMissing}`);
    console.log(debugLog.join('\n'));
  }
  
  return isMissing;
};

// Get insurers missing document types
const insurersWithoutDocType = computed(() => {
  if (!props.insurers || props.insurers.length === 0) return [];
  
  const result = props.insurers.filter(insurer => {
    return isMissingDocType(insurer);
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Found ${result.length} insurers without document type`);
  }
  
  return result;
});

// Get insurers missing delivery method
const insurersWithoutZustellungsweg = computed(() => {
  if (!props.insurers || props.insurers.length === 0) return [];
  
  const result = props.insurers.filter(insurer => {
    return isMissingZustellungsweg(insurer);
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Found ${result.length} insurers without zustellungsweg`);
  }
  
  return result;
});

// Get unique incomplete insurers (without duplicates between the two categories)
const uniqueIncompleteInsurers = computed(() => {
  if (!props.insurers || props.insurers.length === 0) return [];
  
  // Create a Map to store unique insurers by ID
  const uniqueInsurers = new Map();
  
  // Add all insurers without doc type
  insurersWithoutDocType.value.forEach(insurer => {
    if (insurer && insurer.id) {
      uniqueInsurers.set(insurer.id, insurer);
    }
  });
  
  // Add all insurers without zustellungsweg
  insurersWithoutZustellungsweg.value.forEach(insurer => {
    if (insurer && insurer.id) {
      uniqueInsurers.set(insurer.id, insurer);
    }
  });
  
  // Convert Map values to array and log for debugging
  const result = Array.from(uniqueInsurers.values());
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Found ${result.length} unique insurers with incomplete data`);
    if (result.length > 0) {
      console.log('Sample incomplete insurers:', 
        result.slice(0, 3).map(i => ({
          id: i.id,
          name: i.name,
          dokumentenart: i.dokumentenart,
          zustellungsweg: i.zustellungsweg || i.zustellweg || i.bezugsweg
        }))
      );
    }
  }
  
  return result;
});
const { calculateDaysOverdue, calculateNextSettlementDate, parseTurnus } = useInsurerUtils();

// Debug: Log initial data when component mounts
onMounted(() => {
  console.log('=== INSURER STATS DEBUGGING ===');
  console.log('Total insurers received:', props.insurers?.length || 0);
  
  if (props.insurers && props.insurers.length > 0) {
    // Log a few sample insurers
    const sampleSize = Math.min(3, props.insurers.length);
    console.log(`=== SAMPLE OF ${sampleSize} INSURERS ===`);
    
    for (let i = 0; i < sampleSize; i++) {
      const insurer = props.insurers[i];
      if (!insurer) continue;
      
      const docTypes = normalizeDocTypes(insurer.dokumentenart);
      const zustellungsweg = getSafeZustellungsweg(insurer);
      const normalizedZustellungsweg = normalizeZustellungsweg(zustellungsweg);
      
      console.log(`\nInsurer ${i + 1}: ${insurer.name || 'Unnamed'}`);
      console.log('  - dokumentenart (raw):', insurer.dokumentenart);
      console.log('  - dokumentenart (normalized):', docTypes);
      console.log('  - zustellungsweg (raw):', insurer.zustellungsweg);
      console.log('  - zustellweg (raw):', insurer.zustellweg);
      console.log('  - bezugsweg (raw):', insurer.bezugsweg);
      console.log('  - safeZustellungsweg:', zustellungsweg);
      console.log('  - normalizedZustellungsweg:', normalizedZustellungsweg);
      console.log('  - Is missing doc type?', docTypes.length === 0);
      console.log('  - Is missing zustellungsweg?', 
                 !zustellungsweg || 
                 zustellungsweg.trim() === '' || 
                 normalizedZustellungsweg === 'Nicht angegeben');
    }
    
    // Count missing data
    const missingDocType = props.insurers.filter(i => {
      const dt = normalizeDocTypes(i?.dokumentenart);
      return dt.length === 0;
    }).length;
    
    const missingZustellungsweg = props.insurers.filter(i => {
      const z = getSafeZustellungsweg(i);
      const nz = normalizeZustellungsweg(z);
      return !z || z.trim() === '' || nz === 'Nicht angegeben';
    }).length;
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total insurers: ${props.insurers.length}`);
    console.log(`Missing document types: ${missingDocType}`);
    console.log(`Missing zustellungsweg: ${missingZustellungsweg}`);
  } else {
    console.log('No insurers data available');
  }
  
  console.log('=== END INSURER STATS DEBUGGING ===');
  
  // Run the detailed debug function
  debugIncompleteInsurers(props.insurers);
});
// Debug function to log insurer data
const debugInsurerData = (insurers) => {
  console.log('=== DEBUG: Insurer Data ===');
  console.log(`Total insurers: ${insurers?.length || 0}`);
  
  if (insurers && insurers.length > 0) {
    console.log('Sample insurer (first 3):', JSON.parse(JSON.stringify(insurers.slice(0, 3))));
    
    // Check document types
    const withDocType = insurers.filter(i => {
      if (!i) return false;
      const docTypes = normalizeDocTypes(i.dokumentenart);
      return docTypes && docTypes.length > 0;
    });
    
    // Check delivery methods
    const withZustellungsweg = insurers.filter(i => {
      if (!i) return false;
      const zustellungsweg = getSafeZustellungsweg(i);
      const normalized = normalizeZustellungsweg(zustellungsweg);
      return zustellungsweg && 
             zustellungsweg.trim() !== '' && 
             normalized !== 'Nicht angegeben' &&
             normalized !== 'nicht angegeben';
    });
    
    console.log(`Insurers with document type: ${withDocType.length}/${insurers.length}`);
    console.log(`Insurers with delivery method: ${withZustellungsweg.length}/${insurers.length}`);
    
    // Log first few insurers without document type
    const withoutDocType = insurers.filter((i, idx) => {
      if (!i) return false;
      const docTypes = normalizeDocTypes(i.dokumentenart);
      return !docTypes || docTypes.length === 0;
    });
    
    if (withoutDocType.length > 0) {
      console.log('First 3 insurers without document type:', 
        JSON.parse(JSON.stringify(withoutDocType.slice(0, 3))));
    }
    
    // Log first few insurers without delivery method
    const withoutZustellungsweg = insurers.filter(i => {
      if (!i) return false;
      const zustellungsweg = getSafeZustellungsweg(i);
      const normalized = normalizeZustellungsweg(zustellungsweg);
      return !zustellungsweg || 
             zustellungsweg.trim() === '' || 
             normalized === 'Nicht angegeben' ||
             normalized === 'nicht angegeben';
    });
    
    if (withoutZustellungsweg.length > 0) {
      console.log('First 3 insurers without delivery method:', 
        JSON.parse(JSON.stringify(withoutZustellungsweg.slice(0, 3))));
    }
  }
  
  console.log('=== END DEBUG ===');
};

const stats = computed(() => {
  // Debug the insurers data when stats are computed
  if (process.env.NODE_ENV === 'development') {
    debugInsurerData(props.insurers);
  }
  
  const result = {
    total: 0,
    byStatus: {
      critical: 0,
      warning: 0,
      on_time: 0,
      no_invoice: 0
    },
    byZustellungsweg: {},
    byTurnus: {},
    byDokumentenart: {}
  };

  const current = props.currentDate ? new Date(props.currentDate) : new Date();
  const source = (props.insurers && props.insurers.length) ? props.insurers : (insurerStore.insurers || []);

  source.forEach(insurer => {
    if (!insurer) return;
    result.total++;

    // Status (centralized)
    const s = insurerStore.getInsurerStatus(insurer, current);
    if (result.byStatus[s] === undefined) result.byStatus[s] = 0;
    result.byStatus[s] += 1;

    // Zustellungsweg (nur zählen wenn vorhanden)
    const zustRaw = getSafeZustellungsweg(insurer);
    if (zustRaw) {
      const zust = normalizeZustellungsweg(zustRaw);
      result.byZustellungsweg[zust] = (result.byZustellungsweg[zust] || 0) + 1;
    }

    // Turnus
    const turnus = insurer.turnus || 'Nicht angegeben';
    result.byTurnus[turnus] = (result.byTurnus[turnus] || 0) + 1;

    // Dokumentenarten
    const docs = normalizeDocTypes(insurer.dokumentenart);
    docs.forEach(doc => {
      result.byDokumentenart[doc] = (result.byDokumentenart[doc] || 0) + 1;
    });
  });

  return result;
});

const percent = (part, total) => {
  if (!total || !part) return '0.0%';
  return ((part / total) * 100).toFixed(1) + '%';
};
const percentNumber = (part, total) => {
  if (!total || !part) return 0;
  return parseFloat(((part / total) * 100).toFixed(1));
};

const derived = computed(() => {
  const current = props.currentDate ? new Date(props.currentDate) : new Date();
  const rows = (props.insurers || []).map(i => {
    const days = calculateDaysOverdue(i, current);
    let lastDate = null;
    const inv = insurerStore.lastInvoices[i.id] || i.last_invoice;
    if (inv?.date) {
      lastDate = inv.date?.toDate ? inv.date.toDate() : new Date(inv.date);
    } else if (typeof inv === 'string') {
      const d = new Date(inv);
      lastDate = isNaN(d.getTime()) ? null : d;
    }
    return {
      id: i.id,
      name: i.name,
      daysOverdue: typeof days === 'number' ? days : null,
      lastInvoiceDate: lastDate,
      turnusDays: (() => {
        const td = parseTurnus(i.turnus);
        return (td === null || Number.isNaN(td)) ? null : td;
      })(),
      dueDate: calculateNextSettlementDate(i, current)
    };
  });
  return rows;
});

const kpis = computed(() => {
  // Keep only one KPI here for simplicity (avg turnus) to avoid clutter
  const vals = derived.value;
  const turnusList = vals.map(v => v.turnusDays).filter(v => typeof v === 'number');
  const avg = arr => arr.length ? Math.round(arr.reduce((a,c)=>a+c,0)/arr.length) : '–';
  return { avgTurnusDays: avg(turnusList) };
});

// Sorted distributions for visibility
const sortedZustellungswege = computed(() => {
  const entries = Object.entries(stats.value.byZustellungsweg || {}).map(([name, count]) => ({ name, count }));
  return entries.sort((a,b) => b.count - a.count);
});

const sortedDocTypes = computed(() => {
  const entries = Object.entries(stats.value.byDokumentenart || {}).map(([name, count]) => ({ name, count }));
  return entries.sort((a,b) => b.count - a.count);
});

// Hilfsfunktionen
function getSafeZustellungsweg(insurer) {
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
}

function normalizeZustellungsweg(val) {
  if (val === undefined || val === null) {
    return 'Nicht angegeben';
  }
  
  const strVal = String(val).trim();
  if (!strVal) return 'Nicht angegiven';
  
  const lowerVal = strVal.toLowerCase();
  
  // Common delivery methods
  if (lowerVal.includes('bipro')) return 'BiPRO';
  if (lowerVal.includes('maklerportal') || lowerVal.includes('getmyinvoices') || lowerVal === 'portal') {
    return 'Maklerportal/GetMyInvoices';
  }
  if (lowerVal.includes('mail') || lowerVal.includes('e-mail') || lowerVal.includes('email')) {
    return 'E-Mail';
  }
  if (lowerVal.includes('post') || lowerVal.includes('brief')) {
    return 'Per Post';
  }
  if (lowerVal === 'kein' || lowerVal === 'nein' || lowerVal === 'none' || lowerVal === 'n/a') {
    return 'Nicht angegeben';
  }
  
  // Return the original value with first letter capitalized
  return strVal.charAt(0).toUpperCase() + strVal.slice(1).toLowerCase();
}

function normalizeDocTypes(docArt) {
  // Debug log
  const debugLog = [];
  const shouldDebug = process.env.NODE_ENV === 'development';
  
  if (shouldDebug) {
    debugLog.push('normalizeDocTypes input:', JSON.stringify(docArt));
  }
  
  if (!docArt && docArt !== 0) {
    if (shouldDebug) debugLog.push('Empty input, returning empty array');
    return [];
  }
  
  try {
    let result = [];
    
    // Handle array input
    if (Array.isArray(docArt)) {
      result = docArt.flatMap(item => {
        if (!item && item !== 0) return [];
        
        // Handle string items
        if (typeof item === 'string') {
          return item.split(',')
            .map(t => t.trim().toUpperCase())
            .filter(t => t && t !== 'NULL' && t !== 'UNDEFINED');
        }
        
        // Handle object items
        if (typeof item === 'object' && item !== null) {
          // Try common property names
          const possibleValues = [
            item.value, item.label, item.name, item.type, 
            ...Object.values(item).filter(v => typeof v === 'string')
          ];
          
          return possibleValues
            .filter(Boolean)
            .flatMap(v => String(v).split(','))
            .map(t => t.trim().toUpperCase())
            .filter(t => t && t !== 'NULL' && t !== 'UNDEFINED');
        }
        
        // Handle other types
        const strVal = String(item).trim().toUpperCase();
        return strVal && strVal !== 'NULL' && strVal !== 'UNDEFINED' ? [strVal] : [];
      });
    } 
    // Handle string input
    else if (typeof docArt === 'string') {
      result = docArt.split(',')
        .map(t => t.trim().toUpperCase())
        .filter(t => t && t !== 'NULL' && t !== 'UNDEFINED');
    } 
    // Handle other types
    else {
      const strVal = String(docArt).trim().toUpperCase();
      result = strVal && strVal !== 'NULL' && strVal !== 'UNDEFINED' ? [strVal] : [];
    }
    
    // Remove duplicates
    const uniqueResult = [...new Set(result)];
    
    if (shouldDebug) {
      debugLog.push('Normalized document types:', uniqueResult);
      console.log(debugLog.join('\n'));
    }
    
    return uniqueResult;
  } catch (e) {
    console.error('Error normalizing document types:', e, 'Input was:', docArt);
    return [];
  }
}

function formatTurnus(turnus) {
  if (!turnus) return 'N/A';
  return String(turnus).charAt(0).toUpperCase() + String(turnus).slice(1).toLowerCase();
}

function statusLabel(key) {
  const labels = {
    critical: 'Überfällig',
    warning: 'Fällig',
    on_time: 'Aktuell',
    no_invoice: 'Keine Abrechnung'
  };
  return labels[key] || 'Unbekannt';
}

function statusTextColor(key) {
  const colors = {
    critical: 'text-red-700',
    warning: 'text-yellow-700',
    on_time: 'text-green-700',
    no_invoice: 'text-gray-700'
  };
  return colors[key] || 'text-gray-700';
}

function statusBarColor(key) {
  const colors = {
    critical: 'bg-red-600',
    warning: 'bg-yellow-500',
    on_time: 'bg-green-600',
    no_invoice: 'bg-gray-500'
  };
  return colors[key] || 'bg-gray-500';
}

// Handle click on zustellungsweg item
function handleZustellungswegClick(zustellungsweg) {
  emit('filter-by-zustellungsweg', zustellungsweg);
}

// Handle click on turnus item
function handleTurnusClick(turnus) {
  emit('filter-by-turnus', turnus);
}

// Handle click on dokumentenart item
function handleDokumentenartClick(dokumentenart) {
  emit('filter-by-dokumentenart', dokumentenart);
}

// PDF-Export
function exportToPdf() {
  const doc = new jsPDF();
  const date = format(new Date(), 'dd.MM.yyyy');
  
  // Titel
  doc.setFontSize(16);
  doc.text('Statistische Übersicht der Versicherer', 14, 20);
  doc.setFontSize(10);
  doc.text(`Erstellt am: ${date}`, 14, 28);
  
  // Gesamtstatistiken
  doc.setFontSize(14);
  doc.text('Gesamtübersicht', 14, 45);
  
  // Statuswerte als Tabelle
  const statusData = Object.entries(stats.value.byStatus).map(([key, count]) => ({
    status: statusLabel(key),
    count,
    percentage: ((count / stats.value.total) * 100).toFixed(1) + '%'
  }));
  
  autoTable(doc, {
    startY: 55,
    head: [['Status', 'Anzahl', 'Anteil']],
    body: statusData.map(item => [item.status, item.count, item.percentage]),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 }
  });
  
  // Zustellungswege
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Zustellungswege', 14, 20);
  
  const zustellungswegeData = Object.entries(stats.value.byZustellungsweg)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / stats.value.total) * 100).toFixed(1) + '%'
    }))
    .sort((a, b) => b.count - a.count);
  
  autoTable(doc, {
    startY: 30,
    head: [['Zustellungsweg', 'Anzahl', 'Anteil']],
    body: zustellungswegeData.map(item => [item.name, item.count, item.percentage]),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 }
  });
  
  // Dokumentenarten
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Dokumentenarten', 14, 20);
  
  const docTypesData = Object.entries(stats.value.byDokumentenart)
    .map(([name, count]) => ({
      name,
      count,
      percentage: ((count / stats.value.total) * 100).toFixed(1) + '%'
    }))
    .sort((a, b) => b.count - a.count);
  
  autoTable(doc, {
    startY: 30,
    head: [['Dokumentenart', 'Anzahl', 'Anteil']],
    body: docTypesData.map(item => [item.name, item.count, item.percentage]),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 }
  });
  
  // PDF speichern
  doc.save(`Versicherer_Statistik_${date}.pdf`);
}
</script>

<style scoped>
/* Anpassungen für die Statistik-Karten */
.stat-card {
  @apply p-4 rounded-lg shadow-sm border border-gray-200 bg-white;
}

.stat-card .stat-value {
  @apply text-2xl font-bold mt-2;
}

.stat-card .stat-label {
  @apply text-sm text-gray-500 mt-1;
}

/* Farben für die Status-Badges */
.bg-green-100 { background-color: #dcfce7; }
.text-green-800 { color: #166534; }
.bg-yellow-100 { background-color: #fef9c3; }
.text-yellow-800 { color: #854d0e; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-800 { color: #991b1b; }
.bg-blue-100 { background-color: #dbeafe; }
.text-blue-800 { color: #1e40af; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-gray-800 { color: #1f2937; }
</style>
