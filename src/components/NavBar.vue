<template>
  <nav class="navbar">
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
          :to="{name: 'home'}"
          class="nav-link"
        >
          My Profile
        </router-link>
      </li>

    </ul>
  </nav>

</template>

<script setup lang="ts">
defineProps<{
  userLoggedIn: boolean;
}>()
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

.nav-item:hover .nav-link::before { /* Updated this selector */
  width: 100%;
}

.nav-item:hover .nav-link::after { /* Updated this selector */
  height: 100%;
}
</style>
