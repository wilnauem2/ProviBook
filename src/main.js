// Set the global production flag based on Vite's environment mode.
// import.meta.env.PROD is a boolean provided by Vite that is true during a build.
window.IS_PRODUCTION = import.meta.env.PROD;

import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/main.css'; // Use the main CSS file for all environments

// Create a function to initialize the app
const initApp = async () => {
  try {
    const pinia = createPinia();
    const app = createApp({ render: () => h(App) });

    app.use(pinia);

    // Add a comprehensive error handler for all environments
    app.config.errorHandler = (err, instance, info) => {
      console.error('Vue Error Handler:', { 
        error: err, 
        component: instance?.$options?.name || 'Unknown',
        info: info,
        url: window.location.href
      });
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });

    // Apply router after error handlers are set up
    app.use(router);

    // Wait for router to be ready before mounting
    await router.isReady();
    app.mount('#app');

  } catch (e) {
    console.error('Failed to initialize app:', e);
    // Provide a fallback for the user if the app fails to load
    document.body.innerHTML = '<div style="padding: 2rem; text-align: center; font-family: sans-serif;"><h2>Application Error</h2><p>Could not load the application. Please try refreshing the page.</p></div>';
  }
};

// Start the app
initApp();

