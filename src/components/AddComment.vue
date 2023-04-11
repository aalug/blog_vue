<template>
  <div class="comment d-flex">
    <div class="author">
      <img
        v-if="user.userProfile.profileImage"
        :src="user.userProfile.profileImage"
        :alt="`${user.username}'s profile photo`">
      <h3>{{ user.username }}</h3>
    </div>
    <v-text-field
      variant="outlined"
      label="Add a comment..."
      style="height: 20rem; width: 40rem;"
    ></v-text-field>
    <div class="triangle"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from "@/store/users";

const userStore = useUserStore();
const {user} = storeToRefs(userStore);

onMounted(async () => {
  await userStore.getUserInfo();
});

</script>

<style scoped>
.author img {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.triangle {
  width: 0;
  height: 0;
  border-top: 5.5rem solid transparent;
  border-bottom: 5.5rem solid transparent;
  border-left: 2rem solid #000;
  margin-left: 0.3rem;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.triangle:hover {
  transform: scaleX(1.2);
}
</style>
