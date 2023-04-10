<template>
  <v-container
    class="mt-6"
    style="width: 70%"
  >
    <h3 class="mb-5">Filter by tags</h3>

    <v-autocomplete
      v-model="selectedTags"
      :items="tags"
      item-title="name"
      item-value="id"
      multiple
      clearable
      label="Search for tags..."
      variant="outlined"
      rounded="0"
      @update:modelValue="onTagsSelected()"
    ></v-autocomplete>

    <h3 class="mt-5 mb-3">Sorting</h3>
    <v-select
      v-model="sortBy"
      label="Sort by"
      :items="sortOptions"
      variant="outlined"
      rounded="0"
      clearable
      @update:modelValue="onSortSelected()"
    ></v-select>

  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Tag } from '@/types/Tag';
import { SortOption } from '@/types/SortOption.enum';

const emit = defineEmits(['filterByTags', 'sortPosts']);

const loading = ref<boolean>(false);
// Tag filtering
const tags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);

// Sorting
const sortBy = ref<SortOption>();
const sortOptions: string[] = Object.values(SortOption);

const onTagsSelected = () => {
  emit('filterByTags', selectedTags.value);
};

const onSortSelected = () => {
  emit('sortPosts', sortBy.value);
};

onMounted(async () => {
  loading.value = true;
  try {
    // ?no_page means that returned data will be not paginated
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/post/tags/?no_page`
    );
    tags.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

</script>
