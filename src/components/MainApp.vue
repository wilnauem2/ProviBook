<template>
  <div class="app-container">
    <!-- Premium Loading State -->
    <div v-if="isComponentLoading" class="fixed inset-0 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm z-50">
      <div class="text-center animate-fade-in">
        <div class="relative w-16 h-16 mx-auto mb-5">
          <div class="absolute inset-0 rounded-full border-[3px] border-slate-200"></div>
          <div class="absolute inset-0 rounded-full border-[3px] border-brand-500 border-t-transparent animate-spin"></div>
          <div class="absolute inset-2 rounded-full bg-white shadow-soft flex items-center justify-center">
            <svg class="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <p class="text-sm font-medium text-slate-600 tracking-wide">Daten werden geladen...</p>
      </div>
    </div>
    
    <!-- Main Layout with Sidebar -->
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside class="w-[260px] bg-slate-900 h-screen overflow-y-auto sticky top-0 flex flex-col">
        <!-- Logo & Search -->
        <div class="p-5 pb-4 sticky top-0 bg-slate-900/98 backdrop-blur-md z-10 border-b border-white/[0.06]">
          <div class="flex items-center mb-5">
            <div class="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-brand-500/25">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-[17px] font-bold text-white tracking-tight leading-none">ProviBook</h2>
              <span class="text-[10px] font-medium text-slate-400 tracking-wider uppercase">Provisionsmanager</span>
            </div>
          </div>
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-9 pr-3 py-2 border-0 rounded-lg leading-5 bg-white/[0.07] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-400/50 focus:bg-white/[0.1] text-[13px] transition-all"
              placeholder="Suchen..."
              @input="handleSearch"
            >
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-6">
          <!-- Main Navigation -->
          <div>
            <h3 class="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.1em] mb-2">Navigation</h3>
            <div class="space-y-0.5">
              <router-link 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path"
                class="flex items-center px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-all duration-150 group"
                :class="{ 'bg-brand-500/15 text-brand-300 font-medium': isNavItemActive(item.path) }"
              >
                <component :is="item.component" class="w-[18px] h-[18px] mr-2.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>{{ item.name }}</span>
              </router-link>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <h3 class="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.1em] mb-2">Status</h3>
            <div class="space-y-0.5">
              <a 
                v-for="filter in statusFilters" 
                :key="filter.key"
                href="#"
                @click.prevent="statusFilter = filter.key"
                class="flex items-center justify-between px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] rounded-lg transition-all duration-150"
                :class="{ 'bg-white/[0.08] text-slate-200 font-medium': statusFilter === filter.key }"
              >
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-2.5" :class="getStatusColor(filter.key)"></span>
                  <span>{{ filter.label }}</span>
                </div>
                <span v-if="filter.count > 0" class="text-[11px] font-semibold tabular-nums min-w-[22px] text-center px-1.5 py-0.5 rounded-md" 
                      :class="{
                        'bg-red-500/20 text-red-300': filter.key === 'critical',
                        'bg-amber-500/20 text-amber-300': filter.key === 'warning',
                        'bg-emerald-500/20 text-emerald-300': filter.key === 'on_time',
                        'bg-slate-500/20 text-slate-300': filter.key === 'all' || filter.key === 'no_invoice'
                      }">
                  {{ filter.count }}
                </span>
              </a>
            </div>
          </div>
        </nav>

        <!-- Sidebar Footer - User -->
        <div class="p-3 border-t border-white/[0.06]">
          <div class="flex items-center justify-between px-2 py-2">
            <div class="flex items-center min-w-0">
              <div class="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center mr-2.5 flex-shrink-0">
                <span class="text-brand-300 font-semibold text-xs">
                  {{ userStore.userDisplayName.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0">
                <p class="text-[13px] font-medium text-slate-300 truncate">{{ userStore.userDisplayName }}</p>
                <p v-if="isAdmin" class="text-[10px] text-brand-400 font-medium">Admin</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all flex-shrink-0"
              title="Abmelden"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
          <div class="px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center gap-4">
                <h1 class="text-xl font-semibold text-slate-900 tracking-tight">{{ currentRouteName }}</h1>
                <span class="hidden sm:inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                  {{ Array.isArray(insurers) ? insurers.length : 0 }} Versicherer
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="route.path.startsWith('/insurers')"
                  @click="exportInsurersPdf"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  title="Versichererliste als PDF exportieren"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v7a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 11.5v-7Z"/><path d="M3 14.5A1.5 1.5 0 0 0 4.5 16h11a1.5 1.5 0 0 0 1.5-1.5V13H3v1.5Z"/></svg>
                  PDF Export
                </button>
              </div>
            </div>
            
            <!-- Filter Bar (nur auf Versicherungen-Seite) -->
            <div v-if="route.path.startsWith('/insurers')" class="flex flex-wrap items-center gap-2 pb-3 -mt-1">
              <!-- Dokumentenformat Filter -->
              <div class="flex items-center gap-1">
                <span class="text-[11px] text-slate-400 font-medium mr-0.5">Format:</span>
                <button
                  v-for="format in dokumentenFormatOptions"
                  :key="format.value"
                  @click="toggleDokumentenartFilter(format.value)"
                  :class="[
                    'px-2 py-1 text-[11px] font-medium rounded-md transition-all border',
                    activeFilters.dokumentenart === format.value
                      ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  ]"
                >
                  {{ format.label }}
                </button>
              </div>
              
              <div class="w-px h-4 bg-slate-200"></div>
              
              <!-- Zustellungsweg Filter -->
              <div class="flex items-center gap-1">
                <span class="text-[11px] text-slate-400 font-medium mr-0.5">Zustellung:</span>
                <button
                  v-for="weg in zustellungswegOptions"
                  :key="weg.value"
                  @click="toggleZustellungswegFilter(weg.value)"
                  :class="[
                    'px-2 py-1 text-[11px] font-medium rounded-md transition-all border',
                    activeFilters.zustellungsweg === weg.value
                      ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  ]"
                >
                  {{ weg.label }}
                </button>
              </div>
              
              <div class="w-px h-4 bg-slate-200"></div>
              
              <!-- Pools Filter -->
              <div class="flex items-center gap-1">
                <span class="text-[11px] text-slate-400 font-medium mr-0.5">Pools:</span>
                <button
                  v-for="pool in poolOptions"
                  :key="pool.value"
                  @click="togglePoolFilter(pool.value)"
                  :class="[
                    'px-2 py-1 text-[11px] font-medium rounded-md transition-all border',
                    activeFilters.pool === pool.value
                      ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  ]"
                >
                  {{ pool.label }}
                </button>
              </div>
              
              <!-- Filter zurücksetzen Button -->
              <button
                v-if="anyFiltersActive"
                @click="clearAllFilters"
                class="px-2 py-1 text-[11px] font-medium rounded-md inline-flex items-center gap-1 text-red-600 hover:bg-red-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
                Zurücksetzen
              </button>
            </div>
          </div>
        </header>
        
        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto p-5 lg:p-6">
          <router-view v-slot="{ Component, route }">
            <component
              :is="Component"
              :is-production="isProduction"
              :filtered-insurers="filteredInsurers"
              :filtered-gdv-entries="filteredGdvEntries"
              :status-counts="statusCountsForView"
              :gdv-status-counts="gdvStatusCounts"
              :status-filter="statusFilter"
              :search-filter="searchQuery"
              :simulated-date="systemDate"
              :current-date="currentDate"
              :any-filters-active="anyFiltersActive"
              :selected-gdv="selectedGdv"
              :sort-option="gdvSortOption"
              :is-loading="gdvIsLoading"
              @status-clicked="applyFilter"
              @filter-by-zustellungsweg="handleSortByZustellungsweg"
              @filter-by-dokumentenart="handleSortByDokumentenart"
              @update:search-filter="handleSearch"
              @update:sort-option="updateSortOption"
              @update:gdv-sort-option="gdvSortOption = $event"
              @change-date="handleDateChange"
              @reset-date="resetDate"
              @clear-status-filter="statusFilter = 'all'"
              @clear-all-filters="clearAllFilters"
              @select-insurer="selectedInsurer = $event"
              @select-gdv="handleSelectGdv"
              @delete-insurer="handleDeleteInsurer"
              @create-insurer="handleCreateInsurer"
              @create-gdv="handleCreateGdv"
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
            <Transition name="modal">
              <div v-if="showCreateInsurerModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showCreateInsurerModal = false">
                <div class="bg-white rounded-2xl p-6 shadow-soft-xl w-full max-w-md animate-scale-in">
                  <h3 class="text-lg font-semibold text-slate-900 mb-1">Neuen Versicherer erstellen</h3>
                  <p class="text-sm text-slate-500 mb-5">Geben Sie den Namen des neuen Versicherers ein.</p>
                  <input
                    v-model="newInsurerName"
                    type="text"
                    class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all mb-5 placeholder-slate-400"
                    placeholder="Name des Versicherers"
                    autofocus
                  />
                  <div class="flex justify-end gap-2.5">
                    <button @click="showCreateInsurerModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                    <button @click="saveNewInsurer" class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>

          <!-- GDV Detail Panel -->
          <Teleport to="body">
            <GdvDetail 
              v-if="selectedGdv" 
              :gdv="selectedGdv"
              @close="selectedGdv = null"
              @update:gdv="handleUpdateGdv"
              @gdv-deleted="handleGdvDeleted"
            />
          </Teleport>

          <!-- Create GDV Modal -->
          <Teleport to="body">
            <Transition name="modal">
              <div v-if="showCreateGdvModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50" @click.self="showCreateGdvModal = false">
                <div class="bg-white rounded-2xl p-6 shadow-soft-xl w-full max-w-md animate-scale-in">
                  <h3 class="text-lg font-semibold text-slate-900 mb-1">Neuen GDV-Eintrag erstellen</h3>
                  <p class="text-sm text-slate-500 mb-5">Geben Sie den Namen des Versicherers ein.</p>
                  <input
                    v-model="newGdvName"
                    type="text"
                    class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all mb-5 placeholder-slate-400"
                    placeholder="Name des Versicherers"
                    autofocus
                  />
                  <div class="flex justify-end gap-2.5">
                    <button @click="showCreateGdvModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Abbrechen</button>
                    <button @click="saveNewGdv" class="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/25 transition-all">Speichern</button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useInsurerStore } from '../stores/insurerStore';
