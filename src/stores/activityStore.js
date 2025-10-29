import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserStore } from './userStore';

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const lastDocument = ref(null);
  const hasMorePages = ref(true);
  const currentPage = ref(1);
  const pageSize = 50;

  // Activity types enum
  const ActivityType = {
    // Insurer actions
    INSURER_CREATED: 'insurer_created',
    INSURER_UPDATED: 'insurer_updated',
    INSURER_DELETED: 'insurer_deleted',
    INSURER_VIEWED: 'insurer_viewed',
    
    // Field updates
    FIELD_UPDATED: 'field_updated',
    TURNUS_UPDATED: 'turnus_updated',
    DOKUMENTENART_UPDATED: 'dokumentenart_updated',
    ZUSTELLUNGSWEG_UPDATED: 'zustellungsweg_updated',
    COMMENT_UPDATED: 'comment_updated',
    VEMAPOOL_UPDATED: 'vemapool_updated',
    NAME_UPDATED: 'name_updated',
    
    // Billing actions
    BILLING_ADDED: 'billing_added',
    BILLING_UPDATED: 'billing_updated',
    BILLING_DELETED: 'billing_deleted',
    
    // User actions
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    USER_CREATED: 'user_created',
    USER_UPDATED: 'user_updated',
    USER_DELETED: 'user_deleted',
    
    // Data actions
    DATA_EXPORTED: 'data_exported',
    DATA_IMPORTED: 'data_imported',
    FILTER_APPLIED: 'filter_applied',
    SEARCH_PERFORMED: 'search_performed',
    
    // Settings
    SETTINGS_UPDATED: 'settings_updated'
  };

  /**
   * Log an activity to Firestore
   * @param {string} type - Activity type from ActivityType enum
   * @param {Object} details - Activity details
   * @param {string} details.entityType - Type of entity (e.g., 'insurer', 'user', 'billing')
   * @param {string} details.entityId - ID of the entity
   * @param {string} details.entityName - Name of the entity for display
   * @param {Object} details.changes - Object describing what changed (for updates)
   * @param {string} details.description - Human-readable description
   */
  const logActivity = async (type, details = {}) => {
    const userStore = useUserStore();
    
    if (!userStore.isAuthenticated) {
      console.warn('Cannot log activity: User not authenticated');
      return null;
    }

    // Get user info with fallbacks
    const userId = userStore.userId || userStore.currentUser?.uid || null;
    const userEmail = userStore.userEmail || userStore.currentUser?.email || 'unknown@example.com';
    const userName = userStore.userDisplayName || userStore.currentUser?.displayName || userEmail;

    if (!userId) {
      console.error('Cannot log activity: User ID is undefined', {
        isAuthenticated: userStore.isAuthenticated,
        currentUser: userStore.currentUser,
        userId: userStore.userId
      });
      return null;
    }

    try {
      const activity = {
        type,
        userId,
        userName,
        userEmail,
        timestamp: Timestamp.now(),
        entityType: details.entityType || null,
        entityId: details.entityId || null,
        entityName: details.entityName || null,
        changes: details.changes || null,
        description: details.description || getDefaultDescription(type, details),
        metadata: {
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          ...details.metadata
        }
      };

      const docRef = await addDoc(collection(db, 'activities'), activity);
      console.log('Activity logged:', { id: docRef.id, ...activity });
      
      // Add to local cache if we're on the activities page
      if (activities.value.length > 0) {
        activities.value.unshift({ id: docRef.id, ...activity });
      }
      
      return docRef.id;
    } catch (err) {
      console.error('Error logging activity:', err);
      error.value = err.message;
      throw err;
    }
  };

  /**
   * Generate a default description for an activity
   */
  const getDefaultDescription = (type, details) => {
    const entityName = details.entityName || details.entityId || 'Element';
    
    switch (type) {
      case ActivityType.INSURER_CREATED:
        return `Versicherer "${entityName}" erstellt`;
      case ActivityType.INSURER_UPDATED:
        return `Versicherer "${entityName}" aktualisiert`;
      case ActivityType.INSURER_DELETED:
        return `Versicherer "${entityName}" gelöscht`;
      case ActivityType.INSURER_VIEWED:
        return `Versicherer "${entityName}" angesehen`;
        
      case ActivityType.FIELD_UPDATED:
        return `Feld aktualisiert bei "${entityName}"`;
      case ActivityType.TURNUS_UPDATED:
        return `Turnus aktualisiert bei "${entityName}"`;
      case ActivityType.DOKUMENTENART_UPDATED:
        return `Dokumentenart aktualisiert bei "${entityName}"`;
      case ActivityType.ZUSTELLUNGSWEG_UPDATED:
        return `Zustellungsweg aktualisiert bei "${entityName}"`;
      case ActivityType.COMMENT_UPDATED:
        return `Kommentar aktualisiert bei "${entityName}"`;
      case ActivityType.VEMAPOOL_UPDATED:
        return `Vemapool ${details.changes?.vemapool ? 'aktiviert' : 'deaktiviert'} für "${entityName}"`;
      case ActivityType.NAME_UPDATED:
        return `Name geändert zu "${entityName}"`;
        
      case ActivityType.BILLING_ADDED:
        return `Abrechnung hinzugefügt für "${entityName}"`;
      case ActivityType.BILLING_UPDATED:
        return `Abrechnung aktualisiert für "${entityName}"`;
      case ActivityType.BILLING_DELETED:
        return `Abrechnung gelöscht für "${entityName}"`;
        
      case ActivityType.USER_LOGIN:
        return 'Benutzer angemeldet';
      case ActivityType.USER_LOGOUT:
        return 'Benutzer abgemeldet';
      case ActivityType.USER_CREATED:
        return `Benutzer "${entityName}" erstellt`;
      case ActivityType.USER_UPDATED:
        return `Benutzer "${entityName}" aktualisiert`;
      case ActivityType.USER_DELETED:
        return `Benutzer "${entityName}" gelöscht`;
        
      case ActivityType.DATA_EXPORTED:
        return 'Daten exportiert';
      case ActivityType.DATA_IMPORTED:
        return 'Daten importiert';
      case ActivityType.FILTER_APPLIED:
        return 'Filter angewendet';
      case ActivityType.SEARCH_PERFORMED:
        return `Suche durchgeführt: "${details.searchTerm}"`;
        
      case ActivityType.SETTINGS_UPDATED:
        return 'Einstellungen aktualisiert';
        
      default:
        return 'Aktivität durchgeführt';
    }
  };

  /**
   * Fetch activities from Firestore with pagination
   */
  const fetchActivities = async (options = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { 
        forceRefresh = false,
        userId = null,
        entityType = null,
        entityId = null,
        startDate = null,
        endDate = null
      } = options;

      // Reset pagination if force refresh
      if (forceRefresh) {
        resetPagination();
      }

      let q = query(
        collection(db, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );

      // Add filters
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      if (entityType) {
        q = query(q, where('entityType', '==', entityType));
      }
      if (entityId) {
        q = query(q, where('entityId', '==', entityId));
      }
      if (startDate) {
        q = query(q, where('timestamp', '>=', Timestamp.fromDate(startDate)));
      }
      if (endDate) {
        q = query(q, where('timestamp', '<=', Timestamp.fromDate(endDate)));
      }

      // Pagination
      if (lastDocument.value && !forceRefresh) {
        q = query(q, startAfter(lastDocument.value));
      }

      const querySnapshot = await getDocs(q);
      
      const newActivities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (forceRefresh) {
        activities.value = newActivities;
      } else {
        activities.value = [...activities.value, ...newActivities];
      }

      // Update pagination state
      if (querySnapshot.docs.length > 0) {
        lastDocument.value = querySnapshot.docs[querySnapshot.docs.length - 1];
        hasMorePages.value = querySnapshot.docs.length === pageSize;
      } else {
        hasMorePages.value = false;
      }

      currentPage.value += 1;

      return activities.value;
    } catch (err) {
      console.error('Error fetching activities:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Load more activities (pagination)
   */
  const loadMoreActivities = async (options = {}) => {
    if (!hasMorePages.value || isLoading.value) {
      return;
    }
    return fetchActivities(options);
  };

  /**
   * Reset pagination state
   */
  const resetPagination = () => {
    activities.value = [];
    lastDocument.value = null;
    hasMorePages.value = true;
    currentPage.value = 1;
  };

  /**
   * Get activities for a specific entity
   */
  const getEntityActivities = async (entityType, entityId) => {
    return fetchActivities({
      entityType,
      entityId,
      forceRefresh: true
    });
  };

  /**
   * Get recent activities (last N activities)
   */
  const getRecentActivities = async (count = 10) => {
    try {
      const q = query(
        collection(db, 'activities'),
        orderBy('timestamp', 'desc'),
        limit(count)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      throw err;
    }
  };

  /**
   * Get activity statistics
   */
  const getActivityStats = computed(() => {
    const stats = {
      total: activities.value.length,
      byType: {},
      byUser: {},
      byEntity: {}
    };

    activities.value.forEach(activity => {
      // Count by type
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;
      
      // Count by user
      stats.byUser[activity.userName] = (stats.byUser[activity.userName] || 0) + 1;
      
      // Count by entity type
      if (activity.entityType) {
        stats.byEntity[activity.entityType] = (stats.byEntity[activity.entityType] || 0) + 1;
      }
    });

    return stats;
  });

  return {
    // State
    activities,
    isLoading,
    error,
    hasMorePages,
    currentPage,
    
    // Computed
    getActivityStats,
    
    // Actions
    logActivity,
    fetchActivities,
    loadMoreActivities,
    resetPagination,
    getEntityActivities,
    getRecentActivities,
    
    // Enums
    ActivityType
  };
});
