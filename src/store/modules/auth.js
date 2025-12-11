import authAPI from '@/api/auth'

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (e) {
    return null
  }
}

const getStoredToken = () => {
  return localStorage.getItem('token') || null
}

const initialState = () => {
  const user = getStoredUser()
  const token = getStoredToken()
  return {
    user,
    token,
    isAuthenticated: !!(user || token)
  }
}

const state = initialState()

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!(user || state.token)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  SET_TOKEN(state, token) {
    state.token = token
    state.isAuthenticated = !!(state.user || token)
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await authAPI.login(credentials)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER', response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async signup({ commit }, userData) {
    try {
      const response = await authAPI.signup(userData)
      commit('SET_TOKEN', response.data.token)
      commit('SET_USER', response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}

const getters = {
  isAuthenticated: state => !!(state.user || state.token),
  user: state => state.user,
  isITSupport: state => {
    const role = state.user?.role
    // Handle both 'it_support' and 'admin' role names
    return role === 'it_support' || role === 'admin'
  },
  isUser: state => state.user?.role === 'user'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
