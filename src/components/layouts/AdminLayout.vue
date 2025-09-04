<script setup lang="ts">
import Sidebar from "../container/sidebar/index.vue";
</script>

<template>
  <div class="h-screen bg-bullion-white overflow-hidden">
    <Sidebar>
      <template #content>
        <div class="h-full overflow-auto">
          <div class="p-6">
            <slot />
          </div>
        </div>
      </template>
    </Sidebar>
  </div>
</template>
