# Timeline & Abrechnungsliste Synchronisierung

## Datum: 28.10.2025

## Problem
Timeline (InsurerDetail.vue) und Abrechnungsliste (HistoryView) zeigten die gleichen Daten, waren aber nicht synchronisiert. Wenn in einer View etwas gelöscht wurde, blieb es in der anderen sichtbar.

## Lösung

### 1. Gemeinsame Datenquelle
Beide Views lesen jetzt aus der gleichen Firestore Subcollection:
```
insurers/{insurerId}/invoice-history/{invoiceId}
```

### 2. Zentralisierte Delete-Funktion
Beide Views nutzen jetzt `insurerStore.deleteSettlement()`:

#### InsurerDetail.vue (Timeline)
```javascript
await insurerStore.deleteSettlement(props.insurer.id, settlementToDeleteId.value);
```

#### HistoryView.vue (Abrechnungsliste)
```javascript
// Extract insurerId from path
const pathParts = path.split('/');
const insurerId = pathParts[1];

// Use same delete function
await insurerStore.deleteSettlement(insurerId, abrechnungId);
```

### 3. Cross-Store-Update
In `insurerStore.js` - `deleteSettlement()`:
```javascript
// 1. Delete from Firestore
await deleteDoc(settlementRef);

// 2. Update insurerStore (für Timeline)
settlementHistories.value[insurerId] = settlementHistories.value[insurerId]
  .filter(s => s.id !== settlementId);

// 3. Update abrechnungStore (für History View)
const abrechnungStore = useAbrechnungStore();
const index = abrechnungStore.abrechnungen.findIndex(a => a.id === settlementId);
if (index !== -1) {
  abrechnungStore.abrechnungen.splice(index, 1);
}
```

## Datenfluss

### Beim Löschen aus der Timeline:
1. User klickt Delete in Timeline (InsurerDetail)
2. → `insurerStore.deleteSettlement(insurerId, settlementId)`
3. → Löscht aus Firestore
4. → Aktualisiert `settlementHistories` (Timeline)
5. → Aktualisiert `abrechnungen` (History View)
6. → Beide Views zeigen Update sofort

### Beim Löschen aus der Abrechnungsliste:
1. User klickt Delete in History View
2. → Extrahiert `insurerId` aus `path`
3. → `insurerStore.deleteSettlement(insurerId, settlementId)`
4. → Löscht aus Firestore
5. → Aktualisiert `settlementHistories` (Timeline)
6. → Aktualisiert `abrechnungen` (History View)
7. → Beide Views zeigen Update sofort

## Vorteile

✅ **Single Source of Truth**: Firestore ist die einzige Wahrheit
✅ **Bidirektionale Sync**: Änderungen in einer View reflektieren sich in der anderen
✅ **Keine Duplikate**: Eine zentrale Delete-Funktion für alle Views
✅ **Konsistenz**: Beide Views zeigen immer die gleichen Daten
✅ **Echtzeit-Updates**: Sofortige Aktualisierung nach Änderungen

## Datenstruktur

### Timeline (InsurerDetail.vue)
Liest: `settlementHistories[insurerId]` aus `insurerStore`

### History View (HistoryView.vue)
Liest: `abrechnungen` aus `abrechnungStore`

### Beide verweisen auf:
```
Firestore: insurers/{insurerId}/invoice-history/{invoiceId}
```

## Testing

### Test 1: Löschen aus Timeline
1. Öffne einen Versicherer → Timeline sichtbar
2. Lösche eine Abrechnung aus der Timeline
3. Gehe zum "Abrechnungsverlauf"-Tab
4. ✅ Abrechnung ist auch dort gelöscht

### Test 2: Löschen aus History View
1. Gehe zum "Abrechnungsverlauf"-Tab
2. Lösche eine Abrechnung
3. Öffne den zugehörigen Versicherer → Timeline sichtbar
4. ✅ Abrechnung ist auch dort gelöscht

### Test 3: Mehrfach-Löschen
1. Lösche mehrere Abrechnungen aus verschiedenen Views
2. ✅ Alle Löschungen sind in beiden Views sichtbar
3. ✅ Keine Inkonsistenzen

## Technische Details

### Path-Extraktion in HistoryView
```javascript
// Path format: "insurers/abc123/invoice-history/xyz789"
const pathParts = path.split('/');
const insurerId = pathParts[1];  // "abc123"
```

### Error Handling
- Fehlende IDs werden abgefangen
- Store-Update-Fehler werden geloggt aber nicht geworfen
- User bekommt klare Fehlermeldungen

## Zukünftige Erweiterungen

Mögliche weitere Synchronisierungen:
- [ ] Add/Create: Neue Abrechnungen in beiden Views
- [ ] Edit: Änderungen an Abrechnungen
- [ ] Real-time updates mit Firestore listeners
- [ ] Optimistic UI updates
