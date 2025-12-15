import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export const useUserStore = defineStore('user', () => {
  const db = getFirestore();
  const auth = getAuth();
  
  // State
  const currentUser = ref(null); // { uid, email, displayName, role }
  const users = ref([]); // All users (admin only)
  const isLoading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false);

  // Computed
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  const userDisplayName = computed(() => currentUser.value?.displayName || currentUser.value?.email || 'User');
  const userId = computed(() => currentUser.value?.uid || null);
  const userEmail = computed(() => currentUser.value?.email || null);

  // Initialize auth state listener
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in
          try {
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              currentUser.value = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userDoc.data()
              };
              
              // Update last login
              await updateDoc(doc(db, 'users', firebaseUser.uid), {
                lastLogin: serverTimestamp()
              });
            } else {
              // User exists in Auth but not in Firestore (shouldn't happen)
              console.warn('User exists in Auth but not in Firestore:', firebaseUser.uid);
              currentUser.value = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                role: 'user' // Default role
              };
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
            error.value = err.message;
          }
        } else {
          // User is signed out
          currentUser.value = null;
        }
        isInitialized.value = true;
        resolve();
      });
    });
  };

  // Login
  const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if user is active
        if (userData.active === false) {
          await signOut(auth);
          throw new Error('Ihr Account wurde deaktiviert. Bitte kontaktieren Sie den Administrator.');
        }
        
        currentUser.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        };
        
        // Update last login
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLogin: serverTimestamp()
        });
        
        return currentUser.value;
      } else {
        throw new Error('Benutzerdaten nicht gefunden.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // User-friendly error messages
      let errorMessage = 'Login fehlgeschlagen.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Benutzer nicht gefunden.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Falsches Passwort.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Ungültige E-Mail-Adresse.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Zu viele fehlgeschlagene Versuche. Bitte versuchen Sie es später erneut.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await signOut(auth);
      currentUser.value = null;
      users.value = [];
    } catch (err) {
      console.error('Logout error:', err);
      error.value = 'Logout fehlgeschlagen.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch all users (Admin only)
  const fetchUsers = async () => {
    console.log('fetchUsers called');
    console.log('Current user:', currentUser.value);
    console.log('isAdmin:', isAdmin.value);
    
    if (!isAdmin.value) {
      console.error('Permission denied. Current user role:', currentUser.value?.role);
      console.error('Current user data:', JSON.stringify(currentUser.value, null, 2));
      throw new Error('Keine Berechtigung. Sie müssen als Administrator angemeldet sein.');
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Fetching users from Firestore...');
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(usersQuery);
      
      console.log(`Found ${querySnapshot.docs.length} users`);
      
      users.value = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      
      return users.value;
    } catch (err) {
      console.error('Error fetching users:', err);
      error.value = 'Fehler beim Laden der Benutzer: ' + err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create new user (Admin only)
  const createUser = async (email, password, displayName, role = 'user') => {
    if (!isAdmin.value) {
      throw new Error('Keine Berechtigung.');
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Note: Creating users with email/password from client-side
      // In production, this should be done via Cloud Functions with Admin SDK
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      const userData = {
        email: email,
        displayName: displayName,
        role: role,
        active: true,
        createdAt: serverTimestamp(),
        createdBy: currentUser.value.uid,
        lastLogin: null
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Sign out the newly created user and sign back in as admin
      await signOut(auth);
      
      // Re-login as admin
      // Note: This is a limitation of client-side user creation
      // In production, use Cloud Functions
      
      console.log('User created successfully:', firebaseUser.uid);
      
      return {
        uid: firebaseUser.uid,
        ...userData
      };
    } catch (err) {
      console.error('Error creating user:', err);
      
      let errorMessage = 'Fehler beim Anlegen des Benutzers.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Ungültige E-Mail-Adresse.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Das Passwort ist zu schwach. Mindestens 6 Zeichen erforderlich.';
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  // Update user (Admin only)
  const updateUser = async (userId, updates) => {
    if (!isAdmin.value) {
      throw new Error('Keine Berechtigung.');
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.value.uid
      });
      
      // Update local users array
      const index = users.value.findIndex(u => u.uid === userId);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updates };
      }
      
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      error.value = 'Fehler beim Aktualisieren des Benutzers.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete user (Admin only - soft delete by setting active = false)
  const deleteUser = async (userId) => {
    if (!isAdmin.value) {
      throw new Error('Keine Berechtigung.');
    }
    
    if (userId === currentUser.value.uid) {
      throw new Error('Sie können sich nicht selbst löschen.');
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Soft delete: set active to false
      await updateDoc(doc(db, 'users', userId), {
        active: false,
        deletedAt: serverTimestamp(),
        deletedBy: currentUser.value.uid
      });
      
      // Remove from local users array
      users.value = users.value.filter(u => u.uid !== userId);
      
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      error.value = 'Fehler beim Löschen des Benutzers.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Reset password (Admin only)
  // Note: This requires Cloud Functions in production
  const resetUserPassword = async (email) => {
    if (!isAdmin.value) {
      throw new Error('Keine Berechtigung.');
    }
    
    // TODO: Implement via Cloud Functions
    console.log('Password reset for:', email);
    throw new Error('Password Reset ist noch nicht implementiert. Bitte Firebase Console verwenden.');
  };

  // Change own password (any authenticated user)
  const changePassword = async (currentPassword, newPassword) => {
    if (!isAuthenticated.value) {
      throw new Error('Sie müssen angemeldet sein.');
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('Benutzer nicht gefunden.');
      }
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        passwordChangedAt: serverTimestamp()
      });
      
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      
      let errorMessage = 'Fehler beim Ändern des Passworts.';
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Das aktuelle Passwort ist falsch.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Das neue Passwort ist zu schwach. Mindestens 6 Zeichen erforderlich.';
      } else if (err.code === 'auth/requires-recent-login') {
        errorMessage = 'Bitte melden Sie sich erneut an und versuchen Sie es dann noch einmal.';
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    currentUser,
    users,
    isLoading,
    error,
    isInitialized,
    
    // Computed
    isAuthenticated,
    isAdmin,
    userDisplayName,
    userId,
    userEmail,
    
    // Actions
    initAuth,
    login,
    logout,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    changePassword
  };
});
