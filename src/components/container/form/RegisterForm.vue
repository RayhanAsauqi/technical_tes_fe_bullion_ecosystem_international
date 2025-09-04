<script setup lang="ts">
import { ref } from "vue";
import Input from "../../ui/Input.vue";
import Button from "../../ui/Button.vue";
import InputFile from "../../ui/InputFile.vue";
import Select from "../../ui/Select.vue";
import DatePicker from "../../ui/DatePicker.vue";
import { API_ENDPOINT } from "../../../constants/endpoint";
import { parseApiError } from "../../../utils/ErrorHandler";
import { ToastSuccess, ToastError } from "../../../utils/ToastUtils";
import type { PayloadRegister } from "../../../types/payload/auth";

const formData = ref<PayloadRegister>({
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
const birthDate = ref<string>("");
const loading = ref<boolean>(false);
const errors = ref<Record<string, string>>({});

const genderOptions = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

function validateForm() {
  const newErrors: Record<string, string> = {};

  if (formData.value.first_name.length < 3) {
    newErrors.first_name = "Nama depan minimal 3 karakter";
  }
  if (formData.value.last_name.length < 3) {
    newErrors.last_name = "Nama belakang minimal 3 karakter";
  }
  if (!formData.value.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = "Format email tidak valid";
  }
  if (!/^[0-9]{10,15}$/.test(formData.value.phone)) {
    newErrors.phone = "No HP minimal 10 digit dan hanya angka";
  }
  if (!formData.value.address) {
    newErrors.address = "Alamat wajib diisi";
  }
  if (!birthDate.value) {
    newErrors.date_of_birth = "Tanggal lahir wajib diisi";
  }
  if (formData.value.password.length < 6) {
    newErrors.password = "Password minimal 6 karakter";
  }
  if (formData.value.password !== formData.value.confirm_password) {
    newErrors.confirm_password = "Konfirmasi password tidak sama";
  }
  if (formData.value.photo) {
    if (formData.value.photo.size > 5 * 1024 * 1024) {
      newErrors.photo = "Ukuran foto maksimal 5MB";
    }
    if (!formData.value.photo.type.startsWith("image/")) {
      newErrors.photo = "File harus berupa gambar";
    }
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!validateForm()) return;

  loading.value = true;
  try {
    const body = new FormData();
    body.append("first_name", formData.value.first_name);
    body.append("last_name", formData.value.last_name);
    body.append("gender", selectGender.value || formData.value.gender);
    body.append("date_of_birth", birthDate.value || formData.value.date_of_birth);
    body.append("email", formData.value.email);
    body.append("phone", formData.value.phone);
    body.append("address", formData.value.address);
    body.append("password", formData.value.password);
    body.append("confirm_password", formData.value.confirm_password);
    if (formData.value.photo) {
      body.append("photo", formData.value.photo);
    }

    const res = await fetch(`${API_ENDPOINT}/auth/register`, {
      method: "POST",
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      throw data;
    }

    ToastSuccess("Register Berhasil, Silahkan Login");
  } catch (err: any) {
    const message = parseApiError(err);
    ToastError(message);
  } finally {
    loading.value = false;
  }
}

function handleFileChange(file: File | null) {
  formData.value.photo = file;
}
function handleSelectGenderChange(value: string | number) {
  selectGender.value = String(value);
}
function handleDateChange(value: string) {
  birthDate.value = value;
}
</script>

<template>
  <section>
    <h1 class="font-bold text-3xl pt-20 pb-10">Daftar</h1>
    <form @submit="handleSubmit" class="grid">
      <div class="grid lg:grid-cols-2 gap-x-4">
        <Input
          id="first_name"
          label="Nama Depan"
          v-model="formData.first_name"
          placeholder="Masukan Nama Depan"
          :error="errors.first_name"
        />
        <Input
          id="last_name"
          label="Nama Belakang"
          v-model="formData.last_name"
          placeholder="Masukan Nama Belakang"
          :error="errors.last_name"
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
          :error="errors.date_of_birth"
        />
      </div>
      <Input
        id="email"
        label="Email"
        v-model="formData.email"
        placeholder="Masukan email"
        :error="errors.email"
      />
      <Input
        id="phone"
        label="No Handphone"
        type="number"
        v-model="formData.phone"
        placeholder="Masukan no handphone"
        :error="errors.phone"
      />
      <Input
        id="address"
        label="Alamat"
        v-model="formData.address"
        placeholder="Masukan alamat"
        :error="errors.address"
      />
      <div class="grid lg:grid-cols-2 gap-x-4">
        <Input
          id="password"
          label="Password"
          type="password"
          v-model="formData.password"
          placeholder="Masukan password"
          :error="errors.password"
        />
        <Input
          id="confirm_password"
          label="Konfirmasi Password"
          type="password"
          v-model="formData.confirm_password"
          placeholder="Masukan konfirmasi password"
          :error="errors.confirm_password"
        />
      </div>
      <InputFile
        id="profile-picture"
        label="Foto Profil"
        v-model="formData.photo"
        accept="image/*"
        placeholder="Pilih foto profil"
        :error="errors.photo"
        @change="handleFileChange"
      />

      <Button type="submit" variant="blue" class="w-full" :disabled="loading">
        {{ loading ? "Loading..." : "Daftar" }}
      </Button>
    </form>
  </section>
</template>
