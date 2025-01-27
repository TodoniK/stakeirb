<template>
  <router-link :to="'/games/' + game">
    <div class="card">
      <img :src="getImagePath()" :alt="game" class="card-image" />
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'

const { game } = defineProps(['game'])

const getImagePath = () => {
  return `../src/assets/images/games/${game}.jpg`
}
</script>

<style scoped>
.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  cursor: pointer;
  filter: brightness(1.2);
  transition: all 0.2s ease-in-out;
}

.card-image {
  border-radius: 1rem;
  max-width: 150px;
}
</style>
