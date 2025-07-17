import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind-prod.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Set a global property to identify the production environment
app.config.globalProperties.$isProduction = true;

app.mount('#app')
