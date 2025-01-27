<template>
  <div class="container">
    <div class="wrapper">
      <div class="content">
        <h1 class="login-title">Login</h1>
        <form @submit.prevent="userLogin">
          <InputText
            class="mb"
            :placeholder="placeholderEmail"
            v-model="form.email"
            label="Email"
            :disabled="false"
            :actions="[]"
          />
          <InputText
            class="mb"
            :type="'password'"
            :placeholder="placeholderPassword"
            v-model="form.password"
            label="Password"
            :disabled="false"
            :actions="[]"
          />
          <InputButton class="submit-btn mt" :type="'success'" :value="'Login'" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputButton from '../components/inputs/InputButton.vue'
import InputText from '../components/inputs/InputText.vue'

import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '../api/stakeirb-api'
import { sha256 } from 'js-sha256'
import { useStore } from 'vuex'

const placeholderEmail = 'E-mail'
const placeholderPassword = 'Password'

const store = useStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })

const userLogin = async () => {
  const { email, password } = form
  const hashedPassword = sha256(password)

  const user = {
    email: email,
    hashedPassword: hashedPassword
  }

  const loginSuccess = await useLogin(user, store)

  if (loginSuccess) {
    router.push('/')
  }
}
</script>
<style scoped>
.container {
  padding: var(--padding-container);
}

.wrapper {
  max-width: var(--max-width);
  margin: 0 auto;
  width: 75%;
  background-color: var(--grey-700);
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}

.content {
  width: 50%;
  margin: auto;
}

.login-title {
  margin-top: 0;
}

.mb {
  margin-bottom: 1rem;
}

.mt {
  margin-top: 1rem;
}

.submit-btn {
  width: 100%;
  height: 3rem;
}
</style>
