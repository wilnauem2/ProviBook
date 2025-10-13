<template>
  <div class="app-container">
    <!-- Show loading state while data is being fetched -->
    <div v-if="isComponentLoading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-gray-700">Lade Daten...</p>
      </div>
    </div>
    
    <!-- Main Layout with Sidebar -->
    <div class="min-h-screen bg-gray-50 flex">
      <div class="w-64 bg-white shadow-md h-screen overflow-y-auto sticky top-0">
        <div class="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 class="text-lg font-semibold text-gray-800">Navigation</h2>
          <!-- Search -->
          <div class="px-4 py-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Versicherer suchen..."
                @input="handleSearch"
              >
            </div>
          </div>
        </div>
        <div class="p-4 space-y-1">
          <!-- Main Navigation -->
          <div class="mb-4">
            <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hauptmenü</h3>
            <div class="space-y-1">
              <router-link 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
                :class="{ 'bg-blue-50 text-blue-600 font-medium': isNavItemActive(item.path) }"
              >
                <component :is="item.component" class="w-5 h-5 mr-3 flex-shrink-0" />
                <span class="truncate">{{ item.name }}</span>
              </router-link>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="mb-4">
            <h3 class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
            <div class="space-y-1">
              <a 
                v-for="filter in statusFilters" 
                :key="filter.key"
                href="#"
                @click.prevent="statusFilter = filter.key"
                class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
                :class="{ 'bg-blue-50 text-blue-600 font-medium': statusFilter === filter.key }"
              >
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-3" :class="getStatusColor(filter.key)"></span>
                  <span>{{ filter.label }}</span>
                </div>
                <span v-if="filter.count > 0" class="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {{ filter.count }}
                </span>
              </a>
            </div>
          </div>

        </div>
        
        <div v-if="isDevelopment" class="p-4 border-t border-gray-200 mt-4 sticky bottom-0 bg-white">
          <TestDateSimulator 
            v-model="currentDate"
            @change-date="handleDateChange"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <header class="bg-white shadow-sm sticky top-0 z-30">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
              <h1 class="text-xl font-semibold text-gray-900">{{ currentRouteName }}</h1>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">
                  {{ Array.isArray(insurers) ? insurers.length : 0 }} Versicherer
                </span>
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">
                  {{ Array.isArray(abrechnungen) ? abrechnungen.length : 0 }} Dokumente
                </span>
                <button
                  v-if="route.path.startsWith('/insurers')"
                  @click="clearAllFilters"
                  :disabled="!anyFiltersActive"
                  :class="[
                    'ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded transition border',
                    anyFiltersActive ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  ]"
                  title="Filter zurücksetzen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M9 13h6v8H9z"/><path d="M4 7h16v2H4z"/><path d="M10 3h4v2h-4z"/></svg>
                  Filter zurücksetzen
                </button>
                <button 
                  v-if="route.path.startsWith('/insurers')"
                  @click="exportInsurersPdf"
                  class="ml-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  title="Versichererliste als PDF exportieren"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v7a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 11.5v-7Z"/><path d="M3 14.5A1.5 1.5 0 0 0 4.5 16h11a1.5 1.5 0 0 0 1.5-1.5V13H3v1.5Z"/></svg>
                  PDF
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main class="flex-1 overflow-y-auto p-6">
          <!-- Main content will be rendered here -->
          <router-view v-slot="{ Component, route }">
            <component
              :is="Component"
              :is-production="isProduction"
              :filtered-insurers="filteredInsurers"
              :status-counts="statusCountsForView"
              :status-filter="statusFilter"
              :search-filter="searchQuery"
              :simulated-date="systemDate"
              :current-date="currentDate"
              @status-clicked="applyFilter"
              @filter-by-zustellungsweg="handleSortByZustellungsweg"
              @filter-by-dokumentenart="handleSortByDokumentenart"
              @update:search-filter="handleSearch"
              @update:sort-option="updateSortOption"
              @change-date="handleDateChange"
              @reset-date="resetDate"
              @clear-status-filter="statusFilter = 'all'"
              @select-insurer="selectedInsurer = $event"
              @delete-insurer="handleDeleteInsurer"
              @create-insurer="handleCreateInsurer"
            />
          </router-view>
          
          <Teleport to="body">
            <InsurerDetail 
              v-if="selectedInsurer" 
              :insurer="selectedInsurer"
              @close="selectedInsurer = null"
              @update:insurer="handleUpdateInsurer"
              @insurer-deleted="handleInsurerDeleted"
            />
          </Teleport>

          <!-- Create Insurer Modal -->
          <Teleport to="body">
            <div v-if="showCreateInsurerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 class="text-lg font-medium mb-4">Neuen Versicherer erstellen</h3>
                <input
                  v-model="newInsurerName"
                  type="text"
                  class="w-full p-2 border rounded-md mb-4"
                  placeholder="Name des Versicherers"
                />
                <div class="flex justify-end gap-3">
                  <button @click="showCreateInsurerModal = false" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Abbrechen</button>
                  <button @click="saveNewInsurer" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Speichern</button>
                </div>
              </div>
            </div>
          </Teleport>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useInsurerStore } from '../stores/insurerStore';
