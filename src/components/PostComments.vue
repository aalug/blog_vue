<template>

  <!-- Confirm deleting a comment-->
  <ConfirmDialog
    v-if="showConfirmationDialog"
    :key="refreshConfirmDialog"
    title="Are you sure"
    text="you want to delete this comment?"
    @confirm="handleConfirmingDelete"
  />

  <div
    v-for="comment in formattedComments"
    v-bind:key="comment.id"
  >
    <div class="comment">
      <div
        v-if="comment.author.username === user.username"
        class="float-right"
      >
        <span
          class="edit-delete-comment edit-comment"
          @click="editComment(comment.id)"
        >
          edit
        </span>
        <span
          class="edit-delete-comment delete-comment"
          @click="startDeletingProcess(comment.id)"
        >
          delete
        </span>
      </div>
      <div class="author">
        <img
          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
          :alt="`${comment.author.username}'s profile photo`">
        <h3>{{ comment.author.username }}</h3>
        <h5>points: {{ comment.author.userProfile?.points }}</h5>
      </div>
      <div>
        <p class="px-16" style="word-wrap: break-word; white-space: pre-wrap;">
          {{ comment.text }}
        </p>
      </div>
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
import { computed, ref, toRef } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/users';
import { Comment } from '@/types/Comment';
import { VoteType } from '@/types/Vote';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = defineProps<{
  comments: Comment[]
}>();

const userStore = useUserStore();

const {token, user} = storeToRefs(userStore);

const showConfirmationDialog = ref<boolean>(false);
const refreshConfirmDialog = ref<boolean>(false);
const commentToDeleteId = ref<number>(0);

const allComments = toRef(props, 'comments');

const formattedComments = computed(() => {
  return allComments.value.map(comment => {
    const date = new Date(comment.createdAt);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const formattedDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}, ${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

    return {
      ...comment,
      createdAt: formattedDate
    };
  });
});

const vote = async (commentId: number, voteType: VoteType) => {
  /**
   * Send post request to vote. Depending on
   * @param voteType create an upvote, downvote or remove a vote if user already voted this way.
   */
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/post/votes/`,
      {
        comment: commentId,
        voteType: voteType
      },
      {headers: {Authorization: `Token ${token.value}`}}
    );
  } catch (e) {
    console.error(e);
  }
};

const startDeletingProcess = (commentId: number) => {
  /**
   * Start deleting process. After the `delete` button is clicked, this function
   * will be called, and it will:
   * 1. Refresh the dialog component
   * 2. Display the confirmation dialog
   * 3. Set the value of commentToDeleteId
   */
  showConfirmationDialog.value = true;
  refreshConfirmDialog.value = !refreshConfirmDialog.value;
  commentToDeleteId.value = commentId;
};

const handleConfirmingDelete = (isConfirmed: boolean) => {
  /**
   * This function is called when dialog has received a response (emit).
   * If the response is `OK` then it will proceed and delete the comment.
   */
  if (isConfirmed) {
    deleteComment();
  }
};

const deleteComment = async () => {
  /**
   * Send delete request to delete a comment.
   */
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/post/comments/${commentToDeleteId.value}/`,
      {headers: {Authorization: `Token ${token.value}`}}
    );
  } catch (e) {
    console.error(e);
  }
  for (let i = 0; i < allComments.value.length; i++) {
    if (allComments.value[i].id === commentToDeleteId.value) {
      allComments.value.splice(i, 1);
      break;
    }
  }
  commentToDeleteId.value = 0;
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

.edit-delete-comment {
  cursor: pointer;
}

.delete-comment:hover {
  color: red;
}

.edit-comment:hover {
  color: #4646f1;
}
</style>
