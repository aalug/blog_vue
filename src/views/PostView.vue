<template>
  <v-container>
    <!--  Post details -->
    <PostDetails
      :post="post"
      :tagColor="avgColor"/>

    <!--  Add comment  -->
    <AddComment
      v-if="user"
      class="mt-16"
    />

    <!--  Comments  -->
    <PostComments
      v-if="post"
      :comments="post.comments"
    />
  </v-container>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {useUserStore} from '@/store/users';
import { getAverageColor } from '@/utils/get-avg-color';
import { Post } from '@/types/Post';
import PostDetails from '@/components/PostDetails.vue';
import PostComments from '@/components/PostComments.vue';
import AddComment from '@/components/AddComment.vue';

const loading = ref<boolean>(false);
const avgColor = ref<string>('');
const post = ref<Post>();

const route = useRoute();

const user = useUserStore().user;

onMounted(async () => {
  const id = route.params.id;
  loading.value = true;
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id}/`
    );
    post.value = data;
    avgColor.value = await getAverageColor(data.coverImage);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

});


</script>
