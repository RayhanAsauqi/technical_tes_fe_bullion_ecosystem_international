<script setup lang="ts">
import { ref } from "vue";
import Input from "../../ui/Input.vue";
import Button from "../../ui/Button.vue";

type FormData = {
  email: string;
  password: string;
};

const formData = ref<FormData>({
  email: "",
  password: "",
});

const error = ref<string>("");
</script>

<template>
  <section class="">
    <h1 class="font-bold text-3xl pt-20 pb-10">Login Admin</h1>
    <form action="">
      <div class="w-full">
        <Input
          id="email"
          label="Email"
          v-model="formData.email"
          placeholder="example@gmail.com"
          :error="error"
        />
        
        <Input
          id="password"
          label="Password"
          v-model="formData.password"
          placeholder="Enter your password"
          :error="error"
        />

        <Button type="submit" variant="orange" class="w-full"> Masuk </Button>
      </div>
    </form>
  </section>
</template>
