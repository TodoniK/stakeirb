import axios from 'axios'
import Swal from 'sweetalert2'
import VueJwtDecode from 'vue-jwt-decode'
import { store } from '@/store'
import { displayErrorModal, displaySuccessModal } from '@/components/modals/modalsManager'

const API_URL = 'http://localhost:3000'
const USERS_URL = `${API_URL}/users`
const BETS_URL = `${API_URL}/bets`
const MESSAGE_URL = `${API_URL}/messages`

export const getUserByUuid = async (uuid_user) => {
  try {
    const response = await axios.get(`${USERS_URL}/${uuid_user}`)
    return response.data
  } catch (e) {
    displayErrorModal('Impossible to get user')
  }
}

export const getAllBetsFromUser = async (uuid_user) => {
  try {
    const response = await axios.get(`${BETS_URL}/user/${uuid_user}`)
    return response.data
  } catch (e) {
    displayErrorModal('Impossible to get bets from user')
  }
}

export const sendMessageFromUser = async (message) => {
  try {
    await axios.post(`${MESSAGE_URL}`, message)
  } catch (e) {
    displayErrorModal('Impossible to send message')
  }
}

export const tipUser = async (user) => {
  const currentUser = store.state.user

  if (currentUser.uuid_user === user.uuid_user) {
    displayErrorModal("You can't tip yourself")
    return
  }

  await Swal.fire({
    title: 'Enter the amount you want to tip',
    input: 'text',
    inputPlaceholder: 'Ex: 500',
    showCancelButton: true,
    confirmButtonText: 'Send to ' + user.username,
    cancelButtonText: 'Cancel',
    background: '#203141',
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#e34242',
    color: '#ffffff',
    inputValidator: (value) => {
      // Vérifie si la valeur est un nombre compris entre 0 et 100000
      if (!value || isNaN(value) || parseInt(value) < 0 || parseInt(value) > 100000) {
        return 'Please enter a number between 0 and 100,000'
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const currentUserBalance = parseInt(currentUser.balance)
      const resultValue = parseInt(result.value)
      if (currentUserBalance < resultValue) {
        displayErrorModal("You don't have enough money")
        return
      }

      const tip = {
        sender: store.state.user,
        receiver: user
      }

      const response = await axios.post(`${USERS_URL}/tip`, {
        tip_amount: resultValue,
        receiver: tip.receiver.uuid_user
      })

      // Update the user balance in store
      const newBalance = response.data.new_balance
      await store.dispatch('updateBalance', { balance: newBalance, rank_pts: currentUser.rank_pts })

      if (response.status === 200) {
        displaySuccessModal(`You successfully sent ${resultValue} to ${tip.receiver.username}`)
      } else {
        displayErrorModal('Impossible to send tip')
      }
    }
  })
}

export const updateMoneyAmount = async (user) => {
  await Swal.fire({
    title: 'Enter the amount to add',
    input: 'text',
    inputPlaceholder: 'Ex: 500',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Add',
    background: '#203141',
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#e34242',
    color: '#ffffff',
    inputValidator: (value) => {
      // Check if the value is a number between 0 and 1000
      if (!value || isNaN(value) || parseInt(value) < 0 || parseInt(value) > 1000) {
        return 'Please enter a number between 0 and 1000'
      }
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Update user money amount
      const response = await axios.put(`${USERS_URL}/balance`, {
        money_amount: result.value
      })

      if (response.status === 200) {
        // Update user money amount in store
        const newBalance = response.data.balance
        await store.dispatch('updateBalance', { balance: newBalance, rank_pts: user.rank_pts })
        displaySuccessModal('Money amount updated')
      } else {
        displayErrorModal('Impossible to update money amount')
      }
    }
  })
}

export const useLogin = async (user, store) => {
  try {
    const response = await axios.post(`${USERS_URL}/login`, user)
    localStorage.setItem('accessToken', response.data.accessToken)

    // Decode JWT token to get user infos
    const decodedToken = VueJwtDecode.decode(response.data.accessToken)

    const decodedUser = decodedToken.user

    // Store user infos in store
    store.dispatch('login', decodedUser)

    return true
  } catch (e) {
    displayErrorModal('Wrong email or password')
    return false
  }
}

export const useRegister = async (user, store) => {
  try {
    const response = await axios.post(`${USERS_URL}/register`, user)
    localStorage.setItem('accessToken', response.data.accessToken)

    // Decode JWT token to get user infos
    const decodedToken = VueJwtDecode.decode(response.data.accessToken)

    const decodedUser = decodedToken.user

    // Store user infos in store
    store.dispatch('login', decodedUser)

    return true
  } catch (e) {
    displayErrorModal('Impossible to register')
    return false
  }
}

export const placeDiceBet = async (bet) => {
  try {
    let res = await axios.post(`${API_URL}/games/dice`, {
      is_under: bet.is_under,
      target: bet.target,
      bet_amount: bet.bet_amount
    })

    return res.data
  } catch (e) {
    displayErrorModal('Impossible to place bet')
  }
}
