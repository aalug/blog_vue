<template>
  <v-card
    class="mx-auto card"
    variant="text"
    style="margin-top: 7rem;"
    max-width="1280"
    color="white"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="props.post.coverImage"
      cover
    >
      <v-card-title>{{ props.post.title }}</v-card-title>
    </v-img>


    <v-card-subtitle class="pt-4">
      <span>{{ props.post.author.username }}</span>
      <span class="float-right">
        <v-chip
          v-for="tag in props.post.tags"
          v-bind:key="tag.id"
          variant="elevated"
          :color="avgColor"
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
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

p {
  position: absolute;
  color: grey;
  font-size: 11px;
}

.nOfComments {
  left: 5px;
  bottom: 5px;
}

.date {
  right: 5px;
  bottom: 5px;
}

</style>
