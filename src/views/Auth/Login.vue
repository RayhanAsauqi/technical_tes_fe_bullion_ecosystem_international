<script setup lang="ts">
import LoginForm from "../../components/container/form/LoginForm.vue";
import AuthLayout from "../../components/layouts/AuthLayout.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <AuthLayout bg-color="bg-bullion-orange">
    <LoginForm />
    <div class="text-center mt-4">
      <p class="">
        Belum punya akun?
        <RouterLink to="/auth/register" class="font-semibold underline ">
          Daftar di sini
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
