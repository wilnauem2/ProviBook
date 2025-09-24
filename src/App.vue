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
              @select-insurer="selectInsurer"
            />
            <InsurerDetail
              v-if="selectedInsurer"
              :insurer="selectedInsurer"
              :current-date="currentDate"
              :data-mode="dataMode"
              @close="clearSelectedInsurer"
              @update:insurer="handleInsurerUpdate"
              @settlement-completed="handleSettlementCompleted"
              @deleted="handleInsurerDeleted"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInsurerStore } from './stores/insurerStore';
import InsurerList from './components/InsurerList.vue';
import InsurerDetail from './components/InsurerDetail.vue';

const insurerStore = useInsurerStore();
const hasError = ref(false);
const errorMessage = ref('');
const isDevelopment = import.meta.env.MODE === 'development';
const isOpen = ref(false);
const isLoading = ref(false);
const isFirebaseConnected = ref(false);
const error = ref(null);
const selectedInsurer = ref(null);
const dataMode = ref('view');

// Computed properties
const environment = computed(() => import.meta.env.MODE);
const filteredInsurers = computed(() => insurerStore.insurers || []);

// Current date for status calculations
const currentDate = ref(new Date());

// Sort by state
const sortBy = ref('name');

// Methods
const toggleDebug = () => {
  isOpen.value = !isOpen.value;
};

const reloadApp = () => {
  window.location.reload();
};

// Handle insurer selection
const selectInsurer = (insurer) => {
  selectedInsurer.value = insurer;
};

const testFirebase = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    isFirebaseConnected.value = await insurerStore.testFirestoreConnection();
  } catch (err) {
    console.error('Firebase test failed:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const showStoreState = () => {
  console.log('Store state:', JSON.parse(JSON.stringify(insurerStore.$state)));
};

const clearError = () => {
  error.value = null;
};

const clearSelectedInsurer = () => {
  selectedInsurer.value = null;
};

const handleInsurerUpdate = (updatedInsurer) => {
  // Handle insurer update logic here
  insurerStore.updateInsurer(updatedInsurer);
};

const handleSettlementCompleted = () => {
  // Handle settlement completed logic here
  selectedInsurer.value = null;
};

const handleInsurerDeleted = () => {
  selectedInsurer.value = null;
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
