<template>
  <div
    class="roll-container"
    :style="`background-color: ${
      bet.win ? 'var(--color-green-primary)' : 'var(--color-red-primary)'
    }`"
  >
    <span>{{ bet.result.toFixed(2) }}</span>
  </div>
</template>

<script setup>
defineProps(['bet'])
</script>

<style scoped>
.roll-container {
  padding: 0.5rem 0.7rem;
  border-radius: 1rem;
  font-weight: 600;
}
</style>
