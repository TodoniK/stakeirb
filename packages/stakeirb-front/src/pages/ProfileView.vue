<template>
  <div class="container" v-if="!isLoading && userFound">
    <div class="wrapper">
      <div class="top-infos">
        <img
          :src="user?.pfp_url ? user.pfp_url : '../assets/images/users/default-user-img.svg'"
          alt="User profile picture"
          class="user-img"
        />
        <h1>{{ user?.username }}</h1>
      </div>
      <h5 class="secondary-text">Registered on {{ formatDate(user?.createdAt, false) }}</h5>
      <RankBar class="rank-bar" :progress="user?.rank_pts" />
      <InputButton
        :value="'Send a tip'"
        :type="'success'"
        :disabled="false"
        @click="tipUser(user)"
        v-if="user.uuid_user !== activeUser.uuid_user"
      />
      <div class="stats-container">
        <h2>Statistics</h2>
        <div class="stats-inner">
          <div>
            <h3>Total Bets</h3>
            <span>{{ totalBets }}</span>
          </div>
          <div>
            <h3>Total Wagered</h3>
            <div class="text-icon-flex">
              <span>{{ formattedTotalWagered }}</span>
              <CoinIcon />
            </div>
          </div>
          <div>
            <h3>Total Won</h3>
            <div class="text-icon-flex">
              <span :class="totalWon >= 0 ? 'color-green' : 'color-red'">{{
                formattedTotalWon
              }}</span>
              <CoinIcon />
            </div>
          </div>
        </div>
      </div>
      <h2>Last bets</h2>
      <table class="last-bets">
        <thead>
          <tr>
            <th>Game</th>
            <th>Bet Amount</th>
            <th>Multiplier</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bet in userBets" :key="bet.id">
            <td>{{ bet.Game.name }}</td>
            <td class="text-icon-flex">
              <span>{{ formattedBetAmount(bet.bet_amount) }}</span>
              <CoinIcon class="coin-icon" />
            </td>
            <td>{{ bet.multiplier }}x</td>
            <td>{{ formatDate(bet.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="container" v-else-if="isLoading">
    <div class="wrapper">
      <h1>Loading...</h1>
    </div>
  </div>
  <div class="container" v-else>
    <div class="wrapper">
      <h1>User not found</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getAllBetsFromUser, getUserByUuid, tipUser } from '@/api/stakeirb-api'
import { useRoute } from 'vue-router'
import InputButton from '../components/inputs/InputButton.vue'
import { useStore } from 'vuex'
import RankBar from '../components/RankBar.vue'
import CoinIcon from '../components/CoinIcon.vue'

const store = useStore()

const activeUser = computed(() => store.state.user)
const user = ref({})
const userBets = ref([])

const isLoading = ref(true)
const userFound = ref(true)

const route = useRoute()
const uuidUser = ref(route.params.uuid_user)

// Fetch user data when the component is mounted
const fetchData = async () => {
  try {
    const res = await getUserByUuid(uuidUser.value)

    if (!res) {
      throw new Error('User not found')
    }

    user.value = res
    userBets.value = await getAllBetsFromUser(uuidUser.value)
    userFound.value = true
  } catch (error) {
    userFound.value = false
  } finally {
    isLoading.value = false
  }
}

// Watch for changes in the route parameters and fetch data accordingly
watch(
  () => route.params.uuid_user,
  () => {
    isLoading.value = true
    uuidUser.value = route.params.uuid_user
    fetchData()
  }
)

// Initial data fetch
fetchData()

const totalBets = computed(() => userBets.value.length)
const totalWagered = computed(() => userBets.value.reduce((acc, bet) => acc + bet.bet_amount, 0))
const formattedTotalWagered = computed(() => totalWagered.value.toLocaleString('en-US'))

const totalWon = computed(
  () =>
    userBets.value.reduce((acc, bet) => acc + bet.bet_amount * bet.multiplier, 0) -
    totalWagered.value
)

const formattedTotalWon = computed(() => {
  const newTotalWon = parseInt(totalWon.value)
  return newTotalWon.toLocaleString('en-US')
})

const formattedBetAmount = (bet_amount) => {
  const newBetAmount = parseInt(bet_amount)
  return newBetAmount.toLocaleString('en-US')
}

const formatDate = (dateString, includeHours = true) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  if (!includeHours) {
    delete options.hour
    delete options.minute
  }

  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.container {
  padding: var(--padding-container);
}

.wrapper {
  width: 75%;
  background-color: var(--grey-700);
  max-width: var(--max-width);
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  margin: 0 auto;
}

.secondary-text {
  color: var(--grey-200);
  font-weight: 500;
}

.rank-bar {
  margin: auto;
  width: 50%;
  margin-bottom: 2rem;
}

.stats-container {
  margin: 4rem 0;
}

.stats-inner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-weight: 500;
}

.stats-inner > div {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--grey-500);
  margin: 0 1rem;
}

.stats-inner > div:first-of-type,
.stats-inner > div:last-of-type {
  margin: 0;
}

.stats-inner h3 {
  margin-top: 0;
}

.last-bets {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  text-align: center;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: var(--grey-500);
}

.last-bets th,
.last-bets td {
  padding: 1em 0.5em;
}

.last-bets td {
  font-weight: 500;
}

.last-bets tr:nth-child(2n) {
  background-color: var(--grey-700);
}

.text-icon-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.text-icon-flex img {
  margin-left: 0.4rem;
  width: fit-content;
}

.color-green {
  color: var(--green-500);
}

.color-red {
  color: var(--red-500);
}

.top-infos {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.user-img {
  height: 3rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
}
</style>
