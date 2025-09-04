<script setup lang="ts">
import { ref, computed } from "vue";

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  id?: string;
  label?: string;
  modelValue: string | number;
  placeholder?: string;
  options: Option[];
  error?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLDivElement | null>(null);

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue);
});

const displayText = computed(() => {
  return selectedOption.value?.label || props.placeholder || "Pilih opsi";
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (option: Option) => {
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Add event listener when component mounts
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="mb-4" ref="selectRef">
    <label v-if="label" :for="id" class="block text-sm font-semibold pb-4">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Select Button -->
      <button
        type="button"
        :id="id"
        @click="toggleDropdown"
        :disabled="disabled"
        :class="[
          'w-full flex items-center justify-between px-4 py-3.5 text-left border rounded-md shadow-sm focus:outline-none transition-colors duration-200',
          {
            'border-red-500 focus:ring-red-500': error,
            'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500':
              !error && !disabled,
            'bg-gray-100 border-gray-200 cursor-not-allowed': disabled,
            'bg-white hover:bg-gray-50': !disabled,
          },
        ]"
      >
        <!-- Selected Text -->
        <span
          :class="[
            'text-sm truncate',
            {
              'text-gray-500': !selectedOption,
              'text-gray-900': selectedOption,
              'text-gray-400': disabled,
            },
          ]"
        >
          {{ displayText }}
        </span>

        <!-- Dropdown Arrow -->
        <svg
          :class="[
            'w-5 h-5 transition-transform duration-200',
            {
              'transform rotate-180': isOpen,
              'text-orange-500': !disabled,
              'text-gray-400': disabled,
            },
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Dropdown Options -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <div class="py-1">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              @click="selectOption(option)"
              :class="[
                'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                {
                  'bg-orange-50 text-orange-900': option.value === modelValue,
                  'text-gray-900': option.value !== modelValue,
                },
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
