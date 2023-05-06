<template>
  <v-container
    style="position: relative; top: 5rem;"
    class="py-8 px-12"
  >
    <h2 v-if="id" class="mb-8 text-center">Edit the post</h2>
    <h2 v-else class="mb-8 text-center">Add a new post</h2>

    <v-img
      v-if="postDetails.coverImage"
      :src="postDetails.coverImage"
      class="mb-10"
    />

    <SuccessAlert
      v-if="isSuccessful"
      color="success"
      title="Success!"
      text="You have successfully added a new post."
      :signUp="false"
      class="mt-2 mb-6"
    />

    <form
      @submit.prevent="handleSubmit"
      @keydown.enter.prevent
    >
      <v-text-field
        v-model="postDetails.title"
        label="Title"
        variant="outlined"
        rounded="0"
        required
      ></v-text-field>

      <v-textarea
        v-model="postDetails.description"
        label="Description"
        no-resize
        rows="3"
        variant="outlined"
        rounded="0"
        required
      ></v-textarea>

      <v-textarea
        v-model="postDetails.body"
        label="Body"
        rows="10"
        variant="outlined"
        rounded="0"
        required
      ></v-textarea>

      <AddTags
        @addTag="handleAddTag"
        @removeTag="handleRemoveTag"
      />

      <v-file-input
        label="Cover image"
        variant="outlined"
        accept="image/png, image/jpeg, image/bmp"
        prepend-icon="mdi-camera"
        @change="onCoverImageSelected"
      ></v-file-input>

      <v-divider class="mb-3 mt-2"></v-divider>

      <div
        v-for="i in numberOfAdditionalImages"
        v-bind:key="i"
        class="d-flex"
        :class="postImagesErrors.includes(i) ? 'post-image-error' : ''"
      >
        <v-file-input
          :id="`postImage${i}`"
          label="Additional images"
          variant="outlined"
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          style="width: 30%"
        ></v-file-input>

        <v-text-field
          :id="`postImageTitle${i}`"
          label="Image title"
          variant="outlined"
          class="ml-2"
          style="width: 70%"
        ></v-text-field>
      </div>

      <v-btn
        variant="outlined"
        rounded="0"
        @click="numberOfAdditionalImages++"
      >
        <v-icon>mdi-plus</v-icon>
        Add another image
      </v-btn>
      <br>

      <div class="d-flex justify-end mt-6 mb-8 ">
        <v-row>
          <v-col
            cols="3"
            v-for="image in oldPostImages"
            v-bind:key="image"
          >
            <SmallHoverImage
              :id="image.id"
              :image="image.image"
              :title="image.title"
            />
          </v-col>
        </v-row>
      </div>

      <p
        v-if="errorMessage"
        class="text-error mt-10"
      >
        {{ errorMessage }}
      </p>

      <v-btn
        class="me-4 mt-7"
        size="x-large"
        type="submit"
        color="black"
        variant="elevated"
        rounded="0"
      >
        Submit
      </v-btn>

    </form>

    <MultipleColorLinearLoading
      v-if="loading"
      color1="green-accent-2"
      color2="blue"
      color3="yellow-lighten-1"
      color4="teal-darken-1"
      style="position:relative; top: 1rem"
    />

  </v-container>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/store/users';
import { Post } from '@/types/post';
import { PostImage } from '@/types/PostImage';
import AddTags from '@/components/AddTags';
import SuccessAlert from '@/components/alerts/SuccessAlert.vue';
import MultipleColorLinearLoading from '@/components/loadings/MultipleColorLinearLoading';
import HoverImage from '@/components/HoverImaeg.vue';

const postDetails = reactive<Partial<Post>>({
  title: '',
  description: '',
  tags: [],
  body: '',
  coverImage: null
});

const postImages = ref<PostImage[]>([]);
const oldPostImages = ref<PostImage[]>([]);

const loading = ref<boolean>(false);
const numberOfAdditionalImages = ref<number>(1);
const postImagesErrors = ref<number[]>([]);

const errorMessage = ref<string>('');
const isSuccessful = ref<boolean>(false);

const token = useUserStore().token;

