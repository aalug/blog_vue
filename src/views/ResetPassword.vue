<template>
  <div class="container">
    <v-sheet width="600" class="mx-auto sheet">
      <SuccessSnackbar
        v-if="isSuccessful"
        text="Congratulations! You have successfully changed your password."
        :timeout="4000"
        color="white"
      />
      <h2 class="mb-4">Reset password</h2>
      <v-form @submit.prevent="handleSubmit()">

        <v-text-field
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

        <div class="d-flex mt-12 flex-column">
          <v-btn
            color="black"
            block
            type="submit"
            :disabled="loading"
            rounded="0"
          >
            Submit
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/users';
import SuccessSnackbar from '@/components/alerts/SuccessSnackbar.vue';

const password = ref<string>('');

const showPass = ref<boolean>(false);

const userStore = useUserStore();
const {loading, errorMessage, isSuccessful} = storeToRefs(userStore);
// Clear the error message - when coming from sign up page the message would be kept
errorMessage.value = '';

const route = useRoute();
const router = useRouter();

const handleSubmit = async () => {

  const encodedPk = route.query.pk?.toString();
  const token = route.query.token?.toString();
  if (encodedPk && token)
    await userStore.handleResetPassword(encodedPk, token, password.value);
  if (isSuccessful.value) {
    await router.push({name: 'login'});
  }
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
