<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4 mb-2">Tickets I'm Mentioned In</h1>
            <p class="text-body-2 text-medium-emphasis">
              Tickets where you've been CC'd or mentioned
            </p>
          </div>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search tickets"
            single-line
            hide-details
            density="compact"
            variant="outlined"
            style="max-width: 300px;"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <p class="mt-4 text-body-2 text-medium-emphasis">Loading tickets...</p>
        </div>
        <div v-else-if="filteredTickets.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-outline</v-icon>
          <p class="text-h6 mb-2">No Tickets Found</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            You haven't been mentioned in any tickets yet.
          </p>
        </div>
        <div v-else>
          <!-- Pending Tickets -->
          <div v-if="pendingTickets.length > 0" class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="info" class="mr-2">mdi-clock-outline</v-icon>
              <h2 class="text-h6">Pending ({{ pendingTickets.length }})</h2>
            </div>
            <TicketCard
              v-for="ticket in pendingTickets"
              :key="ticket.id"
              :ticket="ticket"
              @view="viewTicket(ticket.id)"
            />
          </div>

          <!-- In Progress Tickets -->
          <div v-if="inProgressTickets.length > 0" class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="warning" class="mr-2">mdi-progress-clock</v-icon>
              <h2 class="text-h6">In Progress ({{ inProgressTickets.length }})</h2>
            </div>
            <TicketCard
              v-for="ticket in inProgressTickets"
              :key="ticket.id"
              :ticket="ticket"
              @view="viewTicket(ticket.id)"
            />
          </div>

          <!-- Resolved Tickets -->
          <div v-if="resolvedTickets.length > 0" class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
              <h2 class="text-h6">Resolved ({{ resolvedTickets.length }})</h2>
            </div>
            <TicketCard
              v-for="ticket in resolvedTickets"
              :key="ticket.id"
              :ticket="ticket"
              @view="viewTicket(ticket.id)"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TicketCard from '@/components/TicketCard.vue'
import ticketsAPI from '@/api/tickets'

export default {
  name: 'MentionedTickets',
  components: {
    TicketCard
  },
  data() {
    return {
      loading: false,
      search: '',
      mentionedTickets: []
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    filteredTickets() {
      let filtered = [...this.mentionedTickets]
      
      // Filter by search
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        filtered = filtered.filter(t =>
          t.ticket_number.toLowerCase().includes(searchLower) ||
          t.request_type?.toLowerCase().includes(searchLower) ||
          t.custom_request_type?.toLowerCase().includes(searchLower) ||
          t.reason?.toLowerCase().includes(searchLower)
        )
      }
      
      return filtered
    },
    pendingTickets() {
      return this.filteredTickets
        .filter(t => t.status === 'Pending')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    inProgressTickets() {
      return this.filteredTickets
        .filter(t => t.status === 'In Progress')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    resolvedTickets() {
      return this.filteredTickets
        .filter(t => t.status === 'Completed' || t.status === 'Resolved')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },
  async mounted() {
    await this.loadTickets()
  },
  methods: {
    ...mapActions('tickets', ['fetchMyTickets']),
    async loadTickets() {
      this.loading = true
      try {
        // Try to fetch from dedicated endpoint first
        try {
          const response = await ticketsAPI.getMentionedTickets()
          this.mentionedTickets = response.data.tickets || response.data || []
        } catch (apiError) {
          // Fallback: Fetch all tickets and filter by CC emails
          const allTickets = await this.fetchMyTickets()
          
          // Filter tickets where current user is in CC list
          if (this.user?.email) {
            this.mentionedTickets = allTickets.filter(ticket => {
              if (!ticket.cc_emails) return false
              const ccEmails = Array.isArray(ticket.cc_emails) 
                ? ticket.cc_emails 
                : JSON.parse(ticket.cc_emails || '[]')
              return ccEmails.includes(this.user.email)
            })
          } else {
            this.mentionedTickets = []
          }
        }
      } catch (error) {
        console.error('Failed to load mentioned tickets:', error)
        this.mentionedTickets = []
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
