<template>
  <div class="settings-view">
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Einstellungen</h2>
        
        <div class="space-y-8">
          <!-- Password Change Section -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Passwort ändern</h3>
            <p class="text-sm text-gray-600 mb-4">
              Hier können Sie Ihr Passwort ändern. Geben Sie dazu Ihr aktuelles Passwort und das neue Passwort ein.
            </p>
            
            <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
              <!-- Current Password -->
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                  Aktuelles Passwort
                </label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Aktuelles Passwort eingeben"
                />
              </div>
              
              <!-- New Password -->
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700">
                  Neues Passwort
                </label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Neues Passwort (mind. 6 Zeichen)"
                />
              </div>
              
              <!-- Confirm New Password -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Neues Passwort bestätigen
                </label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  minlength="6"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Neues Passwort wiederholen"
                />
              </div>
              
              <!-- Error Message -->
              <div v-if="passwordError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {{ passwordError }}
              </div>
              
              <!-- Success Message -->
              <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {{ passwordSuccess }}
              </div>
              
              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  :disabled="isChangingPassword"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isChangingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isChangingPassword ? 'Wird geändert...' : 'Passwort ändern' }}
                </button>
              </div>
            </form>
          </div>
          
          <!-- Backup & Restore Section -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Daten-Sicherung</h3>
            <p class="text-sm text-gray-600 mb-4">
              Hier können Sie eine Sicherung Ihrer Daten erstellen oder eine vorhandene Sicherung wiederherstellen.
            </p>
            <BackupSettings />
          </div>
          
          <!-- App Version -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Version</h3>
            <p class="text-sm text-gray-600">
              ProviBook v{{ appVersion }}
              <span v-if="!isProduction" class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Entwicklungsversion
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BackupSettings from '@/components/BackupSettings.vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  isProduction: {
    type: Boolean,
    required: true,
  },
  gitBranch: {
    type: String,
    default: 'main',
  },
});

const userStore = useUserStore();
const appVersion = ref(import.meta.env.VITE_APP_VERSION || '1.0.0');

// Password change form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const isChangingPassword = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  
  // Validate passwords match
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Die neuen Passwörter stimmen nicht überein.';
    return;
  }
  
  // Validate minimum length
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'Das neue Passwort muss mindestens 6 Zeichen lang sein.';
    return;
  }
  
  // Validate not same as current
  if (passwordForm.currentPassword === passwordForm.newPassword) {
    passwordError.value = 'Das neue Passwort muss sich vom aktuellen unterscheiden.';
    return;
  }
  
  isChangingPassword.value = true;
  
  try {
    await userStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    passwordSuccess.value = 'Ihr Passwort wurde erfolgreich geändert.';
    
    // Clear form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (err) {
    passwordError.value = err.message;
  } finally {
    isChangingPassword.value = false;
  }
};
</script>

<style scoped>
.settings-view {
  min-height: calc(100vh - 120px);
}

.form-radio {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}
</style>
