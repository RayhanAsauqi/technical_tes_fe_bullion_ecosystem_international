<script setup lang="ts">
type LabelProps = {
  labelText: string;
};

const props = defineProps<LabelProps>();
</script>

<template>
  <label class="font-bold">{{ props.labelText }}</label>
</template>
