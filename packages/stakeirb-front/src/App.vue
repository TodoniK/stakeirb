<template>
  <div class="container" v-if="isChatVisible">
    <div class="inner">
      <NavBar @toggleChat="toggleChat" />
      <RouterView />
    </div>
    <OnlineChat />
  </div>
  <div v-else>
    <NavBar @toggleChat="toggleChat" />
    <RouterView class="router" />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import OnlineChat from './components/OnlineChat.vue'
import { ref } from 'vue'

let isChatVisible = ref(true)

const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value
}
</script>

<style scoped>
.container {
  display: flex;
  flex: row;
  justify-content: flex-start;
}

.inner {
  flex-grow: 1;
}
</style>
