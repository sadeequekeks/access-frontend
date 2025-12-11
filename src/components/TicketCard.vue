<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title>
      <div class="d-flex justify-space-between align-center flex-wrap">
        <span class="text-h6">{{ ticket.ticket_number }}</span>
        <StatusChip :status="ticket.status" />
      </div>
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
          <v-list-item-title>Created</v-list-item-title>
          <v-list-item-subtitle>{{ formatDate(ticket.created_at) }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="ticket.resolution_time">
          <v-list-item-title>Resolution Time</v-list-item-title>
          <v-list-item-subtitle>{{ formatDuration(ticket.resolution_time) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('view')">View Details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import StatusChip from './StatusChip.vue'

export default {
  name: 'TicketCard',
  components: {
    StatusChip
  },
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  methods: {
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
    }
  }
}
</script>
