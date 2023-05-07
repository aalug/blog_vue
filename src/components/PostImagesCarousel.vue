<template>
  <v-carousel
    cycle
    height="600"
    hide-delimiter-background
    show-arrows="hover"
    :color="color"
  >
    <v-hover v-slot="{ isHovering, props }">

      <v-carousel-item
        v-for="(postImage, i) in images"
        :key="i"
        :src="postImage.image"
        v-bind="props"
        cover
      >
        <v-expand-transition>
          <div
            v-if="isHovering"
            class="d-flex transition-fast-in-fast-out bg-white v-card--reveal text-h2"
            style="height: 10%; opacity: 0.8; font-size: 1rem !important;"
          >
            <span style="opacity: 1; position: relative; left: 2rem;">{{ postImage.title }}</span>
          </div>
        </v-expand-transition>
      </v-carousel-item>

    </v-hover>

  </v-carousel>
</template>

<script setup lang="ts">
import { PostImage } from '@/types/PostImage';

defineProps<{
  images: PostImage[],
  color: string
}>();
</script>
