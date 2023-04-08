<template>
  <v-card
    class="mx-auto card rainbow"
    variant="text"
    style="margin-top: 7rem; color: black !important;"
    max-width="1280"
    color="white"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="props.post.coverImage"
      cover
    ></v-img>
    <v-card-title>{{ props.post.title }}</v-card-title>

    <v-card-subtitle class="pt-4 text-black">
      <span>{{ props.post.author.username }}</span>
      <span class="float-right">
        <v-chip
          v-for="tag in props.post.tags"
          v-bind:key="tag.id"
          variant="elevated"
          :color="avgColor"
          class="ml-1"
        >
          {{ tag.name }}
        </v-chip>
      </span>
    </v-card-subtitle>

    <v-card-text>
      {{ props.post.description }}
    </v-card-text>

    <v-card-actions>
      <p class="date">{{ date }}</p>
      <p class="nOfComments">Comments: {{ props.post.numberOfComments }}</p>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Post } from '@/types/Post';
import { getAverageColor } from '@/utils/get-avg-color';

const props = defineProps<{
  post: Post;
}>();

const avgColor = ref<string>('');

const options = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
};
const date = new Date(props.post.createdAt)
  .toLocaleDateString("en-US", options);

onMounted(async () => {
  avgColor.value = await getAverageColor(props.post.coverImage);
});

</script>

<style scoped>
.card {
  border-radius: 0;
  transition: all .3s ease-in-out;
}

.card:hover {
  cursor: pointer;
  transform: scale(1.02);
}

p {
  position: absolute;
  color: #676767;
  font-size: 11px;
}

.nOfComments {
  left: 3rem;
  bottom: 1rem;
}

.date {
  right: 3rem;
  bottom: 1rem;
}

*, *::before, *::after {
  box-sizing: border-box;
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}

.rainbow {
  position: relative;
  z-index: 0;
  overflow: hidden;
  padding: 2rem;
}

.rainbow:hover::before {
  content: "";
  position: absolute;
  z-index: -2;
  left: -50%;
  top: -50%;
  width: 200%;
  height: 200%;
  background-color: #399953;
  background-repeat: no-repeat;
  background-size: 50% 50%, 50% 50%;
  background-position: 0 0, 100% 0, 100% 100%, 0 100%;
  background-image: linear-gradient(#0d5cee, #ea1717), linear-gradient(#f6e905, #e0c51b), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5);
  animation: rotate 5s linear infinite;
}

.rainbow:hover::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: 6px;
  top: 6px;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  background: white;
}
</style>
