import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { User } from '@/types/User';
import { validateEmail } from '@/utils/validate-email';

export const useUserStore = defineStore('users', () => {
    const user = ref<User>(new User());
    const token = ref<string | null>(localStorage.getItem('token'));
    const errorMessage = ref<string>('');
    const loading = ref<boolean>(false);
    const isSuccessful = ref<boolean>(false);

    const handleSignUp = async (email: string,
                                username: string,
                                password: string,
                                firstName: string,
                                lastName: string,
                                dateOfBirth: string) => {
      /**
       * Handle the sign-up of a new user.
       * First, validate the data, then make POST request to the server.
       * If there is an error, set the value of errorMessage to the received error message
       */

      if (!validateEmail(email)) {
        return errorMessage.value = 'Email is invalid.';
      }

      if (!username) {
        return errorMessage.value = 'Username is required.';
      }

      if (password.length < 6) {
        return errorMessage.value = 'Password must be at least 6 characters.';
      }

      errorMessage.value = '';

      type Payload = {
        user: {
          email: string;
          username: string;
          password: string;
        };
        firstName?: string;
        lastName?: string;
        dateOfBirth?: string;
      };

      const payload: Payload = {
        user: {
          email: email,
          username: username,
          password: password
        }
      };

      if (firstName) payload['firstName'] = firstName;
      if (lastName) payload['lastName'] = lastName;
      if (dateOfBirth) payload['dateOfBirth'] = dateOfBirth;

      loading.value = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/create/`,
          payload
        );
        // Sign up was successful, set the value appropriately
        isSuccessful.value = true;

        // Clear the error message
        errorMessage.value = '';
      } catch (e) {
        // @ts-ignore
        if (e.response.status === 400) {
          // @ts-ignore
          const errorData = e.response.data.user;
          const message = ref<string>('');
          if (errorData.email && errorData.username) {
            message.value = 'User with this email and username already exists.';
          } else if (errorData.email) {
            message.value = errorData.email[0];
          } else if (errorData.username) {
            message.value = errorData.username[0];
          }
          errorMessage.value = message.value ? message.value : 'Error occurred while creating an account';
        } else {
          errorMessage.value = 'Error occurred while creating an account';
        }
      } finally {
        loading.value = false;
      }
    };

    const handleLogin = async (email: string, password: string) => {
      /**
       * Handle logging-in by getting the auth token
       * for the given credentials.
       * First, validate the given credentials then make post request,
       * and save the received token.
       */

      // Validation
      if (!validateEmail(email)) return errorMessage.value = 'Email is invalid.';

      loading.value = true;
      try {
        const {data} = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/token/`,
          {
            email: email,
            password: password
          }
        );
        // Store the token in the localStorage
        localStorage.setItem('token', data.token);
        token.value = data.token;

        // Login was successful, set the value appropriately
        isSuccessful.value = true;

        // Clear the error message
        errorMessage.value = '';
      } catch (e) {
        // @ts-ignore
        if (e.response.status === 400) {
          // @ts-ignore
          const errorData = e.response.data;
          const message = ref<string>('');
          if (errorData.nonFieldErrors) {
            message.value = errorData.nonFieldErrors[0];
          }
          errorMessage.value = message.value ? message.value : 'Error occurred while logging in.';
        } else {
          errorMessage.value = 'Error occurred while logging in.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      user,
      token,
      errorMessage,
      loading,
      isSuccessful,
      handleSignUp,
      handleLogin
    };
  }
);
