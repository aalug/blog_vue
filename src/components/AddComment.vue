<template>
  <div class="comment d-flex">
    <div
      v-if="user"
      class="author">
      <img
        v-if="user.userProfile.profileImage"
        :src="user.userProfile.profileImage"
        :alt="`${user.username}'s profile photo`">
      <h3 class="mr-3">{{ user.username }}</h3>
    </div>
    <v-text-field
      v-model="comment"
      variant="outlined"
      :label="user.email < 2 ? 'Please login to add a comment.' : 'Add a comment...'"
      :disabled="user.email < 2"
      style="height: 20rem; width: 40rem;"
    ></v-text-field>
    <div
      class="triangle"
      @click="handleCreateComment()"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useUserStore } from "@/store/users";

const props = defineProps<{
  postId: number
}>();

const emit = defineEmits(['commentAdded']);

const comment = ref<string>('');

const userStore = useUserStore();
const {user} = storeToRefs(userStore);

onMounted(async () => {
  await userStore.getUserInfo();
});

const handleCreateComment = async () => {
  if (!comment.value) return
  try {
    const {data} = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/post/comments/`,
      {
        text: comment.value,
        post: props.postId
      },
      {headers: {Authorization: `Token ${userStore.token}`}}
    );
    emit('commentAdded', data);
    comment.value = '';
  } catch (e) {
    console.error(e);
  }
};

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
