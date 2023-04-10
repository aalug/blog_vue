<template>
  <div class="container d-flex">
    <v-card class="mr-4 card">
      <v-card-title>
        Edit your profile

        <v-tooltip
          v-model="showTooltip"
          close-delay="500"
          content-class="bg-black rounded-0"
        >
          <template v-slot:activator="{ props }">
            <v-icon
              size="small"
              v-bind="props"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>You can edit how many fields at the time as you want.</span>
        </v-tooltip>

      </v-card-title>
      <SuccessAlert
        v-if="isSuccessful"
        title="Success!"
        text="You have successfully updated your profile."
        color="success"
        :signUp="false"
        class="mb-6"
      />
      <v-form @submit.prevent="handleSubmit()">

        <v-text-field
          v-model="userData.password"
          label="Password"
          variant="outlined"
          rounded="0"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          hint="At least 6 characters"
          class="my-4"
          @click:append="showPass = !showPass"
        ></v-text-field>

        <v-text-field
          v-model="userData.firstName"
          label="First Name"
          class="my-4"
          variant="outlined"
          rounded="0"
        ></v-text-field>

        <v-text-field
          v-model="userData.lastName"
          label="Last Name"
          class="my-4"
          variant="outlined"
          rounded="0"
        ></v-text-field>

        <VueDatePicker
          v-model="userData.dateOfBirth"
          :clearable="true"
          :enable-time-picker="false"
          :format="dateFormat"
          placeholder="Date Of Birth"
          auto-apply
          class="my-4 date-picker"
        ></VueDatePicker>

        <v-file-input
          accept="image/png, image/jpeg, image/bmp"
          prepend-icon="mdi-camera"
          label="Profile Image"
          class="my-10"
          variant="outlined"
          rounded="0"
          @change="onFileSelected"
        ></v-file-input>

        <p
          v-if="errorMessage"
          class="text-error mt-4"
        >
          {{ errorMessage }}
        </p>

        <div class="d-flex mt-12 flex-column">
          <v-btn
            color="black"
            block
            type="submit"
            :disabled="loading || !dataChanged"
            rounded="0"
          >
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-card class="ml-4 card">
      <v-card
        class="mx-auto d-flex justify-space-between"
        rounded="0"
      >
        <v-avatar
          color="grey"
          size="150"
          rounded="0"
        >
          <v-progress-circular
            v-if="imageLoading || loading"
            indeterminate
            color="white"
            :size="50"
            :width="6"
          />
          <v-img
            v-else
            cover
            :key="refreshImage"
            :src="profileImage"
          ></v-img>
        </v-avatar>

        <v-list-item
          class="text-black"
        >
          <v-list-item-title class="mb-5">
            <h1>{{ user.username }}</h1>
          </v-list-item-title>
          <v-list-item-subtitle>
            <h2>{{ user.email }}</h2>
          </v-list-item-subtitle>
        </v-list-item>
      </v-card>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUserStore } from '@/store/users';
import SuccessAlert from '@/components/alerts/SuccessAlert.vue';

const userData = reactive({
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: ''
});
const profileImage = ref();
const showTooltip = ref<boolean>(false);
const imageLoading = ref<boolean>(false);

// Was the user data edited
const dataChanged = ref<boolean>(false);

const refreshImage = ref<boolean>(false);

const userStore = useUserStore();

const showPass = ref<boolean>(false);
const {loading, errorMessage, isSuccessful, user} = storeToRefs(userStore);
// Clear the error message - when coming from login page the message would be kept
errorMessage.value = '';

const dateFormat = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Date Of Birth: ${day}/${month}/${year}`;
};

interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

const onFileSelected = (event: InputFileEvent) => {
  if (event.target.files) {
    imageLoading.value = true;
    profileImage.value = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(profileImage.value);
    reader.onload = () => {
      profileImage.value = reader.result;
    };
    dataChanged.value = true;
    refreshImage.value = !refreshImage.value;
    imageLoading.value = false;
  }
};

const handleSubmit = async () => {
  let dateOfBirth = '';
  if (userData.dateOfBirth) {
    dateOfBirth = new Date(userData.dateOfBirth)
      .toISOString()
      .substring(0, 10);
  }
  const {password, firstName, lastName} = userData;
  await userStore.handleUpdateUserProfile(
    password,
    firstName,
    lastName,
    dateOfBirth,
    profileImage.value
  );
  dataChanged.value = false;
  refreshImage.value = !refreshImage.value;
};

watch(userData, () => {
  return dataChanged.value =
    userData.firstName !== user.value.userProfile.firstName ||
    userData.lastName !== user.value.userProfile.lastName ||
    userData.dateOfBirth !== user.value.userProfile.dateOfBirth ||
    userData.password.length > 5;
});

onMounted(async () => {
  /*
   * Retrieve user data and fill in the form fields.
   */
  loading.value = true;
  try {
    await userStore.getUserInfo();
    userData.firstName = user.value.userProfile.firstName;
    userData.lastName = user.value.userProfile.lastName;
    userData.dateOfBirth = user.value.userProfile.dateOfBirth;
    profileImage.value = user.value.userProfile.profileImage;

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
.container {
  margin: 20% auto;
}

.card {
  width: 40rem;
  border-radius: 0;
  background-color: white;
  padding: 2rem 2.5rem 2.5rem 2.5rem;
}

.dp__theme_light {
  --dp-background-color: rgba(0, 0, 0, 0);
  --dp-text-color: #282828;
  --dp-hover-color: black;
  --dp-hover-text-color: black;
  --dp-hover-icon-color: #141414;
  --dp-primary-color: #1976d2;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: rgba(0, 0, 0, 0);
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: rgba(0, 0, 0, 0);
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>
