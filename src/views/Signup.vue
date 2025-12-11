<template>
  <v-container class="fill-height gradient-bg">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="5" xl="4">
        <v-card class="signup-card elevation-24" rounded="xl">
          <!-- Header Section -->
          <div class="card-header pa-8 pb-6">
            <div class="text-center mb-2">
              <v-avatar size="64" color="primary" class="mb-4">
                <v-icon size="40" color="white">mdi-account-plus</v-icon>
              </v-avatar>
            </div>
            <h1 class="text-h4 font-weight-bold text-center mb-2">Create Account</h1>
            <p class="text-body-2 text-medium-emphasis text-center">
              Join us today and start your journey
            </p>
          </div>

          <!-- Form Section -->
          <v-card-text class="px-8 pb-8">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSignup">
              <v-text-field
                v-model="email"
                label="Email Address"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                required
                autocomplete="email"
                variant="outlined"
                color="primary"
                class="mb-2"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRules"
                required
                autocomplete="new-password"
                variant="outlined"
                color="primary"
                class="mb-2"
                density="comfortable"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="confirmPasswordRules"
                required
                autocomplete="new-password"
                variant="outlined"
                color="primary"
                class="mb-4"
                density="comfortable"
              ></v-text-field>

              <!-- Password Strength Indicator -->
              <div v-if="password" class="mb-4">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-caption text-medium-emphasis">Password Strength</span>
                  <span class="text-caption font-weight-medium" :style="{ color: strengthColor }">
                    {{ strengthText }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="passwordStrength"
                  :color="strengthColor"
                  height="6"
                  rounded
                ></v-progress-linear>
              </div>

              <v-btn
                block
                size="large"
                color="primary"
                :loading="loading"
                :disabled="!valid || loading"
                @click="handleSignup"
                class="text-none font-weight-medium"
                rounded="lg"
                elevation="0"
              >
                <v-icon left class="mr-2">mdi-account-plus</v-icon>
                Create Account
              </v-btn>
            </v-form>

            <!-- Divider -->
            <div class="d-flex align-center my-6">
              <v-divider></v-divider>
              <span class="px-4 text-caption text-medium-emphasis">OR</span>
              <v-divider></v-divider>
            </div>

            <!-- Social Login Buttons -->
            <div class="d-flex flex-column gap-3">
              <v-btn
                block
                variant="outlined"
                size="large"
                class="text-none"
                rounded="lg"
              >
                <v-icon left class="mr-2">mdi-google</v-icon>
                Continue with Google
              </v-btn>
            </div>

            <!-- Login Link -->
            <div class="text-center mt-6">
              <span class="text-body-2 text-medium-emphasis">
                Already have an account?
              </span>
              <router-link 
                to="/login" 
                class="text-primary font-weight-medium text-decoration-none ml-1"
              >
                Sign In
              </router-link>
            </div>
          </v-card-text>
        </v-card>

        <!-- Snackbar -->
        <v-snackbar
          v-model="errorSnackbar"
          color="error"
          timeout="5000"
          location="top"
          rounded="pill"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-alert-circle</v-icon>
            {{ errorMessage }}
          </div>
          <template v-slot:actions>
            <v-btn
              variant="text"
              @click="errorSnackbar = false"
              icon="mdi-close"
              size="small"
            ></v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Signup',
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errorSnackbar: false,
      errorMessage: '',
      showPassword: false,
      showConfirmPassword: false,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters',
        v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
        v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
        v => /[0-9]/.test(v) || 'Password must contain at least one number'
      ],
      confirmPasswordRules: [
        v => !!v || 'Please confirm your password',
        v => v === this.password || 'Passwords do not match'
      ]
    }
  },
  computed: {
    passwordStrength() {
      if (!this.password) return 0
      let strength = 0
      if (this.password.length >= 6) strength += 25
      if (this.password.length >= 10) strength += 25
      if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password)) strength += 25
      if (/[0-9]/.test(this.password)) strength += 12.5
      if (/[^A-Za-z0-9]/.test(this.password)) strength += 12.5
      return strength
    },
    strengthColor() {
      if (this.passwordStrength < 40) return 'error'
      if (this.passwordStrength < 70) return 'warning'
      return 'success'
    },
    strengthText() {
      if (this.passwordStrength < 40) return 'Weak'
      if (this.passwordStrength < 70) return 'Medium'
      return 'Strong'
    }
  },
  methods: {
    ...mapActions('auth', ['signup']),
    async handleSignup() {
      if (!this.$refs.form.validate()) {
        return
      }
      
      this.loading = true
      try {
        await this.signup({
          email: this.email,
          password: this.password,
          role: 'user'
        })
        // Check user role and redirect accordingly
        const isITSupport = this.$store.getters['auth/isITSupport']
        const redirectPath = isITSupport ? '/admin/dashboard' : '/dashboard'
        this.$router.push(redirectPath)
      } catch (error) {
        const errors = error.response?.data?.errors
        if (errors && Array.isArray(errors)) {
          this.errorMessage = errors.map(e => e.msg).join(', ')
        } else {
          this.errorMessage = error.response?.data?.error || 'Sign up failed. Please try again.'
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
.fill-height {
  min-height: 100vh;
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.gradient-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.signup-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.card-header {
  position: relative;
}

.gap-3 {
  gap: 12px;
}

/* Smooth transitions */
.v-btn,
.v-text-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn:hover {
  transform: translateY(-2px);
}
</style>