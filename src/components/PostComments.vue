<template>
  <div
    v-for="comment in comments"
    v-bind:key="comment.id"
  >
    <div class="comment">
      <div class="author">
        <img
          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
          :alt="`${comment.author.username}'s profile photo`">
        <h3>{{ comment.author.username }}</h3>
        <h5>points: {{ comment.author.userProfile?.points }}</h5>
      </div>
      <p class="px-16">
        {{ comment.text }}
      </p>
      <div class="metadata">
        <span class="date">{{ comment.createdAt }}</span>
        <div class="rating d-flex">
          <v-icon
            icon="mdi-triangle"
            size="x-large"
            :color="comment.hasVoted === VoteType.UPVOTE ? 'green' : 'grey'"
            class="mr-1 upvote-icon"
            @click="vote(comment.id, VoteType.UPVOTE)"
          ></v-icon>
          <h2>{{ comment.numberOfUpvotes - comment.numberOfDownvotes }}</h2>
          <v-icon
            icon="mdi-triangle"
            size="x-large"
            :color="comment.hasVoted === VoteType.DOWNVOTE ? 'error' : 'grey'"
            class="ml-1 downvote-icon"
            style="transform: rotate(180deg);"
            @click="vote(comment.id, VoteType.DOWNVOTE)"
          ></v-icon>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/store/users';
import { Comment } from '@/types/Comment';
import { VoteType } from '@/types/Vote';

const props = defineProps<{
  comments: Comment[]
}>();

const token = useUserStore().token;

onMounted(() => {
  for (const comment of props.comments) {
    const date = new Date(comment.createdAt);

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    comment.createdAt = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}, ${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  }
});

const vote = async (commentId: number, voteType: VoteType) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/post/votes/`,
      {
        comment: commentId,
        voteType: voteType
      },
      {headers: {Authorization: `Token ${token}`}}
    );
  } catch (e) {
    console.error(e);
  }
};

</script>

<style scoped>

.comment {
  margin-bottom: 3rem;
  padding: 1rem;
  border: 1px solid black;
}

.author {
  display: flex;
  align-items: center;
}

.author img {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  margin-right: 10px;
}

.author h3 {
  margin: 0;
}

.metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.date {
  font-size: 14px;
  color: #999;
}

.downvote-icon:hover {
  color: red !important;
}

.upvote-icon:hover {
  color: green !important;
}

</style>
