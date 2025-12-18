<template>
  <v-card class="mb-4" elevation="2">
    <!-- Prominent SLA Banner -->
    <v-alert
      :color="getSLAColor(slaElapsed)"
      variant="tonal"
      density="comfortable"
      class="mb-0"
      border="start"
      :border-color="getSLAColor(slaElapsed)"
    >
      <div class="d-flex align-center justify-space-between flex-wrap">
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-3">{{ getSLAIcon(slaElapsed) }}</v-icon>
          <div>
            <div class="text-caption text-medium-emphasis mb-1">SLA Elapsed</div>
            <div class="text-h5 font-weight-bold">{{ formatSLAElapsed(slaElapsed) }}</div>
          </div>
        </div>
        <v-chip
          :color="getSLAColor(slaElapsed)"
          size="large"
          class="ml-4"
        >
          <v-icon start>{{ getSLAStatusIcon(slaElapsed) }}</v-icon>
          {{ getSLAStatus(slaElapsed) }}
        </v-chip>
      </div>
    </v-alert>
    
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
  computed: {
    slaElapsed() {
      if (!this.ticket.created_at) return 0
      const created = new Date(this.ticket.created_at)
      const now = this.ticket.resolved_at ? new Date(this.ticket.resolved_at) : new Date()
      return Math.floor((now - created) / 1000) // Return in seconds
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
    },
    formatSLAElapsed(seconds) {
      if (!seconds) return '0m'
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (days > 0) {
        return `${days}d ${hours}h`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    },
    getSLAColor(seconds) {
      const hours = seconds / 3600
      if (hours < 24) return 'success'
      if (hours < 48) return 'warning'
      return 'error'
    },
    getSLAIcon(seconds) {
      const hours = seconds / 3600
      if (hours < 24) return 'mdi-check-circle'
      if (hours < 48) return 'mdi-clock-alert'
      return 'mdi-alert-circle'
    },
    getSLAStatusIcon(seconds) {
      const hours = seconds / 3600
      if (hours < 24) return 'mdi-check'
      if (hours < 48) return 'mdi-clock-outline'
      return 'mdi-alert'
    },
    getSLAStatus(seconds) {
      const hours = seconds / 3600
      if (hours < 24) return 'On Track'
      if (hours < 48) return 'Approaching Limit'
      return 'Overdue'
    }
  }
}
</script>
