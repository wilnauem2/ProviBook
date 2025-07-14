import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './input.css'

// Create the app instance with error handler
const app = createApp(App)

// Create and use Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Add global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.info('Vue Component:', instance)
  console.info('Error Info:', info)
}

// Use router
app.use(router)

// Mount the app
app.mount('#app')