import { useAbrechnungStore } from '../stores/abrechnungStore';
import { useUserStore } from '../stores/userStore';
import { useActivityStore } from '../stores/activityStore';
import { useGdvStore } from '../stores/gdvStore';
import { useInsurerUtils } from '@/composables/useInsurerUtils.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { HomeIcon, UserGroupIcon, ChartBarIcon, ClockIcon, CogIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';
import InsurerDetail from './InsurerDetail.vue';
import GdvDetail from './GdvDetail.vue';
import TestDateSimulator from './TestDateSimulator.vue';

const router = useRouter();
const route = useRoute();

const insurerStore = useInsurerStore();
const abrechnungStore = useAbrechnungStore();
const userStore = useUserStore();
const activityStore = useActivityStore();
const gdvStore = useGdvStore();
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

const {
  gdvEntries,
  isLoading: gdvIsLoading
} = storeToRefs(gdvStore);

const isProduction = import.meta.env.PROD;
const isDevelopment = !import.meta.env.PROD;

const systemDate = computed(() => new Date());

const isComponentLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');
const currentDate = ref(new Date());
const selectedInsurer = ref(null);
const selectedGdv = ref(null);
const sortOption = ref('status'); // Default sort option
const gdvSortOption = ref('name'); // GDV sort option
const showCreateGdvModal = ref(false);
const newGdvName = ref('');
// Priority sorting triggered from StatisticsView clicks
const priorityZustellungsweg = ref(null);
const priorityDokumentenart = ref(null);
const showCreateInsurerModal = ref(false);
const newInsurerName = ref('');
const activeFilters = ref({
  zustellungsweg: null,
  turnus: null,
  dokumentenart: null,
  pool: null,
});

