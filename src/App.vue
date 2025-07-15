<template> 
  <div class="app">
    <!-- Debug Panel (only shown in development) -->
    <div v-if="isDevelopment" class="debug-panel">
      <div class="debug-header" @click="toggleDebug">
        <span>Debug Panel ({{ isOpen ? '▼' : '▶' }})</span>
        <span class="debug-status" :class="{ 'status-ok': isFirebaseConnected, 'status-error': !isFirebaseConnected }">
          {{ isFirebaseConnected ? 'Firebase: Connected' : 'Firebase: Disconnected' }}
        </span>
      </div>
      
      <div v-if="isOpen" class="debug-content">
        <div class="debug-section">
          <h4>App State</h4>
          <pre>Environment: {{ environment }}</pre>
          <pre>Loading: {{ isLoading }}</pre>
          <pre v-if="error" class="error">Error: {{ error }}</pre>
        </div>
        
        <div class="debug-section">
          <h4>Actions</h4>
          <button @click="testFirebase">Test Firebase Connection</button>
          <button @click="showStoreState">Show Store State</button>
          <button @click="clearError">Clear Error</button>
        </div>
      </div>
    </div>

    <!-- Error Boundary -->
    <div v-if="hasError" class="error-boundary">
      <h2>Something went wrong</h2>
      <p>{{ errorMessage }}</p>
      <button @click="reloadApp">Reload App</button>
    </div>
    
    <!-- Main App Content -->
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { ref, onMounted, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';
import { useInsurerStore } from './stores/insurerStore';

// Error handling component
const ErrorBoundary = {
  setup() {
    const hasError = ref(false);
    const errorMessage = ref('');

    onErrorCaptured((err) => {
      console.error('Error captured in component:', err);
      hasError.value = true;
      errorMessage.value = err.message;
      return false; // Prevent the error from propagating further
    });

    const reloadApp = () => {
      window.location.reload();
    };

    return {
      hasError,
      errorMessage,
      reloadApp
    };
  }
};

export default {
  name: 'App',
  
  components: {
    ErrorBoundary
  },
  
  setup() {
    const router = useRouter();
    const store = useInsurerStore();
    
    const isDevelopment = import.meta.env.DEV;
    const isOpen = ref(isDevelopment);
    const isFirebaseConnected = ref(false);
    const error = ref(null);
    const isLoading = ref(false);
    const environment = import.meta.env.MODE;

    const toggleDebug = () => {
      isOpen.value = !isOpen.value;
    };

    const testFirebase = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        isFirebaseConnected.value = await store.testFirestoreConnection();
      } catch (err) {
        console.error('Firebase test failed:', err);
        error.value = err.message;
      } finally {
        isLoading.value = false;
      }
    };

    const showStoreState = () => {
      store.debugStoreState();
    };

    const clearError = () => {
      error.value = null;
    };

    // Test Firebase connection on component mount
    onMounted(async () => {
      if (isDevelopment) {
        console.log('App mounted in development mode');
        try {
          isFirebaseConnected.value = await store.testFirestoreConnection();
        } catch (err) {
          console.error('Initial Firebase test failed:', err);
        }
      }
    });

    return {
      isDevelopment,
      isOpen,
      isFirebaseConnected,
      environment,
      error,
      isLoading,
      toggleDebug,
      testFirebase,
      showStoreState,
      clearError
    };
  }
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  font-family: monospace;
  z-index: 9999;
  font-size: 14px;
  max-height: 50vh;
  overflow-y: auto;
  border-top: 2px solid #444;
}

.debug-header {
  background: #333;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
}

.status-ok {
  background: #10b981;
  color: white;
}

.status-error {
  background: #ef4444;
  color: white;
}

.debug-content {
  padding: 12px;
}

.debug-section {
  margin-bottom: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

debug-section h4 {
  margin: 0 0 8px 0;
  color: #60a5fa;
}

pre {
  margin: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

button:hover {
  background: #2563eb;
}

.error {
  color: #f87171;
}

.error-boundary {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  text-align: center;
}

.error-boundary h2 {
  color: #b91c1c;
  margin-bottom: 1rem;
}

.error-boundary button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
}
</style>

<style>
:root {
  --primary: #2563eb;
  --primary-light: #3b82f6;
  --primary-dark: #1d4ed8;
  --secondary: #4b5563;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --background: #f9fafb;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 0.375rem;
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  line-height: 1.5;
  background-color: var(--background);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border);
  color: var(--text-primary);
}

.btn-outline:hover {
  background-color: var(--background);
  border-color: var(--text-secondary);
}

/* Cards */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--surface);
  background-clip: padding-box;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--primary);
  outline: 0;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Utilities */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.p-4 { padding: 1rem; }
</style>
