<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.push('/tickets')">
          Back to Tickets
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    
    <v-row v-else-if="ticket">
      <v-col cols="12">
        <!-- Ticket Information Card -->
        <v-card class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center flex-wrap">
            <div>
              <h2 class="text-h5">{{ ticket.ticket_number }}</h2>
            </div>
            <StatusChip :status="ticket.status" />
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Request Type</v-list-item-title>
                <v-list-item-subtitle>
                  {{ ticket.request_type || ticket.custom_request_type }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Reason</v-list-item-title>
                <v-list-item-subtitle>{{ ticket.reason }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Description</v-list-item-title>
                <v-list-item-subtitle>{{ ticket.description }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="ticket.attachment">
                <v-list-item-title>Attachment</v-list-item-title>
                <v-list-item-subtitle>
                  <v-btn
                    variant="text"
                    size="small"
                    prepend-icon="mdi-download"
                    @click="downloadAttachment"
                  >
                    Download File
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Created</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(ticket.created_at) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Last Updated</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(ticket.updated_at) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="ticket.resolution_time">
                <v-list-item-title>Resolution Time</v-list-item-title>
                <v-list-item-subtitle>{{ formatDuration(ticket.resolution_time) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Timeline Section -->
        <v-card class="mb-4">
          <v-card-title>Timeline</v-card-title>
          <v-card-text>
            <v-timeline density="compact" side="end">
              <v-timeline-item
                dot-color="info"
                size="small"
              >
                <div class="text-caption">Created</div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(ticket.created_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="ticket.status !== 'Pending'"
                dot-color="warning"
                size="small"
              >
                <div class="text-caption">In Progress</div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(ticket.updated_at) }}
                </div>
              </v-timeline-item>
              <v-timeline-item
                v-if="ticket.status === 'Completed'"
                dot-color="success"
                size="small"
              >
                <div class="text-caption">Completed</div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(ticket.updated_at) }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
        
        <!-- Feedback Section -->
        <v-card>
          <v-card-title>IT Support Feedback</v-card-title>
          <v-card-text>
            <div v-if="ticket.feedback && ticket.feedback.length > 0">
              <FeedbackCard
                v-for="feedback in ticket.feedback"
                :key="feedback.id"
                :feedback="feedback"
              />
            </div>
            <div v-else class="text-center py-8">
              <p class="text-medium-emphasis">No feedback yet.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <p>Ticket not found.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StatusChip from '@/components/StatusChip.vue'
import FeedbackCard from '@/components/FeedbackCard.vue'

export default {
  name: 'TicketDetail',
  components: {
    StatusChip,
    FeedbackCard
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('tickets', ['currentTicket']),
    ticket() {
      return this.currentTicket
    }
  },
  async mounted() {
    await this.loadTicket()
  },
  methods: {
    ...mapActions('tickets', ['fetchMyTicket']),
    async loadTicket() {
      this.loading = true
      try {
        await this.fetchMyTicket(this.$route.params.id)
      } catch (error) {
        console.error('Failed to load ticket:', error)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    formatDuration(seconds) {
      if (!seconds) return 'N/A'
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    },
    downloadAttachment() {
      if (this.ticket.attachment) {
        const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000'
        const token = localStorage.getItem('token')
        const url = `${apiUrl}/tickets/${this.ticket.id}/attachment`
        window.open(url, '_blank')
      }
    }
  }
}
</script>