// Filter Options
const dokumentenFormatOptions = [
  { label: 'PDF', value: 'PDF' },
  { label: 'CSV', value: 'CSV' },
  { label: 'Papier', value: 'PAPIER' },
];

const zustellungswegOptions = [
  { label: 'E-Mail', value: 'E-Mail' },
  { label: 'Post', value: 'Per Post' },
  { label: 'BiPRO', value: 'BiPRO' },
  { label: 'GetMyInvoices', value: 'Maklerportal/GetMyInvoices' },
];

const poolOptions = [
  { label: 'Vema-Pool', value: 'vema' },
];

// Toggle functions for filter buttons
const toggleDokumentenartFilter = (value) => {
  if (activeFilters.value.dokumentenart === value) {
    activeFilters.value.dokumentenart = null;
  } else {
    activeFilters.value.dokumentenart = value;
  }
};

const toggleZustellungswegFilter = (value) => {
  if (activeFilters.value.zustellungsweg === value) {
    activeFilters.value.zustellungsweg = null;
  } else {
    activeFilters.value.zustellungsweg = value;
  }
};

const togglePoolFilter = (value) => {
  if (activeFilters.value.pool === value) {
    activeFilters.value.pool = null;
  } else {
    activeFilters.value.pool = value;
  }
};

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

// Status filters - dynamically show different options based on current route
const isGdvRoute = computed(() => route.path.startsWith('/gdv'));

