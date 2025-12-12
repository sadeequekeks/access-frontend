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
              <!-- Request Type Dropdown -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Request Type</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Select the category and type of request
                </p>
                <v-select
                  v-model="form.request_type"
                  :items="requestTypeItems"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  label="Select Request Type"
                  prepend-inner-icon="mdi-format-list-bulleted"
                  :rules="[v => !!v || 'Request type is required']"
                  required
                  class="mb-4"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :color="item.raw.color" class="mr-3">{{ item.raw.icon }}</v-icon>
                      </template>
                      <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                      <v-list-item-subtitle v-if="item.raw.group" class="text-caption">
                        {{ item.raw.group }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
                
                <v-text-field
                  v-if="form.request_type === 'Other'"
                  v-model="form.custom_request_type"
                  label="Specify Custom Request Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil"
                  :rules="[
                    v => form.request_type !== 'Other' || !!v || 'Custom request type is required'
                  ]"
                  required
                  hint="Enter the specific type of request"
                  persistent-hint
                ></v-text-field>

                <v-alert
                  v-if="selectedRequestType"
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mt-4"
                >
                  <div class="d-flex align-center">
                    <v-icon start size="small">mdi-information-outline</v-icon>
                    <span class="text-body-2">
                      This request will be routed to <strong>{{ selectedRequestType.group }}</strong>
                    </span>
                  </div>
                </v-alert>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Request Details Section -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Request Details</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Provide detailed information about your request
                </p>

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
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Additional Options -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Additional Information</h3>
                
                <!-- CC Field -->
                <v-combobox
                  v-model="form.cc_emails"
                  :items="[]"
                  label="CC (Mention Others)"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-plus-outline"
                  multiple
                  chips
                  closable-chips
                  hint="Add email addresses of people who should be notified about this ticket"
                  persistent-hint
                  class="mb-4"
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :prepend-icon="validateEmail(item.raw) ? 'mdi-email' : 'mdi-alert'"
                      :color="validateEmail(item.raw) ? 'primary' : 'error'"
                    >
                      {{ item.raw }}
                    </v-chip>
                  </template>
                </v-combobox>

                <!-- Attachment -->
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
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Submit Button -->
              <div class="d-flex justify-end">
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
      successSnackbar: false,
      successMessage: '',
      errorSnackbar: false,
      errorMessage: '',
      requestTypeGroups: [
        {
          group: 'IT Administration',
          email: 'techsupport@summitbankng.com',
          types: [
            {
              value: 'Application Database Access',
              title: 'Application Database Access',
              icon: 'mdi-database',
              color: 'purple',
              description: 'Request access to application databases and schemas'
            },
            {
              value: 'System Permissions',
              title: 'System Permissions',
              icon: 'mdi-shield-account',
              color: 'blue',
              description: 'Request elevated permissions or access rights'
            },
            {
              value: 'API Access',
              title: 'API Access',
              icon: 'mdi-api',
              color: 'teal',
              description: 'Get API keys or integration access'
            }
          ]
        },
        {
          group: 'IT Support',
          email: 'techsupport@summitbankng.com',
          types: [
            {
              value: 'Password Recovery',
              title: 'Password Recovery',
              icon: 'mdi-lock-reset',
              color: 'orange',
              description: 'Reset or recover passwords for your accounts'
            }
          ]
        },
        {
          group: 'Digital Banking',
          email: 'digitalbankingsupport@summitbankng.com',
          types: [
            {
              value: 'Other',
              title: 'Digital Banking - Performance Issues',
              icon: 'mdi-speedometer',
              color: 'indigo',
              description: 'Report performance issues with digital banking applications',
              custom_value: 'Performance issues'
            },
            {
              value: 'Other',
              title: 'Digital Banking - POS Application Issues',
              icon: 'mdi-credit-card-scan',
              color: 'indigo',
              description: 'Issues with POS application functionality',
              custom_value: 'POS Application Issues'
            },
            {
              value: 'Other',
              title: 'Digital Banking - POS Hardware Issues',
              icon: 'mdi-devices',
              color: 'indigo',
              description: 'Hardware problems with POS devices',
              custom_value: 'POS Hardware Issues'
            },
            {
              value: 'Other',
              title: 'Digital Banking - Account Access/Unlock',
              icon: 'mdi-account-lock',
              color: 'indigo',
              description: 'Unable to access application or unlock account',
              custom_value: 'Unable to Access Application/Unlock Account'
            },
            {
              value: 'Other',
              title: 'Digital Banking - User Account Management',
              icon: 'mdi-account-cog',
              color: 'indigo',
              description: 'User account creation or deletion requests',
              custom_value: 'User Account Creation/Deletion'
            }
          ]
        },
        {
          group: 'Card Services',
          email: 'cardservices@summitbankng.com',
          types: [
            {
              value: 'Other',
              title: 'Card Services - Instant Card Stock',
              icon: 'mdi-card-account-details',
              color: 'pink',
              description: 'Request for instant card stock',
              custom_value: 'Request for Instant Card Stock'
            },
            {
              value: 'Other',
              title: 'Card Services - Personalized Cards',
              icon: 'mdi-card-text',
              color: 'pink',
              description: 'Request for personalized cards',
              custom_value: 'Request for Personalized Cards'
            }
          ]
        },
        {
          group: 'Data Analytics',
          email: 'dataanalytics@summitbankng.com',
          types: [
            {
              value: 'Other',
              title: 'Data Analytics - Report Configuration',
              icon: 'mdi-chart-box',
              color: 'cyan',
              description: 'Request for report configuration',
              custom_value: 'Report Configuration Request'
            },
            {
              value: 'Other',
              title: 'Data Analytics - Dashboard Request',
              icon: 'mdi-view-dashboard',
              color: 'cyan',
              description: 'Request for dashboard creation or modification',
              custom_value: 'Dashboard Request'
            }
          ]
        },
        {
          group: 'ATM Support',
          email: 'atmsupport@summitbankng.com',
          types: [
            {
              value: 'Other',
              title: 'ATM - Configuration/Support',
              icon: 'mdi-cash-multiple',
              color: 'green',
              description: 'ATM configuration, support, or requests',
              custom_value: 'Configuration/Support/Requests'
            }
          ]
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
        attachment: null,
        cc_emails: []
      }
    }
  },
  computed: {
    requestTypeItems() {
      const items = []
      this.requestTypeGroups.forEach(group => {
        group.types.forEach(type => {
          items.push({
            ...type,
            group: group.group,
            title: type.title
          })
        })
      })
      return items
    },
    selectedRequestType() {
      if (!this.form.request_type) return null
      const item = this.requestTypeItems.find(item => item.value === this.form.request_type)
      if (item && item.custom_value) {
        // For "Other" types with custom_value, set the custom_request_type
        this.form.custom_request_type = item.custom_value
      }
      return item
    }
  },
  methods: {
    ...mapActions('tickets', ['createTicket']),
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    async handleSubmit() {
      if (!this.$refs.form.validate()) {
        return
      }
      
      // Additional validation: ensure custom_request_type is provided when request_type is "Other"
      if (this.form.request_type === 'Other' && !this.form.custom_request_type?.trim()) {
        this.errorMessage = 'Custom request type is required when request type is "Other"'
        this.errorSnackbar = true
        return
      }

      // Validate CC emails
      if (this.form.cc_emails && this.form.cc_emails.length > 0) {
        const invalidEmails = this.form.cc_emails.filter(email => !this.validateEmail(email))
        if (invalidEmails.length > 0) {
          this.errorMessage = `Invalid email addresses: ${invalidEmails.join(', ')}`
          this.errorSnackbar = true
          return
        }
      }
      
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('request_type', this.form.request_type)
        formData.append('reason', this.form.reason)
        formData.append('description', this.form.description)
        
        if (this.form.request_type === 'Other') {
          formData.append('custom_request_type', this.form.custom_request_type.trim())
        }
        
        if (this.form.attachment) {
          formData.append('attachment', this.form.attachment)
        }

        // Add CC emails if provided
        if (this.form.cc_emails && this.form.cc_emails.length > 0) {
          formData.append('cc_emails', JSON.stringify(this.form.cc_emails))
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
    }
  }
}
</script>

<style scoped>
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
