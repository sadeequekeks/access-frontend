<template>
  <v-chip :color="statusColor" variant="flat" size="small">
    {{ displayStatus }}
  </v-chip>
</template>

<script>
export default {
  name: 'StatusChip',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['Pending', 'In Progress', 'Completed', 'Resolved'].includes(value)
    }
  },
  computed: {
    statusColor() {
      const colors = {
        'Pending': 'info',
        'In Progress': 'warning',
        'Completed': 'success',
        'Resolved': 'success'
      }
      return colors[this.status] || 'default'
    },
    displayStatus() {
      // Display "Resolved" for both "Completed" and "Resolved" statuses
      return this.status === 'Completed' ? 'Resolved' : this.status
    }
  }
}
</script>
