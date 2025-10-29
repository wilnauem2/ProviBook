# Timeline Delete Feature - 28.10.2025

## Implementierung

### Neue Funktionalität
Benutzer können jetzt Aktivitäten direkt aus der Timeline-Ansicht löschen.

## Änderungen

### 1. Timeline.vue - Lösch-Button hinzugefügt
```vue
<!-- Delete Button erscheint beim Hover -->
<button
  v-if="event.deletable !== false && event.type === 'settlement' && !event.isLastInvoice"
  @click.stop="$emit('delete-event', event)"
  class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600"
  title="Aktivität löschen"
>
  <svg>...</svg>
</button>
```

**Features:**
- ✅ Lösch-Button erscheint nur beim Hover über eine Aktivität
- ✅ Nur bei Abrechnungen (nicht bei Erstellungs-Events)
- ✅ Nicht bei der aktuellen/letzten Abrechnung
- ✅ Smooth Opacity-Transition
- ✅ Visuelles Feedback (rot beim Hover)

### 2. InsurerDetail.vue - Event-Handler

#### Timeline Event-Binding
```vue
<Timeline
  :events="timelineEvents"
  @event-click="handleTimelineEventClick"
  @delete-event="handleTimelineDeleteEvent"
/>
```

#### Delete-Handler
```javascript
const handleTimelineDeleteEvent = (event) => {
  if (event.type === 'settlement' && !event.isLastInvoice) {
    confirmSettlementDelete(event.id);
  }
};
```

#### Delete-Funktionen
```javascript
const confirmSettlementDelete = (settlementId) => {
  settlementToDeleteId.value = settlementId;
  showSettlementDeleteConfirmation.value = true;
};

const executeDeleteSettlement = async () => {
  // Löscht über Store
  await insurerStore.deleteSettlement(props.insurer.id, settlementToDeleteId.value);
  
  // Aktualisiert lokale State
  localSettlementHistory.value = localSettlementHistory.value.filter(
    s => s.id !== settlementToDeleteId.value
  );
  
  // Zeigt Success-Toast
  showSuccessToast('Abrechnung erfolgreich gelöscht');
  
  // Lädt Daten neu
  await fetchSettlements();
};
```

## Benutzerfluss

1. **Hover über Aktivität** → Lösch-Button erscheint
2. **Klick auf Lösch-Button** → Bestätigungs-Dialog öffnet sich
3. **Bestätigung** → Aktivität wird gelöscht
4. **Success-Feedback** → Toast-Notification
5. **Timeline aktualisiert** → Gelöschte Aktivität verschwindet

## Sicherheitsmaßnahmen

✅ **Bestätigungs-Dialog**: Verhindert versehentliches Löschen
✅ **Aktuelle Abrechnung geschützt**: Letzte/aktuelle Abrechnung kann nicht gelöscht werden
✅ **Click-Event-Propagation gestoppt**: `@click.stop` verhindert ungewolltes Öffnen der Details
✅ **Error-Handling**: Bei Fehler wird Toast-Notification angezeigt
✅ **Automatische Aktualisierung**: Timeline wird nach Löschung neu geladen

## UI/UX Details

- **Hover-Effekt**: Button nur sichtbar beim Hover (reduziert visuelle Überladung)
- **Icon**: Papierkorb-Icon für klare Funktion
- **Farbcodierung**: Grau → Rot beim Hover
- **Position**: Rechts neben dem Event-Badge
- **Responsive**: Funktioniert auf allen Bildschirmgrößen

## Testing

Zum Testen:
1. Versicherer mit mehreren Abrechnungen öffnen
2. Über eine alte Abrechnung hovern
3. Lösch-Button sollte erscheinen
4. Klick → Bestätigung → Abrechnung wird gelöscht
5. Timeline aktualisiert automatisch
