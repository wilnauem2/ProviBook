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
      <div class="w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl h-screen overflow-y-auto sticky top-0">
        <div class="p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="text-xl font-extrabold text-white tracking-tight">ProviBook</h2>
          </div>
          <!-- Search -->
          <div class="px-0 py-0">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 border border-slate-600/50 rounded-lg leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all backdrop-blur-sm"
                placeholder="Versicherer suchen..."
                @input="handleSearch"
              >
            </div>
          </div>
        </div>
        <div class="p-4 space-y-1">
          <!-- Main Navigation -->
          <div class="mb-6">
            <h3 class="px-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Hauptmenü</h3>
            <div class="space-y-1">
              <router-link 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path"
                class="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700/60 rounded-xl transition-all duration-200 group"
                :class="{ 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/40': isNavItemActive(item.path) }"
              >
                <component :is="item.component" class="w-5 h-5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span class="truncate">{{ item.name }}</span>
              </router-link>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="mb-6">
            <h3 class="px-4 text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Status</h3>
            <div class="space-y-1">
              <a 
                v-for="filter in statusFilters" 
                :key="filter.key"
                href="#"
                @click.prevent="statusFilter = filter.key"
                class="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/60 rounded-xl transition-all duration-200 group"
                :class="{ 'bg-slate-700/80 text-white font-semibold': statusFilter === filter.key }"
              >
                <div class="flex items-center">
                  <span class="w-2.5 h-2.5 rounded-full mr-3 group-hover:scale-125 transition-transform" :class="getStatusColor(filter.key)"></span>
                  <span>{{ filter.label }}</span>
                </div>
                <span v-if="filter.count > 0" class="bg-slate-600/80 text-slate-100 text-xs font-bold px-2.5 py-1 rounded-full">
                  {{ filter.count }}
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div class="w-full px-6">
            <div class="flex justify-between items-center py-5">
              <div>
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ currentRouteName }}</h1>
                <div class="flex items-center space-x-2 mt-2">
                  <span class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide shadow-sm">
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    {{ Array.isArray(insurers) ? insurers.length : 0 }} Versicherer
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                
                <!-- User Info & Logout (hidden for public access) -->
                <div v-if="!isPublicAccess" class="flex items-center space-x-3 border-l pl-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-800 font-medium text-sm">
                        {{ userStore.userDisplayName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-medium text-gray-900">{{ userStore.userDisplayName }}</span>
                      <span v-if="isAdmin" class="text-xs text-indigo-600">Admin</span>
                    </div>
                  </div>
                  <button
                    @click="handleLogout"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Abmelden"
                  >
                    <ArrowRightOnRectangleIcon class="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  v-if="route.path.startsWith('/insurers') || route.path.startsWith('/stats')"
                  @click="clearAllFilters"
                  :disabled="!anyFiltersActive"
                  :class="[
                    'ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded transition border font-medium',
                    anyFiltersActive ? 'bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500 blink-yellow' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  ]"
                  title="Filter zurücksetzen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
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
        
        <main class="flex-1 overflow-y-auto p-4">
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
              :any-filters-active="anyFiltersActive"
              @status-clicked="applyFilter"
              @filter-by-zustellungsweg="handleSortByZustellungsweg"
              @filter-by-dokumentenart="handleSortByDokumentenart"
              @update:search-filter="handleSearch"
              @update:sort-option="updateSortOption"
              @change-date="handleDateChange"
              @reset-date="resetDate"
              @clear-status-filter="statusFilter = 'all'"
              @clear-all-filters="clearAllFilters"
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
import { useUserStore } from '../stores/userStore';
import { useActivityStore } from '../stores/activityStore';
import { useInsurerUtils } from '@/composables/useInsurerUtils.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { HomeIcon, UserGroupIcon, ChartBarIcon, ClockIcon, CogIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import InsurerDetail from './InsurerDetail.vue';
import TestDateSimulator from './TestDateSimulator.vue';

const router = useRouter();
const route = useRoute();

const insurerStore = useInsurerStore();
const abrechnungStore = useAbrechnungStore();
const userStore = useUserStore();
const activityStore = useActivityStore();
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
const isDevelopment = !import.meta.env.PROD;

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
  { key: 'incomplete', label: 'Unvollständig', count: 0 },
]);

// Check if user is admin
const isAdmin = computed(() => userStore.isAdmin);

// Check if this is public access (ChatGPT route)
const isPublicAccess = computed(() => route.path.startsWith('/ChatGPT'));

// Navigation items - dynamically show admin panel
const navItems = computed(() => {
  const basePath = isPublicAccess.value ? '/ChatGPT' : '';
  const items = [
    { name: 'Versicherungen', path: `${basePath}/insurers`, icon: 'users', component: UserGroupIcon },
    { name: 'Statistiken', path: `${basePath}/stats`, icon: 'stats', component: ChartBarIcon },
    { name: 'Aktivitäten', path: `${basePath}/activities`, icon: 'activity', component: ClockIcon },
  ];
  
  // Add admin panel for admins only (not for public access)
  if (isAdmin.value && !isPublicAccess.value) {
    items.push({ name: 'Benutzerverwaltung', path: '/users', icon: 'admin', component: ShieldCheckIcon });
  }
  
  items.push({ name: 'Einstellungen', path: `${basePath}/settings`, icon: 'settings', component: CogIcon });
  
  return items;
});

