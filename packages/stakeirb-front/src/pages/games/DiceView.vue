<template>
  <div class="container">
    <div class="wrapper">
      <div class="card">
        <div class="card-left">
          <InputNumber
            class="bet-amount-input"
            :step="1"
            :min="1"
            :value="Number(betAmount) !== 0 ? Number(betAmount).toFixed(0) : 0"
            label="Bet Amount"
            imageSrc="../src/assets/images/icons/coineirb.png"
            :disabled="false"
            :actions="inputActions"
            @update:value="updateBetAmount"
          />
          <InputNumber
            :step="1"
            :min="0"
            :value="(betAmount * multiplier).toFixed(0)"
            label="Win Amount"
            imageSrc="../src/assets/images/icons/coineirb.png"
            :disabled="true"
            :actions="[{ value: 'Copy', action: copyWinAmount }]"
          />
          <InputButton class="bet-btn" value="Bet" type="success" :disabled="false" :action="bet" />
        </div>
        <div class="card-right">
          <DiceBar
            :range="range"
            :isUnder="isUnder"
            :result="result"
            :multiplier="multiplier"
            :betsHistory="betsHistory"
            :hideDice="hideDice"
            :diceScale="diceScale"
            @update-isUnder="toggleIsUnder"
            @update-range="updateRange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DiceBar from '../../components/DiceBar.vue'
import InputNumber from '../../components/inputs/InputNumber.vue'
import InputButton from '../../components/inputs/InputButton.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { placeDiceBet } from '../../api/stakeirb-api'
import { displayErrorModal } from '@/components/modals/modalsManager'

const store = useStore()

const MAX_BET_AMOUNT = 1000000
const MAX_BETS_HISTORY = 5

let betAmount = ref(0)
let range = ref((50.0).toFixed(2))
let isUnder = ref(true)
let result = ref((0.0).toFixed(2))
let betsHistory = ref([])
let hideDice = ref(true)
let diceScale = ref(0.95)
let isBetting = ref(false)

const multiplier = computed(() =>
  isUnder.value ? (100 / range.value).toFixed(2) : (100 / (100 - range.value)).toFixed(2)
)

const inputActions = [
  { value: '½', action: divideBy2 },
  { value: '2x', action: multiplyBy2 },
  { value: 'Max', action: maxBet }
]

function copyWinAmount() {
  navigator.clipboard.writeText((betAmount.value * multiplier.value).toFixed(0))
}

function updateBetAmount(newVal) {
  betAmount.value = Number(newVal)
}

function divideBy2() {
  betAmount.value = Math.floor(betAmount.value / 2)
}

function multiplyBy2() {
  if (betAmount.value * 2 > MAX_BET_AMOUNT || betAmount.value == 0) {
    betAmount.value = betAmount.value === 0 ? 1 : MAX_BET_AMOUNT
    return
  }
  betAmount.value = Math.floor(betAmount.value * 2)
}

function maxBet() {
  const userBalance = store.state.user.balance
  if (userBalance < MAX_BET_AMOUNT) {
    betAmount.value = userBalance
    return
  }
  betAmount.value = MAX_BET_AMOUNT
}

function toggleIsUnder() {
  isUnder.value = !isUnder.value
  range.value = (100 - parseFloat(range.value)).toFixed(2)
}

function updateRange(newVal) {
  playSound('../src/assets/sounds/tick.mp3')
  range.value = parseFloat(newVal).toFixed(2)
}

let hideTimer = null

async function bet() {
  // isBetting.value is used to prevent spamming the bet button and sending multiple requests
  if (isBetting.value) return
  isBetting.value = true

  if (store.getters.loggedIn === false) {
    displayErrorModal('You need to be logged in to bet')
    return
  }

  if (betAmount.value > store.state.user.balance) {
    displayErrorModal("You don't have enough money to bet")
    return
  }

  playSound('../src/assets/sounds/bet.mp3')
  await sleep(200)

  const bet = {
    is_under: isUnder.value,
    target: range.value,
    bet_amount: betAmount.value,
    uuid_user: store.state.user.uuid_user
  }

  const res = await placeDiceBet(bet)

  try {
    result.value = parseFloat(res.data.result).toFixed(2)
    store.dispatch('updateBalance', { balance: res.balance, rank_pts: res.rank_pts })
  } catch (e) {
    displayErrorModal('Failed trying to place bet')
    return
  }

  const won = res.win
  const newBet = { id: Date.now(), win: res.win, result: parseFloat(result.value) }
  betsHistory.value.push(newBet)

  if (betsHistory.value.length > MAX_BETS_HISTORY) {
    betsHistory.value.shift()
  }

  playSound('../src/assets/sounds/rolling.mp3')

  isBetting.value = false

  if (won) setTimeout(() => playSound('../src/assets/sounds/win.mp3'), 300)

  animateDiceRoll()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function playSound(src) {
  const audio = new Audio(src)
  audio.play()
}

function animateDiceRoll() {
  clearTimeout(hideTimer)

  hideDice.value = false
  diceScale.value = 0.95

  setTimeout(() => {
    diceScale.value = 1.15
    setTimeout(() => {
      diceScale.value = 1
      hideTimer = setTimeout(() => (hideDice.value = true), 3000)
    }, 100)
  }, 300)
}
</script>

<style scoped>
.container {
  padding: var(--padding-container);
}

.container .wrapper .card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--color-background-dark);
  border-radius: 0.5rem;
  gap: 0;
  overflow: hidden;
}

.wrapper {
  max-width: var(--max-width);
  margin: 0 auto;
}

.card-left {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 2rem;
  gap: 1rem;
  background-color: var(--grey-500);
}

.card-right {
  padding: 3rem 5rem;
  margin: auto;
  width: calc(100% - 10rem);
}

.bet-btn {
  margin-top: 1rem;
  padding: 1rem;
}

.bet-amount-input {
  min-width: 300px;
}

@media (max-width: 1000px) {
  .card {
    flex-direction: column-reverse !important;
    justify-content: flex-start !important;
  }

  .card-right {
    padding: 3rem 2rem !important;
    width: calc(100% - 4rem) !important;
  }
}
</style>
