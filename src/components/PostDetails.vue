<template>
  <v-container
    v-if="props.post"
    class="mt-8"
  >
    <v-img
      :src="props.post.coverImage"
      height="400"
      cover
      class="bg-grey-lighten-2"
    ></v-img>

    <!-- Authors  -->
    <h3 class="float-right">{{ props.post.author.username }}</h3>

    <span class="float-left mt-3">
        <v-chip
          v-for="tag in props.post.tags"
          v-bind:key="tag.id"
          variant="elevated"
          :color="tagColor"
          class="ml-1"
        >
          {{ tag.name }}
        </v-chip>
      </span>

    <h1 class="mt-15 text-center">{{ post.title }}</h1>

    <!-- Body   -->
    <div class="body">
      {{ props.post.body }}
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { Post } from '@/types/Post';

const props = defineProps<{
  post: Post,
  tagColor: string
}>()

</script>

<style scoped>
.body {
  text-align: justify;
  font-size: 1rem;
  width: 90%;
  margin: 5rem auto;
  line-height: 1.7;
}
</style>
