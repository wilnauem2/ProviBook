# Aktivitäten Löschen - Feature Implementierung

## Datum: 28.10.2025

## Implementierte Änderungen

### HistoryView.vue (Aktivitäten-Tab)

#### 1. UI-Änderungen
- ✅ Neue "Aktionen"-Spalte im Table-Header hinzugefügt
- ✅ Delete-Button (Papierkorb-Icon) in jeder Zeile
- ✅ Button ist immer sichtbar, wird rot beim Hover
- ✅ `@click.stop` verhindert, dass Details-Modal aufgeht beim Klick auf Delete

#### 2. Bestätigungs-Dialog
```vue
<div v-if="showDeleteConfirmation" ...>
  - Titel: "Aktivität löschen?"
  - Zeigt Versicherer und Datum der zu löschenden Aktivität
  - Buttons: Abbrechen / Löschen
</div>
```

#### 3. State-Variablen
```javascript
const showDeleteConfirmation = ref(false);
const abrechnungToDelete = ref(null);
```

#### 4. Funktionen
```javascript
confirmDelete(abrechnung)    // Öffnet Bestätigung
cancelDelete()               // Bricht ab
executeDelete()              // Führt Löschung aus
```

## Aktueller Status

### ✅ Implementiert:
- UI mit Delete-Button
- Bestätigungs-Dialog
- Grundlegende Delete-Logik
- Lokales Entfernen aus der Liste

### ⚠️ TODO:
- **Store-Integration**: `deleteAbrechnung()` Methode in `abrechnungStore.js` implementieren
- **Firestore-Löschung**: Tatsächliches Löschen aus der Datenbank
- **Toast-Notifications**: Statt `alert()` bessere UI-Feedback verwenden

## Store-Implementierung (noch erforderlich)

In `abrechnungStore.js` muss folgende Methode hinzugefügt werden:

```javascript
const deleteAbrechnung = async (insurerId, abrechnungId) => {
  try {
    // Determine collection based on dataMode
    const invoicesSubcollection = dataMode.value === 'production' 
      ? 'invoice-history' 
      : 'invoice-history-test';
    
    // Delete from Firestore
    const abrechnungRef = doc(
      db, 
      collections.value.insurers, 
      insurerId, 
      invoicesSubcollection, 
      abrechnungId
    );
    
    await deleteDoc(abrechnungRef);
    
    // Update local state
    abrechnungen.value = abrechnungen.value.filter(
      a => a.id !== abrechnungId
    );
    
    return true;
  } catch (err) {
    console.error('Error deleting abrechnung:', err);
    throw err;
  }
};
```

## Benutzerfluss

1. **Benutzer klickt auf Papierkorb-Icon** in einer Zeile
2. **Bestätigungs-Dialog öffnet sich** mit Details zur Aktivität
3. **Benutzer bestätigt** → Aktivität wird gelöscht
4. **Success-Feedback** → Alert-Meldung (später Toast)
5. **Liste aktualisiert** → Gelöschter Eintrag verschwindet

## Grid-Layout-Änderungen

Alte Aufteilung: 2-3-3-2-2 (12 Spalten)
Neue Aufteilung: 2-3-2-2-2-1 (12 Spalten)

- Dokumenttyp-Spalte von 3 auf 2 reduziert
- Neue Aktionen-Spalte: 1 Spalte

## Testing

1. Gehen Sie zum **Abrechnungsverlauf**-Tab (links in der Navigation)
2. Sie sollten in jeder Zeile einen **Papierkorb-Button** sehen (rechts)
3. Klicken Sie auf den Button
4. **Bestätigungs-Dialog** erscheint
5. Klicken Sie auf "Löschen"
6. Eintrag verschwindet aus der Liste (nur lokal, noch nicht in DB)

## Nächste Schritte

1. Store-Methode `deleteAbrechnung` implementieren
2. Firestore-Löschung integrieren
3. Toast-Notifications statt Alerts
4. Error-Handling verbessern
5. Optimistische Updates (UI update vor DB-Bestätigung)
