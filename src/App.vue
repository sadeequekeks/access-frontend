<template>
  <v-app>
    <v-app-bar
      v-if="isAuthenticated"
      color="primary"
      dark
      prominent
    >
      <v-app-bar-title>Access Request Portal</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-chip v-if="user" color="white" variant="flat" class="mr-2">
        {{ user.email }}
      </v-chip>
      <v-chip v-if="user" color="white" variant="flat" class="mr-2">
        {{ (user.role === 'it_support' || user.role === 'admin') ? 'IT Support' : 'User' }}
      </v-chip>
      <v-btn
        v-if="isITSupport"
        variant="text"
        prepend-icon="mdi-view-dashboard"
        @click="$router.push('/admin/dashboard')"
      >
        Admin
      </v-btn>
      <v-btn
        variant="text"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Logout
      </v-btn>
    </v-app-bar>
    
    <v-navigation-drawer
      v-if="isAuthenticated && !isITSupport"
      permanent
      location="left"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          @click="$router.push('/dashboard')"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-ticket"
          title="My Tickets"
          value="tickets"
          @click="$router.push('/tickets')"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Create Ticket"
          value="create"
          @click="$router.push('/tickets/create')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user', 'isITSupport'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
