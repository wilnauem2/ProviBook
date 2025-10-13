import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import MainApp from '../components/MainApp.vue'
import DashboardView from '../views/DashboardView.vue'
import HistoryView from '../views/HistoryView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL || '/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: MainApp,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'insurers',
          name: 'insurers',
          component: DashboardView,
          meta: { title: 'Versicherungen' }
        },
        {
          path: 'stats',
          name: 'statistics',
          component: StatisticsView,
          meta: { title: 'Statistiken' }
        },
        {
          path: 'activities',
          name: 'activities',
          component: HistoryView,
          meta: { title: 'Aktivitäten' }
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView,
          meta: { title: 'Historie' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
          meta: { title: 'Einstellungen' }
        },
        {
          path: 'insurer/:name',
          name: 'insurer-detail',
          component: () => import('../components/InsurerDetail.vue'),
          meta: { title: 'Versicherungsdetails' }
        }
      ]
    },
    // Redirect old routes to new ones
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})


// Authentication guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('authToken')
  
  if (requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
