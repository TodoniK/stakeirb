<template>
  <input type="submit" class="button" :class="type" :value="value" @click="action" />
</template>

<script setup>
defineProps(['value', 'type', 'disabled', 'action'])
</script>

<style scoped>
.button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.button:focus {
  outline: 0.2rem solid var(--color-green-tertiary);
}

.success {
  background-color: var(--color-green-primary);
  color: var(--color-text-light);
}

.success:hover {
  background-color: var(--color-green-secondary);
}

.danger {
  background-color: var(--color-red-primary);
  color: var(--color-text-light);
}

.danger:hover {
  background-color: var(--color-red-secondary);
}
</style>
