<template>
  <!-- Error Boundary -->
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong.</h2>
    <p>{{ errorMessage }}</p>
    <button @click="reloadApp">Reload Application</button>
  </div>

  <!-- Main Application -->
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

const reloadApp = () => {
  window.location.reload();
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

</style>
