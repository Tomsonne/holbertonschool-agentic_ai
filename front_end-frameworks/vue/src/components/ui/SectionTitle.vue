<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    highlight: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <h2 class="text-4xl font-black leading-none tracking-tight md:text-5xl">
    <span class="text-slate-50">{{ title }}</span>
    <span class="block text-violet-300">{{ highlight }}</span>
  </h2>
</template>
