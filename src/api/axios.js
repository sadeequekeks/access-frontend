import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 if we're already on login/signup pages (allows login errors to show)
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup'
    
    if (error.response?.status === 401 && !isAuthPage) {
      // Only redirect to login if we're not already on auth pages
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Handle 403 Forbidden - might need to refresh token or check permissions
      console.error('Access forbidden (403):', error.response?.data)
    }
    return Promise.reject(error)
  }
)

export default api
