<template>
  <v-container>
    <!--  Post details -->
    <PostDetails
      :post="post"
      :tagColor="avgColor"/>

    <!--  Add comment  -->
    <AddComment
      v-if="post"
      class="mt-16"
      :postId="post.id"
      @commentAdded="handleCommentAdded"
    />

    <!--  Comments  -->
    <PostComments
      v-if="post"
      :comments="comments"
    />
  </v-container>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/users';
import { getAverageColor } from '@/utils/get-avg-color';
import { Post } from '@/types/Post';
import { Comment } from '@/types/Comment';
import PostDetails from '@/components/PostDetails.vue';
import PostComments from '@/components/PostComments.vue';
import AddComment from '@/components/AddComment.vue';

const loading = ref<boolean>(false);
const avgColor = ref<string>('');
const post = ref<Post>();
const comments = ref<Comment[]>([]);

const userStore = useUserStore();
const {user} = storeToRefs(userStore);

const route = useRoute();

onMounted(async () => {
  const id = route.params.id;
  loading.value = true;
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id}/`
    );
    post.value = data;
    if (post.value)
      comments.value = post.value.comments;
    avgColor.value = await getAverageColor(data.coverImage);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const handleCommentAdded = async (comment: Comment) => {
  comment.numberOfUpvotes = 0;
  comment.numberOfDownvotes = 0;

  comment.createdAt = 'now';

  comments.value.unshift(comment);
};

</script>
