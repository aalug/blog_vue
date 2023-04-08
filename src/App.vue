<template>

  <div class="bg"
       :style="style"
  ></div>
  <div class="bg bg2"
       :style="style"></div>
  <div class="bg bg3"
       :style="style"></div>

  <NavBar
    @colorThemeChange="setNewColorTheme"
  />

  <router-view/>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';

const color1 = ref<string>('');
const color2 = ref<string>('');
const style = ref<string>('');

const setNewColorTheme = (colors: string[]) => {
  color1.value = colors[0];
  color2.value = colors[1];
  style.value = `background-image: linear-gradient(-60deg, ${color1.value} 50%, ${color2.value} 50%);`;
};

onMounted(() => {
  // Get color values from local storage
  const themeColors: string | null = localStorage.getItem('themeColors');
  if (themeColors) {
    const colors: string[] = themeColors.split('-');
    color1.value = colors[0];
    color2.value = colors[1];
    style.value = `background-image: linear-gradient(-60deg, ${color1.value} 50%, ${color2.value} 50%);`;
  } else {
    style.value = 'background-image: linear-gradient(-60deg, #dcdc31 50%, #c73ac7 50%); ';
  }

});

</script>
