import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import axios from './auth/http-interceptor'

const app = createApp(App)

app.config.globalProperties.$axios = axios

app.use(router)
app.use(store)

app.mount('#app')
