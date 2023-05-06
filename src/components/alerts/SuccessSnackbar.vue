<template>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="timeout"
    :color="color"
    class="snackbar"
  >
    <div class="text-center">
      <h4>{{ text }}</h4>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  timeout: number,
  text: string,
  color: string
}>();

const showSnackbar = ref<boolean>(true);

</script>

<style scoped>
.snackbar {
  border-radius: 0 !important;
}

.snackbar div {
  width: 30rem;
  height: 5rem;
}
</style>
