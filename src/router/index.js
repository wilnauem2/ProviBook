import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginView from '../views/LoginView.vue'
import MainApp from '../components/MainApp.vue'
import DashboardView from '../views/DashboardView.vue'
import GdvDashboardView from '../views/GdvDashboardView.vue'
import HistoryView from '../views/HistoryView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import SettingsView from '../views/SettingsView.vue'
import UserManagement from '../views/UserManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL || '/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
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
          path: 'gdv',
          name: 'gdv',
          component: GdvDashboardView,
          meta: { title: 'GDV-Daten' }
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
          component: ActivitiesView,
          meta: { title: 'Aktivitäten' }
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView,
          meta: { title: 'Abrechnungsverlauf' }
        },
        {
          path: 'users',
          name: 'users',
          component: UserManagement,
          meta: { title: 'Benutzerverwaltung', requiresAdmin: true }
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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // Wait for auth initialization
  if (!userStore.isInitialized) {
    await userStore.initAuth()
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isAuthenticated = userStore.isAuthenticated
  const isAdmin = userStore.isAdmin
  
  // Redirect to login if not authenticated
  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // Redirect to dashboard if trying to access login while authenticated
  if (to.path === '/login' && isAuthenticated) {
    next('/')
    return
  }
  
  // Check admin permission
  if (requiresAdmin && !isAdmin) {
    alert('Sie haben keine Berechtigung für diese Seite.')
    next('/')
    return
  }
  
  next()
})

export default router
