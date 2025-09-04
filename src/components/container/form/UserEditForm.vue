<script setup lang="ts">
import { ref, reactive } from "vue";
import Cookies from "js-cookie";
import Input from "../../ui/Input.vue";
import Select from "../../ui/Select.vue";
import DatePicker from "../../ui/DatePicker.vue";
import { API_ENDPOINT } from "../../../constants/endpoint";
import Button from "../../ui/Button.vue";
import { parseApiError } from "../../../utils/ErrorHandler";
import { ToastError, ToastSuccess } from "../../../utils/ToastUtils";

interface UserData {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

interface UserEditFormProps {
  user: UserData;
}

interface UserEditFormEmits {
  (e: "save", userData: UserData): void;
  (e: "cancel"): void;
  (e: "loading", isLoading: boolean): void;
  (e: "error", error: string): void;
}

const props = defineProps<UserEditFormProps>();
const emit = defineEmits<UserEditFormEmits>();

const formData = reactive({
  firstName: props.user.name.split(" ")[0] || "",
  lastName: props.user.name.split(" ").slice(1).join(" ") || "",
  gender: props.user.gender || "Laki-laki",
  birthDate: props.user.birthDate || "",
  email: props.user.email || "",
  phone: props.user.phone || "",
  address: props.user.address || "",
  password: "",
  confirmPassword: "",
  profileImage: props.user.profileImage || "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

const genderOptions = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
];

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

function validateForm() {
  const newErrors: Record<string, string> = {};

  if (!formData.firstName || formData.firstName.length < 2) {
    newErrors.firstName = "Nama depan harus di isi minimal 2 karakter";
  }

  if (!formData.email || formData.email.length < 3) {
    newErrors.email = "Email harus di isi";
  }

  if (formData.password && formData.password.length < 6) {
    newErrors.password = "Password minimal 6 karakter";
  }

  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    newErrors.confirmPassword = "Password dan konfirmasi password tidak sama";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  await handleSave();
};

const handleSave = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    emit("loading", true);

    const updateData: any = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender: formData.gender,
      date_of_birth: formData.birthDate,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    let token = Cookies.get("token");

    const response = await fetch(`${API_ENDPOINT}/admin/${props.user.id}/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        throw { message: "Data yang dimasukkan tidak valid" };
      }
      throw data;
    }

    ToastSuccess("Data berhasil diperbarui!");

    const userData: UserData = {
      id: props.user.id,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      gender: formData.gender,
      birthDate: formData.birthDate,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      profileImage: formData.profileImage,
    };

    errors.value = {};

    emit("save", userData);
  } catch (err: any) {
    const message = err.message || parseApiError(err);
    errors.value = {};
    ToastError(message);
    emit("error", message);
  } finally {
    isLoading.value = false;
    emit("loading", false);
  }
};

defineExpose({
  handleSave,
});
</script>

<template>
  <form @submit="handleSubmit" class="space-y-4">
    <!-- Name Fields -->
    <div class="grid grid-cols-2 gap-4">
      <Input
        label="Nama Depan"
        v-model="formData.firstName"
        placeholder="Masukkan nama depan"
        :error="errors.firstName"
        required
      />

      <Input
        label="Nama Belakang"
        v-model="formData.lastName"
        placeholder="Masukkan nama belakang"
        :error="errors.lastName"
      />
    </div>

    <!-- Gender and Birth Date -->
    <div class="grid grid-cols-2 gap-4">
      <Select
        label="Jenis Kelamin"
        v-model="formData.gender"
        :options="genderOptions"
        placeholder="Pilih jenis kelamin"
      />
      <DatePicker label="Tanggal Lahir" v-model="formData.birthDate" placeholder="1 Januari 1990" />
    </div>

    <!-- Email -->
    <Input
      label="Email"
      v-model="formData.email"
      type="email"
      placeholder="masukkan email"
      :error="errors.email"
      required
    />

    <!-- Phone -->
    <Input
      label="No. Handphone"
      v-model="formData.phone"
      type="tel"
      placeholder="masukkan nomor handphone"
      :error="errors.phone"
    />

    <!-- Address -->
    <Input
      label="Alamat"
      v-model="formData.address"
      placeholder="masukkan alamat"
      :error="errors.address"
    />

    <!-- Password Fields -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div class="relative">
          <Input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="************"
            :error="errors.password"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-600"
          >
            <svg
              v-if="showPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              ></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
        <div class="relative">
          <Input
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="*************"
            :error="errors.confirmPassword"
          />
          <button
            type="button"
            @click="toggleConfirmPasswordVisibility"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-600"
          >
            <svg
              v-if="showConfirmPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              ></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Button type="button" @click="handleSave" variant="orange" :disabled="isLoading" class="w-full"
      >Simpan</Button
    >
  </form>
</template>
