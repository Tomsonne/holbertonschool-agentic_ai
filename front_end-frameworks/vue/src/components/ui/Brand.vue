<script setup>
import { BrainCircuit } from "lucide-vue-next";

defineProps({
    name: {
        type: String,
        default: "Agentic AI",
    },
    href: {
        type: String,
        default: "#hero-section",
    },
});
</script>

<template>
  <a
    :href="href"
    class="flex items-center gap-2"
  >
    <span class="rounded-lg bg-violet-500 p-2 text-slate-50">
      <BrainCircuit :size="14" />
    </span>
    <span class="text-slate-50">{{ name }}</span>
  </a>
</template>
