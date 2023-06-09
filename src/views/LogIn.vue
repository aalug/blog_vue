<template>
  <div class="container">
    <v-sheet width="600" class="mx-auto sheet">
      <SuccessSnackbar
        v-if="isSuccessful && !forgotPassword"
        text="Congratulations! You have successfully logged in to your account."
        :timeout="4000"
        color="white"
      />
      <SuccessAlert
        v-if="isSuccessful && forgotPassword"
        title="Success!"
        color="success"
        text="A reset password link has been sent. Please check your email."
        :signUp="false"
        class="mb-8"
      />
      <h2 class="mb-4">{{ forgotPassword ? 'Reset password' : 'Login' }}</h2>
      <v-form @submit.prevent="handleSubmit()">
        <v-text-field
          v-model="email"
          :rules="[v => !!v || 'Email is required']"
          label="Email"
          type="email"
          required
          variant="outlined"
          rounded="0"
        ></v-text-field>

        <v-text-field
          v-if="!forgotPassword"
          v-model="password"
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

        <p
          v-if="errorMessage"
          class="text-error mt-4"
        >
          {{ errorMessage }}
        </p>

        <a
          v-if="!forgotPassword"
          style="cursor: pointer;"
          class="float-right mb-4"
          @click="handleForgotPassword()"
        >
          Forgot password?</a>

        <div class="d-flex mt-12 flex-column">
          <v-btn
            color="black"
            block
            type="submit"
            :disabled="loading"
            rounded="0"
          >
            {{ forgotPassword ? 'Submit' : 'Login' }}
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/users';
import SuccessSnackbar from '@/components/alerts/SuccessSnackbar.vue';
import SuccessAlert from '@/components/alerts/SuccessAlert.vue';

const email = ref<string>('');
const password = ref<string>('');
const forgotPassword = ref<boolean>(false);

const showPass = ref<boolean>(false);

const userStore = useUserStore();
const {loading, errorMessage, isSuccessful} = storeToRefs(userStore);
// Clear the error message - when coming from sign up page the message would be kept
errorMessage.value = '';

const router = useRouter();

const handleSubmit = async () => {
  if (!forgotPassword.value) {
    await userStore.handleLogin(email.value, password.value);
    if (isSuccessful.value) {
      await router.push({name: 'home'});
    }
  } else {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/forgot-password/`,
        {email: email.value}
      );
      isSuccessful.value = true;
      errorMessage.value = '';
    } catch (e) {
      console.error(e);
      // @ts-ignore
      errorMessage.value = e.response.data.message;
    }
  }
};

const handleForgotPassword = () => {
  forgotPassword.value = true;
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

</style>
