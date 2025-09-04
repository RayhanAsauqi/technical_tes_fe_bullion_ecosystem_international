<script setup lang="ts">
import { computed } from "vue";

interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
}

interface PaginationEmits {
  (e: "update:offset", value: number): void;
}

const props = defineProps<PaginationProps>();
const emit = defineEmits<PaginationEmits>();

const currentPage = computed(() => Math.floor(props.offset / props.limit) + 1);
const totalPages = computed(() => Math.ceil(props.total / props.limit));

const visiblePages = computed(() => {
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    const newOffset = (page - 1) * props.limit;
    emit("update:offset", newOffset);
  }
};

const goToPrevious = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const goToNext = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};
</script>

<template>
  <div class="flex justify-end items-center mt-4 md:mt-6 space-x-1 md:space-x-2">
    <button
      @click="goToPrevious"
      :disabled="currentPage === 1"
      :class="[
        'px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm',
        currentPage === 1
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-500 hover:text-gray-700',
      ]"
    >
      Previous
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded',
        page === currentPage ? 'bg-bullion-orange text-white' : 'text-gray-700 hover:text-gray-900',
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="goToNext"
      :disabled="currentPage === totalPages"
      :class="[
        'px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm',
        currentPage === totalPages
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-500 hover:text-gray-700',
      ]"
    >
      Next
    </button>
  </div>
</template>
