<script setup lang="ts">
const props = defineProps<{
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "orange" | "blue" | "secondary" | "outline";
  disabled?: boolean;
  fullWidth?: boolean;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "mouseover", event: MouseEvent): void;
  (e: "mouseleave", event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'py-3.5 px-4 rounded-lg font-medium transition duration-200',
      fullWidth ? 'w-full' : 'inline-flex items-center justify-center',
      disabled
        ? 'bg-gray-400 cursor-not-allowed text-white'
        : variant === 'orange'
        ? 'bg-bullion-orange hover:bg-bullion-orange/90 hover:shadow-lg text-white'
        : variant === 'blue'
        ? 'bg-bullion-blue hover:bg-bullion-blue/90 hover:shadow-lg text-white'
        : variant === 'secondary'
        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        : 'bg-transparent text-black border border-gray-300 hover:bg-gray-100',
    ]"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
