<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          color="primary"
          class="mb-4"
          @click="$router.back()"
        >
          Back
        </v-btn>
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Create Access Request</h1>
          <p class="text-body-2 text-medium-emphasis">
            Submit a new support ticket and our IT team will respond shortly
          </p>
        </div>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" lg="8" xl="6">
        <v-card elevation="0" border>
          <v-card-text class="pa-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <!-- Progress Indicator -->
              <div class="mb-8">
                <v-stepper
                  v-model="currentStep"
                  flat
                  hide-actions
                  class="elevation-0"
                >
                  <v-stepper-header>
                    <v-stepper-item
                      :value="1"
                      :complete="currentStep > 1"
                      title="Request Type"
                      icon="mdi-format-list-bulleted"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                      :value="2"
                      :complete="currentStep > 2"
                      title="Details"
                      icon="mdi-text-box-outline"
                    ></v-stepper-item>
                    <v-divider></v-divider>
                    <v-stepper-item
                      :value="3"
                      title="Review"
                      icon="mdi-check-circle-outline"
                    ></v-stepper-item>
                  </v-stepper-header>
                </v-stepper>
              </div>

              <!-- Step 1: Request Type -->
              <div v-show="currentStep === 1" class="step-content">
                <div class="mb-6">
                  <h3 class="text-h6 mb-2">Select Request Type</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Choose the type of access or support you need
                  </p>
                </div>

                <v-radio-group
                  v-model="form.request_type"
                  :rules="[v => !!v || 'Request type is required']"
                  class="request-type-group"
                >
                  <v-card
                    v-for="type in requestTypes"
                    :key="type.value"
                    :class="['request-type-card mb-3', { 'selected': form.request_type === type.value }]"
                    @click="form.request_type = type.value"
                    elevation="0"
                    border
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center">
                        <v-radio :value="type.value" class="mr-3"></v-radio>
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-1">
                            <v-icon :color="type.color" class="mr-2">{{ type.icon }}</v-icon>
                            <span class="text-body-1 font-weight-medium">{{ type.label }}</span>
                          </div>
                          <p class="text-caption text-medium-emphasis mb-0">
                            {{ type.description }}
                          </p>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-radio-group>
                
                <v-text-field
                  v-if="form.request_type === 'Other'"
                  v-model="form.custom_request_type"
                  label="Specify Request Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil"
                  :rules="[
                    v => form.request_type !== 'Other' || !!v || 'Custom request type is required'
                  ]"
                  class="mt-4"
                  required
                ></v-text-field>

                <div class="d-flex justify-end mt-6">
                  <v-btn
                    color="primary"
                    size="large"
                    :disabled="!form.request_type || (form.request_type === 'Other' && !form.custom_request_type)"
                    @click="currentStep = 2"
                  >
                    Next: Add Details
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- Step 2: Details -->
              <div v-show="currentStep === 2" class="step-content">
                <div class="mb-6">
                  <h3 class="text-h6 mb-2">Provide Request Details</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Help us understand your request better
                  </p>
                </div>

                <v-textarea
                  v-model="form.reason"
                  label="Reason for Request"
                  variant="outlined"
                  prepend-inner-icon="mdi-message-text-outline"
                  :rules="[
                    v => !!v || 'Reason is required',
                    v => (v && v.length >= 10) || 'Reason must be at least 10 characters'
                  ]"
                  counter
                  rows="3"
                  placeholder="Briefly explain why you need this access..."
                  required
                  class="mb-4"
                ></v-textarea>
                
                <v-textarea
                  v-model="form.description"
                  label="Detailed Description"
                  variant="outlined"
                  prepend-inner-icon="mdi-text-box-outline"
                  :rules="[
                    v => !!v || 'Description is required',
                    v => (v && v.length >= 20) || 'Description must be at least 20 characters'
                  ]"
                  counter
                  rows="5"
                  placeholder="Provide detailed information about your request..."
                  required
                  class="mb-4"
                ></v-textarea>
                
                <div class="mb-4">
                  <div class="text-body-2 font-weight-medium mb-3">
                    <v-icon size="small" class="mr-1">mdi-paperclip</v-icon>
                    Attachment (Optional)
                  </div>
                  <FileUpload
                    v-model="form.attachment"
                    label="Upload supporting documents"
                  />
                </div>

                <div class="d-flex justify-space-between mt-6">
                  <v-btn
                    variant="outlined"
                    size="large"
                    @click="currentStep = 1"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    size="large"
                    :disabled="!form.reason || form.reason.length < 10 || !form.description || form.description.length < 20"
                    @click="currentStep = 3"
                  >
                    Next: Review
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </div>

              <!-- Step 3: Review -->
              <div v-show="currentStep === 3" class="step-content">
                <div class="mb-6">
                  <h3 class="text-h6 mb-2">Review Your Request</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Please verify all information before submitting
                  </p>
                </div>

                <v-card elevation="0" color="surface-variant" class="mb-4">
                  <v-card-text class="pa-4">
                    <div class="review-item mb-4">
                      <div class="text-caption text-medium-emphasis mb-1">Request Type</div>
                      <div class="d-flex align-center">
                        <v-chip
                          :color="getRequestTypeColor(form.request_type)"
                          variant="tonal"
                        >
                          <v-icon start size="small">{{ getRequestTypeIcon(form.request_type) }}</v-icon>
                          {{ form.request_type === 'Other' ? form.custom_request_type : form.request_type }}
                        </v-chip>
                      </div>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div class="review-item mb-4">
                      <div class="text-caption text-medium-emphasis mb-1">Reason</div>
                      <p class="text-body-2 mb-0">{{ form.reason }}</p>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div class="review-item mb-4">
                      <div class="text-caption text-medium-emphasis mb-1">Description</div>
                      <p class="text-body-2 mb-0">{{ form.description }}</p>
                    </div>

                    <v-divider v-if="form.attachment" class="my-4"></v-divider>

                    <div v-if="form.attachment" class="review-item">
                      <div class="text-caption text-medium-emphasis mb-1">Attachment</div>
                      <v-chip variant="outlined" prepend-icon="mdi-file-document-outline">
                        {{ form.attachment.name }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>

                <v-alert
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mb-4"
                >
                  <div class="d-flex align-center">
                    <v-icon start>mdi-information-outline</v-icon>
                    <span class="text-body-2">You'll receive email notifications about your ticket status</span>
                  </div>
                </v-alert>

                <div class="d-flex justify-space-between mt-6">
                  <v-btn
                    variant="outlined"
                    size="large"
                    @click="currentStep = 2"
                    :disabled="loading"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    size="large"
                    :loading="loading"
                    :disabled="!valid || loading"
                    @click="handleSubmit"
                  >
                    <v-icon start>mdi-send</v-icon>
                    Submit Request
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Help Card -->
        <v-card elevation="0" border class="mt-4">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="info" size="32" class="mr-3">mdi-help-circle-outline</v-icon>
              <div>
                <div class="text-body-2 font-weight-medium mb-1">Need Help?</div>
                <p class="text-caption text-medium-emphasis mb-0">
                  Contact IT support at support@company.com or call ext. 1234
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Tips Sidebar -->
      <v-col cols="12" lg="4" xl="6" class="d-none d-lg-block">
        <div style="position: sticky; top: 24px;">
          <v-card elevation="0" border>
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-lightbulb-outline</v-icon>
                <span class="text-h6">Tips for Better Requests</span>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <v-list lines="two" density="compact">
                <v-list-item
                  v-for="(tip, index) in tips"
                  :key="index"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-avatar size="32" :color="tip.color" variant="tonal">
                      <v-icon size="small">{{ tip.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2 font-weight-medium mb-1">
                    {{ tip.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{ tip.description }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card elevation="0" border class="mt-4">
            <v-card-text class="pa-6">
              <div class="text-center">
                <v-icon size="48" color="primary" class="mb-3">mdi-clock-fast</v-icon>
                <div class="text-h6 mb-2">Quick Response</div>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Most requests are processed within 24-48 hours
                </p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      timeout="5000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon start>mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="successSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
    
    <!-- Error Snackbar -->
    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      timeout="5000"
      location="top"
    >
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
import { mapActions } from 'vuex'
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'CreateTicket',
  components: {
    FileUpload
  },
  data() {
    return {
      valid: false,
      loading: false,
      currentStep: 1,
      successSnackbar: false,
      successMessage: '',
      errorSnackbar: false,
      errorMessage: '',
      requestTypes: [
        {
          value: 'Application Database Access',
          label: 'Application Database Access',
          icon: 'mdi-database',
          color: 'purple',
          description: 'Request access to application databases and schemas'
        },
        {
          value: 'Password Recovery',
          label: 'Password Recovery',
          icon: 'mdi-lock-reset',
          color: 'orange',
          description: 'Reset or recover passwords for your accounts'
        },
        {
          value: 'System Permissions',
          label: 'System Permissions',
          icon: 'mdi-shield-account',
          color: 'blue',
          description: 'Request elevated permissions or access rights'
        },
        {
          value: 'API Access',
          label: 'API Access',
          icon: 'mdi-api',
          color: 'teal',
          description: 'Get API keys or integration access'
        },
        {
          value: 'Other',
          label: 'Other Request',
          icon: 'mdi-dots-horizontal',
          color: 'grey',
          description: 'Submit a different type of request'
        }
      ],
      tips: [
        {
          icon: 'mdi-text-long',
          color: 'blue',
          title: 'Be Specific',
          description: 'Provide clear details about what you need and why'
        },
        {
          icon: 'mdi-file-document',
          color: 'green',
          title: 'Include Context',
          description: 'Add relevant documents or screenshots if applicable'
        },
        {
          icon: 'mdi-format-list-checks',
          color: 'orange',
          title: 'List Requirements',
          description: 'Specify any particular requirements or constraints'
        },
        {
          icon: 'mdi-clock-outline',
          color: 'purple',
          title: 'Note Urgency',
          description: 'Mention if this is time-sensitive or urgent'
        }
      ],
      form: {
        request_type: '',
        custom_request_type: '',
        reason: '',
        description: '',
        attachment: null
      }
    }
  },
  methods: {
    ...mapActions('tickets', ['createTicket']),
    async handleSubmit() {
      if (!this.$refs.form.validate()) {
        return
      }
      
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('request_type', this.form.request_type)
        formData.append('reason', this.form.reason)
        formData.append('description', this.form.description)
        
        if (this.form.request_type === 'Other') {
          formData.append('custom_request_type', this.form.custom_request_type)
        }
        
        if (this.form.attachment) {
          formData.append('attachment', this.form.attachment)
        }
        
        const result = await this.createTicket(formData)
        this.successMessage = `Ticket ${result.ticket_number} created successfully!`
        this.successSnackbar = true
        
        setTimeout(() => {
          this.$router.push(`/tickets/${result.ticket.id}`)
        }, 1500)
      } catch (error) {
        const errors = error.response?.data?.errors
        if (errors && Array.isArray(errors)) {
          this.errorMessage = errors.map(e => e.msg).join(', ')
        } else {
          this.errorMessage = error.response?.data?.error || 'Failed to create ticket. Please try again.'
        }
        this.errorSnackbar = true
      } finally {
        this.loading = false
      }
    },
    getRequestTypeColor(type) {
      const typeObj = this.requestTypes.find(t => t.value === type)
      return typeObj?.color || 'grey'
    },
    getRequestTypeIcon(type) {
      const typeObj = this.requestTypes.find(t => t.value === type)
      return typeObj?.icon || 'mdi-help-circle'
    }
  }
}
</script>

<style scoped>
.request-type-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.request-type-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-2px);
}

.request-type-card.selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.request-type-group :deep(.v-radio) {
  pointer-events: none;
}

.step-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>