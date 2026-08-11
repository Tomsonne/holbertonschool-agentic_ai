<script setup>
defineProps({
    href: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
    class="text-slate-500 transition hover:text-slate-50"
  >
    <slot />
  </a>
</template>
