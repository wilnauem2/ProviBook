<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900">Anmelden</h2>
          <p class="mt-2 text-sm text-slate-500">Willkommen zurück. Bitte melden Sie sich an.</p>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="handleLogin" aria-describedby="login-error">
          <div class="space-y-4">
            <!-- Username -->
            <div class="relative">
              <label for="username" class="sr-only">Benutzername</label>
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                v-model="username"
                autocomplete="username"
                class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Benutzername"
              />
            </div>

            <!-- Password -->
            <div class="relative">
              <label for="password" class="sr-only">Passwort</label>
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.0391-.5858-1.4142C13.0391 7.2107 12.5304 7 12 7s-1.0391.2107-1.4142.5858C10.2107 7.9609 10 8.4696 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11zm0 0v6m8-3a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="password"
                autocomplete="current-password"
                class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Passwort"
              />
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" id="login-error" role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start">
            <svg class="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isLoading" class="-ml-0.5 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ isLoading ? 'Wird angemeldet…' : 'Anmelden' }}</span>
          </button>
        </form>
      </div>
      <p class="mt-6 text-center text-xs text-slate-500">Tip: Demo-Zugang wird über Umgebungsvariablen konfiguriert.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Get credentials from environment variables
    const adminUsername = import.meta.env.VITE_APP_ADMIN_USERNAME
    const adminPassword = import.meta.env.VITE_APP_ADMIN_PASSWORD
    
    if (!adminUsername || !adminPassword) {
      throw new Error('Authentication service is not properly configured.')
    }

    if (username.value === adminUsername && password.value === adminPassword) {
      localStorage.setItem('authToken', 'dummy-token')
      localStorage.setItem('username', username.value)
      router.push('/')
    } else {
      error.value = 'Ungültige Anmeldeinformationen'
    }
  } catch (err) {
    console.error('Authentication error:', err)
    error.value = 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
