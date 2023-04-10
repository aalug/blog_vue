<template>
  <div class="container">
    <v-sheet width="600" class="mx-auto sheet">
      <SuccessAlert
        v-if="isSuccessful"
        title="Success!"
        text="You have successfully created an account."
        color="success"
        :signUp="true"
        class="mb-6"
      />

      <h2 class="mb-4">Sign up</h2>
      <v-form @submit.prevent="handleSubmit()">
        <v-text-field
          v-model="userData.email"
          :rules="[v => !!v || 'Email is required']"
          label="Email"
          type="email"
          variant="outlined"
          rounded="0"
          required
        ></v-text-field>

        <v-text-field
          v-model="userData.username"
          :rules="[v => !!v || 'Username is required']"
          label="Username"
          variant="outlined"
          rounded="0"
          required
        ></v-text-field>

        <v-text-field
          v-model="userData.password"
          :rules="[v => !!v || 'Password is required']"
          label="Password"
          required
          variant="outlined"
          rounded="0"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          hint="At least 6 characters"
          @click:append="showPass = !showPass"
        ></v-text-field>

        <v-btn
          :icon="showMoreInfo ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="plain"
          color="black"
          size="large"
          @click="showMoreInfo = !showMoreInfo"
        ></v-btn>

        <v-expand-transition>
          <div v-show="showMoreInfo">
            <v-text-field
              v-model="userData.firstName"
              label="First Name"
              variant="outlined"
              rounded="0"
            ></v-text-field>
            <v-text-field
              v-model="userData.lastName"
              label="Last Name"
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
              class="date-picker"
            ></VueDatePicker>

          </div>
        </v-expand-transition>

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
            :disabled="loading"
            rounded="0"
          >
            Sign up
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUserStore } from '@/store/users';
import SuccessAlert from '@/components/alerts/SuccessAlert.vue';

const userData = reactive({
  email: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
});

// Date picker
const dateFormat = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Date Of Birth: ${day}/${month}/${year}`;
};

const showPass = ref<boolean>(false);
const showMoreInfo = ref<boolean>(false);

const userStore = useUserStore();
const {loading, errorMessage, isSuccessful} = storeToRefs(userStore);
// Clear the error message - when coming from login page the message would be kept
errorMessage.value = '';

const handleSubmit = async () => {
  let dateOfBirth = '';
  if (userData.dateOfBirth) {
    dateOfBirth = new Date(userData.dateOfBirth)
      .toISOString()
      .substring(0, 10);
  }
  const {email, username, password, firstName, lastName} = userData;
  await userStore.handleSignUp(
    email,
    username,
    password,
    firstName,
    lastName,
    dateOfBirth);
};

</script>

<style scoped>
.container {
  margin: 20% auto;
}

.sheet {
  background-color: rgba(255, 255, 255, 0.8);
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
