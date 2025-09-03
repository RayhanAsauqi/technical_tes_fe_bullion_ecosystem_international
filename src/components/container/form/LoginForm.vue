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

const handleChange = (val: string) => {
  console.log("onChange value:", val);
  if (val.length < 3) {
    error.value = "Minimal 3 karakter";
  } else {
    error.value = "";
  }
};
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
          @change="handleChange"
        />
        <!-- <EyeIcon /> -->
        <Input
          id="password"
          label="Password"
          v-model="formData.password"
          placeholder="Enter your password"
          :error="error"
          @change="handleChange"
        />

        <Button type="submit" variant="orange" class="w-full"> Masuk </Button>
      </div>
    </form>
  </section>
</template>
