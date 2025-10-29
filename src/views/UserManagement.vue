<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Benutzerverwaltung</h1>
      <p class="mt-2 text-sm text-gray-600">
        Verwalten Sie Benutzer und deren Berechtigungen
      </p>
    </div>

    <!-- Debug Info (Development Mode) -->
    <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 class="text-sm font-semibold text-yellow-800 mb-2">🔍 Debug-Info</h3>
      <div class="text-xs text-yellow-700 space-y-1">
        <p><strong>Eingeloggt:</strong> {{ userStore.isAuthenticated ? 'Ja' : 'Nein' }}</p>
        <p><strong>User-Email:</strong> {{ userStore.currentUser?.email || 'Keine' }}</p>
        <p><strong>User-Role:</strong> {{ userStore.currentUser?.role || 'Keine' }}</p>
        <p><strong>Ist Admin:</strong> {{ userStore.isAdmin ? 'Ja ✓' : 'Nein ✗' }}</p>
        <p><strong>Display Name:</strong> {{ userStore.userDisplayName }}</p>
        <p class="mt-2"><strong>Vollständige User-Daten:</strong></p>
        <pre class="bg-yellow-100 p-2 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(userStore.currentUser, null, 2) }}</pre>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button
          @click="fetchAllUsers"
          :disabled="isLoading"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Aktualisieren
        </button>
      </div>

      <button
        @click="showCreateDialog = true"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Neuen Benutzer anlegen
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Benutzer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              E-Mail
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rolle
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Letzter Login
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Lade Benutzer...
              </div>
            </td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Keine Benutzer gefunden
            </td>
          </tr>
          <tr v-else v-for="user in users" :key="user.uid" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-800 font-medium text-sm">
                      {{ getUserInitials(user) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.displayName || 'Unbekannt' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'admin',
                  'bg-green-100 text-green-800': user.role === 'user'
                }"
              >
                {{ user.role === 'admin' ? 'Administrator' : 'Benutzer' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': user.active !== false,
                  'bg-red-100 text-red-800': user.active === false
                }"
              >
                {{ user.active !== false ? 'Aktiv' : 'Deaktiviert' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.lastLogin) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editUser(user)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
                title="Bearbeiten"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                v-if="user.uid !== currentUserId"
                @click="confirmDeleteUser(user)"
                class="text-red-600 hover:text-red-900"
                title="Löschen"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Dialog -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Neuen Benutzer anlegen</h3>
          
          <form @submit.prevent="createNewUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="newUser.displayName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Max Mustermann"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  v-model="newUser.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                <input
                  v-model="newUser.password"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mindestens 6 Zeichen"
                />
                <p class="mt-1 text-xs text-gray-500">Der Benutzer kann sich mit diesem Passwort anmelden</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select
                  v-model="newUser.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">Benutzer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="createError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-800">{{ createError }}</p>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="cancelCreateUser"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ isCreating ? 'Wird angelegt...' : 'Benutzer anlegen' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit User Dialog -->
    <div v-if="showEditDialog && editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Benutzer bearbeiten</h3>
          
          <form @submit.prevent="saveUserEdit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="editingUser.displayName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select
                  v-model="editingUser.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">Benutzer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="editingUser.active"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option :value="true">Aktiv</option>
                  <option :value="false">Deaktiviert</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                :disabled="isUpdating"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ isUpdating ? 'Wird gespeichert...' : 'Speichern' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog && userToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Benutzer löschen?</h3>
          <p class="text-sm text-gray-600 mb-4">
            Möchten Sie den Benutzer "{{ userToDelete.displayName }}" wirklich deaktivieren?
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Abbrechen
            </button>
            <button
              @click="executeDelete"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ isDeleting ? 'Wird deaktiviert...' : 'Deaktivieren' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const userStore = useUserStore();

// State
const users = computed(() => userStore.users);
const isLoading = computed(() => userStore.isLoading);
const currentUserId = computed(() => userStore.currentUser?.uid);

// Create dialog
const showCreateDialog = ref(false);
const newUser = ref({
  displayName: '',
  email: '',
  password: '',
  role: 'user'
});
const isCreating = ref(false);
const createError = ref('');

// Edit dialog
const showEditDialog = ref(false);
const editingUser = ref(null);
const isUpdating = ref(false);

// Delete dialog
const showDeleteDialog = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(false);

// Fetch users on mount
onMounted(async () => {
  await fetchAllUsers();
});

// Fetch all users
const fetchAllUsers = async () => {
  try {
    await userStore.fetchUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Fehler beim Laden der Benutzer: ' + error.message);
  }
};

// Create new user
const createNewUser = async () => {
  isCreating.value = true;
  createError.value = '';

  try {
    await userStore.createUser(
      newUser.value.email,
      newUser.value.password,
      newUser.value.displayName,
      newUser.value.role
    );

    // Success
    alert('Benutzer erfolgreich angelegt!');
    showCreateDialog.value = false;
    resetNewUser();

    // Reload users
    await fetchAllUsers();
  } catch (error) {
    console.error('Error creating user:', error);
    createError.value = error.message;
  } finally {
    isCreating.value = false;
  }
};

const cancelCreateUser = () => {
  showCreateDialog.value = false;
  resetNewUser();
};

const resetNewUser = () => {
  newUser.value = {
    displayName: '',
    email: '',
    password: '',
    role: 'user'
  };
  createError.value = '';
};

// Edit user
const editUser = (user) => {
  editingUser.value = { ...user };
  showEditDialog.value = true;
};

const saveUserEdit = async () => {
  isUpdating.value = true;

  try {
    await userStore.updateUser(editingUser.value.uid, {
      displayName: editingUser.value.displayName,
      role: editingUser.value.role,
      active: editingUser.value.active
    });

    alert('Benutzer erfolgreich aktualisiert!');
    showEditDialog.value = false;
    editingUser.value = null;

    await fetchAllUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Fehler beim Aktualisieren: ' + error.message);
  } finally {
    isUpdating.value = false;
  }
};

const cancelEdit = () => {
  showEditDialog.value = false;
  editingUser.value = null;
};

// Delete user
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const executeDelete = async () => {
  isDeleting.value = true;

  try {
    await userStore.deleteUser(userToDelete.value.uid);

    alert('Benutzer erfolgreich deaktiviert!');
    showDeleteDialog.value = false;
    userToDelete.value = null;

    await fetchAllUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Fehler beim Löschen: ' + error.message);
  } finally {
    isDeleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  userToDelete.value = null;
};

// Helper functions
const getUserInitials = (user) => {
  if (user.displayName) {
    return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  return user.email[0].toUpperCase();
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Nie';

  try {
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  } catch (e) {
    return 'Ungültig';
  }
};
</script>