import { useAbrechnungStore } from '../stores/abrechnungStore';
import { useInsurerUtils } from '@/composables/useInsurerUtils.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { HomeIcon, UserGroupIcon, ChartBarIcon, ClockIcon, CogIcon } from '@heroicons/vue/24/outline';
import InsurerDetail from './InsurerDetail.vue';

const router = useRouter();
const route = useRoute();

const insurerStore = useInsurerStore();
const abrechnungStore = useAbrechnungStore();
const { calculateDaysOverdue } = useInsurerUtils();

const { 
  insurers, 
  isLoading: storeIsLoading, 
  error, 
  dataMode 
} = storeToRefs(insurerStore);

const { 
  abrechnungen 
} = storeToRefs(abrechnungStore);

const isProduction = import.meta.env.PROD;

const systemDate = computed(() => new Date());

const isComponentLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const currentDate = ref(new Date());
const selectedInsurer = ref(null);
const sortOption = ref('status'); // Default sort option
// Priority sorting triggered from StatisticsView clicks
const priorityZustellungsweg = ref(null);
const priorityDokumentenart = ref(null);
const showCreateInsurerModal = ref(false);
const newInsurerName = ref('');
const activeFilters = ref({
  zustellungsweg: null,
  turnus: null,
  dokumentenart: null,
});

