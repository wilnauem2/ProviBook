<template>
  <div :class="{ 'filter blur-sm': selectedInsurer }">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Abrechnungsverlauf</h2>
        <div class="flex items-center space-x-2">
          <button 
            @click="refreshData" 
            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Lädt...' : 'Aktualisieren' }}
          </button>
          <div class="text-sm text-gray-500">
            <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Lade Daten...
          </span>
          <span v-else>
            {{ abrechnungen?.length || 0 }} Einträge geladen
            <span v-if="hasMorePages"> (weitere verfügbar)</span>
          </span>
          </div>
        </div>
      </div>

      <div v-if="abrechnungen?.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versicherer</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referenz</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumenttyp</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Notiz</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="!isLoading && abrechnungen.length > 0">
              <tr 
                v-for="abrechnung in abrechnungen" 
                :key="abrechnung.id" 
                @click="handleAbrechnungClick(abrechnung)"
                class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(abrechnung.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ abrechnung.insurer || 'Unbekannt' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ abrechnung.reference || 'Keine Referenz' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <!-- Document type badges -->
                    <template v-if="Array.isArray(abrechnung.documentType) && abrechnung.documentType.length > 0">
                      <span 
                        v-for="(docType, idx) in abrechnung.documentType" 
                        :key="idx"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getDocTypeClass(docType)"
                      >
                        <component :is="getDocTypeIcon(docType)" class="w-3 h-3 mr-1.5" />
                        {{ docType }}
                      </span>
                    </template>
                    <span v-else class="text-sm text-gray-500 italic">
                      Kein Typ
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      statusClass(abrechnung.status), 
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ abrechnung.status || 'Unbekannt' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm text-gray-500 w-48">
                  <div class="flex items-center overflow-hidden">
                    <span class="truncate">{{ abrechnung.note || 'Keine Notiz' }}</span>
                    <span v-if="abrechnung.note" class="ml-2 text-blue-500 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                <p v-if="abrechnungStore.isLoading">Lade Abrechnungen...</p>
                <p v-else>Keine Abrechnungen gefunden.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Load more trigger (invisible element for intersection observer) -->
      <div ref="loadMoreTrigger" class="h-1 w-full"></div>

      <!-- Load More Button -->
      <div v-if="hasMorePages" class="px-6 py-4 border-t text-center">
        <button 
          @click="loadMore" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Lade mehr...
          </span>
          <span v-else>Mehr laden</span>
        </button>
      </div>
    </div>

    <div v-if="dataMode === 'test'" class="bg-white shadow rounded-lg p-6 mt-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Test-Aktionen</h3>
      <div class="flex justify-center">
        <button @click="$emit('create-sample-data')" :disabled="isCreatingSampleData" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg v-if="isCreatingSampleData" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isCreatingSampleData ? 'Erstelle Testdaten...' : 'Testdaten erstellen' }}
        </button>
      </div>
    </div>

    <!-- Abrechnung Details Modal -->
    <div v-if="showAbrechnungModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showAbrechnungModal = false">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Abrechnungsdetails</h3>
            <button @click="showAbrechnungModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Datum</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedAbrechnung?.date) }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.reference">
              <dt class="text-sm font-medium text-gray-500">Referenz</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.reference }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.documentType">
              <dt class="text-sm font-medium text-gray-500">Dokumententyp</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ selectedAbrechnung.documentType }}</dd>
            </div>
            
            <div v-if="selectedAbrechnung?.status">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span :class="statusClass(selectedAbrechnung.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedAbrechnung.status }}
                </span>
              </dd>
            </div>
            
            <div v-if="selectedAbrechnung?.note">
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ selectedAbrechnung.note }}</dd>
            </div>
            <div v-else>
              <dt class="text-sm font-medium text-gray-500">Kommentar</dt>
              <dd class="mt-1 text-sm text-gray-500 italic">Kein Kommentar vorhanden</dd>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showAbrechnungModal = false" type="button" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted, onBeforeUnmount, h } from 'vue';
