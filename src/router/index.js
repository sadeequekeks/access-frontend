import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/Signup.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'MyTickets',
    component: () => import('@/views/MyTickets.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/create',
    name: 'CreateTicket',
    component: () => import('@/views/CreateTicket.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: () => import('@/views/TicketDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresITSupport: true }
  },
  {
    path: '/admin/tickets/:id',
    name: 'AdminTicketDetail',
    component: () => import('@/views/AdminTicketDetail.vue'),
    meta: { requiresAuth: true, requiresITSupport: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isITSupport = store.getters['auth/isITSupport']
  
  // Handle root path redirect
  if (to.path === '/') {
    if (isAuthenticated) {
      next(isITSupport ? '/admin/dashboard' : '/dashboard')
    } else {
      next('/login')
    }
    return
  }
  
  // Handle routes requiring authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // Handle routes requiring guest (login/signup pages)
  if (to.meta.requiresGuest && isAuthenticated) {
    next(isITSupport ? '/admin/dashboard' : '/dashboard')
    return
  }
  
  // Handle routes requiring IT Support role
  if (to.meta.requiresITSupport && !isITSupport) {
    next('/dashboard')
    return
  }
  
  // Redirect IT Support users away from regular dashboard to admin dashboard
  if (to.path === '/dashboard' && isITSupport) {
    next('/admin/dashboard')
    return
  }
  
  next()
})

export default router
