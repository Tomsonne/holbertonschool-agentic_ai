<script setup>
import { Circle } from "lucide-vue-next";

defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <p class="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
    <Circle
      color="#c4b5fd"
      fill="#c4b5fd"
      :size="4"
    />
    {{ text }}
    <Circle
      color="#c4b5fd"
      fill="#c4b5fd"
      :size="4"
    />
  </p>
</template>
