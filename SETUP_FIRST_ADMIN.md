# Setup: Ersten Admin-User anlegen

## Wichtig: Firebase Console Setup

### Schritt 1: Firebase Authentication aktivieren

1. Öffnen Sie die **Firebase Console**: https://console.firebase.google.com/
2. Wählen Sie Ihr Projekt aus
3. Gehen Sie zu **Build** → **Authentication**
4. Klicken Sie auf **Get Started**
5. Aktivieren Sie **Email/Password** als Sign-in Methode:
   - Klicken Sie auf "Email/Password"
   - Toggle "Email/Password" auf **Enabled**
   - Klicken Sie "Save"

### Schritt 2: Ersten Admin-User manuell anlegen

Da noch kein Admin existiert, müssen Sie den ersten Admin über die Firebase Console anlegen:

#### Option A: Über Firebase Console (Empfohlen)

1. In Firebase Console → **Authentication** → **Users**
2. Klicken Sie auf **Add User**
3. Geben Sie ein:
   - **Email**: ihre-admin@email.com
   - **Password**: Ihr sicheres Passwort (mind. 6 Zeichen)
4. Klicken Sie **Add User**
5. Kopieren Sie die **User UID** (wichtig!)

6. Gehen Sie zu **Firestore Database**
7. Gehen Sie zur Collection **users**
8. Klicken Sie **Add Document**
9. Document ID: **Fügen Sie die kopierte UID ein**
10. Fügen Sie folgende Fields hinzu:
    - `email` (string): ihre-admin@email.com
    - `displayName` (string): Admin Name
    - `role` (string): **admin**
    - `active` (boolean): **true**
    - `createdAt` (timestamp): **Jetzt**
    - `lastLogin` (timestamp): null

#### Option B: Über das Setup-Skript (erfordert Firebase Admin SDK)

**Hinweis**: Dieses Skript erfordert Firebase Admin SDK und Serviceaccount-Zugriff.

1. Erstellen Sie eine Datei `setup-admin.js` im Projektroot
2. Kopieren Sie folgenden Code:

```javascript
// setup-admin.js
import admin from 'firebase-admin';
import fs from 'fs';

// Laden Sie Ihren Service Account Key
const serviceAccount = JSON.parse(
  fs.readFileSync('./path/to/serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: 'admin@example.com',
      password: 'changeme123',
      displayName: 'Admin'
    });

    console.log('User created in Auth:', userRecord.uid);

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: 'admin@example.com',
      displayName: 'Admin',
      role: 'admin',
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    });

    console.log('User document created in Firestore');
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: changeme123');
    console.log('Please change the password after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
```

3. Führen Sie aus: `node setup-admin.js`

### Schritt 3: Firestore Security Rules einrichten

Erstellen Sie folgende Rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read user data
      allow read: if isAuthenticated();
      
      // Only admins can create/update/delete users
      allow write: if isAdmin();
    }
    
    // Insurers collection
    match /insurers/{insurerId} {
      // Read/write only for authenticated users
      allow read, write: if isAuthenticated();
      
      // Subcollections (invoice-history, invoice-history-test)
      match /{document=**} {
        allow read, write: if isAuthenticated();
      }
    }
    
    // Audit logs (for future implementation)
    match /audit-logs/{logId} {
      // Anyone authenticated can read logs
      allow read: if isAuthenticated();
      
      // Only server (Cloud Functions) can write
      allow write: if false;
    }
  }
}
```

### Schritt 4: Erste Anmeldung

1. Starten Sie die App: `npm run dev`
2. Sie werden zur Login-Seite weitergeleitet
3. Melden Sie sich mit dem Admin-Account an
4. Gehen Sie zu **Benutzerverwaltung** (im Menü)
5. Legen Sie weitere Benutzer an

## Fehlerbehebung

### "User not found" beim Login
- Überprüfen Sie, ob der User in Firebase Authentication existiert
- Überprüfen Sie, ob das Firestore-Dokument erstellt wurde

### "No permission"
- Überprüfen Sie, ob `role: 'admin'` im Firestore-Dokument gesetzt ist
- Überprüfen Sie die Firestore Security Rules

### "Email already in use"
- Der User existiert bereits in Firebase Authentication
- Verwenden Sie eine andere E-Mail oder löschen Sie den bestehenden User

## Nächste Schritte

Nach dem ersten Login als Admin:

1. ✅ Ändern Sie Ihr Admin-Passwort
2. ✅ Legen Sie weitere Benutzer an
3. ✅ Testen Sie Login mit einem normalen User
4. ✅ Überprüfen Sie die Berechtigungen

## Sicherheitshinweise

⚠️ **Wichtig**:
- Ändern Sie das Admin-Passwort sofort nach dem ersten Login
- Verwenden Sie sichere Passwörter (mind. 12 Zeichen)
- Geben Sie Admin-Rechte nur an vertrauenswürdige Personen
- Aktivieren Sie 2-Factor Authentication für Admin-Accounts (optional)
- Deaktivieren Sie User, die die App nicht mehr nutzen sollen
