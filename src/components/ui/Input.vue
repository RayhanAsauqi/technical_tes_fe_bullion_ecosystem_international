<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  id?: string;
  label?: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("change", target.value);
};
</script>
<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-semibold pb-4">
      {{ props.label }}
    </label>
    <input
      :id="props.id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="[
        'mt-1 block w-full rounded-md border px-3 py-3.5 shadow-sm focus:outline-none sm:text-sm placeholder-black',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500',
      ]"
      @input="onInput"
      @change="onChange"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
