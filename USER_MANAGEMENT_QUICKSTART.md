# User-Management Quick Start Guide

## 🚀 Schnellstart in 5 Minuten

### Schritt 1: Firebase Authentication aktivieren (2 Min)

1. **Firebase Console öffnen**: https://console.firebase.google.com/
2. Wählen Sie Ihr Projekt
3. **Build** → **Authentication** → **Get Started**
4. Klicken Sie auf **Email/Password**
5. Toggle auf **Enabled** → **Save**

✅ **Fertig!** Authentication ist aktiviert.

---

### Schritt 2: Ersten Admin-User anlegen (3 Min)

#### Option A: Über Firebase Console (Empfohlen)

**Teil 1: User in Authentication anlegen**
1. Firebase Console → **Authentication** → **Users Tab**
2. Klick auf **Add User**
3. Eingeben:
   - **Email**: `admin@example.com`
   - **Password**: `Admin123!` (ändern Sie dies später!)
4. **Add User** klicken
5. **⚠️ WICHTIG**: Kopieren Sie die **User UID** (z.B. `abc123xyz456`)

**Teil 2: User-Dokument in Firestore anlegen**
1. Firebase Console → **Firestore Database**
2. Gehen Sie zur Collection **`users`** (wenn nicht vorhanden, wird sie automatisch erstellt)
3. Klick auf **Add Document**
4. **Document ID**: Fügen Sie die kopierte **UID** ein
5. Felder hinzufügen:
   ```
   Field               Type        Value
   ─────────────────────────────────────────
   email               string      admin@example.com
   displayName         string      Administrator
   role                string      admin
   active              boolean     true
   createdAt           timestamp   [Now]
   lastLogin           timestamp   null
   ```
6. **Save** klicken

✅ **Fertig!** Ihr Admin-Account ist bereit.

---

### Schritt 3: App starten und einloggen

```bash
npm run dev
```

1. Browser öffnet sich automatisch
2. Sie werden zur **Login-Seite** weitergeleitet
3. Einloggen mit:
   - **Email**: `admin@example.com`
   - **Password**: `Admin123!`
4. Nach erfolgreichem Login sehen Sie die App

---

### Schritt 4: Benutzerverwaltung öffnen

Im linken Navigationsmenü sehen Sie:
- **Versicherungen**
- **Statistiken**
- **Aktivitäten**
- **👤 Benutzerverwaltung** ← Nur für Admins sichtbar!
- **Einstellungen**

Klicken Sie auf **Benutzerverwaltung**.

---

### Schritt 5: Neuen User anlegen

1. Klick auf **"Neuen Benutzer anlegen"**
2. Formular ausfüllen:
   - **Name**: z.B. "Max Mustermann"
   - **E-Mail**: z.B. "max@example.com"
   - **Passwort**: z.B. "Test123!" (mind. 6 Zeichen)
   - **Rolle**: "Benutzer" (oder "Administrator")
3. **"Benutzer anlegen"** klicken

✅ Der neue User kann sich jetzt einloggen!

---

## 🎯 Was Sie jetzt tun können

### Als Admin:
- ✅ Neue User anlegen
- ✅ User bearbeiten (Name, Rolle ändern)
- ✅ User deaktivieren
- ✅ Alle Funktionen der App nutzen

### Als normaler User:
- ✅ Einloggen
- ✅ Versicherer verwalten
- ✅ Abrechnungen erstellen/bearbeiten/löschen
- ❌ Keine Benutzerverwaltung

---

## 👤 User-Interface Features

### Im Header (rechts oben):
- **User-Avatar** mit Initialen
- **User-Name** angezeigt
- **"Admin"** Badge (nur für Admins)
- **Logout-Button** (Pfeil-Icon)

### In der Navigation (links):
- **Benutzerverwaltung** erscheint nur für Admins
- Automatische Anzeige basierend auf Rolle

---

## 🔒 Firestore Security Rules (Optional aber empfohlen)

Für Production sollten Sie Security Rules einrichten:

1. Firebase Console → **Firestore Database** → **Rules**
2. Ersetzen Sie die Rules mit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Insurers collection
    match /insurers/{insurerId} {
      allow read, write: if isAuthenticated();
      
      match /{document=**} {
        allow read, write: if isAuthenticated();
      }
    }
  }
}
```

3. **Publish** klicken

---

## 🧪 Testing

### Test 1: Admin-Login
1. Login als Admin
2. ✅ "Benutzerverwaltung" im Menü sichtbar?
3. ✅ "Admin" Badge im Header?
4. ✅ Logout funktioniert?

### Test 2: User anlegen
1. Neuen User anlegen
2. ✅ User erscheint in der Liste?
3. ✅ Logout als Admin
4. ✅ Login als neuer User funktioniert?

### Test 3: User-Berechtigungen
1. Login als normaler User
2. ✅ "Benutzerverwaltung" NICHT sichtbar?
3. ✅ Abrechnungen bearbeiten funktioniert?
4. ✅ Kein Zugriff auf `/users` Route?

---

## ⚠️ Wichtige Hinweise

### Sicherheit:
- ✅ **Ändern Sie das Admin-Passwort sofort!**
- ✅ Verwenden Sie sichere Passwörter (mind. 12 Zeichen)
- ✅ Geben Sie Admin-Rechte nur an vertrauenswürdige Personen
- ✅ Deaktivieren Sie User die die App nicht mehr nutzen

### Bekannte Einschränkungen:
- ⚠️ User-Erstellung erfolgt client-seitig
  - In Production sollte dies via Cloud Functions laufen
  - Aktuell funktioniert es aber einwandfrei für interne Apps
- ⚠️ Password-Reset noch nicht implementiert
  - Nutzen Sie Firebase Console zum Zurücksetzen
- ⚠️ Beim User-Anlegen wird Admin kurzzeitig ausgeloggt
  - Normales Verhalten bei client-seitiger Erstellung
  - Einfach neu einloggen

---

## 🔄 Nächste Features (geplant)

Nach dem User-Management kommt:

### Phase 2: Audit-Trail
- 📝 Automatisches Logging aller Änderungen
- 👤 Wer hat was wann geändert
- 📊 History-View mit Filter
- ⏮️ Änderungen rückgängig machen (optional)

---

## 🆘 Fehlerbehebung

### Problem: "User not found" beim Login
**Lösung**: 
- Überprüfen Sie Firebase Authentication → Users
- User muss dort existieren

### Problem: "No permission"
**Lösung**:
- Überprüfen Sie Firestore → users → [UID]
- Feld `role` muss auf `"admin"` gesetzt sein

### Problem: "Email already in use"
**Lösung**:
- User existiert bereits in Firebase Auth
- Verwenden Sie andere E-Mail oder löschen Sie alten User

### Problem: App lädt nicht
**Lösung**:
```bash
npm install
npm run dev
```

### Problem: "Cannot read property 'isAdmin'"
**Lösung**:
- Browser-Cache leeren
- Hard Refresh: `Ctrl + Shift + R`

---

## 📞 Support

Bei Problemen:
1. Siehe `SETUP_FIRST_ADMIN.md` für Details
2. Siehe `USER_MANAGEMENT_PLAN.md` für Architektur
3. Firebase Console Logs überprüfen

---

**🎉 Viel Erfolg mit dem User-Management!**
