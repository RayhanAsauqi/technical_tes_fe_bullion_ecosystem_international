<script setup lang="ts">
interface Props {
  bgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: "bg-bullion-orange",
});
</script>

<template>
  <div class="min-h-screen md:grid md:grid-cols-2">
    <div
      :class="[
        'hidden md:flex w-full lg:w-[548px] h-32 md:h-auto relative items-center justify-center',
        props.bgColor,
      ]"
    >
      <div class="text-white text-center">
        <img src="/src/assets/svg/buillon_img.svg" alt="" class="absolute top-0 left-0" />
        <img
          src="/src/assets/svg/logo-bei-white 1.svg"
          class="absolute top-0 left-0 pt-[60px] pl-[60px]"
        />
      </div>
    </div>

    <div class="flex-1 p-4 sm:pr-10 lg:pr-40 overflow-y-auto max-h-screen">
      <slot>
        <div class="flex items-center justify-center h-full">
          <p class="text-gray-500">Form content here</p>
        </div>
      </slot>
    </div>
  </div>
</template>
