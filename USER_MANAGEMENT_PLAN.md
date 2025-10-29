# User-Management System - Implementierungsplan

## Datum: 28.10.2025

## Ziel
Vollständiges User-Management mit Admin-Funktion, Login-System und Audit-Trail.

## Phase 1: User-Management (JETZT)

### 1.1 Datenmodell (Firestore)
```javascript
// Collection: users
{
  id: "user-id",
  email: "user@example.com",
  displayName: "Max Mustermann",
  role: "admin" | "user",  // admin oder normaler user
  createdAt: Timestamp,
  createdBy: "admin-user-id",
  lastLogin: Timestamp,
  active: true | false
}
```

### 1.2 Firebase Authentication
- Email/Password Authentication aktivieren
- Admins können User mit Passwort anlegen
- User können sich einloggen

### 1.3 User Store (Pinia)
```javascript
// stores/userStore.js
- currentUser (eingeloggter User)
- users (alle User - nur für Admins)
- login(email, password)
- logout()
- createUser(email, password, displayName, role) // nur Admin
- updateUser(userId, data) // nur Admin
- deleteUser(userId) // nur Admin
- isAdmin() // Check ob aktueller User Admin ist
```

### 1.4 UI-Komponenten
- LoginView.vue - Login-Seite
- UserManagement.vue - Admin-Panel für User-Verwaltung
- UserProfile.vue - User-Profil anzeigen/bearbeiten
- Header mit User-Info und Logout

### 1.5 Router Guards
- Nur eingeloggte User haben Zugriff
- Admin-Routes nur für Admins

## Phase 2: Audit-Trail (SPÄTER)

### 2.1 Change-Log Datenmodell
```javascript
// Collection: audit-logs
{
  id: "log-id",
  userId: "user-id",
  userName: "Max Mustermann",
  action: "create" | "update" | "delete",
  entityType: "insurer" | "settlement" | "user",
  entityId: "entity-id",
  changes: {
    before: {...},
    after: {...}
  },
  timestamp: Timestamp
}
```

### 2.2 Audit-Funktionen
- Automatisches Logging bei allen Änderungen
- History-View mit Filter nach User/Datum/Action
- Rollback-Funktion (optional)

## Technologie-Stack

### Firebase Authentication
- Email/Password Provider
- User-Management über Firebase Admin (Server-side)
- Client-side: Firebase Auth SDK

### Firestore Collections
```
/users/{userId}
/audit-logs/{logId}
/insurers/{insurerId}
  /invoice-history/{invoiceId}
```

### Security Rules (Firestore)
```javascript
// Nur authentifizierte User haben Zugriff
match /insurers/{insurerId} {
  allow read, write: if request.auth != null;
}

// User-Collection: Nur Admins können schreiben
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Audit-Logs: Nur lesen, automatisches Schreiben via Cloud Functions
match /audit-logs/{logId} {
  allow read: if request.auth != null;
  allow write: if false; // Nur via Cloud Functions
}
```

## Implementation Steps

### Step 1: User Store erstellen ✅
- [ ] `stores/userStore.js` erstellen
- [ ] Firebase Auth Integration
- [ ] Login/Logout Funktionen
- [ ] User-CRUD für Admins

### Step 2: Login-UI ✅
- [ ] `views/LoginView.vue` erstellen
- [ ] Email/Password Form
- [ ] Error Handling
- [ ] Redirect nach Login

### Step 3: User Management UI ✅
- [ ] `views/UserManagement.vue` erstellen
- [ ] User-Liste anzeigen
- [ ] User anlegen Dialog
- [ ] User bearbeiten/löschen

### Step 4: Router Guards ✅
- [ ] Auth Guard in Router
- [ ] Redirect zu Login wenn nicht eingeloggt
- [ ] Admin-only Routes

### Step 5: User-Info im Header ✅
- [ ] User-Name anzeigen
- [ ] Logout-Button
- [ ] Profil-Link

### Step 6: Firestore Security Rules ✅
- [ ] Rules für User-Collection
- [ ] Rules für Insurers (auth required)
- [ ] Deployment

## Testing Checklist

### User-Management
- [ ] Admin kann neuen User anlegen
- [ ] Neuer User kann sich einloggen
- [ ] User kann Abrechnungen bearbeiten
- [ ] Admin kann User löschen/deaktivieren
- [ ] Nicht-Admin kann keine User anlegen

### Security
- [ ] Nicht eingeloggte User werden zu Login umgeleitet
- [ ] User ohne Admin-Rolle sehen kein User-Management
- [ ] Firestore Rules verhindern unbefugten Zugriff

### UX
- [ ] Login-Fehler werden angezeigt
- [ ] Logout funktioniert korrekt
- [ ] Session bleibt nach Reload erhalten
- [ ] User-Name wird überall korrekt angezeigt

## Nächste Schritte (nach User-Management)

1. **Audit-Trail System**
   - Change-Logs für alle Operationen
   - History-View mit User-Filter
   
2. **User-Rollen erweitern**
   - Read-only User
   - Department-based Access
   
3. **Email-Benachrichtigungen**
   - Welcome-Email für neue User
   - Password-Reset
   
4. **2-Factor Authentication**
   - Optional für Admins
