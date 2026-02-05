import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  doc, updateDoc, getDoc, collection, getDocs, addDoc, 
  serverTimestamp, deleteDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useGdvStore = defineStore('gdv', () => {
  // State
  const gdvEntries = ref([]);
  const selectedGdv = ref(null);
  const gdvHistories = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  // Collection name
  const collectionName = 'gdv-data';

  // Fetch all GDV entries
  const fetchGdvEntries = async () => {
    console.log('[GDV] Fetching GDV entries...');
    try {
      isLoading.value = true;
      error.value = null;
      
      const gdvRef = collection(db, collectionName);
      const queryRef = query(gdvRef, orderBy('name'));
      const snapshot = await getDocs(queryRef);
      
      console.log(`[GDV] Found ${snapshot.size} GDV entries`);
      
      const entries = [];
      snapshot.forEach(doc => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      gdvEntries.value = entries;
      return entries;
    } catch (err) {
      console.error('[GDV] Error fetching GDV entries:', err);
      error.value = err.message;
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Add new GDV entry
  const addGdvEntry = async (entryData) => {
    try {
      isLoading.value = true;
      const gdvRef = collection(db, collectionName);
      
      const docRef = await addDoc(gdvRef, {
        ...entryData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      const newEntry = {
        id: docRef.id,
        ...entryData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      gdvEntries.value.push(newEntry);
      gdvEntries.value.sort((a, b) => a.name.localeCompare(b.name));
      
      return newEntry;
    } catch (err) {
      console.error('[GDV] Error adding GDV entry:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update GDV entry
  const updateGdvEntry = async (gdvId, updateData) => {
    try {
      const gdvRef = doc(db, collectionName, gdvId);
      await updateDoc(gdvRef, {
        ...updateData,
        updated_at: serverTimestamp()
      });
      
      // Update local state
      const index = gdvEntries.value.findIndex(e => e.id === gdvId);
      if (index !== -1) {
        gdvEntries.value[index] = {
          ...gdvEntries.value[index],
          ...updateData,
          updated_at: new Date()
        };
      }
      
      if (selectedGdv.value?.id === gdvId) {
        selectedGdv.value = {
          ...selectedGdv.value,
          ...updateData,
          updated_at: new Date()
        };
      }
      
      return true;
    } catch (err) {
      console.error('[GDV] Error updating GDV entry:', err);
      error.value = err.message;
      return false;
    }
  };

  // Delete GDV entry
  const deleteGdvEntry = async (gdvId) => {
    try {
      await deleteDoc(doc(db, collectionName, gdvId));
      gdvEntries.value = gdvEntries.value.filter(e => e.id !== gdvId);
      
      if (selectedGdv.value?.id === gdvId) {
        selectedGdv.value = null;
      }
      
      if (gdvHistories.value[gdvId]) {
        delete gdvHistories.value[gdvId];
      }
      
      return true;
    } catch (err) {
      console.error('[GDV] Error deleting GDV entry:', err);
      error.value = err.message;
      return false;
    }
  };

  // Mark GDV data as imported (add to history)
  const markAsImported = async (gdvId, importData = {}) => {
    try {
      const historyRef = collection(db, collectionName, gdvId, 'import-history');
      
      const historyEntry = {
        date: importData.date || new Date(),
        notes: importData.notes || '',
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(historyRef, historyEntry);
      
      // Update the last_import field on the GDV entry
      const gdvRef = doc(db, collectionName, gdvId);
      await updateDoc(gdvRef, {
        last_import: historyEntry.date,
        updated_at: serverTimestamp()
      });
      
      // Update local state
      const index = gdvEntries.value.findIndex(e => e.id === gdvId);
      if (index !== -1) {
        gdvEntries.value[index] = {
          ...gdvEntries.value[index],
          last_import: historyEntry.date,
          updated_at: new Date()
        };
      }
      
      // Add to local history
      if (!gdvHistories.value[gdvId]) {
        gdvHistories.value[gdvId] = [];
      }
      gdvHistories.value[gdvId].unshift({
        id: docRef.id,
        ...historyEntry,
        date: historyEntry.date,
        createdAt: new Date()
      });
      
      return true;
    } catch (err) {
      console.error('[GDV] Error marking as imported:', err);
      error.value = err.message;
      throw err;
    }
  };

  // Fetch import history for a GDV entry
  const fetchImportHistory = async (gdvId) => {
    try {
      if (!gdvId) return [];
      
      const historyRef = collection(db, collectionName, gdvId, 'import-history');
      const q = query(historyRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const history = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : data.date,
          createdAt: data.createdAt?.toDate?.() || data.createdAt
        });
      });
      
      gdvHistories.value[gdvId] = history;
      return history;
    } catch (err) {
      console.error('[GDV] Error fetching import history:', err);
      error.value = err.message;
      return [];
    }
  };

  // Delete import history entry
  const deleteImportHistoryEntry = async (gdvId, historyId) => {
    try {
      const historyRef = doc(db, collectionName, gdvId, 'import-history', historyId);
      await deleteDoc(historyRef);
      
      // Update local history
      if (gdvHistories.value[gdvId]) {
        gdvHistories.value[gdvId] = gdvHistories.value[gdvId].filter(h => h.id !== historyId);
      }
      
      return true;
    } catch (err) {
      console.error('[GDV] Error deleting import history entry:', err);
      error.value = err.message;
      return false;
    }
  };

  // Calculate days since last import
  const calculateDaysSinceImport = (gdvEntry, currentDate = new Date()) => {
    if (!gdvEntry?.last_import) return null;
    
    let lastImportDate;
    if (gdvEntry.last_import?.toDate) {
      lastImportDate = gdvEntry.last_import.toDate();
    } else if (gdvEntry.last_import instanceof Date) {
      lastImportDate = gdvEntry.last_import;
    } else if (typeof gdvEntry.last_import === 'string') {
      lastImportDate = new Date(gdvEntry.last_import);
    } else {
      return null;
    }
    
    if (isNaN(lastImportDate.getTime())) return null;
    
    const diffTime = currentDate.getTime() - lastImportDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get expected days based on frequency
  const getExpectedDaysByFrequency = (frequency) => {
    const frequencyDays = {
      'täglich': 1,
      'wöchentlich': 7,
      '14-tägig': 14,
      'monatlich': 30
    };
    return frequencyDays[frequency] || 30;
  };

  // Get GDV entry status (Ampel-Logik)
  const getGdvStatus = (gdvEntry, currentDate = new Date()) => {
    // If GDV data is not delivered, show as no_data
    if (!gdvEntry?.delivers_gdv) {
      return 'no_data';
    }
    
    const daysSinceImport = calculateDaysSinceImport(gdvEntry, currentDate);
    
    // If no import yet, show as no_import
    if (daysSinceImport === null) {
      return 'no_import';
    }
    
    const expectedDays = getExpectedDaysByFrequency(gdvEntry.frequency);
    const daysOverdue = daysSinceImport - expectedDays;
    
    // Ampel-Logik: 2 Tage Warnung, 5 Tage kritisch
    if (daysOverdue > 5) {
      return 'critical';
    }
    if (daysOverdue >= 2) {
      return 'warning';
    }
    
    return 'on_time';
  };

  // Set selected GDV entry
  const setSelectedGdv = (gdv) => {
    selectedGdv.value = gdv;
  };

  // Clear selected GDV entry
  const clearSelectedGdv = () => {
    selectedGdv.value = null;
  };

  // Clone all insurers from insurers collection to GDV
  const cloneInsurersToGdv = async () => {
    try {
      isLoading.value = true;
      
      // Fetch all insurers
      const insurersRef = collection(db, 'insurers');
      const snapshot = await getDocs(insurersRef);
      
      console.log(`[GDV] Found ${snapshot.size} insurers to clone`);
      
      let successCount = 0;
      
      for (const docSnap of snapshot.docs) {
        const insurerData = docSnap.data();
        
        // Check if already exists by name
        const existingEntry = gdvEntries.value.find(g => g.name === insurerData.name);
        if (existingEntry) {
          console.log(`[GDV] Skipping ${insurerData.name} - already exists`);
          continue;
        }
        
        // Create GDV entry with default values
        const gdvEntry = {
          name: insurerData.name || 'Unbekannt',
          delivers_gdv: true,
          versandarten: [],
          portal_link: '',
          frequency: '',
          bestandsart: '',
          last_import: null,
          original_insurer_id: docSnap.id
        };
        
        try {
          await addGdvEntry(gdvEntry);
          successCount++;
          console.log(`[GDV] ✓ Cloned: ${insurerData.name}`);
        } catch (err) {
          console.error(`[GDV] ✗ Failed to clone ${insurerData.name}:`, err.message);
        }
      }
      
      console.log(`[GDV] Successfully cloned ${successCount} insurers`);
      return successCount;
    } catch (err) {
      console.error('[GDV] Error cloning insurers:', err);
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    gdvEntries,
    selectedGdv,
    gdvHistories,
    isLoading,
    error,
    
    // Actions
    fetchGdvEntries,
    addGdvEntry,
    updateGdvEntry,
    deleteGdvEntry,
    markAsImported,
    fetchImportHistory,
    deleteImportHistoryEntry,
    calculateDaysSinceImport,
    getGdvStatus,
    setSelectedGdv,
    clearSelectedGdv,
    cloneInsurersToGdv
  };
});
