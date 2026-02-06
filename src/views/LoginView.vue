<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Subtle background pattern -->
    <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50/50 via-slate-50 to-slate-100 pointer-events-none"></div>
    
    <div class="relative max-w-sm w-full animate-fade-in">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 mb-5">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">
          Willkommen bei ProviBook
        </h2>
        <p class="mt-1.5 text-sm text-slate-500">
          Melden Sie sich mit Ihren Zugangsdaten an
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-soft-lg border border-slate-200/60 p-6">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-3">
            <div>
              <label for="email-address" class="block text-xs font-medium text-slate-600 mb-1.5">E-Mail-Adresse</label>
              <input
                id="email-address"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                placeholder="name@firma.de"
              />
            </div>
            <div>
              <label for="password" class="block text-xs font-medium text-slate-600 mb-1.5">Passwort</label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                placeholder="Passwort eingeben"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-100 rounded-xl">
            <svg class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-sm text-red-700 font-medium">{{ errorMessage }}</p>
          </div>

          <!-- Remember me -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-brand-500 focus:ring-brand-500/30 border-slate-300 rounded transition-colors"
            />
            <label for="remember-me" class="ml-2 block text-sm text-slate-600">
              Angemeldet bleiben
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-brand-500/25 transition-all"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Anmeldung...' : 'Anmelden' }}
          </button>
        </form>
      </div>

      <!-- Footer Info -->
      <p class="mt-6 text-center text-xs text-slate-400">
        Bei Problemen wenden Sie sich an Ihren Administrator
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

// Form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

// Handle login
const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const user = await userStore.login(email.value, password.value);
    
    // Successful login
    console.log('Login successful, user:', user);
    
    // Wait a tick to ensure state is fully updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Double-check authentication before redirect
    if (userStore.isAuthenticated) {
      router.push('/');
    } else {
      // Fallback: force reload to ensure clean state
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = error.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
