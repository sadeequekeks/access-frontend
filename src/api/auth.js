import api from './axios'

export default {
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  signup(userData) {
    return api.post('/auth/signup', userData)
  }
}
