<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Header Section -->
    <div class="px-6 py-4 border-b flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Aktivitäten</h2>
        <p class="text-xs text-gray-500 mt-1">
          Status: 
          <span v-if="isLoading" class="text-blue-600">Lädt...</span>
          <span v-else-if="activities.length > 0" class="text-green-600">{{ activities.length }} Aktivitäten geladen</span>
          <span v-else class="text-amber-600">Keine Aktivitäten</span>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="refreshActivities" 
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
            {{ activities?.length || 0 }} Aktivitäten
            <span v-if="hasMorePages"> (weitere verfügbar)</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div v-if="activities?.length > 0" class="p-6">
      <div class="flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(activity, activityIdx) in activities" :key="activity.id">
            <div class="relative pb-8">
              <!-- Connector line -->
              <span 
                v-if="activityIdx !== activities.length - 1" 
                class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                aria-hidden="true"
              ></span>
              
              <div class="relative flex items-start space-x-3">
                <!-- Activity Icon -->
                <div>
                  <span :class="[getActivityColor(activity.type), 'h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white']">
                    <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </div>
                
                <!-- Activity Content -->
                <div class="min-w-0 flex-1">
                  <div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-900">{{ activity.userName }}</span>
                    </div>
                    <p class="mt-0.5 text-sm text-gray-500">
                      {{ formatTimestamp(activity.timestamp) }}
                    </p>
                  </div>
                  <div class="mt-2 text-sm text-gray-700">
                    <p>{{ activity.description }}</p>
                    
                    <!-- Entity Info -->
                    <div v-if="activity.entityName" class="mt-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {{ activity.entityType }}: {{ activity.entityName }}
                      </span>
                    </div>
                    
                    <!-- Changes -->
                    <div v-if="activity.changes" class="mt-2 text-xs">
                      <details class="bg-gray-50 rounded p-2">
                        <summary class="cursor-pointer text-gray-600 hover:text-gray-900">Änderungen anzeigen</summary>
                        <div class="mt-2 space-y-1">
                          <div v-for="(value, key) in activity.changes" :key="key" class="flex justify-between">
                            <span class="font-medium">{{ key }}:</span>
                            <span class="text-gray-600">{{ formatValue(value) }}</span>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePages" class="mt-6 text-center">
        <button 
          @click="loadMore" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Lädt...' : 'Mehr laden' }}
        </button>
      </div>
      
      <div v-else-if="activities.length > 0" class="mt-6 text-center text-sm text-gray-500">
        Keine weiteren Aktivitäten
      </div>
    </div>

    <!-- No Data Message -->
    <div v-else-if="!isLoading" class="p-6 text-center text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-2 text-sm">Noch keine Aktivitäten vorhanden</p>
      <p class="mt-1 text-xs text-gray-400">Aktivitäten werden automatisch erstellt, wenn Sie Aktionen durchführen</p>
      <button 
        @click="createTestActivity" 
        class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        Test-Aktivität erstellen
      </button>
    </div>
    
    <!-- Error Display -->
    <div v-if="activityStore.error" class="p-6 bg-red-50 text-red-700 rounded-md mx-6 mb-6">
      <p class="font-medium">Fehler beim Laden der Aktivitäten:</p>
      <p class="text-sm mt-1">{{ activityStore.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useActivityStore } from '@/stores/activityStore';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  CogIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const activityStore = useActivityStore();

const activities = computed(() => activityStore.activities);
const isLoading = computed(() => activityStore.isLoading);
const hasMorePages = computed(() => activityStore.hasMorePages);

// Methods
const refreshActivities = async () => {
  console.log('[ActivitiesView] Refreshing activities...');
  try {
    await activityStore.fetchActivities({ forceRefresh: true });
    console.log('[ActivitiesView] Activities loaded:', activityStore.activities.length);
  } catch (error) {
    console.error('[ActivitiesView] Error refreshing activities:', error);
  }
};

const loadMore = async () => {
  console.log('[ActivitiesView] Loading more activities...');
  try {
    await activityStore.loadMoreActivities();
  } catch (error) {
    console.error('[ActivitiesView] Error loading more:', error);
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unbekannt';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: de 
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Ungültiges Datum';
  }
};

const formatValue = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const getActivityColor = (type) => {
  if (type.includes('created')) return 'bg-green-500';
  if (type.includes('updated')) return 'bg-blue-500';
  if (type.includes('deleted')) return 'bg-red-500';
  if (type.includes('login')) return 'bg-indigo-500';
  if (type.includes('logout')) return 'bg-gray-500';
  if (type.includes('export')) return 'bg-purple-500';
  if (type.includes('filter')) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const getActivityIcon = (type) => {
  if (type.includes('created')) return PlusCircleIcon;
  if (type.includes('updated')) return PencilSquareIcon;
  if (type.includes('deleted')) return TrashIcon;
  if (type.includes('viewed')) return EyeIcon;
  if (type.includes('login')) return ArrowRightOnRectangleIcon;
  if (type.includes('logout')) return ArrowRightOnRectangleIcon;
  if (type.includes('export')) return ArrowDownTrayIcon;
  if (type.includes('user')) return UserPlusIcon;
  if (type.includes('settings')) return CogIcon;
  if (type.includes('filter')) return FunnelIcon;
  return PencilSquareIcon;
};

const createTestActivity = async () => {
  console.log('[ActivitiesView] Creating test activity...');
  try {
    await activityStore.logActivity(activityStore.ActivityType.INSURER_VIEWED, {
      entityType: 'test',
      entityId: 'test-' + Date.now(),
      entityName: 'Test Aktivität',
      description: 'Dies ist eine Test-Aktivität um zu prüfen, ob das System funktioniert'
    });
    console.log('[ActivitiesView] Test activity created successfully');
    await refreshActivities();
  } catch (error) {
    console.error('[ActivitiesView] Error creating test activity:', error);
    alert('Fehler beim Erstellen der Test-Aktivität: ' + error.message);
  }
};

// Lifecycle
onMounted(async () => {
  console.log('[ActivitiesView] Component mounted');
  await refreshActivities();
});
</script>
