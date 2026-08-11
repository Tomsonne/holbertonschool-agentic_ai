<script setup>
import { computed } from "vue";

const props = defineProps({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    index: { type: Number, required: true },
});

const isFirstCard = computed(() => props.index === 0);
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/40"
    :class="{ 'sm:col-span-2 lg:col-span-2': isFirstCard }"
  >
    <img
      :src="image"
      :alt="title"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    >
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    <div class="relative z-10 flex min-h-80 flex-col items-start justify-end p-8 text-start">
      <p class="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
        {{ category }}
      </p>
      <h3
        class="mt-4 font-bold text-slate-50"
        :class="isFirstCard ? 'text-2xl md:text-3xl' : 'text-xl'"
      >
        {{ title }}
      </h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-300">
        {{ description }}
      </p>
    </div>
  </article>
</template>
