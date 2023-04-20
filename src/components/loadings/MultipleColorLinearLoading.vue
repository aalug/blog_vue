<template>
  <div>
    <v-progress-linear
      indeterminate
      :color="color1"
      style="width: 70%"
    ></v-progress-linear>
    <v-progress-linear
      indeterminate
      :color="color2"
    ></v-progress-linear>
    <v-progress-linear
      indeterminate
      :color="color3"
      style="width: 50%"
    ></v-progress-linear>
    <v-progress-linear
      indeterminate
      :color="color4"
      style="width: 80%"
    ></v-progress-linear>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color1: string,
  color2: string,
  color3: string,
  color4: string,
}>()
</script>
