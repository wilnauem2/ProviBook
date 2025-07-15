import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './input.css'

// Create a function to initialize the app
const initApp = async () => {
  try {
    // Create Pinia instance first
    const pinia = createPinia()

    // Create the app instance
    const app = createApp({
      render: () => h(App)
    })

    // Apply plugins in the correct order
    app.use(pinia)
    app.use(router)

    // Global error handler
    app.config.errorHandler = (err, instance, info) => {
      console.error('Vue Error:', err)
      console.error('Error in component:', instance?.$options?.name || 'Unknown')
      console.error('Error info:', info)
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })

    // Wait for router to be ready before mounting
    try {
      await router.isReady()
      app.mount('#app')
      console.log('App mounted successfully')
      // Dispatch event to hide loading spinner
      window.dispatchEvent(new Event('app-mounted'))
    } catch (routerError) {
      console.error('Router initialization failed:', routerError)
      // Fallback mount without router
      app.mount('#app')
      // Still dispatch the event even if router failed
      window.dispatchEvent(new Event('app-mounted'))
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
