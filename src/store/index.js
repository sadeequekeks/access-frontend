import { createStore } from 'vuex'
import auth from './modules/auth'
import tickets from './modules/tickets'

export default createStore({
  modules: {
    auth,
    tickets
  }
})
