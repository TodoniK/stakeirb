// socket.js
import { ref, onMounted } from 'vue'
import io from 'socket.io-client'

const socket = io('https://julesroyet-projects.me', {
  path: '/api/'
})

export function useSocket() {
  const isSocketConnected = ref(false)

  onMounted(() => {
    socket.on('connect', () => {
      isSocketConnected.value = true
    })

    socket.on('disconnect', () => {
      isSocketConnected.value = false
    })
  })

  return { socket, isSocketConnected }
}
