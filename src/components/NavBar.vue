<template>
  <nav class="navbar">
    <div class="color-theme-chooser navbar-nav">
      <ul class="nav-item">
        <li
          class="nav-link"
          @click="showColorPicker = !showColorPicker">
          {{ colorPickerText }}
        </li>
      </ul>
      <div>
        <div class="d-flex">
          <v-color-picker
            v-if="showColorPicker"
            v-model="color1"
            class="ma-2 color-picker"
            :swatches="swatches"
            show-swatches
            hide-sliders
            rounded="0"
          ></v-color-picker>
          <v-color-picker
            v-if="showColorPicker"
            v-model="color2"
            class="ma-2 color-picker"
            :swatches="swatches"
            show-swatches
            hide-sliders
            rounded="0"
          ></v-color-picker>
        </div>
        <v-btn
          v-if="showColorPicker"
          class="save-color"
          rounded="0"
          color="black"
          @click="sendColors()"
        >
          Save
        </v-btn>
      </div>
    </div>
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link
          :to="{name: 'home'}"
          class="nav-link"
        >
          Home
        </router-link>
      </li>

      <li
        v-if="!userLoggedIn"
        class="nav-item"
      >
        <router-link
          :to="{name: 'login'}"
          class="nav-link"
        >
          Login
        </router-link>
      </li>

      <li
        v-if="!userLoggedIn"
        class="nav-item"
      >
        <router-link
          :to="{name: 'sign-up'}"
          class="nav-link"
        >
          Sign Up
        </router-link>
      </li>

      <li
        v-else
        class="nav-item"
      >
        <router-link
          :to="{name: 'profile'}"
          class="nav-link"
        >
          My Profile
        </router-link>
      </li>

    </ul>
  </nav>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/users';

const emit = defineEmits(['colorThemeChange']);

const showColorPicker = ref<boolean>(false);
const color1 = ref<string>('');
const color2 = ref<string>('');

const colorPickerText = computed(() => showColorPicker.value ? 'Close color picker' : 'Choose color theme')

const userLoggedIn: boolean = !!useUserStore().token;

const sendColors = () => {
  // Close the color picker
  showColorPicker.value = false;

  // Set local storage to keep the values
  localStorage.setItem('themeColors', `${color1.value}-${color2.value}`);

  // Send emit with new colors
  emit('colorThemeChange', [color1.value, color2.value]);
};

// For color theme picker
const swatches = [
  ['#FF0000', '#AA0000', '#550000'],
  ['#FFFF00', '#AAAA00', '#555500'],
  ['#00FF00', '#00AA00', '#005500'],
  ['#00FFFF', '#00AAAA', '#005555'],
  ['#0000FF', '#0000AA', '#000055'],
  ['#FF00FF', '#AA00AA', '#550055'], // magenta shades
  ['#FFA500', '#AA7500', '#554000'], // orange shades
  ['#800080', '#550055', '#2A002A'], // purple shades
  ['#008000', '#005500', '#002A00'], // green shades
  ['#000080', '#000055', '#00002A'], // navy shades
  ['#FFFFFF', '#AAAAAA', '#555555'], // grayscale shades
  ['#FFC0CB', '#FFA07A', '#CD5C5C'], // pink and coral shades
];

</script>

<style scoped>
/* Navbar container */
.navbar {
  position: fixed;
  width: 100%;
  z-index: 99;
  background-color: black;
  height: 50px;
  display: flex;
  justify-content: center;
}

/* Navbar items */
.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
}

.nav-item {
  margin: 0;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  height: 100%;
  padding: 0 4rem;
}

.nav-link::before {
  content: "";
  position: absolute;
  width: 0;
  height: 3px;
  bottom: 0;
  left: 0;
  background-color: #fff;
  transition: width 0.2s ease-out;
  transform-origin: bottom left;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 3px;
  height: 0;
  top: 0;
  right: 0;
  background-color: #fff;
  transition: height 0.2s ease-out 0.2s;
  transform-origin: top right;
}

.nav-item:hover .nav-link::before {
  width: 100%;
}

.nav-item:hover .nav-link::after {
  height: 100%;
}

.color-theme-chooser {
  position: absolute;
  left: -1rem;
  color: white;
  cursor: pointer;
}

.color-picker {
  z-index: 100;
  width: 20rem;
}

.save-color {
  width: 100%;
}
</style>