import {
  DocumentTextIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  CodeBracketIcon,
  DocumentIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/solid';
import { format } from 'date-fns';
import { useInsurerUtils } from '../composables/useInsurerUtils';
import { useAbrechnungStore } from '@/stores/abrechnungStore';

// Initialize store
const abrechnungStore = useAbrechnungStore();

// Emit events
const emit = defineEmits(['create-sample-data']);

// Component props
const props = defineProps({
  selectedInsurer: {
    type: Object,
    default: null
  },
  dataMode: {
    type: String,
    default: 'production'
  },
  isCreatingSampleData: {
    type: Boolean,
    default: false
  }
});

// Methods
const refreshData = async () => {
  console.log('Refreshing data...');
  try {
    await abrechnungStore.fetchAbrechnungen({ forceRefresh: true });
    console.log('Data refresh complete');
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

// Document type icon components
const DocTypeIcon = {
  PDF: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]);
    }
  },
  XLS: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]);
    }
  },
  XML: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' })
      ]);
    }
  },
  CSV: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]);
    }
  },
  PAPIER: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
      ]);
    }
  },
  BIPRO: {
    render() {
      return h('svg', { 
        class: 'h-4 w-4',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, [
        h('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })
      ]);
    }
  }
};

// Document type configuration
const docTypeConfig = {
  'PDF': { 
    classes: 'bg-red-100 text-red-800',
    icon: 'PDF',
    aliases: ['PDF']
  },
  'XLS': { 
    classes: 'bg-green-100 text-green-800',
    icon: 'XLS',
    aliases: ['EXCEL', 'XLSX']
  },
  'XML': { 
    classes: 'bg-purple-100 text-purple-800',
    icon: 'XML'
  },
  'CSV': { 
    classes: 'bg-blue-100 text-blue-800',
    icon: 'CSV'
  },
  'PAPIER': { 
    classes: 'bg-gray-100 text-gray-800',
    icon: 'PAPIER',
    aliases: ['PAPER', 'PAP']
  },
  'BIPRO': {
    classes: 'bg-indigo-100 text-indigo-800',
    icon: 'BIPRO'
  }
};

// Helper functions for document types
const getDocTypeClass = (docType) => {
  if (!docType) return 'bg-gray-100 text-gray-800';
  const type = docType.toUpperCase();
  switch (type) {
    case 'PDF': return 'bg-red-100 text-red-800';
    case 'XLS':
    case 'XLSX': return 'bg-green-100 text-green-800';
    case 'CSV': return 'bg-blue-100 text-blue-800';
    case 'XML': return 'bg-purple-100 text-purple-800';
    case 'PAPIER': return 'bg-gray-200 text-gray-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const getDocTypeIcon = (docType) => {
  if (!docType) return QuestionMarkCircleIcon;
  const type = docType.toUpperCase();
  switch (type) {
    case 'PDF': return DocumentTextIcon;
    case 'XLS':
    case 'XLSX': return TableCellsIcon;
    case 'CSV': return DocumentChartBarIcon;
    case 'XML': return CodeBracketIcon;
    case 'PAPIER': return DocumentIcon;
    default: return QuestionMarkCircleIcon;
  }
};

// Local state
const showAbrechnungModal = ref(false);
const selectedAbrechnung = ref(null);
const isMounted = ref(false);
const observer = ref(null);
const loadMoreTrigger = ref(null);

// Helper function to safely extract array from Proxy or regular array
const safeExtractArray = (value) => {
  if (!value) return [];
  // Handle Proxy-wrapped arrays
  if (value[Symbol.iterator] && typeof value !== 'string') {
    try {
      return Array.from(value);
    } catch (e) {
      console.warn('Error extracting array from Proxy:', e);
      return [];
    }
  }
  return Array.isArray(value) ? value : [value];
};

// Helper function to safely extract values from Proxy or regular objects/arrays
const safeExtractValue = (value) => {
  if (!value) return value;
  
  // If it's a Vue 3 reactive Proxy with __v_raw, get the raw value
  if (value[Symbol.for('__v_raw')]) {
    return value[Symbol.for('__v_raw')];
  }
  
  // If it's an array or array-like, convert to array
  if (Array.isArray(value) || (value[Symbol.iterator] && typeof value !== 'string')) {
    try {
      return Array.from(value);
    } catch (e) {
      console.warn('Could not convert value to array:', e);
      return [];
    }
  }
  
  return value;
};

// Document type utility functions
const getDisplayableDocTypes = (docArt, currentAbrechnung) => {
  // Get document type with safe fallback
  const docType = safeExtractValue(
    (currentAbrechnung && currentAbrechnung.documentType) || docArt
  );
  
  // If no document type is provided, return empty array
  if (!docType) {
    return [];
  }
  
  // Handle array input (either directly, as Proxy, or iterable)
  if (Array.isArray(docType) || (docType && typeof docType[Symbol.iterator] === 'function')) {
    let items;
    try {
      // Safely convert to array whether it's a Proxy or regular array
      items = Array.isArray(docType) ? [...docType] : Array.from(docType);
    } catch (e) {
      console.error('Error processing document type array:', e);
      items = [];
    }
    
    const processedItems = items.flatMap(item => {
      if (!item) return [];
      
      // Handle string items
      if (typeof item === 'string') {
        // Handle comma-separated values in strings
        const values = item.split(',').map(s => s.trim()).filter(Boolean);
        return values.map(v => normalizeDocType(v));
      }
      
      // Handle object items
      if (typeof item === 'object') {
        // Handle case where object has documentType property
        if (item.documentType) {
          const docTypes = Array.isArray(item.documentType) 
            ? item.documentType 
            : [item.documentType];
          return docTypes.map(doc => normalizeDocType(doc));
        }
        
        // Handle case where object has value/type properties
        if (item.value || item.type) {
          const value = item.value || item.type;
          if (Array.isArray(value)) {
            return value.map(v => normalizeDocType(v));
          }
          return [normalizeDocType(value)];
        }
        
        // Handle case where object has document types as properties
        return Object.values(item)
          .flatMap(val => {
            if (Array.isArray(val)) {
              return val.map(v => normalizeDocType(v));
            }
            return [normalizeDocType(val)];
          });
      }
      
      return [normalizeDocType(item)];
    }).filter(Boolean);
    
    const result = [...new Set(processedItems)]; // Remove duplicates
    if (isDebug) console.log('Processed array/object document types:', result);
    return result;
  }
  
  // Handle string input (comma-separated values)
  if (typeof docType === 'string') {
    const result = [...new Set(
      docType.split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => normalizeDocType(s))
        .filter(Boolean)
    )];
    if (isDebug) console.log('Processed string document types:', result);
    return result;
  }
  
  // Handle single object with documentType property
  if (docType && typeof docType === 'object') {
    // Handle documentType property first
    if (docType.documentType) {
      const docTypes = Array.isArray(docType.documentType)
        ? docType.documentType
        : [docType.documentType];
      const result = docTypes.map(doc => normalizeDocType(doc)).filter(Boolean);
      if (isDebug) console.log('Processed documentType property:', result);
      return result;
    }
    
    // Handle value/type properties
    const value = docType.value || docType.type || docType.name;
    if (value) {
      let result;
      if (Array.isArray(value)) {
        result = [...new Set(value.map(v => normalizeDocType(v)).filter(Boolean))];
      } else {
        result = [normalizeDocType(value)].filter(Boolean);
      }
      if (isDebug) console.log('Processed value/type property:', result);
      return result;
    }
    
    // If no specific properties found, try to use all object values
    const result = Object.values(docType)
      .flatMap(val => {
        if (Array.isArray(val)) {
          return val.map(v => normalizeDocType(v));
        }
        return [normalizeDocType(val)];
      })
      .filter(Boolean);
    
    if (isDebug) console.log('Processed object values:', result);
    return result;
  }
  
  // If we get here, it's an unexpected format
  console.warn('Unexpected document type format:', docType);
  return []; // Return empty array as fallback
  return [];
};

const normalizeDocType = (docType) => {
  if (!docType) return null;
  
  // Handle different input types
  let value = '';
  if (typeof docType === 'object') {
    value = docType.value || docType.type || docType.name || '';
  } else {
    value = String(docType);
  }
  
  // Convert to string and normalize
  value = value.trim().toUpperCase();
  
  // Map to standard types - keep this in sync with abrechnungStore.js
  const typeMap = {
    // PDF variations
    'INVOICE': 'PDF',
    'RECHNUNG': 'PDF',
    'INVOICE.PDF': 'PDF',
    'RECHNUNG.PDF': 'PDF',
    
    // Excel variations
    'EXCEL': 'XLS',
    'XLSX': 'XLS',
    'XLS': 'XLS',
    
    // Paper variations
    'PAPER': 'PAPIER',
    'PAPIER': 'PAPIER',
    'PAP': 'PAPIER',
    'UNBEKANNT': 'PAPIER',
    
    // Other formats
    'CSV': 'CSV',
    'XML': 'XML',
    'JSON': 'JSON',
    'BIPRO': 'BIPRO',
    // Add any additional formats as needed
  };
  
  // Try direct match first
  if (typeMap[value]) {
    return typeMap[value];
  }
  
  // Try partial matching (e.g., 'PDF Document' -> 'PDF')
  for (const [key, mappedValue] of Object.entries(typeMap)) {
    if (value.includes(key)) {
      return mappedValue;
    }
  }
  
  // If no match, return the original value in uppercase
  return value || 'PAPIER'; // Default to PAPIER if empty
};

// Computed properties
const abrechnungen = computed(() => {
  return abrechnungStore.abrechnungen || [];
});

const isLoading = computed(() => abrechnungStore.isLoading || false);
const hasMorePages = computed(() => abrechnungStore.hasMorePages || false);

// Watch for dataMode changes
watch(() => props.dataMode, async (newMode, oldMode) => {
  if (newMode !== oldMode && isMounted.value) {
    console.log(`Data mode changed from ${oldMode} to ${newMode}, refreshing data...`);
    await reloadData();
  }
}, { immediate: true });

// Component lifecycle hooks
onMounted(async () => {
  isMounted.value = true;
  console.log('HistoryView mounted, initializing...');
  
  // Initialize IntersectionObserver for infinite scroll
  setupInfiniteScroll();
  
  // Load initial data if needed
  if (abrechnungStore.abrechnungen.length === 0 || 
      (props.dataMode && props.dataMode !== abrechnungStore.dataMode)) {
    await reloadData();
  }
});

onBeforeUnmount(() => {
  // Clean up observer
  if (observer.value) {
    observer.value.disconnect();
  }
});

// Methods
const reloadData = async () => {
  if (isLoading.value) return;
  
  try {
    console.log('Reloading data...');
    await abrechnungStore.resetPagination();
    await abrechnungStore.fetchAbrechnungen({ forceRefresh: true });
    console.log('Data reloaded. Total items:', abrechnungen.value.length);
  } catch (error) {
    console.error('Error reloading data:', error);
  }
};

const loadMore = async () => {
  if (isLoading.value || !hasMorePages.value) return;
  
  try {
    console.log('Loading more Abrechnungen...');
    await abrechnungStore.loadMoreAbrechnungen();
    console.log('More data loaded. Total items:', abrechnungen.value.length);
  } catch (error) {
    console.error('Error loading more Abrechnungen:', error);
  }
};

const setupInfiniteScroll = () => {
  // Use IntersectionObserver to detect when to load more items
  const options = {
    root: null, // viewport
    rootMargin: '20px',
    threshold: 0.1
  };

  observer.value = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !abrechnungStore.isLoading) {
      await loadMore();
    }
  }, options);

  // Start observing the load more trigger element
  if (loadMoreTrigger.value) {
    observer.value.observe(loadMoreTrigger.value);
  }
};

