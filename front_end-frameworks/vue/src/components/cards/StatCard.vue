<script setup>
defineProps({
    label: { type: String, required: true },
    value: { type: String, required: true },
});
</script>

<template>
  <div class="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
    <dt class="order-2 mt-2 text-sm text-slate-400">
      {{ label }}
    </dt>
    <dd class="order-1 text-4xl font-black text-violet-300">
      {{ value }}
    </dd>
  </div>
</template>
