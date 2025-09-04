<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

export type TableColumn = {
  key: string;
  title: string;
  width?: string;
  mobileLabel?: string;
};

export type TableRow<T = Record<string, any>> = {
  id: number | string;
} & T;

export type TableProps<T = Record<string, any>> = {
  columns: TableColumn[];
  rows: TableRow<T>[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  refreshCb?: () => void;
  emptyStateMessage?: string;
};

withDefaults(defineProps<TableProps>(), {
  isLoading: false,
  isError: false,
  errorMessage: "Unable to load data. Please try again.",
  emptyStateMessage: "No data available",
});

function renderCell<T extends Record<string, any>>(column: TableColumn, row: TableRow<T>) {
  const cell = row[column.key];
  if (typeof cell === "function") {
    return cell(row);
  }
  return cell;
}

const skeletonRows = computed(() => Array.from({ length: 5 }));

// Responsive detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<template>
  <!-- Error State -->
  <div v-if="!isLoading && isError" class="flex justify-center py-12">
    <div class="flex flex-col items-center space-y-4">
      <div class="rounded-full bg-red-50 p-3">
        <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 18.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900">Something went wrong</h3>
        <p class="text-sm text-gray-500 mt-1">{{ errorMessage }}</p>
      </div>
      <button
        v-if="refreshCb"
        @click="refreshCb"
        class="mt-2 px-4 py-2 bg-bullion-orange text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>

  <!-- Main Container -->
  <div v-else class="w-full">
    <!-- Desktop & Mobile Table View (Sama-sama menggunakan tabel) -->
    <div class="bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-full">
          <!-- Table Header -->
          <thead>
            <tr class="bg-gray-50">
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                :style="column.width ? { width: column.width } : {}"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <!-- Loading State -->
            <template v-if="isLoading">
              <tr v-for="(_, index) in skeletonRows" :key="`skeleton-${index}`">
                <td v-for="column in columns" :key="column.key" class="px-4 py-3">
                  <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <template v-else-if="!rows || rows.length === 0">
              <tr>
                <td :colspan="columns.length" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center space-y-2">
                    <svg
                      class="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p class="text-gray-500">{{ emptyStateMessage }}</p>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Data Rows -->
            <template v-else>
              <tr
                v-for="(row, index) in rows"
                :key="row.id"
                class="hover:bg-gray-50 transition-colors"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-bullion-orange-table'"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  class="px-4 py-3 text-sm text-gray-900"
                >
                  <component
                    v-if="
                      typeof renderCell(column, row) === 'object' &&
                      renderCell(column, row)?.component
                    "
                    :is="renderCell(column, row).component"
                    v-bind="renderCell(column, row).props"
                  />
                  <div
                    v-else-if="
                      typeof renderCell(column, row) === 'string' &&
                      renderCell(column, row).includes('<')
                    "
                    v-html="renderCell(column, row)"
                  />
                  <span v-else>{{ renderCell(column, row) }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
