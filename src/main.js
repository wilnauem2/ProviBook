console.log('Starting app initialization...');
console.log('Environment:', import.meta.env.MODE);

import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './input.css'

// Create a function to initialize the app
const initApp = async () => {
  console.log('Initializing application...');
  
  try {
    console.log('Creating Pinia store...');
    const pinia = createPinia();

    console.log('Creating Vue app instance...');
    const app = createApp({
      render: () => h(App)
    });

    console.log('Applying plugins...');
    app.use(pinia);
    
    // Add global error handler before mounting
    app.config.errorHandler = (err, instance, info) => {
      console.error('Vue Error Handler:', {
        error: err,
        component: instance?.$options?.name || 'Unknown',
        info: info,
        url: window.location.href
      });
      
      // Show error to user
      const errorDiv = document.createElement('div');
      errorDiv.className = 'global-error';
      errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fee2e2;
        color: #b91c1c;
        padding: 1rem;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      
      errorDiv.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
          <h3 style="margin: 0 0 0.5rem 0;">An error occurred</h3>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">${err.message || 'Unknown error'}</p>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="this.parentNode.parentNode.remove()" style="padding: 0.25rem 0.75rem; background: #fca5a5; border: none; border-radius: 4px; cursor: pointer;">
              Dismiss
            </button>
            <button onclick="window.location.reload()" style="padding: 0.25rem 0.75rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Reload Page
            </button>
          </div>
        </div>
      `;
      
      document.body.prepend(errorDiv);
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });

    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global Error:', { message, source, lineno, colno, error });
      return true; // Prevent default error handling
    };

    // Apply router after error handlers are set up
    console.log('Applying router...');
    app.use(router);

    // Wait for router to be ready before mounting
    try {
      console.log('Waiting for router to be ready...');
      await router.isReady();
      
      console.log('Mounting app...');
      app.mount('#app');
      
      console.log('App mounted successfully');
      window.dispatchEvent(new Event('app-mounted'));
    } catch (routerError) {
      console.error('Router initialization failed:', routerError);
      
      // Fallback mount without router
      console.log('Attempting fallback mount without router...');
      app.mount('#app');
      window.dispatchEvent(new Event('app-mounted'));
    }
  } catch (error) {
    console.error('Critical error during app initialization:', error)
    // Create a minimal error app to show the error
    const errorApp = createApp({
      render: () => h('div', { class: 'p-4 text-red-600' }, [
        h('h1', 'Application Error'),
        h('p', 'A critical error occurred while loading the application.'),
        h('pre', error.toString())
      ])
    })
    errorApp.mount('#app')
  }
}

// Start the application
initApp()