const statusFilters = computed(() => {
  if (isGdvRoute.value) {
    // GDV-specific status filters
    const counts = gdvStatusCounts.value || {};
    return [
      { key: 'all', label: 'Alle', count: counts.all || 0 },
      { key: 'on_time', label: 'Aktuell', count: counts.on_time || 0 },
      { key: 'warning', label: 'Fällig', count: counts.warning || 0 },
      { key: 'critical', label: 'Überfällig', count: counts.critical || 0 },
      { key: 'no_import', label: 'Kein Import', count: counts.no_import || 0 },
    ];
  } else {
    // Insurer-specific status filters
    const counts = insurerStatusCounts.value || {};
    return [
      { key: 'all', label: 'Alle', count: counts.all || 0 },
      { key: 'on_time', label: 'Aktuell', count: counts.on_time || 0 },
      { key: 'warning', label: 'Mahnung', count: counts.warning || 0 },
      { key: 'critical', label: 'Kritisch', count: counts.critical || 0 },
      { key: 'no_invoice', label: 'Keine Abrechnung', count: counts.no_invoice || 0 },
      { key: 'incomplete', label: 'Unvollständig', count: counts.incomplete || 0 },
    ];
  }
});

// Check if user is admin
const isAdmin = computed(() => userStore.isAdmin);

// Navigation items - dynamically show admin panel
const navItems = computed(() => {
  const items = [
    { name: 'Abrechnung', path: '/insurers', icon: 'users', component: UserGroupIcon },
    { name: 'GDV', path: '/gdv', icon: 'document', component: DocumentTextIcon },
    { name: 'Statistiken', path: '/stats', icon: 'stats', component: ChartBarIcon },
    { name: 'Aktivitäten', path: '/activities', icon: 'activity', component: ClockIcon },
  ];
  
  // Add admin panel for admins only
  if (isAdmin.value) {
    items.push({ name: 'Benutzerverwaltung', path: '/users', icon: 'admin', component: ShieldCheckIcon });
  }
  
  items.push({ name: 'Einstellungen', path: '/settings', icon: 'settings', component: CogIcon });
  
  return items;
});

const currentRouteName = computed(() => {
  const currentNav = navItems.value.find((item) => {
    return route.path.startsWith(item.path);
  });
  return currentNav ? currentNav.name : 'Übersicht';
});

const insurerStatusCounts = computed(() => {
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

  return counts;
});

const statusCountsForView = computed(() => {
  const counts = insurerStatusCounts.value ?? {};
  return {
    critical: counts.critical ?? 0,
    warning: counts.warning ?? 0,
    on_time: counts.on_time ?? 0,
    no_invoice: counts.no_invoice ?? 0,
  };
});

// GDV Status Counts
const gdvStatusCounts = computed(() => {
  const counts = {
    all: 0,
    on_time: 0,
    warning: 0,
    critical: 0,
    no_import: 0,
    no_data: 0
  };

  (gdvEntries.value || []).forEach((gdv) => {
    if (!gdv) return;
    const status = gdvStore.getGdvStatus(gdv, currentDate.value);
    if (counts[status] !== undefined) {
      counts[status] += 1;
    }
    counts.all += 1;
  });

  return counts;
});

