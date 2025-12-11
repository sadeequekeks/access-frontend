import ticketsAPI from '@/api/tickets'

const state = {
  tickets: [],
  currentTicket: null,
  filters: {
    status: null,
    request_type: null
  },
  loading: false,
  error: null
}

const mutations = {
  SET_TICKETS(state, tickets) {
    state.tickets = tickets
  },
  SET_CURRENT_TICKET(state, ticket) {
    state.currentTicket = ticket
  },
  ADD_TICKET(state, ticket) {
    state.tickets.unshift(ticket)
  },
  UPDATE_TICKET(state, updatedTicket) {
    const index = state.tickets.findIndex(t => t.id === updatedTicket.id)
    if (index !== -1) {
      state.tickets[index] = updatedTicket
    }
    if (state.currentTicket?.id === updatedTicket.id) {
      state.currentTicket = updatedTicket
    }
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async createTicket({ commit }, formData) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.create(formData)
      commit('ADD_TICKET', response.data.ticket)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to create ticket')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchMyTickets({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.getMyTickets()
      commit('SET_TICKETS', response.data.tickets)
      return response.data.tickets
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch tickets')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchAllTickets({ commit, state }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null) // Clear previous errors
    try {
      const params = {}
      if (state.filters.status) params.status = state.filters.status
      if (state.filters.request_type) params.request_type = state.filters.request_type
      
      const response = await ticketsAPI.getAll(params)
      console.log('API Response:', response.data)
      
      // Handle different response structures
      const tickets = response.data.tickets || response.data || []
      commit('SET_TICKETS', tickets)
      commit('SET_ERROR', null) // Clear error on success
      return tickets
    } catch (error) {
      console.error('Fetch tickets error:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch tickets'
      commit('SET_ERROR', errorMessage)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchTicket({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.get(id)
      commit('SET_CURRENT_TICKET', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch ticket')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchMyTicket({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.getMyTicket(id)
      commit('SET_CURRENT_TICKET', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch ticket')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async updateStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.updateStatus(id, status)
      commit('UPDATE_TICKET', response.data.ticket)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to update status')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async addFeedback({ commit, dispatch }, { id, message }) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.addFeedback(id, message)
      // Refresh ticket to get updated feedback
      await dispatch('fetchTicket', id)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to add feedback')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async closeTicket({ commit, dispatch }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await ticketsAPI.close(id)
      commit('UPDATE_TICKET', response.data.ticket)
      await dispatch('fetchTicket', id) // Refresh to get resolution_time
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to close ticket')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  tickets: state => state.tickets,
  currentTicket: state => state.currentTicket,
  pendingTickets: state => state.tickets.filter(t => t.status === 'Pending'),
  inProgressTickets: state => state.tickets.filter(t => t.status === 'In Progress'),
  completedTickets: state => state.tickets.filter(t => t.status === 'Completed'),
  ticketsByStatus: state => status => state.tickets.filter(t => t.status === status),
  loading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