const handleAbrechnungClick = (abrechnung) => {
  console.log('Abrechnung document type data:', {
    rawDocumentType: abrechnung.documentType,
    normalizedTypes: getNormalizedDocTypes(abrechnung.documentType),
    fullAbrechnung: JSON.parse(JSON.stringify(abrechnung)) // Deep clone for logging
  });
  selectedAbrechnung.value = abrechnung;
  showAbrechnungModal.value = true;
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Kein Datum';
  
  try {
    let date;
    
    // Handle Firestore Timestamp
    if (dateValue.toDate) {
      date = dateValue.toDate();
    } 
    // Handle ISO string
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    // Assume it's already a Date object
    else if (dateValue instanceof Date) {
      date = dateValue;
    } 
    // Handle timestamp number
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    // Handle invalid date
    else {
      console.warn('Unsupported date format:', dateValue);
      return 'Ungültiges Datum';
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateValue);
      return 'Ungültiges Datum';
    }
    
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateValue);
    return 'Fehler';
  }
};

const statusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('erfolg') || statusLower.includes('success') || statusLower.includes('abgeschlossen')) {
    return 'bg-green-100 text-green-800';
  } else if (statusLower.includes('fehler') || statusLower.includes('error') || statusLower.includes('fehlgeschlagen')) {
    return 'bg-red-100 text-red-800';
  } else if (statusLower.includes('warn') || statusLower.includes('warning') || statusLower.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
};
</script>
