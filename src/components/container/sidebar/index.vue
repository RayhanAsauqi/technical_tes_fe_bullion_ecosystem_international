<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref<boolean>(true);
const windowWidth = ref<number>(0);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < 768) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

const menuItems = [
  { name: "User Aktif", active: true },
  { name: "Menu 2", active: false },
  { name: "Menu 3", active: false },
  { name: "Menu 4", active: false },
  { name: "Menu 5", active: false },
];

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

const isMobile = ref<boolean>(false);
onMounted(() => {
  isMobile.value = windowWidth.value < 768;
});
</script>

<template>
  <div class="flex h-screen">
    <!-- Overlay for mobile -->
    <div
      v-if="isOpen && windowWidth < 768"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>

    <!-- Sidebar -->
    <div
      class="bg-white shadow-lg transition-all duration-300 h-screen flex flex-col"
      :class="[
        windowWidth >= 768 ? (isOpen ? 'w-64' : 'w-16') : 'fixed top-0 left-0 h-full z-40 w-64',
        windowWidth < 768 && !isOpen ? '-translate-x-full' : 'translate-x-0',
      ]"
    >
      <div class="px-4 pt-10 pb-2 border-gray-200 overflow-hidden flex-shrink-0">
        <div class="flex items-center">
          <div class="flex items-center min-w-0">
            <img
              v-show="isOpen"
              src="/src/assets/svg/logo-dashboard.svg"
              class="transition-opacity duration-300"
            />
          </div>
          <button
            @click="toggleSidebar"
            class="ml-auto hover:bg-gray-100 p-1 rounded"
            v-if="isOpen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu Items -->
      <nav class="mt-6 overflow-hidden flex-shrink-0">
        <ul class="space-y-2 px-3">
          <li v-for="(item, index) in menuItems" :key="index">
            <a
              href="#"
              @click="windowWidth < 768 ? closeSidebar() : null"
              class="flex items-center px-3 py-2 rounded-lg transition-colors duration-200"
              :class="
                item.active ? 'bg-bullion-orange text-white' : 'text-gray-700 hover:bg-gray-100'
              "
            >
              <!-- Icon placeholder -->
              <div class="w-5 h-5 bg-current rounded-sm opacity-60 flex-shrink-0"></div>
              <span v-if="isOpen" class="ml-3 font-medium whitespace-nowrap">{{ item.name }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 h-screen transition-all duration-300 flex flex-col"
      :class="windowWidth >= 768 ? 'ml-0' : 'ml-0'"
    >
      <!-- Hamburger Toggle Button -->
      <button
        v-if="!isOpen || windowWidth < 768"
        @click="toggleSidebar"
        class="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        :class="{ hidden: isOpen && windowWidth < 768 }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Content Slot -->
      <div class="flex-1 overflow-hidden pt-16 md:pt-0">
        <slot name="content">
          <div class="h-full overflow-auto">
            <div class="p-6">
              <slot />
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
