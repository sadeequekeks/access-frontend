<template>
  <v-container class="fill-height login-container">
    <v-row align="center" justify="center" class="full-width">
      <!-- Left Panel - Branding -->
      <v-col cols="12" md="6" class="d-none d-md-flex branding-panel">
        <div class="branding-content">
          <div class="logo-container">
            <v-icon size="48" color="white">mdi-shield-check</v-icon>
          </div>
          <h1 class="brand-title">Secure Banking</h1>
          <p class="brand-subtitle">Trust. Security. Excellence.</p>
          <div class="features-list">
            <div class="feature-item">
              <v-icon size="20" color="white">mdi-lock-check</v-icon>
              <span>Bank-level encryption</span>
            </div>
            <div class="feature-item">
              <v-icon size="20" color="white">mdi-clock-check</v-icon>
              <span>24/7 Account access</span>
            </div>
            <div class="feature-item">
              <v-icon size="20" color="white">mdi-shield-account</v-icon>
              <span>Multi-factor authentication</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Panel - Login Form -->
      <v-col cols="12" md="6" class="form-panel">
        <v-card class="login-card" elevation="0">
          <v-card-text class="pa-8 pa-sm-12">
            <!-- Mobile Logo -->
            <div class="mobile-logo d-md-none text-center mb-6">
              <v-icon size="40" color="primary">mdi-shield-check</v-icon>
              <h2 class="text-h5 mt-2 font-weight-bold">Secure Banking</h2>
            </div>

            <div class="form-header mb-8">
              <h2 class="text-h4 font-weight-bold mb-2">Welcome Back</h2>
              <p class="text-body-1 text-medium-emphasis">
                Sign in to access your account
              </p>
            </div>

            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <div class="mb-4">
                <label class="form-label">Email Address</label>
                <v-text-field
                  v-model="email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Enter your email"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                  required
                  autocomplete="email"
                  hide-details="auto"
                  class="professional-input"
                ></v-text-field>
              </div>

              <div class="mb-2">
                <label class="form-label">Password</label>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Enter your password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  required
                  autocomplete="current-password"
                  hide-details="auto"
                  class="professional-input"
                ></v-text-field>
              </div>

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  density="compact"
                  hide-details
                  color="primary"
                ></v-checkbox>
                <a href="#" class="text-primary text-decoration-none text-body-2 font-weight-medium">
                  Forgot password?
                </a>
              </div>

              <v-btn
                color="primary"
                size="x-large"
                block
                :loading="loading"
                :disabled="!valid || loading"
                @click="handleLogin"
                class="login-btn text-none font-weight-bold mb-6"
                elevation="0"
              >
                Sign In Securely
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>

              <div class="text-center">
                <p class="text-body-2 text-medium-emphasis mb-2">
                  Don't have an account?
                  <router-link to="/signup" class="text-primary text-decoration-none font-weight-bold">
                    Open Account
                  </router-link>
                </p>
              </div>
            </v-form>

            <!-- Security Badge -->
            <div class="security-badge mt-8 text-center">
              <v-icon size="16" color="success" class="mr-1">mdi-shield-check</v-icon>
              <span class="text-caption text-medium-emphasis">
                Protected by 256-bit SSL encryption
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      location="top"
      timeout="10000"
    >
      <div>
        <div class="font-weight-bold mb-1">Login Failed</div>
        <div>{{ errorMessage }}</div>
        <div class="text-caption mt-2">Check browser console (F12) for details</div>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="errorSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      loading: false,
      errorSnackbar: false,
      errorMessage: '',
      showPassword: false,
      rememberMe: false,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Please enter a valid email address'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters'
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      if (!this.$refs.form.validate()) {
        return
      }
      
      this.loading = true
      this.errorMessage = '' // Clear previous errors
      this.errorSnackbar = false
      try {
        const response = await this.login({
          email: this.email,
          password: this.password
        })
        console.log('Login successful:', response)
        // Check user role and redirect accordingly
        const isITSupport = this.$store.getters['auth/isITSupport']
        const redirectPath = isITSupport ? '/admin/dashboard' : '/dashboard'
        this.$router.push(redirectPath)
      } catch (error) {
        console.error('Login error:', error)
        console.error('Error response:', error.response)
        console.error('Error data:', error.response?.data)
        
        // Handle different error response structures
        let errorMsg = 'Login failed. Please check your credentials and try again.'
        
        if (error.response?.data) {
          // Check for error message in different possible formats
          errorMsg = error.response.data.error || 
                    error.response.data.message || 
                    error.response.data.msg ||
                    (Array.isArray(error.response.data.errors) 
                      ? error.response.data.errors.map(e => e.msg || e.message).join(', ')
                      : errorMsg)
        } else if (error.message) {
          errorMsg = error.message
        }
        
        this.errorMessage = errorMsg
        this.errorSnackbar = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 0;
}

.full-width {
  width: 100%;
  margin: 0;
}

/* Branding Panel */
.branding-panel {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.branding-panel::before {
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
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    opacity: 0.5;
  }
}

.branding-content {
  z-index: 1;
  color: white;
  max-width: 450px;
  padding: 2rem;
}

.logo-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  font-weight: 300;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  opacity: 0.95;
}

/* Form Panel */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.form-header h2 {
  color: #1a1a1a;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.professional-input {
  font-size: 0.9375rem;
}

.login-btn {
  height: 52px !important;
  letter-spacing: 0.5px;
  text-transform: none;
  font-size: 1rem;
}

.security-badge {
  padding: 0.75rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #d1fae5;
}

.mobile-logo {
  color: #1e3c72;
}

/* Responsive */
@media (max-width: 960px) {
  .form-panel {
    min-height: auto;
    padding: 1rem;
  }
  
  .login-card {
    box-shadow: none;
  }
  
  .login-container {
    background: white;
  }
}
</style>