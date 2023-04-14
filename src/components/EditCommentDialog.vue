<template>
  <v-dialog
    v-model="showDialog"
    persistent
    width="1024"
  >
    <v-card
      class="py-8 px-5"
      style="width: 50%; margin: auto;"
    >
      <v-card-title class="mb-6">
        <span class="text-h4">Edit the comment</span>
      </v-card-title>

      <v-btn
        icon="mdi-close"
        variant="text"
        style="position: absolute; top: 0.3rem; right: 0.3rem;"
        @click="showDialog = false; emit('closeDialog');"
      >
      </v-btn>
      {{newCommentText}}
      <v-form @submit.prevent="handleEditComment()">
        <v-textarea
          v-model="newCommentText"
          :rules="[v => !!v || 'This field cannot be empty. Please delete this comment.']"
          variant="outlined"
          label="Edit the comment"
          required
        ></v-textarea>

        <div class="d-flex flex-column mt-10">
          <v-btn
            color="black"
            type="submit"
            rounded="0"
          >
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/users';
import axios from 'axios';

const props = defineProps<{
  oldCommentText: string,
  editCommentId: number
}>();

const emit = defineEmits(['closeDialog']);

const showDialog = ref<boolean>(true);

const newCommentText = ref('');

const userStore = useUserStore();
const {token} = storeToRefs(userStore);

onMounted(() => {
  newCommentText.value = props.oldCommentText;
})

const handleEditComment = async () => {
  /**
   * Send patch request and update the text of a comment.
   * Then send emit so the parent component knows that the dialog was closed.
   */
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/post/comments/${props.editCommentId}/`,
      {text: newCommentText.value},
      {headers: {Authorization: `Token ${token.value}`}}
    );
    emit('closeDialog');
    showDialog.value = false;
  } catch (e) {
    console.error(e);
  }
};

</script>
