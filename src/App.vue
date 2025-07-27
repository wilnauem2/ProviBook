<template>
  <!-- Error Boundary -->
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong.</h2>
    <p>{{ errorMessage }}</p>
    <button @click="reloadApp">Reload Application</button>
  </div>

  <!-- Main Application -->
  <div v-else>
    <router-view></router-view>

    <!-- Debug Panel -->
    <div v-if="isDevelopment" class="debug-panel" :class="{ 'is-open': isOpen }">
      <div class="debug-toggle" @click="toggleDebug">
        <span>D</span>
      </div>
      <div class="debug-content">
        <h3>Debug Information</h3>
        <p><strong>Environment:</strong> {{ environment }}</p>
        <p><strong>Firebase:</strong> 
          <span v-if="isLoading">Testing...</span>
          <span v-else :class="{ 'status-ok': isFirebaseConnected, 'status-error': !isFirebaseConnected }">
            {{ isFirebaseConnected ? 'Connected' : 'Disconnected' }}
          </span>
        </p>
        <div v-if="error" class="error-message">
          <p><strong>Error:</strong> {{ error }}</p>
          <div class="flex-1 overflow-y-auto">
            <InsurerList 
              :insurers="filteredInsurers" 
              :last-invoices="insurerStore.lastInvoices" 
              :current-date="currentDate"
              @select-insurer="selectInsurer"
              @update:sort-by="sortBy = $event"
              :sort-by="sortBy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onErrorCaptured, watch } from 'vue';
import { useInsurerStore } from './stores/insurerStore';
import { debounce } from 'lodash';
import InsurerList from '@/components/InsurerList.vue';

// --- Error Boundary State ---
const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err) => {
  console.error('Root error captured in App.vue:', err);
  hasError.value = true;
  errorMessage.value = err.message || 'An unknown error occurred.';
  return false; // Prevent the error from propagating further
});

const reloadApp = () => {
  window.location.reload();
};

// --- Debug Panel State & Logic ---
const store = useInsurerStore();
const isDevelopment = import.meta.env.DEV;
const isOpen = ref(isDevelopment);
const isFirebaseConnected = ref(false);
const error = ref(null); // Local error for debug panel
const isLoading = ref(false);
const environment = import.meta.env.MODE;

const toggleDebug = () => {
  isOpen.value = !isOpen.value;
};

// Initialize the insurer store
const insurerStore = useInsurerStore();

// Ensure we have insurers loaded
onMounted(async () => {
  try {
    await insurerStore.refreshInsurers();
  } catch (err) {
    console.error('Error loading insurers:', err);
    error.value = 'Failed to load insurers';
  }
});

// Compute filtered insurers
const filteredInsurers = computed(() => {
  return insurerStore.insurers || [];
});

// Current date for status calculations
const currentDate = ref(new Date());

// Sort by state
const sortBy = ref('name');

// Handle insurer selection
const selectInsurer = (insurer) => {
  console.log('Selected insurer:', insurer);
  // Add any additional selection logic here if needed
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
</script>

<style>
/* Global Styles */
body, #app {
  overscroll-behavior: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Error Boundary Styles */
.error-boundary {
  padding: 2rem;
  text-align: center;
  background-color: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  margin: 2rem;
}

/* Debug Panel Styles */
.debug-panel {
  position: fixed;
  bottom: 10px;
  right: -300px; /* Initially hidden */
  width: 300px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1000;
}

.debug-panel.is-open {
  right: 0;
}

.debug-toggle {
  position: absolute;
  left: -40px;
  top: 10px;
  width: 40px;
  height: 40px;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px 0 0 8px;
}

.debug-content {
  padding: 1rem;
}

.status-ok {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

.error-message {
  background-color: #ffebeb;
  border: 1px solid #ffc2c2;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
}

.debug-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
