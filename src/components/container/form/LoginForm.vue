<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Input from "../../ui/Input.vue";
import Cookies from "js-cookie";
import Button from "../../ui/Button.vue";
import { API_ENDPOINT } from "../../../constants/endpoint";
import { parseApiError } from "../../../utils/ErrorHandler";
import { ToastError, ToastSuccess } from "../../../utils/ToastUtils";
import { useFetch } from "../../../composable/useFetch";

const router = useRouter();

type FormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  status: number;
  iserror: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    token: string;
  };
};

const formData = ref<FormData>({
  email: "",
  password: "",
});
const errors = ref<Record<string, string>>({});
const showPassword = ref<boolean>(false);

const { loading, request } = useFetch<LoginResponse>();

function validateForm() {
  const newErrors: Record<string, string> = {};

  if (formData.value.email.length < 3) {
    newErrors.email = "Email harus di isi";
  }

  if (formData.value.password.length < 3) {
    newErrors.password = "Password harus di isi";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const result = await request(`${API_ENDPOINT}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.value.email,
        password: formData.value.password,
      }),
    });

    if (result) {
      const token = result.data?.token;
      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: "strict",
        });
      }

      ToastSuccess("Login Berhasil!!");

      formData.value = { email: "", password: "" };
      errors.value = {};

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  } catch (err: any) {
    const message = err.message || parseApiError(err);
    errors.value = {};
    ToastError(message);
  }
}
</script>

<template>
  <section class="">
    <h1 class="font-bold text-3xl pt-20 pb-10">Login Admin</h1>
    <form @submit="handleSubmit">
      <div class="w-full">
        <Input
          id="email"
          label="Email"
          v-model="formData.email"
          placeholder="example@gmail.com"
          :error="errors.email"
        />

        <div class="relative">
          <Input
            id="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            v-model="formData.password"
            placeholder="Enter your password"
            :error="errors.password"
          />

          <!-- Eye Icon -->
          <button
            type="button"
            class="absolute right-3 top-14 text-gray-600 hover:text-gray-900"
            @click="showPassword = !showPassword"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-bullion-orange"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-bullion-orange"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c1.72 0 3.342-.405 4.77-1.125M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.774 3.162 10.066 7.5a10.45 10.45 0 0 1-4.293 5.087M6.228 6.228 3 3m3.228 3.228 12.544 12.544"
              />
            </svg>
          </button>
        </div>

        <Button type="submit" variant="orange" :disabled="loading" class="w-full">
          {{ loading ? "Memproses..." : "Masuk" }}
        </Button>
      </div>
    </form>
  </section>
</template>
