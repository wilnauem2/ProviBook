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
  
  <div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Title Row -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Statistische Übersicht</h2>
    </div>
    
    <!-- Distributions (high visibility) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Zustellungsweg Distribution -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">Zustellungswege</h3>
        <div v-if="sortedZustellungswege.length" class="space-y-3">
          <div v-for="row in sortedZustellungswege" :key="row.name" class="cursor-pointer" @click="emit('filter-by-zustellungsweg', row.name)">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-gray-700">{{ row.name }}</span>
              <span class="text-gray-600">{{ row.count }} · {{ percent(row.count, stats.total) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div class="h-3 rounded-full bg-blue-600" :style="{ width: percentNumber(row.count, stats.total) + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400">Keine Daten</div>
      </div>

      <!-- Dokumentenformate Distribution -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">Dokumentenformate</h3>
        <div v-if="sortedDocTypes.length" class="space-y-3">
          <div v-for="row in sortedDocTypes" :key="row.name" class="cursor-pointer" @click="emit('filter-by-dokumentenart', row.name)">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-gray-700">{{ row.name }}</span>
              <span class="text-gray-600">{{ row.count }} · {{ percent(row.count, stats.total) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div class="h-3 rounded-full bg-purple-600" :style="{ width: percentNumber(row.count, stats.total) + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400">Keine Daten</div>
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

const emit = defineEmits(['filter-by-zustellungsweg', 'filter-by-turnus', 'filter-by-dokumentenart']);

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
const { calculateDaysOverdue, calculateNextSettlementDate, parseTurnus } = useInsurerUtils();
const stats = computed(() => {
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

    // Zustellungsweg
    const zustRaw = getSafeZustellungsweg(insurer) || 'Nicht angegeben';
    const zust = normalizeZustellungsweg(zustRaw);
    result.byZustellungsweg[zust] = (result.byZustellungsweg[zust] || 0) + 1;

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
  const s = String(val).trim().toLowerCase();
  if (!s) return 'Nicht angegeben';
  if (s.includes('bipro')) return 'BiPRO';
  if (s.includes('maklerportal') || s.includes('getmyinvoices')) return 'Maklerportal/GetMyInvoices';
  if (s.includes('mail') || s.includes('e-mail') || s.includes('email')) return 'E-Mail';
  if (s.includes('post')) return 'Per Post';
  return val;
}

function normalizeDocTypes(docArt) {
  if (!docArt) return [];
  try {
    if (Array.isArray(docArt)) {
      return docArt
        .map(item => {
          if (typeof item === 'string') return item.trim().toUpperCase();
          if (item && typeof item === 'object') {
            const strValue = Object.values(item).find(v => typeof v === 'string');
            return strValue ? strValue.trim().toUpperCase() : null;
          }
          return String(item).trim().toUpperCase();
        })
        .filter(Boolean);
    }
    if (typeof docArt === 'string') {
      return docArt.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    }
    return [String(docArt).trim().toUpperCase()].filter(Boolean);
  } catch (e) {
    console.error('normalizeDocTypes error', e);
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
