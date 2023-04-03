<template>
  <v-container>
    <HomeHeader />
    <PostCard
      v-for="post in posts"
      v-bind:key="post.id"
      :post="post"
    />

  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Post } from '@/types/Post';
import PostCard from '@/components/PostCard.vue';
import HomeHeader from '@/components/HomeHeader.vue';

const posts = ref<Post[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/post/posts/`
    );
    posts.value = data['results'];

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});


</script>

<style>
.header h1 {
  font-family: 'Fasthand', cursive;
  font-size: 6rem;
}
</style>
