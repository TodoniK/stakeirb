// socket.js
import { ref, onMounted } from 'vue'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  path: '/socket.io/'
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
