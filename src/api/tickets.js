import api from './axios'

export default {
  create(formData) {
    return api.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getMyTickets() {
    return api.get('/tickets/my')
  },
  getMyTicket(id) {
    return api.get(`/tickets/my/${id}`)
  },
  getAll(params = {}) {
    return api.get('/tickets', { params })
  },
  get(id) {
    return api.get(`/tickets/${id}`)
  },
  updateStatus(id, status) {
    return api.put(`/tickets/${id}/status`, { status })
  },
  addFeedback(id, message) {
    return api.post(`/tickets/${id}/feedback`, { message })
  },
  close(id) {
    return api.put(`/tickets/${id}/close`)
  },
  getMentionedTickets() {
    return api.get('/tickets/mentioned')
  }
}
