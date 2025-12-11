<template>
  <v-chip :color="statusColor" variant="flat" size="small">
    {{ status }}
  </v-chip>
</template>

<script>
export default {
  name: 'StatusChip',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['Pending', 'In Progress', 'Completed'].includes(value)
    }
  },
  computed: {
    statusColor() {
      const colors = {
        'Pending': 'info',
        'In Progress': 'warning',
        'Completed': 'success'
      }
      return colors[this.status] || 'default'
    }
  }
}
</script>
