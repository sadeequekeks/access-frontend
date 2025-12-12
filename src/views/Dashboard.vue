<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="welcome-section">
          <div class="d-flex align-center mb-3">
            <v-avatar color="primary" size="56" class="mr-4">
              <span class="text-h5">{{ getUserInitials }}</span>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">
                Welcome back, {{ getUserFirstName }}!
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ getGreeting }}
              </p>
            </div>
          </div>
          
          <v-alert
            v-if="isITSupport"
            type="info"
            variant="tonal"
            density="comfortable"
            class="mt-4"
          >
            <div class="d-flex align-center">
              <v-icon start>mdi-shield-account</v-icon>
              <span>You have IT Support access.</span>
              <v-btn
                variant="text"
                color="info"
                class="ml-2"
                @click="$router.push('/admin/dashboard')"
              >
                Go to Admin Dashboard
                <v-icon end size="small">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </v-alert>
        </div>
      </v-col>
    </v-row>
    
    <!-- Statistics Overview -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar color="primary" variant="tonal" size="48">
                <v-icon size="28">mdi-ticket-outline</v-icon>
              </v-avatar>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ tickets.length }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Requests</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar color="info" variant="tonal" size="48">
                <v-icon size="28">mdi-clock-outline</v-icon>
              </v-avatar>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ pendingCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Pending</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar color="warning" variant="tonal" size="48">
                <v-icon size="28">mdi-progress-clock</v-icon>
              </v-avatar>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ inProgressCount }}</div>
            <div class="text-body-2 text-medium-emphasis">In Progress</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border class="stat-card h-100">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-avatar color="success" variant="tonal" size="48">
                <v-icon size="28">mdi-check-circle-outline</v-icon>
              </v-avatar>
            </div>
            <div class="text-h4 font-weight-bold mb-1">{{ completedCount }}</div>
            <div class="text-body-2 text-medium-emphasis">Resolved</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Main Content Row -->
    <v-row>
      <!-- Recent Tickets Section -->
      <v-col cols="12" lg="8">
        <v-card elevation="0" border>
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                <span class="text-h6">Recent Requests</span>
              </div>
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="$router.push('/tickets')"
              >
                View All
                <v-icon end size="small">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
              <p class="mt-4 text-body-2 text-medium-emphasis">Loading your tickets...</p>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="recentTickets.length === 0" class="text-center py-12 px-6">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-ticket-outline</v-icon>
              <p class="text-h6 mb-2">No Tickets Yet</p>
              <p class="text-body-2 text-medium-emphasis mb-6">
                You haven't submitted any requests. Create your first one to get started!
              </p>
              <v-btn
                color="primary"
                variant="tonal"
                size="large"
                @click="$router.push('/tickets/create')"
              >
                <v-icon start>mdi-plus-circle</v-icon>
                Create First Request
              </v-btn>
            </div>
            
            <!-- Tickets List -->
            <div v-else class="pa-6 pt-4">
              <TicketCard
                v-for="(ticket, index) in recentTickets"
                :key="ticket.id"
                :ticket="ticket"
                :class="{ 'mb-3': index < recentTickets.length - 1 }"
                @view="viewTicket(ticket.id)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Quick Actions & Info Sidebar -->
      <v-col cols="12" lg="4">
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
            <v-btn
              color="primary"
              size="large"
              block
              class="mb-3"
              @click="$router.push('/tickets/create')"
            >
              <v-icon start>mdi-plus-circle</v-icon>
              Create New Request
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              block
              @click="$router.push('/tickets')"
            >
              <v-icon start>mdi-format-list-bulleted</v-icon>
              View All Tickets
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Status Guide Card -->
        <v-card elevation="0" border class="mb-4">
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
              <span class="text-h6">Status Guide</span>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-6">
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0 mb-3">
                <template v-slot:prepend>
                  <v-avatar color="info" variant="tonal" size="32">
                    <v-icon size="small">mdi-clock-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                  Pending
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Request is queued for review
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0 mb-3">
                <template v-slot:prepend>
                  <v-avatar color="warning" variant="tonal" size="32">
                    <v-icon size="small">mdi-progress-clock</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                  In Progress
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  IT team is working on it
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-avatar color="success" variant="tonal" size="32">
                    <v-icon size="small">mdi-check-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                  Resolved
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Request has been resolved
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Help & Support Card -->
        <v-card elevation="0" border>
          <v-card-text class="pa-6">
            <div class="text-center">
              <v-icon size="48" color="primary" class="mb-3">mdi-headset</v-icon>
              <div class="text-h6 mb-2">Need Help?</div>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Our IT support team is here to assist you
              </p>
              <v-divider class="my-4"></v-divider>
              <div class="text-left">
                <div class="d-flex align-center mb-2">
                  <v-icon size="small" class="mr-2" color="medium-emphasis">mdi-email</v-icon>
                  <span class="text-body-2">support@company.com</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-2" color="medium-emphasis">mdi-phone</v-icon>
                  <span class="text-body-2">Extension 1234</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TicketCard from '@/components/TicketCard.vue'

export default {
  name: 'Dashboard',
  components: {
    TicketCard
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'isITSupport']),
    ...mapGetters('tickets', ['tickets']),
    recentTickets() {
      return this.tickets.slice(0, 5)
    },
    pendingCount() {
      return this.tickets.filter(t => t.status === 'Pending').length
    },
    inProgressCount() {
      return this.tickets.filter(t => t.status === 'In Progress').length
    },
    completedCount() {
      return this.tickets.filter(t => t.status === 'Completed').length
    },
    getUserFirstName() {
      if (!this.user?.email) return 'User'
      return this.user.email.split('@')[0]
    },
    getUserInitials() {
      if (!this.user?.email) return 'U'
      return this.user.email.substring(0, 2).toUpperCase()
    },
    getGreeting() {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 17) return 'Good afternoon'
      return 'Good evening'
    }
  },
  async mounted() {
    // Redirect IT Support users to admin dashboard
    if (this.isITSupport) {
      this.$router.replace('/admin/dashboard')
      return
    }
    await this.loadTickets()
  },
  methods: {
    ...mapActions('tickets', ['fetchMyTickets']),
    async loadTickets() {
      this.loading = true
      try {
        await this.fetchMyTickets()
      } catch (error) {
        console.error('Failed to load tickets:', error)
      } finally {
        this.loading = false
      }
    },
    viewTicket(id) {
      this.$router.push(`/tickets/${id}`)
    }
  }
}
</script>

<style scoped>
.welcome-section {
  padding: 24px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-radius: 12px;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.h-100 {
  height: 100%;
}
</style>