const currentRouteName = computed(() => {
  const currentNav = navItems.value.find((item) => {
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
    incomplete: 0,
  };

  (insurers.value || []).forEach((insurer) => {
    if (!insurer) {
      return;
    }

    // Check for incomplete data
    const hasNoDokumentenart = !insurer.dokumentenart || 
                              (Array.isArray(insurer.dokumentenart) && insurer.dokumentenart.length === 0) ||
                              (typeof insurer.dokumentenart === 'string' && insurer.dokumentenart.trim() === '');
                              
    const hasNoZustellungsweg = !getSafeZustellungsweg(insurer) || 
                               (typeof getSafeZustellungsweg(insurer) === 'string' && getSafeZustellungsweg(insurer).trim() === '');
    
    if (hasNoDokumentenart || hasNoZustellungsweg) {
      counts.incomplete += 1;
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
    on_time: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
    no_invoice: 'bg-gray-100 text-gray-800',
    incomplete: 'bg-amber-100 text-amber-800',
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
      if (statusFilter.value === 'incomplete') {
        const hasNoDokumentenart = !insurer.dokumentenart || 
                                 (Array.isArray(insurer.dokumentenart) && insurer.dokumentenart.length === 0) ||
                                 (typeof insurer.dokumentenart === 'string' && insurer.dokumentenart.trim() === '');
                                  
        const hasNoZustellungsweg = !getSafeZustellungsweg(insurer) || 
                                  (typeof getSafeZustellungsweg(insurer) === 'string' && getSafeZustellungsweg(insurer).trim() === '');
        
        if (!hasNoDokumentenart && !hasNoZustellungsweg) {
          return false;
        }
      } else {
        const status = insurerStore.getInsurerStatus(insurer, currentDate.value);
        if (status !== statusFilter.value) {
          return false;
        }
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
      const zVal = getSafeZustellungsweg(insurer);
      const normalizedZVal = normalizeZustellungsweg(zVal);
      // Special handling for 'Nicht angegeben' to match both empty and 'Nicht angegeben' values
      if (activeFilters.value.zustellungsweg === 'Nicht angegeben') {
        if (zVal && zVal.trim() !== '' && normalizedZVal !== 'Nicht angegeben') {
          return false;
        }
      } else if (normalizedZVal !== activeFilters.value.zustellungsweg) {
        return false;
      }
    }

    if (activeFilters.value.turnus && insurer.turnus !== activeFilters.value.turnus) {
      return false;
    }

    if (activeFilters.value.dokumentenart) {
      // Handle both array and string values for dokumentenart
      let docsRaw = [];
      if (Array.isArray(insurer.dokumentenart)) {
        docsRaw = insurer.dokumentenart;
      } else if (insurer.dokumentenart) {
        // If it's a string or other value, wrap it in an array
        docsRaw = [insurer.dokumentenart];
      }
      
      const docs = docsRaw.map((item) => {
        if (typeof item === 'string') return item.trim().toUpperCase();
        if (item && typeof item === 'object') {
          const strVal = Object.values(item).find(v => typeof v === 'string');
          return strVal ? strVal.trim().toUpperCase() : '';
        }
        return String(item).trim().toUpperCase();
      });
      
      console.log(`[Filter] Insurer "${insurer.name}" docs:`, docs, 'Looking for:', activeFilters.value.dokumentenart, 'Match:', docs.includes(activeFilters.value.dokumentenart));
      
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
  console.log('[handleSortByDokumentenart] Input docType:', docType);
  const normalizedDocType = String(docType).trim().toUpperCase();
  console.log('[handleSortByDokumentenart] Normalized to:', normalizedDocType);
  activeFilters.value.dokumentenart = normalizedDocType;
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

// Logout function
const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    alert('Fehler beim Abmelden');
  }
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
    const newInsurer = await insurerStore.addInsurer({ name: newInsurerName.value.trim() });
    showCreateInsurerModal.value = false;
    
    // Log activity
    await activityStore.logActivity(activityStore.ActivityType.INSURER_CREATED, {
      entityType: 'insurer',
      entityId: newInsurer?.id,
      entityName: newInsurerName.value.trim(),
      description: `Versicherer "${newInsurerName.value.trim()}" erstellt`
    });
    
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

<style scoped>
@keyframes blink-yellow {
  0% {
    background-color: rgb(250 204 21); /* yellow-400 */
    border-color: rgb(234 179 8); /* yellow-500 */
    opacity: 1;
  }
  50% {
    background-color: rgb(234 179 8); /* yellow-500 */
    border-color: rgb(202 138 4); /* yellow-600 */
    opacity: 0.7;
  }
  100% {
    background-color: rgb(250 204 21); /* yellow-400 */
    border-color: rgb(234 179 8); /* yellow-500 */
    opacity: 1;
  }
}

.blink-yellow {
  animation: blink-yellow 1s ease-in-out infinite;
}
</style>
