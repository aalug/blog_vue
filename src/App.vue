<template>

  <div class="bg"></div>
  <div class="bg bg2"></div>
  <div class="bg bg3"></div>

  <NavBar/>

  <router-view/>

</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>
