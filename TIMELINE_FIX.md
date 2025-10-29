# Timeline History Fix - 28.10.2025

## Problem
Die Timeline-Ansicht zeigte nur die letzte Rechnung an, nicht die komplette Historie.

## Ursachen
1. `fetchSettlementHistory` verwendete falsche Subcollection: `settlements` statt `invoice-history`
2. Sortierung nach `createdAt` statt `date`
3. `localSettlementHistory` wurde nicht mit Store-Daten synchronisiert
4. `dataMode` wurde beim Abrufen der Historie ignoriert

## Fixes

### 1. insurerStore.js - fetchSettlementHistory
```javascript
// Vorher:
const settlementsRef = collection(db, collections.value.insurers, insurerId, 'settlements');
const q = query(settlementsRef, orderBy('createdAt', 'desc'));

// Nachher:
const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
const settlementsRef = collection(db, collections.value.insurers, insurerId, invoicesSubcollection);
const q = query(settlementsRef, orderBy('date', 'desc'));
```

### 2. insurerStore.js - addInvoiceToHistory
```javascript
// Vorher:
const invoicesSubcollection = 'invoice-history';

// Nachher:
const invoicesSubcollection = dataMode.value === 'production' ? 'invoice-history' : 'invoice-history-test';
```

### 3. InsurerDetail.vue - fetchSettlements
```javascript
// Nachher:
const fetchSettlements = async () => {
  try {
    const settlements = await insurerStore.fetchSettlements(props.insurer.id, props.dataMode);
    localSettlementHistory.value = settlements || [];
    console.log('Fetched settlements:', settlements);
  } catch (error) {
    console.error('Error fetching settlements:', error);
    showErrorToast('Fehler beim Laden der Abrechnungen');
  }
};
```

### 4. InsurerDetail.vue - Store Watch
```javascript
// Watch für automatische Synchronisation mit Store
watch(() => insurerStore.settlementHistories[props.insurer?.id], (newHistory) => {
  if (newHistory) {
    console.log('Settlement history updated from store:', newHistory);
    localSettlementHistory.value = newHistory;
  }
}, { immediate: true, deep: true });
```

## Ergebnis
✅ Timeline zeigt jetzt alle Abrechnungen aus der Historie
✅ Korrekte Sortierung nach Datum
✅ dataMode wird respektiert (production vs test)
✅ Automatische Synchronisation mit Store-Daten
