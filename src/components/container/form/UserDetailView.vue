<script setup lang="ts">
import type { User } from "../../../types/res/dashboard";

interface UserDetailViewProps {
  user: User;
}

defineProps<UserDetailViewProps>();
defineEmits<{
  edit: [user: User];
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- Profile Image -->
    <div class="flex justify-center">
      <div class="relative">
        <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
          <img
            src="https://via.placeholder.com/150x150/e5e7eb/9ca3af?text=User"
            :alt="`Profile ${user.name}`"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="text-center mt-3">
          <h3 class="text-lg font-semibold text-gray-900">Foto Profil</h3>
        </div>
      </div>
    </div>

    <!-- User Details -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Nama Depan -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">Nama Depan</label>
        <p class="text-sm text-gray-700">{{ user.name.split(" ")[0] || "-" }}</p>
      </div>

      <!-- Nama Belakang -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">Nama Belakang</label>
        <p class="text-sm text-gray-700">{{ user.name.split(" ").slice(1).join(" ") || "-" }}</p>
      </div>

      <!-- Jenis Kelamin -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">Jenis Kelamin</label>
        <p class="text-sm text-gray-700">{{ user.gender || "Laki-laki" }}</p>
      </div>

      <!-- Tanggal Lahir -->
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-2">Tanggal Lahir</label>
        <p class="text-sm text-gray-700">{{ user.date_of_birth || "1 Januari 1990" }}</p>
      </div>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-2">Email</label>
      <p class="text-sm text-gray-700">{{ user.email || "usernolsatu@mail.com" }}</p>
    </div>

    <!-- No. Handphone (Static for now since not in User type) -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-2">No. Handphone</label>
      <p class="text-sm text-gray-700">0812 3456 7890</p>
    </div>

    <!-- Alamat (Static for now since not in User type) -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-2">Alamat</label>
      <p class="text-sm text-gray-700">Jl. Perjuangan No.45</p>
    </div>

    <!-- Edit Button -->
    <div class="pt-4">
      <button
        @click="$emit('edit', user)"
        class="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
      >
        Edit
      </button>
    </div>
  </div>
</template>
