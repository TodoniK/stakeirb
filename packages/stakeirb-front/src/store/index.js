import { createStore } from 'vuex'

export const store = createStore({
  state: {
    loggedIn: localStorage.getItem('accessToken') ? true : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  },
  mutations: {
    login(state, user) {
      state.loggedIn = true
      state.user = user
    },
    logout(state) {
      state.loggedIn = false
      state.user = {}
    },
    updateBalance(state, data) {
      state.user.balance = data.balance
      state.user.rank_pts = data.rank_pts
    }
  },
  actions: {
    login: ({ commit }, user) => {
      user.balance = parseFloat(user.balance).toFixed(0)
      localStorage.setItem('user', JSON.stringify(user))
      commit('login', user)
    },
    logout: ({ commit }) => {
      localStorage.removeItem('user')
      commit('logout')
    },
    updateBalance: ({ commit }, data) => {
      const user = JSON.parse(localStorage.getItem('user'))
      const newUser = { ...user, balance: data.balance, rank_pts: data.rank_pts }
      localStorage.setItem('user', JSON.stringify(newUser))
      commit('updateBalance', { balance: data.balance, rank_pts: data.rank_pts })
    }
  },
  getters: {
    loggedIn: (state) => state.loggedIn,
    user: (state) => state.user
  }
})
