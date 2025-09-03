<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps<{
  id?: string;
  label?: string;
  modelValue: File | null;
  accept?: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
  (e: "change", value: File | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  emit("update:modelValue", file);
  emit("change", file);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <div class="mb-4">
    <label v-if="props.label" class="block text-sm font-semibold pb-4">
      {{ props.label }}
    </label>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      :id="props.id"
      type="file"
      :accept="props.accept"
      class="hidden"
      @change="handleFileSelect"
    />

    <button
      type="button"
      @click="triggerFileInput"
      :class="[
        'w-full flex items-center justify-between gap-3 px-4 py-3.5 border rounded-md text-sm font-medium transition-colors duration-200',
        props.error
          ? 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
      ]"
    >
      <span>{{ props.placeholder || "Pilih file" }}</span>
      <!-- Upload Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 text-orange-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
        />
      </svg>
    </button>

    <!-- Selected file name -->
    <div v-if="props.modelValue" class="mt-2 text-sm text-gray-600">
      File terpilih: {{ props.modelValue.name }}
    </div>

    <!-- Error message -->
    <p v-if="props.error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
