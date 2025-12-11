<template>
  <v-container fluid class="pa-6">
    <!-- Header with Back Button -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          color="primary"
          class="mb-4"
          @click="$router.push('/admin/dashboard')"
        >
          Back to Dashboard
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        <p class="mt-4 text-body-2 text-medium-emphasis">Loading ticket details...</p>
      </v-col>
    </v-row>
    
    <!-- Ticket Content -->
    <v-row v-else-if="ticket">
      <!-- Main Content Column -->
      <v-col cols="12" lg="8">
        <!-- Ticket Header Card -->
        <v-card elevation="0" border class="mb-6">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-4">
              <div>
                <div class="d-flex align-center ga-3 mb-2">
                  <h1 class="text-h4 font-weight-bold">{{ ticket.ticket_number }}</h1>
                  <StatusChip :status="ticket.status" size="large" />
                </div>
                <div class="d-flex align-center text-medium-emphasis">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  <span class="text-body-2">Created {{ getRelativeTime(ticket.created_at) }}</span>
                </div>
              </div>
            </div>
            
            <!-- User Info -->
            <div class="d-flex align-center pa-4 rounded" style="background-color: rgba(var(--v-theme-surface), 0.04);">
              <v-avatar color="primary" size="48" class="mr-4">
                <span class="text-h6">{{ getInitials(ticket.user_email) }}</span>
              </v-avatar>
              <div>
                <div class="text-body-2 text-medium-emphasis">Submitted by</div>
                <div class="text-body-1 font-weight-medium">{{ ticket.user_email }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Ticket Details Card -->
        <v-card elevation="0" border class="mb-6">
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
              <span class="text-h6">Ticket Details</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-row dense>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-caption text-medium-emphasis mb-1">Request Type</div>
                <v-chip 
                  variant="tonal" 
                  :color="getRequestTypeColor(ticket.request_type || ticket.custom_request_type)"
                >
                  <v-icon start size="small">mdi-tag-outline</v-icon>
                  {{ ticket.request_type || ticket.custom_request_type }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6" class="mb-4">
                <div class="text-caption text-medium-emphasis mb-1">Priority</div>
                <v-chip variant="tonal" color="warning">
                  <v-icon start size="small">mdi-alert-circle-outline</v-icon>
                  Medium
                </v-chip>
              </v-col>
            </v-row>
            
            <v-divider class="my-4"></v-divider>
            
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis mb-2">Reason</div>
              <p class="text-body-1">{{ ticket.reason }}</p>
            </div>
            
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis mb-2">Description</div>
              <p class="text-body-1">{{ ticket.description }}</p>
            </div>
            
            <div v-if="ticket.attachment" class="mb-4">
              <div class="text-caption text-medium-emphasis mb-2">Attachment</div>
              <v-btn
                variant="outlined"
                prepend-icon="mdi-paperclip"
                @click="downloadAttachment"
              >
                Download Attachment
              </v-btn>
            </div>
            
            <v-divider class="my-4"></v-divider>
            
            <v-row dense>
              <v-col cols="12" sm="4">
                <div class="text-caption text-medium-emphasis mb-1">Created</div>
                <div class="text-body-2">{{ formatDate(ticket.created_at) }}</div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-caption text-medium-emphasis mb-1">Last Updated</div>
                <div class="text-body-2">{{ formatDate(ticket.updated_at) }}</div>
              </v-col>
              <v-col cols="12" sm="4" v-if="ticket.resolution_time">
                <div class="text-caption text-medium-emphasis mb-1">Resolution Time</div>
                <div class="text-body-2">{{ formatDuration(ticket.resolution_time) }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Timeline Card -->
        <v-card elevation="0" border class="mb-6">
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-timeline-outline</v-icon>
              <span class="text-h6">Activity Timeline</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-timeline density="compact" side="end" align="start">
              <v-timeline-item 
                dot-color="info" 
                size="small"
                icon="mdi-plus-circle"
              >
                <template v-slot:opposite>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatTimelineDate(ticket.created_at) }}
                  </div>
                </template>
                <div>
                  <div class="text-body-2 font-weight-medium mb-1">Ticket Created</div>
                  <div class="text-caption text-medium-emphasis">
                    Ticket submitted by {{ ticket.user_email }}
                  </div>
                </div>
              </v-timeline-item>
              
              <v-timeline-item
                v-if="ticket.status !== 'Pending'"
                dot-color="warning"
                size="small"
                icon="mdi-progress-clock"
              >
                <template v-slot:opposite>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatTimelineDate(ticket.updated_at) }}
                  </div>
                </template>
                <div>
                  <div class="text-body-2 font-weight-medium mb-1">Status Changed</div>
                  <div class="text-caption text-medium-emphasis">
                    Ticket moved to In Progress
                  </div>
                </div>
              </v-timeline-item>
              
              <v-timeline-item
                v-if="ticket.status === 'Completed'"
                dot-color="success"
                size="small"
                icon="mdi-check-circle"
              >
                <template v-slot:opposite>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatTimelineDate(ticket.updated_at) }}
                  </div>
                </template>
                <div>
                  <div class="text-body-2 font-weight-medium mb-1">Ticket Completed</div>
                  <div class="text-caption text-medium-emphasis">
                    Ticket has been resolved and closed
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
        
        <!-- Feedback Section -->
        <v-card elevation="0" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-message-text-outline</v-icon>
              <span class="text-h6">Feedback & Comments</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <div v-if="ticket.feedback && ticket.feedback.length > 0">
              <FeedbackCard
                v-for="feedback in ticket.feedback"
                :key="feedback.id"
                :feedback="feedback"
                class="mb-4"
              />
            </div>
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-message-off-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis">No feedback yet</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Actions Sidebar -->
      <v-col cols="12" lg="4">
        <div style="position: sticky; top: 24px;">
          <!-- Quick Actions Card -->
          <v-card elevation="0" border class="mb-4">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-lightning-bolt-outline</v-icon>
                <span class="text-h6">Quick Actions</span>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <!-- Status Update -->
              <div class="mb-6">
                <div class="text-body-2 font-weight-medium mb-3">Update Status</div>
                <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  variant="outlined"
                  density="comfortable"
                  :disabled="ticket.status === 'Completed'"
                  @update:model-value="updateStatus"
                  hide-details
                >
                  <template v-slot:prepend-inner>
                    <v-icon size="small">mdi-flag-outline</v-icon>
                  </template>
                </v-select>
              </div>
              
              <v-divider class="my-4"></v-divider>
              
              <!-- Add Feedback -->
              <div class="mb-4">
                <div class="text-body-2 font-weight-medium mb-3">Add Feedback</div>
                <v-textarea
                  v-model="feedbackMessage"
                  variant="outlined"
                  placeholder="Write your feedback here..."
                  rows="4"
                  :rules="[v => !v || v.length >= 10 || 'Minimum 10 characters required']"
                  hide-details="auto"
                ></v-textarea>
                <v-btn
                  color="primary"
                  block
                  class="mt-3"
                  :disabled="!feedbackMessage || feedbackMessage.length < 10"
                  :loading="addingFeedback"
                  @click="addFeedback"
                >
                  <v-icon start>mdi-send</v-icon>
                  Send Feedback
                </v-btn>
              </div>
              
              <v-divider class="my-4"></v-divider>
              
              <!-- Close Ticket Button -->
              <div v-if="ticket.status !== 'Completed'">
                <v-btn
                  color="success"
                  block
                  size="large"
                  :loading="closingTicket"
                  @click="closeTicket"
                >
                  <v-icon start>mdi-check-circle-outline</v-icon>
                  Close Ticket
                </v-btn>
              </div>
              <div v-else>
                <v-alert type="success" variant="tonal" density="compact">
                  <div class="d-flex align-center">
                    <v-icon start>mdi-check-circle</v-icon>
                    <span>This ticket is closed</span>
                  </div>
                </v-alert>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Ticket Info Card -->
          <v-card elevation="0" border>
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
                <span class="text-h6">Ticket Info</span>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <div class="info-row mb-3">
                <div class="text-caption text-medium-emphasis">Ticket ID</div>
                <div class="text-body-2 font-weight-medium">{{ ticket.id }}</div>
              </div>
              <div class="info-row mb-3">
                <div class="text-caption text-medium-emphasis">Created</div>
                <div class="text-body-2">{{ getRelativeTime(ticket.created_at) }}</div>
              </div>
              <div class="info-row">
                <div class="text-caption text-medium-emphasis">Last Activity</div>
                <div class="text-body-2">{{ getRelativeTime(ticket.updated_at) }}</div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    
    <!-- Not Found State -->
    <v-row v-else>
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-ticket-outline</v-icon>
        <p class="text-h6 mb-2">Ticket Not Found</p>
        <p class="text-body-2 text-medium-emphasis mb-6">The ticket you're looking for doesn't exist</p>
        <v-btn color="primary" variant="tonal" @click="$router.push('/admin/dashboard')">
          <v-icon start>mdi-arrow-left</v-icon>
          Back to Dashboard
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Dialogs -->
    <v-dialog v-model="statusDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-6 pb-4">Update Status</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-select
            v-model="tempStatus"
            :items="statusOptions"
            label="Select Status"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="statusDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmStatusUpdate">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="closeDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-6 pb-4">Close Ticket</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          Are you sure you want to close this ticket? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog = false">Cancel</v-btn>
          <v-btn color="success" variant="flat" @click="confirmCloseTicket">Close Ticket</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbars -->
    <v-snackbar v-model="successSnackbar" color="success" timeout="5000" location="top">
      <div class="d-flex align-center">
        <v-icon start>mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="successSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
    
    <v-snackbar v-model="errorSnackbar" color="error" timeout="5000" location="top">
      <div class="d-flex align-center">
        <v-icon start>mdi-alert-circle</v-icon>
        {{ errorMessage }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="errorSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StatusChip from '@/components/StatusChip.vue'
import FeedbackCard from '@/components/FeedbackCard.vue'

export default {
  name: 'AdminTicketDetail',
  components: {
    StatusChip,
    FeedbackCard
  },
  data() {
    return {
      loading: false,
      selectedStatus: null,
      statusOptions: ['Pending', 'In Progress', 'Completed'],
      feedbackMessage: '',
      addingFeedback: false,
      closingTicket: false,
      statusDialog: false,
      tempStatus: null,
      closeDialog: false,
      successSnackbar: false,
      successMessage: '',
      errorSnackbar: false,
      errorMessage: ''
    }
  },
  computed: {
    ...mapGetters('tickets', ['currentTicket']),
    ticket() {
      return this.currentTicket
    }
  },
  watch: {
    ticket: {
      handler(newTicket) {
        if (newTicket) {
          this.selectedStatus = newTicket.status
        }
      },
      immediate: true
    }
  },
  async mounted() {
    await this.loadTicket()
  },
  methods: {
    ...mapActions('tickets', ['fetchTicket', 'updateStatus', 'addFeedback', 'closeTicket']),
    async loadTicket() {
      this.loading = true
      try {
        await this.fetchTicket(this.$route.params.id)
      } catch (error) {
        console.error('Failed to load ticket:', error)
      } finally {
        this.loading = false
      }
    },
    async updateStatus(status) {
      if (!status || status === this.ticket.status) return
      
      try {
        await this.$store.dispatch('tickets/updateStatus', {
          id: this.ticket.id,
          status
        })
        await this.loadTicket()
        this.successMessage = 'Status updated successfully'
        this.successSnackbar = true
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Failed to update status'
        this.errorSnackbar = true
      }
    },
    async addFeedback() {
      if (!this.feedbackMessage || this.feedbackMessage.length < 10) return
      
      this.addingFeedback = true
      try {
        await this.$store.dispatch('tickets/addFeedback', {
          id: this.ticket.id,
          message: this.feedbackMessage
        })
        this.feedbackMessage = ''
        this.successMessage = 'Feedback added successfully'
        this.successSnackbar = true
        await this.loadTicket()
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Failed to add feedback'
        this.errorSnackbar = true
      } finally {
        this.addingFeedback = false
      }
    },
    async closeTicket() {
      this.closeDialog = true
    },
    async confirmCloseTicket() {
      this.closeDialog = false
      this.closingTicket = true
      try {
        await this.$store.dispatch('tickets/closeTicket', this.ticket.id)
        this.successMessage = 'Ticket closed successfully'
        this.successSnackbar = true
        await this.loadTicket()
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Failed to close ticket'
        this.errorSnackbar = true
      } finally {
        this.closingTicket = false
      }
    },
    confirmStatusUpdate() {
      this.statusDialog = false
      if (this.tempStatus) {
        this.updateStatus(this.tempStatus)
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatTimelineDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getRelativeTime(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(hours / 24)
      
      if (days > 30) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
      return 'Just now'
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
    getInitials(email) {
      if (!email) return '?'
      return email.substring(0, 2).toUpperCase()
    },
    getRequestTypeColor(type) {
      const colors = {
        'Application Database Access': 'purple',
        'Password Recovery': 'orange',
        'System Permissions': 'blue',
        'API Access': 'teal',
        'Other': 'grey'
      }
      return colors[type] || 'grey'
    },
    downloadAttachment() {
      if (this.ticket.attachment) {
        const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000'
        const url = `${apiUrl}/tickets/${this.ticket.id}/attachment`
        window.open(url, '_blank')
      }
    }
  }
}
</script>

<style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
</style>