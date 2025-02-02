import { ref, onMounted } from 'vue'
import io from 'socket.io-client'

const socket = io('https://julesroyet-projects.me', {
  path: '/socket.io/', // Spécifiez le chemin pour les WebSockets
  transports: ['websocket'], // Forcer l'utilisation de WebSocket
})

export function useSocket() {
  const isSocketConnected = ref(false)

  onMounted(() => {
    socket.on('connect', () => {
      isSocketConnected.value = true
      console.log('Socket connected')
    })

    socket.on('disconnect', () => {
      isSocketConnected.value = false
      console.log('Socket disconnected')
    })
  })

  return { isSocketConnected }
}