// PDF export for current insurer list (filteredInsurers)
const exportInsurersPdf = () => {
  try {
    const doc = new jsPDF({ orientation: 'landscape' });
    const dateStr = format(new Date(), 'dd.MM.yyyy');

    doc.setFontSize(16);
    doc.text('Versichererliste', 14, 14);
    doc.setFontSize(10);
    doc.text(`Erstellt am: ${dateStr}`, 14, 20);
    doc.text(`Gesamt: ${filteredInsurers.value.length}`, 60, 20);

    const rows = (filteredInsurers.value || []).map((ins) => {
      const status = insurerStore.getInsurerStatus(ins, currentDate.value);
      const z = normalizeZustellungsweg(getSafeZustellungsweg(ins)) || '–';
      const turnus = ins.turnus ?? '–';
      // Last invoice formatting
      const inv = insurerStore.lastInvoices[ins.id] || ins.last_invoice;
      let last = '–';
      if (inv) {
        if (inv.date) {
          const d = inv.date?.toDate ? inv.date.toDate() : new Date(inv.date);
          if (!isNaN(d)) last = format(d, 'dd.MM.yyyy');
        } else if (typeof inv === 'string') {
          const d = new Date(inv);
          if (!isNaN(d)) last = format(d, 'dd.MM.yyyy');
          else last = inv;
        } else if (inv.datum || inv.display) {
          last = inv.display || inv.datum || '–';
        }
      }
      return [
        ins.name || '–',
        ins.number || '–',
        statusLabel(status),
        last,
        String(turnus),
        z,
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [['Name', 'Nummer', 'Status', 'Letzte Abrechnung', 'Turnus', 'Zustellungsweg']],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
      theme: 'grid',
      margin: { left: 14, right: 14 },
    });

    doc.save(`Versicherer_${dateStr}.pdf`);
  } catch (e) {
    console.error('exportInsurersPdf error', e);
  }
};

const statusLabel = (key) => {
  const labels = {
    critical: 'Überfällig',
    warning: 'Fällig',
    on_time: 'Aktuell',
    no_invoice: 'Keine Abrechnung'
  };
  return labels[key] || 'Unbekannt';
};

const statusFilters = ref([
  { key: 'all', label: 'Alle', count: 0 },
  { key: 'on_time', label: 'Aktuell', count: 0 },
  { key: 'warning', label: 'Mahnung', count: 0 },
  { key: 'critical', label: 'Kritisch', count: 0 },
  { key: 'no_invoice', label: 'Keine Abrechnung', count: 0 },
]);

const navItems = [
  { name: 'Versicherungen', path: '/insurers', icon: 'users', component: UserGroupIcon },
  { name: 'Statistiken', path: '/stats', icon: 'stats', component: ChartBarIcon },
  { name: 'Aktivitäten', path: '/activities', icon: 'activity', component: ClockIcon },
  { name: 'Einstellungen', path: '/settings', icon: 'settings', component: CogIcon },
];

const currentRouteName = computed(() => {
  const currentNav = navItems.find((item) => {
    return route.path.startsWith(item.path);
  });
  return currentNav ? currentNav.name : 'Übersicht';
});

const statusCounts = computed(() => {
  const counts = {
    all: 0,
    on_time: 0,
    warning: 0,
    critical: 0,
    no_invoice: 0,
  };

  (insurers.value || []).forEach((insurer) => {
    if (!insurer) {
      return;
    }

    const status = insurerStore.getInsurerStatus(insurer, currentDate.value);
    if (counts[status] !== undefined) {
      counts[status] += 1;
    }
    counts.all += 1;
  });

  statusFilters.value = statusFilters.value.map((filter) => ({
    ...filter,
    count: counts[filter.key] ?? 0,
  }));

  return counts;
});

const statusCountsForView = computed(() => {
  const counts = statusCounts.value ?? {};
  return {
    critical: counts.critical ?? 0,
    warning: counts.warning ?? 0,
    on_time: counts.on_time ?? 0,
    no_invoice: counts.no_invoice ?? 0,
  };
});

const getStatusColor = (status) => {
  const colors = {
    on_time: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    no_invoice: 'bg-gray-400',
  };

  return colors[status] ?? 'bg-gray-300';
};

const getSafeZustellungsweg = (insurer) => {
  try {
    if (!insurer) return '';
    const z = insurer?.zustellungsweg || insurer?.zustellweg || insurer?.bezugsweg;
    if (!z) return '';
    if (typeof z === 'string') return z;
    if (Array.isArray(z)) {
      const first = z[0];
      if (typeof first === 'object' && first) return first.value || first.label || first.name || '';
      return first || '';
    }
    if (typeof z === 'object') return z.value || z.label || z.name || z.display || '';
    return String(z);
  } catch {
    return '';
  }
};

const filteredInsurers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  let filtered = (insurers.value || []).filter((insurer) => {
    if (!insurer) {
      return false;
    }

    if (statusFilter.value !== 'all') {
      const status = insurerStore.getInsurerStatus(insurer, currentDate.value);
      if (status !== statusFilter.value) {
        return false;
      }
    }

    if (query) {
      const matchesName = typeof insurer.name === 'string' && insurer.name.toLowerCase().includes(query);
      const matchesNumber = typeof insurer.number === 'string' && insurer.number.toLowerCase().includes(query);
      if (!matchesName && !matchesNumber) {
        return false;
      }
    }

    if (activeFilters.value.zustellungsweg) {
      const zVal = normalizeZustellungsweg(getSafeZustellungsweg(insurer));
      if (zVal !== activeFilters.value.zustellungsweg) {
        return false;
      }
    }

    if (activeFilters.value.turnus && insurer.turnus !== activeFilters.value.turnus) {
      return false;
    }

    if (activeFilters.value.dokumentenart) {
      const docsRaw = Array.isArray(insurer.dokumentenart) ? insurer.dokumentenart : [];
      const docs = docsRaw.map((item) => {
        if (typeof item === 'string') return item.trim().toUpperCase();
        if (item && typeof item === 'object') {
          const strVal = Object.values(item).find(v => typeof v === 'string');
          return strVal ? strVal.trim().toUpperCase() : '';
        }
        return String(item).trim().toUpperCase();
      });
      if (!docs.includes(activeFilters.value.dokumentenart)) {
        return false;
      }
    }

    return true;
  });

  // Sorting logic
  const sortFn = (a, b) => {
    // Priority by clicked distributions first
    const aZ = normalizeZustellungsweg(getSafeZustellungsweg(a));
    const bZ = normalizeZustellungsweg(getSafeZustellungsweg(b));
    const zWanted = priorityZustellungsweg.value;
    const aZScore = zWanted ? (aZ === zWanted ? 1 : 0) : 0;
    const bZScore = zWanted ? (bZ === zWanted ? 1 : 0) : 0;

    // Dokumentenart priority (case-insensitive, normalized to upper-case)
    const wantedDoc = priorityDokumentenart.value;
    const docsA = Array.isArray(a.dokumentenart) ? a.dokumentenart.map(x => String(x).trim().toUpperCase()) : [];
    const docsB = Array.isArray(b.dokumentenart) ? b.dokumentenart.map(x => String(x).trim().toUpperCase()) : [];
    const aDScore = wantedDoc ? (docsA.includes(wantedDoc) ? 1 : 0) : 0;
    const bDScore = wantedDoc ? (docsB.includes(wantedDoc) ? 1 : 0) : 0;

    const aPriority = aZScore + aDScore;
    const bPriority = bZScore + bDScore;
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // higher priority first
    }

    const rawA = calculateDaysOverdue(a, currentDate.value);
    const rawB = calculateDaysOverdue(b, currentDate.value);
    const daysA = (rawA === null || Number.isNaN(rawA)) ? -99999 : rawA;
    const daysB = (rawB === null || Number.isNaN(rawB)) ? -99999 : rawB;
    return daysB - daysA; // Higher overdue first, then due today, then future/unknown
  };

  if (sortOption.value === 'name') {
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default sort by status
    return filtered.sort(sortFn);
  }
});

const isNavItemActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path === path || route.path.startsWith(`${path}/`);
};

const handleSearch = () => {
  // Triggered by v-model; filtering happens in computed
};

const updateSortOption = (value) => {
  sortOption.value = value;
};

// Normalize Zustellungsweg similar to stats
const normalizeZustellungsweg = (val) => {
  if (!val) return '';
  const s = String(val).trim().toLowerCase();
  if (!s) return '';
  if (s.includes('bipro') || s.includes('bi-pro')) return 'BiPRO';
  const isPortal = (
    s.includes('maklerportal') ||
    s.includes('makler-portal') ||
    s.includes('getmyinvoices') ||
    s.includes('get my invoices') ||
    s.includes('gmi') ||
    s.includes('portal') ||
    s.includes('kundenportal') ||
    s.includes('serviceportal') ||
    s.includes('login') ||
    s.includes('online') ||
    (s.startsWith('http') && (s.includes('portal') || s.includes('makler')))
  );
  if (isPortal) return 'Maklerportal/GetMyInvoices';
  if (s.includes('mail') || s.includes('e-mail') || s.includes('email')) return 'E-Mail';
  if (s.includes('post') || s.includes('brief')) return 'Per Post';
  return val;
};

// Handlers for clicks from StatisticsView
const handleSortByZustellungsweg = (label) => {
  // Apply filter by normalized label
  activeFilters.value.zustellungsweg = label;
  // Clear previous doc-type filter priority and sort priorities
  activeFilters.value.dokumentenart = null;
  statusFilter.value = 'all';
  searchQuery.value = '';
  priorityZustellungsweg.value = null;
  priorityDokumentenart.value = null;
  // Navigate to insurers view to see filtered cards
  if (!route.path.startsWith('/insurers')) {
    router.push('/insurers');
  }
};

