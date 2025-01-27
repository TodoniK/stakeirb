<template>
  <header class="menu-container">
    <div class="grid wrapper nav-container">
      <div class="logo-container">
        <router-link to="/">
          <img
            src="../assets/images/logos/logo-stakeirb-light.png"
            alt="Stak'Eirb logo"
            class="logo"
          />
        </router-link>
      </div>

      <div class="balance-container">
        <div class="balance-inner">
          <span v-if="isLoggedIn" class="balance-amount">{{ formattedUserBalance }}</span>
          <span v-else class="balance-amount">0</span>
          <CoinIcon />
        </div>
        <button class="button success deposit-btn" @click="updateMoneyAmount(user)">+</button>
      </div>

      <div v-if="isLoggedIn" class="right-menu">
        <router-link :to="userRoute" class="profile-link">
          <div class="username-container">
            <img
              :src="user.pfp_url ? user.pfp_url : '../assets/images/users/default-user-img.svg'"
              alt="User profile picture"
              class="user-img"
            />
            {{ user.username }}
          </div>
        </router-link>
        <router-link to="/logout">
          <InputButton :value="'Logout'" :type="'danger'" :disabled="false" />
        </router-link>
        <div @click="toggleChat">
          <img src="../assets/images/icons/message.svg" alt="Message" class="msg-icon" />
        </div>
      </div>

      <div v-else class="right-menu">
        <router-link to="/login" class="login-text">
          <span>Login</span>
        </router-link>
        <router-link to="/register">
          <InputButton :value="'Register'" :type="'success'" :disabled="false" />
        </router-link>
        <div @click="toggleChat">
          <img src="../assets/images/icons/message.svg" alt="Message" class="msg-icon" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import InputButton from './inputs/InputButton.vue'
import CoinIcon from './CoinIcon.vue'
import { store } from '@/store'
import { updateMoneyAmount } from '@/api/stakeirb-api'

const isLoggedIn = computed(() => store.getters.loggedIn)
const user = computed(() => store.getters.user)
const userRoute = computed(() => '/profile/' + store.getters.user.uuid_user)

const emit = defineEmits(['toggleChat'])

const toggleChat = () => {
  emit('toggleChat')
}

const formattedUserBalance = computed(() => {
  if (isLoggedIn.value) {
    const balance = parseInt(user.value.balance)
    return balance.toLocaleString('en-US')
  } else {
    return '0'
  }
})
</script>

<style scoped>
.menu-container {
  background-color: var(--grey-600);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  position: sticky;
  top: 0;
  width: 100%;
}

.grid {
  display: grid;
  gap: 2rem;
}

.wrapper {
  max-width: var(--max-width);
  margin: 0 auto;
}

.nav-container {
  grid-template-columns: 1fr auto 1fr;
  padding: 0.7rem 3rem;
  gap: 3rem;
}

.nav-container > * {
  flex-grow: 1;
}

.balance-container {
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background-dark);
  padding: 0.5rem 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  font-weight: bold;
  border-radius: 1rem;
}

.balance-inner {
  gap: 0.3rem;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
}

.balance-amount {
  letter-spacing: 0.05rem;
}

.logo-container {
  align-items: center;
  justify-content: flex-start;
  display: flex;
}

.logo {
  height: 2rem;
}

.deposit-btn {
  background-color: var(--color-green-primary);
  color: var(--color-text-light);
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.right-menu {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.05rem;
  border-radius: 1rem;
}

.username-container {
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
  justify-content: space-between;
}

.user-img {
  height: 1rem;
  margin-right: 0.4rem;
  border-radius: 50%;
  aspect-ratio: 1/1;
}

.login-text {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text-light);
  text-decoration: none;
}

.profile-link {
  text-decoration: none;
  color: var(--color-text-light);
}

.msg-icon {
  height: 1.2rem;
  aspect-ratio: 1/1;
  cursor: pointer;
}
</style>
