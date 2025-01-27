import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: (to, from, next) => {
        // If already logged in, redirect to home
        if (store.getters.loggedIn) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
      component: () => import('../pages/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      beforeEnter: (to, from, next) => {
        // If already logged in, redirect to home
        if (store.getters.loggedIn) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
      component: () => import('../pages/RegisterView.vue')
    },
    {
      path: '/profile/:uuid_user',
      name: 'profile',
      component: () => import('../pages/ProfileView.vue')
    },
    {
      path: '/games/dice',
      name: 'dice',
      component: () => import('../pages/games/DiceView.vue')
    },
    {
      path: '/games/mines',
      name: 'mines',
      component: () => import('../pages/games/MinesView.vue')
    },
    {
      path: '/games/roulette',
      name: 'roulette',
      component: () => import('../pages/games/RouletteView.vue')
    },
    {
      path: '/games/plinko',
      name: 'plinko',
      component: () => import('../pages/games/PlinkoView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        // Clear local storage and store variables
        clearLocalStorageAndStoreVariables()

        // Navigate to home
        next({ name: 'home' })
      }
    }
  ]
})

function clearLocalStorageAndStoreVariables() {
  localStorage.clear()
  store.commit('logout')
}

export default router
