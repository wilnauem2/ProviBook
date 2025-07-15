import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './input.css'

// Create Pinia instance first
const pinia = createPinia()

// Create the app instance
const app = createApp(App)

// Apply plugins in the correct order
app.use(pinia)  // Pinia first
app.use(router) // Then router

// Add global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Error in component:', instance?.$options?.name || 'Unknown')
  console.error('Error info:', info)
  
  // You might want to show a user-friendly error message here
  // or send the error to an error tracking service
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  // Optionally show error to user
})

// Mount the app only when everything is ready
router.isReady().then(() => {
  app.mount('#app')
}).catch(error => {
  console.error('Router initialization failed:', error)
})
