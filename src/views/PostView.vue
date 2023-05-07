<template>
  <v-container>
    <!--  Post details -->
    <PostDetails
      :post="post"
      :tagColor="avgColor"
      :isUserStaff="user.isStaff"
    />

    <PostImagesCarousel
      v-if="images.length > 0"
      :images="images"
      :color="avgColor"
      class="carousel"
    />

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
import { PostImage } from '@/types/PostImage';
import PostDetails from '@/components/PostDetails.vue';
import PostComments from '@/components/PostComments.vue';
import AddComment from '@/components/AddComment.vue';
import PostImagesCarousel from '@/components/PostImagesCarousel.vue';

const loading = ref<boolean>(false);
const avgColor = ref<string>('');
const post = ref<Post>();
const comments = ref<Comment[]>([]);
const images = ref<PostImage[]>([]);

const userStore = useUserStore();
const {token, user} = storeToRefs(userStore);

const route = useRoute();

onMounted(async () => {
  const id = route.params.id;
  loading.value = true;
  try {
    if (token.value) {
      const {data} = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id}/`,
        {headers: {Authorization: `Token ${token.value}`}}
        // If the token exists, user is logged-in nad can get additional info
        // such as if they voted on a comment or not.
      );
      post.value = data;
      avgColor.value = await getAverageColor(data.coverImage);
    } else {
      const {data} = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id}/`
      );
      post.value = data;
      avgColor.value = await getAverageColor(data.coverImage);
    }

    if (post.value)
      comments.value = post.value.comments;
    if (post.value?.images)
      images.value = post.value.images;

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const handleCommentAdded = async (comment: Comment) => {
  comment.numberOfUpvotes = 0;
  comment.numberOfDownvotes = 0;

  comments.value.unshift(comment);
};

</script>

<style scoped>
.carousel {
  width: 70%;
  height: 70%;
  margin: 7rem auto 10rem auto;
  border: solid 2px black;
}
</style>