const handleSortByDokumentenart = (docType) => {
  // Apply filter by upper-cased doc type
  activeFilters.value.dokumentenart = String(docType).trim().toUpperCase();
  // Clear previous zustellungsweg filter and sort priorities
  activeFilters.value.zustellungsweg = null;
  statusFilter.value = 'all';
  searchQuery.value = '';
  priorityZustellungsweg.value = null;
  priorityDokumentenart.value = null;
  if (!route.path.startsWith('/insurers')) {
    router.push('/insurers');
  }
};

const handleDateChange = (payload) => {
  if (payload === 1 || payload === -1) {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() + payload);
    currentDate.value = newDate;
  } else {
    currentDate.value = new Date(payload);
  }
};

const resetDate = () => {
  currentDate.value = new Date();
};

const handleInsurerDeleted = () => {
  selectedInsurer.value = null;
};

const applyFilter = (filter) => {
  statusFilter.value = filter;
};

// Show 'Clear Filters' button when any filter/search is active
const anyFiltersActive = computed(() => {
  return (
    statusFilter.value !== 'all' ||
    !!searchQuery.value ||
    !!activeFilters.value.zustellungsweg ||
    !!activeFilters.value.dokumentenart ||
    !!activeFilters.value.turnus
  );
});

const clearAllFilters = () => {
  statusFilter.value = 'all';
  searchQuery.value = '';
  activeFilters.value = { zustellungsweg: null, dokumentenart: null, turnus: null };
  priorityZustellungsweg.value = null;
  priorityDokumentenart.value = null;
};

const handleCreateInsurer = () => {
  newInsurerName.value = '';
  showCreateInsurerModal.value = true;
};

const saveNewInsurer = async () => {
  if (!newInsurerName.value.trim()) {
    // Optionally, show an error message
    return;
  }

  try {
    await insurerStore.addInsurer({ name: newInsurerName.value.trim() });
    showCreateInsurerModal.value = false;
    newInsurerName.value = '';
    // Optionally, show a success message
  } catch (error) {
    console.error('Failed to save new insurer:', error);
    // Optionally, show an error message
  }
};

const handleDeleteInsurer = () => {};

// Merge updates from InsurerDetail into the local selectedInsurer and log turnus
const handleUpdateInsurer = (updatedInsurer) => {
  try {
    if (!updatedInsurer) return;
    console.log('[MainApp] received update:insurer turnus ->', updatedInsurer?.turnus, 'id ->', updatedInsurer?.id);
    if (selectedInsurer.value?.id === updatedInsurer.id) {
      selectedInsurer.value = { ...selectedInsurer.value, ...updatedInsurer };
      console.log('[MainApp] merged selectedInsurer turnus ->', selectedInsurer.value.turnus);
    } else {
      console.log('[MainApp] update id mismatch, current selected id ->', selectedInsurer.value?.id);
    }
  } catch (e) {
    console.error('[MainApp] handleUpdateInsurer error', e);
  }
};

onMounted(async () => {
  try {
    await insurerStore.switchEnvironmentAndFetchData?.('production');
    await abrechnungStore.fetchAbrechnungen?.();
  } catch (err) {
    console.error('Failed to load initial data', err);
  } finally {
    isComponentLoading.value = false;
  }
});

onUnmounted(() => {
  console.log('MainApp unmounted');
});
</script>
