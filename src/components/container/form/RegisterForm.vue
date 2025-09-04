<script setup lang="ts">
import { ref } from "vue";
import Input from "../../ui/Input.vue";
import Button from "../../ui/Button.vue";
import InputFile from "../../ui/InputFile.vue";
import Select from "../../ui/Select.vue";
import DatePicker from "../../ui/DatePicker.vue";

type FormData = {
  first_name: string;
  last_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  photo: File | null;
  password: string;
  confirm_password: string;
};

const formData = ref<FormData>({
  first_name: "",
  last_name: "",
  gender: "male",
  date_of_birth: "",
  email: "",
  phone: "",
  address: "",
  photo: null,
  password: "",
  confirm_password: "",
});

const selectGender = ref<string>("");
const birthDate = ref("");

const genderOptions = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

const error = ref<string>("");

function handleChange(val: string) {
  console.log("onChange value:", val);
  if (val.length < 3) {
    error.value = "Minimal 3 karakter";
  } else {
    error.value = "";
  }
}

function handleSubmit(e: Event) {
  e.preventDefault();
}

function handleFileChange(file: File | null) {
  console.log("File selected:", file);
  if (file && file.size > 5 * 1024 * 1024) {
    error.value = "File size must be less than 5MB";
  } else {
    error.value = "";
  }
}

function handleSelectGenderChange(value: string | number) {
  console.log("Gender selected:", value);
}

function handleDateChange(value: string) {
  console.log("date selected:", value);
}
</script>

<template>
  <section class="">
    <h1 class="font-bold text-3xl pt-20 pb-10">Daftar</h1>
    <form @submit="handleSubmit" class="grid">
      <div class="grid lg:grid-cols-2 gap-x-4">
        <Input
          id="first_name"
          label="Nama Depan"
          v-model="formData.first_name"
          placeholder="Masukan Nama Depan "
          :error="error"
          @change="handleChange"
        />
        <Input
          id="last_name"
          label="Nama Belakang"
          v-model="formData.last_name"
          placeholder="Masukan Nama Belakang "
          :error="error"
          @change="handleChange"
        />
        <Select
          id="gender"
          label="Jenis Kelamin"
          v-model="selectGender"
          :options="genderOptions"
          placeholder="Pilih jenis kelamin"
          @change="handleSelectGenderChange"
        />
        <DatePicker
          id="birth-date"
          label="Tanggal Lahir"
          v-model="birthDate"
          placeholder="Pilih tanggal lahir"
          :maxDate="new Date().toISOString().split('T')[0]"
          @change="handleDateChange"
        />
      </div>
      <Input
        id="email"
        label="Email"
        v-model="formData.email"
        placeholder="Masukan email"
        :error="error"
        @change="handleChange"
      />
      <Input
        id="phone"
        label="No Handphone"
        type="number"
        v-model="formData.phone"
        placeholder="Masukan no handphone"
        :error="error"
        @change="handleChange"
      />
      <Input
        id="address"
        label="Alamat"
        v-model="formData.address"
        placeholder="Masukan alamat"
        :error="error"
        @change="handleChange"
      />
      <div class="grid lg:grid-cols-2 gap-x-4">
        <Input
          id="password"
          label="Password"
          v-model="formData.password"
          placeholder="Masukan alamat"
          :error="error"
          @change="handleChange"
        />
        <Input
          id="confirm_password"
          label="Konfirmasi Password"
          v-model="formData.confirm_password"
          placeholder="Masukan konfirmasi password"
          :error="error"
          @change="handleChange"
        />
      </div>
      <InputFile
        id="profile-picture"
        label="Foto Profil"
        v-model="formData.photo"
        accept="image/*"
        placeholder="Pilih foto profil"
        :error="error"
        @change="handleFileChange"
      />

      <Button type="submit" variant="blue" class="w-full"> Masuk </Button>
    </form>
  </section>
</template>