// Filtered GDV Entries
const filteredGdvEntries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  
  let filtered = (gdvEntries.value || []).filter((gdv) => {
    if (!gdv) return false;
    
    // Status filter
    if (statusFilter.value !== 'all') {
      const status = gdvStore.getGdvStatus(gdv, currentDate.value);
      if (status !== statusFilter.value) {
        return false;
      }
    }
    
    // Search filter
    if (query) {
      const matchesName = typeof gdv.name === 'string' && gdv.name.toLowerCase().includes(query);
      if (!matchesName) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sorting
  if (gdvSortOption.value === 'name') {
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (gdvSortOption.value === 'date') {
    return filtered.sort((a, b) => {
      const dateA = a.last_import ? new Date(a.last_import) : new Date(0);
      const dateB = b.last_import ? new Date(b.last_import) : new Date(0);
      return dateB - dateA;
    });
  } else {
    // Sort by overdue status
    return filtered.sort((a, b) => {
      const daysA = gdvStore.calculateDaysSinceImport(a, currentDate.value) ?? -99999;
      const daysB = gdvStore.calculateDaysSinceImport(b, currentDate.value) ?? -99999;
      return daysB - daysA;
    });
  }
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
        // If it's a comma-separated string, split it
        if (typeof insurer.dokumentenart === 'string' && insurer.dokumentenart.includes(',')) {
          docsRaw = insurer.dokumentenart.split(',');
        } else {
          docsRaw = [insurer.dokumentenart];
        }
      }
      
      // Flatten and normalize all document types
      const docs = docsRaw.flatMap((item) => {
        if (typeof item === 'string') {
          // Also split by comma in case array items contain multiple values
          return item.split(',').map(s => s.trim().toUpperCase());
        }
        if (item && typeof item === 'object') {
          const strVal = Object.values(item).find(v => typeof v === 'string');
          return strVal ? strVal.split(',').map(s => s.trim().toUpperCase()) : [];
        }
        return [String(item).trim().toUpperCase()];
      });
      
      console.log(`[Filter] Insurer "${insurer.name}" docs:`, docs, 'Looking for:', activeFilters.value.dokumentenart, 'Match:', docs.includes(activeFilters.value.dokumentenart));
      
      if (!docs.includes(activeFilters.value.dokumentenart)) {
        return false;
      }
    }

    // Pool filter (check vemapool boolean field)
    if (activeFilters.value.pool === 'vema') {
      if (insurer.vemapool !== true) {
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
  // Strenger Check für "Per Post" - nur wenn explizit Post/Papier/Brief gemeint ist
  const isPost = (
    s.includes('per post') ||
    s.includes('papier') ||
    s.includes('brief') ||
    s === 'post' ||
    s.includes('postalisch') ||
    s.includes('postversand') ||
    s.includes('postweg')
  );
  if (isPost) return 'Per Post';
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
  console.log('[DateSimulator] handleDateChange called with payload:', payload, typeof payload);
  if (payload === 1 || payload === -1) {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() + payload);
    currentDate.value = newDate;
    console.log('[DateSimulator] Arrow button: new currentDate =', currentDate.value);
  } else {
    currentDate.value = new Date(payload);
    console.log('[DateSimulator] Direct date set: new currentDate =', currentDate.value);
  }
};

const resetDate = () => {
  currentDate.value = new Date();
};

// Provide currentDate and date change functions to all descendants
provide('currentDate', currentDate);
provide('handleDateChange', handleDateChange);
provide('resetDate', resetDate);

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
    !!activeFilters.value.turnus ||
    !!activeFilters.value.pool
  );
});

const clearAllFilters = () => {
  statusFilter.value = 'all';
  searchQuery.value = '';
  activeFilters.value = { zustellungsweg: null, dokumentenart: null, turnus: null, pool: null };
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

// GDV Event Handlers
const handleCreateGdv = () => {
  newGdvName.value = '';
  showCreateGdvModal.value = true;
};

const saveNewGdv = async () => {
  if (!newGdvName.value.trim()) {
    return;
  }

  try {
    const newGdv = await gdvStore.addGdvEntry({ 
      name: newGdvName.value.trim(),
      delivers_gdv: true,
      versandarten: [],
      frequency: '',
      bestandsart: ''
    });
    showCreateGdvModal.value = false;
    
    // Log activity
    await activityStore.logActivity(activityStore.ActivityType.INSURER_CREATED, {
      entityType: 'gdv',
      entityId: newGdv?.id,
      entityName: newGdvName.value.trim(),
      description: `GDV-Eintrag "${newGdvName.value.trim()}" erstellt`
    });
    
    newGdvName.value = '';
  } catch (error) {
    console.error('Failed to save new GDV entry:', error);
  }
};

const handleGdvDeleted = () => {
  selectedGdv.value = null;
};

const handleUpdateGdv = (updatedGdv) => {
  try {
    if (!updatedGdv) return;
    if (selectedGdv.value?.id === updatedGdv.id) {
      selectedGdv.value = { ...selectedGdv.value, ...updatedGdv };
    }
  } catch (e) {
    console.error('[MainApp] handleUpdateGdv error', e);
  }
};

const handleSelectGdv = (gdv) => {
  selectedGdv.value = gdv;
};

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
    await Promise.all([
      insurerStore.switchEnvironmentAndFetchData?.('production'),
      abrechnungStore.fetchAbrechnungen?.(),
      gdvStore.fetchGdvEntries()
    ]);
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
    box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7);
    transform: scale(1);
  }
  50% {
    background-color: rgb(253 224 71); /* yellow-300 */
    border-color: rgb(250 204 21); /* yellow-400 */
    box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.5);
    transform: scale(1.08);
  }
  100% {
    background-color: rgb(250 204 21); /* yellow-400 */
    border-color: rgb(234 179 8); /* yellow-500 */
    box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.7);
    transform: scale(1);
  }
}

.blink-yellow {
  animation: blink-yellow 0.8s ease-in-out infinite;
  transform-origin: center;
}
</style>
