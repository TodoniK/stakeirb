<template>
  <div class="bar-container">
    <div class="progress-bar" :style="{ width: formattedProgress + '%' }"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['progress'])

const formattedProgress = computed(() => {
  return props.progress / 100
})
</script>

<style scoped>
.bar-container {
  height: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  background-color: var(--color-background-light);
}

.progress-bar {
  height: 1rem;
  text-align: right;
  z-index: 1;
  background-color: var(--color-green-primary);
}
</style>
