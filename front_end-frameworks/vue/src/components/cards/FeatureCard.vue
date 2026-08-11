<script setup>
defineProps({
    icon: {
        type: [Object, Function],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <article class="group flex flex-col items-start rounded-3xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">
    <div class="rounded-lg bg-violet-500 p-2 text-slate-50">
      <component
        :is="icon"
        :size="20"
      />
    </div>
    <h3 class="mt-6 text-base font-bold text-slate-50">
      {{ title }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-slate-300">
      {{ description }}
    </p>
  </article>
</template>
