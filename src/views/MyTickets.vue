<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">My Tickets</h1>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex flex-wrap align-center">
            <v-tabs v-model="statusFilter" @update:model-value="loadTickets">
              <v-tab value="all">All</v-tab>
              <v-tab value="Pending">Pending</v-tab>
              <v-tab value="In Progress">In Progress</v-tab>
              <v-tab value="Completed">Completed</v-tab>
            </v-tabs>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              density="compact"
              class="mt-4"
              style="max-width: 300px;"
            ></v-text-field>
          </v-card-title>
          
          <v-card-text>
            <div v-if="loading">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="filteredTickets.length === 0" class="text-center py-8">
              <p class="text-medium-emphasis">No tickets found.</p>
              <v-btn color="primary" class="mt-4" @click="$router.push('/tickets/create')">
                Create Your First Ticket
              </v-btn>
            </div>
            <div v-else>
              <TicketCard
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                :ticket="ticket"
                @view="viewTicket(ticket.id)"
              />
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
  name: 'MyTickets',
  components: {
    TicketCard
  },
  data() {
    return {
      loading: false,
      statusFilter: 'all',
      search: ''
    }
  },
  computed: {
    ...mapGetters('tickets', ['tickets']),
    filteredTickets() {
      let filtered = [...this.tickets]
      
      // Filter by status
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === this.statusFilter)
      }
      
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
      
      // Sort by date (newest first)
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