const id = ref<string | string[]>('');
const initialData = ref();
onMounted(async () => {
  id.value = useRoute().params.id;
  if (id.value) {
    // That means that `id` is in the route params,
    // and an existing post is being edited, not a new post created.
    loading.value = true;
    try {
      const {data} = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id.value}/`
      );
      postDetails.title = data.title;
      postDetails.description = data.description;
      postDetails.body = data.body;
      postDetails.tags = data.tags;
      postDetails.coverImage = data.coverImage;
      oldPostImages.value = data.images;
      initialData.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }
});

const handleAddTag = (tagName: string) => {
  postDetails.tags?.push({name: tagName});
};

const handleRemoveTag = (tagName: string) => {
  postDetails.tags = postDetails.tags?.filter(tag => tag.name !== tagName);
};

interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

const onCoverImageSelected = (event: InputFileEvent) => {
  if (event.target.files) {
    postDetails.coverImage = event.target.files[0];
  }
};

const handleSubmit = async () => {
  /**
   * Check if this is creating a new post or editing existing one.
   * Validate accordingly and send post or patch request.
   */
  // Validate post images (files and titles)

  // reset the error list and the post images list
  postImagesErrors.value = [];
  postImages.value = [];

  for (let i = 1; i <= numberOfAdditionalImages.value; i++) {
    const image = document.getElementById(`postImage${i}`);
    const title = document.getElementById(`postImageTitle${i}`);

    if (
      // @ts-ignore
      (image.files.length > 0 && title.value.trim().length < 1) ||
      // @ts-ignore
      (image.files.length < 1 && title.value.trim().length > 0)
    ) {
      postImagesErrors.value.push(i);
      // @ts-ignore
    } else if (image.files.length > 0 && title.value.trim().length > 0) {
      postImages.value.push({
          // @ts-ignore
          title: title.value.trim(),
          // @ts-ignore
          image: image.files[0]
        }
      );
    }
  }
  if (postImagesErrors.value.length > 0)
    return errorMessage.value = 'Fix images related errors.';


  const headers = {headers: {Authorization: `Token ${token}`}};

  // Create a form data with provided details
  const formData = new FormData();

  if (!id.value) {
    if (postDetails.title) formData.append('title', postDetails.title);
    else return errorMessage.value = 'Title is required.';

    if (postDetails.description) formData.append('description', postDetails.description);
    else return errorMessage.value = 'Description is required.';

    if (postDetails.body) formData.append('body', postDetails.body);
    else return errorMessage.value = 'Body is required.';

    if (postDetails.coverImage) formData.append('coverImage', postDetails.coverImage);
    else return errorMessage.value = 'Cover image is required.';

    if (postDetails.tags) formData.append('tags', JSON.stringify(postDetails.tags));

    loading.value = true;
    try {
      const {data} = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post/posts/`,
        formData,
        headers
      );
      const postId = data.id;
      if (postImages.value.length > 0) {
        // Set the post ID of added post images
        // to the ID of the created post.
        for (const postImg of postImages.value) {
          const fd = new FormData();
          fd.append('post', postId);
          fd.append('image', postImg.image);
          fd.append('title', postImg.title);
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/post/postimages/`,
            fd,
            headers
          );
        }
      }
      isSuccessful.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    if (postDetails.title) {
      if (postDetails.title !== initialData.value.title) {
        formData.append('title', postDetails.title);
      }
    } else {
      return errorMessage.value = 'Title is required.';
    }
    if (postDetails.description) {
      if (postDetails.description !== initialData.value.description) {
        formData.append('description', postDetails.description);
      }
    } else {
      return errorMessage.value = 'Description is required.';
    }
    if (postDetails.body) {
      if (postDetails.body !== initialData.value.body) {
        formData.append('body', postDetails.body);
      }
    } else {
      return errorMessage.value = 'Body is required.';
    }
    if (postDetails.coverImage) {
      if (postDetails.coverImage !== initialData.value.coverImage) {
        formData.append('coverImage', postDetails.coverImage);
      }
    } else {
      return errorMessage.value = 'Cover image is required.';
    }
    loading.value = true;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/post/posts/${id.value}/`,
        formData,
        headers
      );
      if (postImages.value.length > 0) {
        for (const postImg of postImages.value) {
          const fd = new FormData();
          // @ts-ignore
          fd.append('post', id.value);
          fd.append('image', postImg.image);
          fd.append('title', postImg.title);
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/post/postimages/`,
            fd,
            headers
          );
        }
      }
      isSuccessful.value = true;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }
};

</script>

<style scoped>
.post-image-error {
  color: red;
}
</style>
