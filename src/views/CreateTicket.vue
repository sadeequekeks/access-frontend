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
              <!-- Category & Request Type Dropdowns -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Request Type</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Select the category and type of request
                </p>

                <!-- Category Dropdown -->
                <v-select
                  v-model="form.category"
                  :items="requestTypeGroups"
                  item-title="group"
                  item-value="group"
                  label="Select Category"
                  variant="outlined"
                  prepend-inner-icon="mdi-folder-outline"
                  :rules="[v => !!v || 'Category is required']"
                  required
                  class="mb-4"
                ></v-select>

                <!-- Request Type Dropdown (filtered by category) -->
                <v-select
                  v-model="form.request_type"
                  :items="filteredRequestTypes"
                  item-title="title"
                  item-value="value"
                  label="Select Request Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-format-list-bulleted"
                  :rules="[v => !!v || 'Request type is required']"
                  :disabled="!form.category"
                  required
                  class="mb-4"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :key="item.raw.value">
                      <template v-slot:prepend>
                        <v-icon :color="item.raw.color" class="mr-3">{{ item.raw.icon }}</v-icon>
                      </template>
                      <v-list-item-subtitle v-if="item.raw.description" class="text-caption">
                        {{ item.raw.description }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
                
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
                      This request will be routed to <strong>{{ form.category }}</strong>
                      <span v-if="selectedRequestType.email" class="ml-2 text-caption">
                        ({{ selectedRequestType.email }})
                      </span>
                    </span>
                  </div>
                </v-alert>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Subject Field -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Subject</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Enter a brief subject for your request
                </p>

                <v-text-field
                  v-model="form.subject"
                  variant="outlined"
                  prepend-inner-icon="mdi-format-title"
                  :rules="[v => !!v || 'Subject is required']"
                  placeholder="Enter subject..."
                  hint="Provide a clear and concise subject for your request"
                  persistent-hint
                  required
                  class="mb-4"
                ></v-text-field>
              </div>

              <v-divider class="my-6"></v-divider>

              <!-- Request Details Section -->
              <div class="mb-6">
                <h3 class="text-h6 mb-2">Request Details</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Provide detailed information about your request
                </p>

                <v-textarea
                  v-model="form.description"
                  variant="outlined"
                  prepend-inner-icon="mdi-text-box-outline"
                  :rules="[
                    v => !!v || 'Request details are required',
                    v => (v && v.length <= 500) || 'Request details must be 500 characters or less'
                  ]"
                  counter
                  maxlength="500"
                  rows="5"
                  placeholder="Provide detailed information about your request..."
                  hint="Include all relevant details, requirements, and context for your request (maximum 500 characters)"
                  persistent-hint
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
                  label="CC Recipients"
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
                <p class="text-body-1 mb-0">
                  <strong class="font-weight-bold" style="font-size: 1.1em;">Most requests are processed within 24-48 hours</strong>
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
          group: 'Digital Banking',
          types: [
            {
              value: 'Performance issues',
              title: 'Performance Issues',
              icon: 'mdi-speedometer',
              color: 'indigo',
              description: 'Report performance issues with digital banking applications',
              email: 'digitalbankingsupport@summitbankng.com'
            },
            {
              value: 'POS Application Issues',
              title: 'POS Application Issues',
              icon: 'mdi-credit-card-scan',
              color: 'indigo',
              description: 'Issues with POS application functionality',
              email: 'possupport@summitbankng.com'
            },
            {
              value: 'POS Hardware Issues',
              title: 'POS Hardware Issues',
              icon: 'mdi-devices',
              color: 'indigo',
              description: 'Hardware problems with POS devices',
              email: 'possupport@summitbankng.com'
            },
            {
              value: 'Unable to Access Application/Unlock Account',
              title: 'Account Access/Unlock',
              icon: 'mdi-account-lock',
              color: 'indigo',
              description: 'Unable to access application or unlock account',
              email: 'digitalbankingsupport@summitbankng.com'
            },
            {
              value: 'Request for Instant Card Stock',
              title: 'Instant Card Stock',
              icon: 'mdi-card-account-details',
              color: 'pink',
              description: 'Request for instant card stock',
              email: 'cardservices@summitbankng.com'
            },
            {
              value: 'Request for Personalized Cards',
              title: 'Personalized Cards',
              icon: 'mdi-card-text',
              color: 'pink',
              description: 'Request for personalized cards',
              email: 'cardservices@summitbankng.com'
            },
            {
              value: 'User Account Creation/Deletion',
              title: 'User Account Management',
              icon: 'mdi-account-cog',
              color: 'indigo',
              description: 'User account creation or deletion requests',
              email: 'digitalbankingsupport@summitbankng.com'
            },
            {
              value: 'POS Merchant/Agent request Abuja & Lagos',
              title: 'POS Merchant/Agent (Abuja & Lagos)',
              icon: 'mdi-store',
              color: 'indigo',
              description: 'POS merchant or agent requests for Abuja and Lagos',
              email: 'possupport@summitbankng.com'
            },
            {
              value: 'POS Merchant/Agent request Kano & Kaduna',
              title: 'POS Merchant/Agent (Kano & Kaduna)',
              icon: 'mdi-store',
              color: 'indigo',
              description: 'POS merchant or agent requests for Kano and Kaduna',
              email: 'PosBusinessKano.Kaduna@summitbankng.com'
            },
            {
              value: 'Mobile & Internet Banking Support (Limit, Profiling, Reset, Deactivation)',
              title: 'Mobile & Internet Banking Support',
              icon: 'mdi-cellphone-cog',
              color: 'indigo',
              description: 'Limit, profiling, reset, or deactivation requests',
              email: 'digitalchannels@summitbankng.com'
            },
            {
              value: 'Corporate Communications',
              title: 'Corporate Communications',
              icon: 'mdi-bullhorn',
              color: 'indigo',
              description: 'Corporate communications requests',
              email: 'corporatecommunications@summitbankng.com'
            }
          ]
        },
        {
          group: 'Data Analytics Engineering',
          types: [
            {
              value: 'Report Configuration Request',
              title: 'Report Configuration',
              icon: 'mdi-chart-box',
              color: 'cyan',
              description: 'Request for report configuration',
              email: 'dataanalytics@summitbankng.com'
            },
            {
              value: 'Dashboard Request',
              title: 'Dashboard Request',
              icon: 'mdi-view-dashboard',
              color: 'cyan',
              description: 'Request for dashboard creation or modification',
              email: 'dataanalytics@summitbankng.com'
            }
          ]
        },
        {
          group: 'IT Administration',
          types: [
            {
              value: 'Core Banking Support',
              title: 'Core Banking Support',
              icon: 'mdi-bank',
              color: 'purple',
              description: 'Core banking system support requests',
              email: 'techsupport@summitbankng.com'
            },
            {
              value: 'Software Engineering',
              title: 'Software Engineering',
              icon: 'mdi-code-braces',
              color: 'blue',
              description: 'Software engineering and development support',
              email: 'softwaresupport@summitbankng.com'
            }
          ]
        },
        {
          group: 'ATM Support',
          types: [
            {
              value: 'Configuration/Support/Requests',
              title: 'ATM Configuration/Support',
              icon: 'mdi-cash-multiple',
              color: 'green',
              description: 'ATM configuration, support, or requests',
              email: 'atmsupport@summitbankng.com'
            }
          ]
        },
        {
          group: 'Operations',
          types: [
            {
              value: 'Settlement Issues (Pending Settlement/ Request for report)',
              title: 'Settlement Issues',
              icon: 'mdi-cash-register',
              color: 'orange',
              description: 'Pending settlement or request for settlement reports',
              email: 'settlementoperations@summitbankng.com'
            },
            {
              value: 'Account Opening',
              title: 'Account Opening',
              icon: 'mdi-account-plus',
              color: 'teal',
              description: 'Account opening requests',
              email: 'customerexperience@summitbankng.com'
            },
            {
              value: 'Customer Information Update',
              title: 'Customer Information Update',
              icon: 'mdi-account-edit',
              color: 'teal',
              description: 'Update customer information',
              email: 'customerexperience@summitbankng.com'
            },
            {
              value: 'Customer Requests',
              title: 'Customer Requests',
              icon: 'mdi-account-question',
              color: 'teal',
              description: 'General customer service requests',
              email: 'customerexperience@summitbankng.com'
            }
          ]
        },
        {
          group: 'IT Security',
          types: [
            {
              value: 'IT Security Request',
              title: 'IT Security Request',
              icon: 'mdi-shield-lock',
              color: 'red',
              description: 'IT security and assurance requests',
              email: 'TechnologyAssurance@summitbankng.com'
            }
          ]
        },
        {
          group: 'Internal Control',
          types: [
            {
              value: 'Internal Control Request',
              title: 'Internal Control Request',
              icon: 'mdi-shield-check',
              color: 'amber',
              description: 'Internal audit and control requests',
              email: 'internal.audit.and.control@summitbankng.com'
            }
          ]
        },
        {
          group: 'HR & Admin',
          types: [
            {
              value: 'HR & Admin Request',
              title: 'HR & Admin Request',
              icon: 'mdi-account-group',
              color: 'purple',
              description: 'Human resources and administration requests',
              email: 'hr@summitbankng.com'
            }
          ]
        },
        {
          group: 'Marketing & Business Development',
          types: [
            {
              value: 'Jahi',
              title: 'Jahi',
              icon: 'mdi-map-marker',
              color: 'green',
              description: 'Business development requests for Jahi',
              email: 'BDTJAHI@summitbankng.com'
            },
            {
              value: 'Wuse',
              title: 'Wuse',
              icon: 'mdi-map-marker',
              color: 'green',
              description: 'Business development requests for Wuse',
              email: 'BDTWUSE@summitbankng.com'
            },
            {
              value: 'France Road',
              title: 'France Road',
              icon: 'mdi-map-marker',
              color: 'green',
              description: 'Business development requests for France Road',
              email: 'businessdevelopmentfr@summitbankng.com'
            },
            {
              value: 'Lagos',
              title: 'Lagos',
              icon: 'mdi-map-marker',
              color: 'green',
              description: 'Business development requests for Lagos',
              email: 'lagosliaisonbusdev@summitbankng.com'
            }
          ]
        },
        {
          group: 'Financial Control',
          types: [
            {
              value: 'Payment Request (Retirement/Cash Advance)',
              title: 'Payment Request',
              icon: 'mdi-cash',
              color: 'green',
              description: 'Retirement or cash advance payment requests',
              email: 'financialcontrol@summitbankng.com'
            },
            {
              value: 'Vendor Payment etc',
              title: 'Vendor Payment',
              icon: 'mdi-currency-usd',
              color: 'green',
              description: 'Vendor payment and related requests',
              email: 'financialcontrol@summitbankng.com'
            }
          ]
        },
        {
          group: 'Treasury',
          types: [
            {
              value: 'Treasury Request',
              title: 'Treasury Request',
              icon: 'mdi-treasury',
              color: 'blue',
              description: 'Treasury operations and requests',
              email: 'treasury@summitbankng.com'
            }
          ]
        },
        {
          group: 'Compliance',
          types: [
            {
              value: 'Regulatory request and Returns',
              title: 'Regulatory Request and Returns',
              icon: 'mdi-file-document-check',
              color: 'amber',
              description: 'Regulatory requests and returns',
              email: 'compliance@summitbankng.com'
            }
          ]
        },
        {
          group: 'Legal',
          types: [
            {
              value: 'Document Reviews',
              title: 'Document Reviews',
              icon: 'mdi-file-document-edit',
              color: 'blue',
              description: 'Legal document review requests',
              email: 'legalservices@summitbankng.com'
            },
            {
              value: 'Company Secretary Signing',
              title: 'Company Secretary Signing',
              icon: 'mdi-signature',
              color: 'blue',
              description: 'Company secretary signing requests',
              email: 'legalservices@summitbankng.com'
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
        category: '',
        request_type: '',
        subject: '',
        description: '',
        attachment: null,
        cc_emails: []
      }
    }
  },
  computed: {
    filteredRequestTypes() {
      if (!this.form.category) return []
      const categoryGroup = this.requestTypeGroups.find(g => g.group === this.form.category)
      return categoryGroup ? categoryGroup.types : []
    },
    selectedRequestType() {
      if (!this.form.request_type) return null
      const allTypes = []
      this.requestTypeGroups.forEach(group => {
        allTypes.push(...group.types)
      })
      return allTypes.find(item => item.value === this.form.request_type)
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

      // Validate CC emails
      if (this.form.cc_emails && this.form.cc_emails.length > 0) {
        const invalidEmails = this.form.cc_emails.filter(email => !this.validateEmail(email))
        if (invalidEmails.length > 0) {
          this.errorMessage = `Invalid email addresses: ${invalidEmails.join(', ')}`
          this.errorSnackbar = true
          return
        }
      }

      // Validate attachment size (max 5MB)
      if (this.form.attachment && this.form.attachment.size > 5242880) {
        this.errorMessage = 'Attachment must be smaller than 5 MB'
        this.errorSnackbar = true
        return
      }

      // Validate description length (max 500 chars)
      if (this.form.description && this.form.description.length > 500) {
        this.errorMessage = 'Description must be 500 characters or less'
        this.errorSnackbar = true
        return
      }
      
      this.loading = true
      try {
        const formData = new FormData()
        
        // Send the exact request_type value as specified in the API
        formData.append('request_type', this.form.request_type)
        formData.append('subject', this.form.subject)
        formData.append('description', this.form.description)
        
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
