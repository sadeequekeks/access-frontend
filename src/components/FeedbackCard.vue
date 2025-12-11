<template>
  <v-card class="mb-3" variant="outlined">
    <v-card-text>
      <div class="d-flex justify-space-between align-start mb-2">
        <div>
          <div class="text-subtitle-2 font-weight-bold">
            {{ feedback.support_email || 'IT Support' }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ formatDate(feedback.created_at) }}
          </div>
        </div>
      </div>
      <div class="text-body-1">
        {{ feedback.message }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FeedbackCard',
  props: {
    feedback: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
</script>
