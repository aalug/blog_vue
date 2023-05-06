<template>
  <SuccessSnackbar
    v-if="isDeleteSuccessful"
    color="success"
    text="You have successfully deleted the image."
    :timeout="3000"
  />
  <SuccessSnackbar
    v-if="isEditSuccessful"
    color="success"
    text="You have successfully updated the image."
    :timeout="3000"
  />

  <v-dialog
    v-model="showEditDialog"
    width="1024"
  >
    <v-card rounded="0">
      <v-card-title>
        <span class="text-h5">Edit the image title</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field
            v-model="newTitle"
            label="Image title"
            variant="outlined"
            rounded="0"
          ></v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="outlined"
          @click="showEditDialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="outlined"
          @click="editImage()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :elevation="isHovering ? 12 : 2"
      class="card"
      :class="{ 'on-hover': isHovering }"
      v-bind="props"
      rounded="0"
    >
      <v-img
        :src="image"
        height="225px"
        cover
      >
        <div class="mt-5 text-center post-details">
          <v-card-title class="text-h6 text-white d-flex flex-column">
            <p class="mt-4">
              {{ title }}
            </p>
          </v-card-title>
          <div>
            <v-btn
              variant="plain"
              class="edit-btn"
              :class="{ 'show-btns': isHovering }"
              :color="transparent"
              icon="mdi-pencil"
              @click="showEditDialog = true;"
            ></v-btn>
            <v-btn
              variant="plain"
              class="delete-btn"
              :class="{ 'show-btns': isHovering }"
              :color="transparent"
              icon="mdi-delete"
              @click="deleteImage()"
            ></v-btn>
          </div>

        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useUserStore } from '@/store/users';
import SuccessSnackbar from '@/components/alerts/SuccessSnackbar.vue';

const props = defineProps<{
  id: string;
  image: File | string;
  title: string;
}>();
const transparent: string = 'rgba(255, 255, 255, 0)';
const newTitle = ref<string>('');
const showEditDialog = ref<boolean>(false);
const isDeleteSuccessful = ref<boolean>(false);
const isEditSuccessful = ref<boolean>(false);
const userStore = useUserStore();
const {token} = storeToRefs(userStore);
onMounted(() => {
  newTitle.value = props.title;
});
const editImage = async () => {
  /**
   * Send patch request and update the value of the image title.
   */
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/post/postimages/${props.id}/`,
      {
        title: newTitle.value
      },
      {headers: {Authorization: `Token ${token.value}`}}
    );
    isEditSuccessful.value = true;
    showEditDialog.value = false;
  } catch (e) {
    console.error(e);
  }
};
const deleteImage = async () => {
  /**
   * Send delete request to delete the post image.
   */
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/post/postimages/${props.id}/`,
      {headers: {Authorization: `Token ${token.value}`}}
    );
    isDeleteSuccessful.value = true;
  } catch (e) {
    console.error(e);
  }
};
</script>

<style scoped>
.card {
  transition: opacity .4s ease-in-out;
}

.card:not(.on-hover) {
  opacity: 0.6;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}

.delete-btn, .edit-btn {
  transition: color .5s ease;
}

.delete-btn:hover {
  color: var(--error-red) !important;
}

.edit-btn:hover {
  color: #5f5fea !important;
}

.post-details {
  transition: background-color .4s ease;
}

.post-details:hover {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
