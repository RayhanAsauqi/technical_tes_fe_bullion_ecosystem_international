<script setup lang="ts">
interface DialogProps {
  isOpen: boolean;
  title: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

interface DialogEmits {
  (e: "close"): void;
}

const props = withDefaults(defineProps<DialogProps>(), {
  maxWidth: "sm",
  showCloseButton: true,
});

const emit = defineEmits<DialogEmits>();

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const closeDialog = () => {
  emit("close");
};

const handleBackdropClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    closeDialog();
  }
};
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click="handleBackdropClick"
  >
    <div
      :class="[
        'bg-white rounded-lg shadow-xl w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col',
        maxWidthClasses[props.maxWidth],
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 flex-shrink-0">
        <h2 class="text-xl font-semibold text-gray-900">{{ props.title }}</h2>
        <button
          v-if="props.showCloseButton"
          @click="closeDialog"
          class="p-1 rounded-full bg-bullion-orange hover:bg-bullion-orange/80 transition-colors"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content Slot -->
      <div class="p-6 overflow-y-auto flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>
