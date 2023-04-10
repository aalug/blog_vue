<template>
  <v-container class="mt-10">

    <FilterSortPanel
      @sortPosts="handleSortPosts"
      @filterByTags="handleFilterByTags"
    />

    <div v-if="loading" class="post-loading">
      <v-progress-circular
        indeterminate
        :size="123"
        :width="10"
      ></v-progress-circular>
    </div>

    <PostCard
      v-else
      v-for="post in posts"
      v-bind:key="post.id"
      :post="post"
    />

    <v-pagination
      v-model="currentPage"
      :length="pageLength"
      active-color="black"
      variant="outlined"
      show-first-last-page
      start="1"
      total-visible="5"
      rounded="0"
    ></v-pagination>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { Post } from '@/types/Post';
import { SortOption } from '@/types/SortOption.enum';
import PostCard from '@/components/PostCard.vue';
import FilterSortPanel from '@/components/FilterSortPanel.vue';

const posts = ref<Post[]>([]);
const loading = ref<boolean>(false);

// Pagination
const currentPage = ref<number>(1);
let pageLength: number = 1;

const sort = ref<string>('');
const selectedTags = ref<number[]>([]);

const sortOptionToQueryParam = (sortBy: SortOption | null): string => {
  if (sortBy === SortOption.TITLE_ASCENDING)
    return 'title-asc';
  else if (sortBy === SortOption.TITLE_DESCENDING)
    return 'title-desc';
  else if (sortBy === SortOption.COMMENTS_ASCENDING)
    return 'comments-asc';
  else if (sortBy === SortOption.COMMENTS_DESCENDING)
    return 'comments-desc';
  else if (sortBy === SortOption.DATE_ASCENDING)
    return 'date-asc';
  else if (sortBy === SortOption.DATE_DESCENDING)
    return 'date-desc';
  else if (sortBy === SortOption.UPDATE_ASCENDING)
    return 'update-asc';
  else if (sortBy === SortOption.UPDATE_DESCENDING)
    return 'update-desc';
  else
    return '';
};

const handleSortPosts = async (sortBy: SortOption | null) => {
  sort.value = sortOptionToQueryParam(sortBy);
  await getPosts(false);
};

const handleFilterByTags = async (tags: number[]) => {
  selectedTags.value = tags;
  await getPosts(true);
};

const getPosts = async (countPages: boolean) => {
  const sortBy = sort.value ? `&sort=${sort.value}` : '';
  const tagsFilter = selectedTags.value ? `&tags=${selectedTags.value}` : '';
  loading.value = true;
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/post/posts/?page=${currentPage.value}${sortBy}${tagsFilter}`
    );
    posts.value = data['results'];
    if (countPages) {
      const count = data['count'];
      pageLength = Math.ceil(count / 10);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch(currentPage, async () => {
  await getPosts(false);
});

onMounted(async () => {
  await getPosts(true);
});
</script>
