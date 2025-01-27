<template>
  <div class="comp-container">
    <span class="label" v-if="label">{{ label }}</span>
    <div class="input-container">
      <div class="input-inner" :class="{ disabled: disabled }">
        <input
          :type="type || 'number'"
          :step="step"
          :min="min"
          :max="max"
          :value="value || 0"
          :disabled="disabled"
          @click="changeSide"
          @input="$emit('update:value', $event.target.value)"
        />
        <img :src="imageSrc" alt="Button Icon" />
      </div>

      <div class="actions-container" v-if="actions">
        <div class="actions-inner" v-for="(action, index) in actions" :key="action.value">
          <input type="button" class="action" :value="action.value" @click="action.action" />
          <div class="divider" v-if="index < actions.length - 1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { step, type, min, max, value, disabled, label, imageSrc, actions } = defineProps([
  'step',
  'type',
  'min',
  'max',
  'value',
  'disabled',
  'label',
  'imageSrc',
  'actions'
])
</script>

<style scoped>
.comp-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.15rem;
}

.input-container {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 0.15rem;
  width: 100%;
  box-shadow: var(--btn-shadow);
}

.input-inner {
  overflow: hidden;
  border: 0.15rem solid var(--grey-400);
  border-radius: 0.15rem 0 0 0.15rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  background-color: var(--grey-700);
}

.input-inner:focus-within,
.input-inner:hover {
  border-color: var(--grey-300) !important;
}

input {
  padding: 0.5rem 0.5rem;
  padding-right: 0;
  background-color: inherit;
  font-family: 'Metropolis', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  width: 100%;
  line-height: 1.3rem;
  box-sizing: border-box;
}

input[type='submit'] {
  text-align: left;
  cursor: pointer;
}

.disabled {
  background-color: var(--grey-400);
  border-color: var(--grey-400);
}

img {
  width: 1rem;
  height: 1rem;
  align-self: center;
  padding: 0 0.5rem;
  fill: aliceblue;
  stroke: aliceblue;
}

.actions-container {
  flex-wrap: nowrap;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
}

.actions-inner {
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: var(--grey-400);
}

.action {
  background-color: var(--grey-400);
  border: 0.15rem solid var(--grey-400);
  padding: 0 1rem;
  transition: all ease 0.2s;
}

.action:hover {
  background-color: var(--grey-300);
  border: 0.15rem solid var(--grey-300);
  cursor: pointer;
}

.divider {
  width: 3px;
  height: 1.3rem;
  background-color: var(--grey-700);
  margin: auto;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--grey-200);
}
</style>
