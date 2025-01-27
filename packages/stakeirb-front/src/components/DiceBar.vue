<template>
  <div class="dice-container">
    <transition-group name="bet" tag="div" class="bets-history">
      <PreviousRoll :bet="bet" v-for="bet in lastBets" :key="bet.id" />
    </transition-group>

    <div :class="['bar', isUnder ? 'red-primary' : 'green-primary']">
      <div
        :class="['bar-inner', isUnder ? 'green-primary' : 'red-primary']"
        :style="`width: ${range}%;`"
      >
        <div
          :class="{ dice: true, hide: props.hideDice, show: !props.hideDice }"
          :style="`left: ${result}%; transform: scale(${props.diceScale})`"
        >
          <img src="../assets/images/games/dice/dice.svg" alt="Dice" :style="`left: ${result}%;`" />
          <span :class="{ green: win, red: !win }">{{ result }}</span>
        </div>
      </div>
      <input
        type="range"
        class="bar-range"
        step="1"
        min="2"
        max="98"
        :value="props.range"
        @input="$emit('update-range', $event.target.value)"
      />
    </div>

    <div class="bet-infos">
      <InputNumber
        :step="0.01"
        :min="1"
        :max="10000"
        label="Multiplier"
        imageSrc="../src/assets/images/icons/x.svg"
        :disabled="true"
        :value="multiplier"
      />

      <InputNumber
        :step="1"
        type="submit"
        :min="0"
        :value="range"
        :label="'Roll ' + textUnderOver"
        imageSrc="../src/assets/images/icons/double-arrows.svg"
        @click="changeSide"
        :disabled="false"
      />

      <InputNumber
        :step="0.01"
        :min="0.01"
        :max="98"
        label="Chance of Winning"
        imageSrc="../src/assets/images/icons/percent.svg"
        :disabled="true"
        :value="probabilityOfWinning"
        @update:value="probabilityOfWinning = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import InputNumber from './inputs/InputNumber.vue'
import PreviousRoll from './PreviousRoll.vue'

const props = defineProps([
  'range',
  'isUnder',
  'result',
  'multiplier',
  'betsHistory',
  'hideDice',
  'diceScale'
])
const emit = defineEmits(['update-isUnder', 'update-range'])

const textUnderOver = computed(() => (props.isUnder ? 'Under' : 'Over'))

const probabilityOfWinning = computed(() => {
  const value = props.isUnder ? parseFloat(props.range) : 100 - parseFloat(props.range)
  return value.toFixed(2)
})

const win = computed(() =>
  props.isUnder
    ? parseFloat(props.result) <= parseFloat(props.range)
    : parseFloat(props.result) > parseFloat(props.range)
)

let lastBets = computed(() => (props.betsHistory ? props.betsHistory : []))

const changeSide = () => emit('update-isUnder')
</script>

<style scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  gap: 5rem;
}

.bar {
  height: 0.7rem;
  border: 0.7rem solid var(--grey-700);
  box-shadow: 0 0 0 0.9rem var(--grey-400);
  border-radius: 5rem;
  position: relative;
}

.bar-inner {
  height: 100%;
  border-radius: 0.5rem;
}

.bar-range {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent !important;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
}

.bar-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  background-color: var(--color-blue-primary);
  cursor: pointer;
  margin-top: -0.4rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(var(--color-blue-secondary), var(--color-blue-secondary)),
    linear-gradient(var(--color-blue-secondary), var(--color-blue-secondary)),
    linear-gradient(var(--color-blue-secondary), var(--color-blue-secondary));
  background-size:
    0.2rem 40%,
    0.2rem 50%,
    0.2rem 40%;
  background-position:
    0.8rem 1rem,
    1.4rem 0.8rem,
    2rem 1rem;
  background-repeat: no-repeat;
}

.bar-range::-webkit-slider-thumb:hover {
  cursor: grab;
}

.bar-range::-webkit-slider-thumb:active {
  cursor: grabbing;
}

.bet-infos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background-color: var(--grey-500);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin-top: auto;
}

.bet-infos > * {
  flex-grow: 1;
}

.flex-column {
  gap: 0.1rem;
}

.dice {
  position: absolute;
  height: 5rem;
  bottom: 50%;
  transition:
    all 300ms ease,
    opacity 300ms ease;
  transform-origin: 50% 100%;
}

.dice.hide {
  opacity: 0;
}

.dice.show {
  opacity: 1;
}

.dice img {
  position: absolute;
  height: 5rem;
  top: 0;
  left: 0;
  transform: translate(-50%);
}

.dice span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  text-shadow: 0 1px 0 #fff;
}

.bets-history {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  margin-bottom: 3rem;
  min-height: 2rem;
}

.bet-move {
  transition: transform 0.5s;
}

.bet-leave-active {
  transition: all 0.5s;
}

.bet-leave-to {
  opacity: 0;
}

.red-primary {
  background-color: var(--color-red-primary);
}

.green-primary {
  background-color: var(--color-green-primary);
}

.red {
  color: var(--color-red-primary);
}

.green {
  color: var(--color-green-primary);
}
</style>
