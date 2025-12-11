<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Dashboard</h1>
            <p class="text-body-2 text-medium-emphasis">Monitor and manage support tickets</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            variant="tonal"
            @click="loadTickets"
            :loading="loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-col>
    </v-row>
    
    <!-- Statistics Cards with Enhanced Design -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="0" border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-icon size="40" color="primary" class="stat-icon">mdi-ticket-outline</v-icon>
              <v-chip size="small" variant="tonal" color="primary">Total</v-chip>
            </div>
            <div class="text-h3 font-weight-bold mb-1">{{ tickets.length }}</div>
            <div class="text-body-2 text-medium-emphasis">Total Tickets</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="0" border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-icon size="40" color="info" class="stat-icon">mdi-clock-outline</v-icon>
              <v-chip size="small" variant="tonal" color="info">Pending</v-chip>
            </div>
            <div class="text-h3 font-weight-bold mb-1">{{ pendingTickets.length }}</div>
            <div class="text-body-2 text-medium-emphasis">Awaiting Response</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="0" border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-icon size="40" color="warning" class="stat-icon">mdi-progress-clock</v-icon>
              <v-chip size="small" variant="tonal" color="warning">Active</v-chip>
            </div>
            <div class="text-h3 font-weight-bold mb-1">{{ inProgressTickets.length }}</div>
            <div class="text-body-2 text-medium-emphasis">In Progress</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" lg="3">
        <v-card class="stat-card" elevation="0" border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <v-icon size="40" color="success" class="stat-icon">mdi-check-circle-outline</v-icon>
              <v-chip size="small" variant="tonal" color="success">Done</v-chip>
            </div>
            <div class="text-h3 font-weight-bold mb-1">{{ completedTickets.length }}</div>
            <div class="text-body-2 text-medium-emphasis">Completed</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Tickets Table Card -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" border>
          <!-- Search and Filters Bar -->
          <v-card-title class="pa-6 pb-0">
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search tickets..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-filter-outline"
                  @update:model-value="loadTickets"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filters.request_type"
                  :items="requestTypes"
                  label="Request Type"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  prepend-inner-icon="mdi-tag-outline"
                  @update:model-value="loadTickets"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-title>
          
          <v-divider class="my-4"></v-divider>
          
          <v-card-text class="pa-0">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <v-progress-circular 
                indeterminate 
                color="primary" 
                size="48"
              ></v-progress-circular>
              <p class="mt-4 text-body-2 text-medium-emphasis">Loading tickets...</p>
            </div>
            
            <!-- Error State (when no tickets) -->
            <div v-else-if="error && tickets.length === 0" class="text-center py-12 px-6">
              <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
              <p class="text-h6 mb-2">Unable to Load Tickets</p>
              <p class="text-body-2 text-medium-emphasis mb-6">{{ error }}</p>
              <v-btn color="primary" variant="tonal" @click="loadTickets">
                <v-icon start>mdi-refresh</v-icon>
                Try Again
              </v-btn>
            </div>
            
            <!-- Data Table -->
            <div v-else>
              <v-alert 
                v-if="error" 
                type="warning" 
                variant="tonal"
                class="ma-6 mb-0"
                closable
              >
                {{ error }}
              </v-alert>
              
              <v-data-table
                :headers="headers"
                :items="filteredTickets"
                :items-per-page="10"
                class="tickets-table"
              >
                <!-- Empty State -->
                <template v-slot:no-data>
                  <div class="text-center py-12">
                    <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-ticket-outline</v-icon>
                    <p class="text-h6 mb-2">No Tickets Found</p>
                    <p class="text-body-2 text-medium-emphasis">
                      Tickets will appear here once users submit support requests
                    </p>
                  </div>
                </template>
                
                <!-- Ticket Number Column -->
                <template v-slot:item.ticket_number="{ item }">
                  <span class="font-weight-medium">{{ item.ticket_number }}</span>
                </template>
                
                <!-- User Email Column -->
                <template v-slot:item.user_email="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar color="primary" size="32" class="mr-3">
                      <span class="text-caption">{{ getInitials(item.user_email) }}</span>
                    </v-avatar>
                    <span>{{ item.user_email }}</span>
                  </div>
                </template>
                
                <!-- Request Type Column -->
                <template v-slot:item.request_type="{ item }">
                  <v-chip 
                    size="small" 
                    variant="tonal"
                    :color="getRequestTypeColor(item.request_type || item.custom_request_type)"
                  >
                    {{ item.request_type || item.custom_request_type }}
                  </v-chip>
                </template>
                
                <!-- Status Column -->
                <template v-slot:item.status="{ item }">
                  <StatusChip :status="item.status" />
                </template>
                
                <!-- Created Date Column -->
                <template v-slot:item.created_at="{ item }">
                  <div>
                    <div class="text-body-2">{{ formatDate(item.created_at) }}</div>
                    <div class="text-caption text-medium-emphasis">{{ getRelativeTime(item.created_at) }}</div>
                  </div>
                </template>
                
                <!-- Actions Column -->
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    size="small"
                    color="primary"
                    variant="tonal"
                    @click="viewTicket(item.id)"
                  >
                    <v-icon start size="small">mdi-eye-outline</v-icon>
                    View
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StatusChip from '@/components/StatusChip.vue'

