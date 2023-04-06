<template>
  <v-alert
    type="success"
    closable
    close-label="Close Alert"
    :color="color"
    :title="title"
    style="border-radius: 0"
  >
    {{ text }}<br>
    <span
    v-if="signUp"
    >Now you can <router-link :to="{name: 'login'}">login</router-link></span>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  text: string,
  color: string,
  signUp: boolean
}>();
</script>

<style scoped>
a {
  color: #3c3cf1;
  font-weight: bold;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

</style>