export default {
  name: 'AdminDashboard',
  components: {
    StatusChip
  },
  data() {
    return {
      loading: false,
      search: '',
      filters: {
        status: null,
        request_type: null
      },
      statusOptions: ['Pending', 'In Progress', 'Completed'],
      requestTypes: [
        'Application Database Access',
        'Password Recovery',
        'System Permissions',
        'API Access',
        'Other'
      ],
      headers: [
        { title: 'Ticket #', key: 'ticket_number', width: '140px' },
        { title: 'User', key: 'user_email', width: '250px' },
        { title: 'Request Type', key: 'request_type', width: '200px' },
        { title: 'Status', key: 'status', width: '140px' },
        { title: 'Created', key: 'created_at', width: '180px' },
        { title: 'Actions', key: 'actions', sortable: false, width: '120px', align: 'end' }
      ]
    }
  },
  computed: {
    ...mapGetters('tickets', [
      'tickets',
      'pendingTickets',
      'inProgressTickets',
      'completedTickets',
      'error'
    ]),
    filteredTickets() {
      let filtered = [...this.tickets]
      
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        filtered = filtered.filter(t =>
          t.ticket_number?.toLowerCase().includes(searchLower) ||
          t.user_email?.toLowerCase().includes(searchLower) ||
          t.request_type?.toLowerCase().includes(searchLower) ||
          t.custom_request_type?.toLowerCase().includes(searchLower)
        )
      }
      
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },
  async mounted() {
    await this.loadTickets()
  },
  watch: {
    filters: {
      handler() {
        this.updateFilters()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('tickets', ['fetchAllTickets']),
    async loadTickets() {
      this.loading = true
      this.$store.commit('tickets/SET_ERROR', null)
      try {
        this.updateFilters()
        await this.fetchAllTickets()
        this.$store.commit('tickets/SET_ERROR', null)
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to load tickets. Please try again.'
        this.$store.commit('tickets/SET_ERROR', errorMessage)
      } finally {
        this.loading = false
      }
    },
    updateFilters() {
      this.$store.commit('tickets/SET_FILTERS', {
        status: this.filters.status,
        request_type: this.filters.request_type
      })
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getRelativeTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(hours / 24)
      
      if (days > 7) return ''
      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      return 'Just now'
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
    viewTicket(id) {
      this.$router.push(`/admin/tickets/${id}`)
    }
  }
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  opacity: 0.9;
}

.tickets-table :deep(.v-table__wrapper) {
  border-radius: 0;
}

.tickets-table :deep(thead) {
  background-color: rgba(var(--v-theme-surface), 0.04);
}

.tickets-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>