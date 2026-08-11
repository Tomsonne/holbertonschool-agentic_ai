<script setup>
import { computed } from "vue";

const props = defineProps({
    variant: {
        type: String,
        default: "primary",
        validator: (value) => ["primary", "secondary"].includes(value),
    },
    href: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "button",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    target: {
        type: String,
        default: undefined,
    },
    rel: {
        type: String,
        default: undefined,
    },
});

const classes = computed(() => {
    const baseClasses = "rounded-md px-4 py-2 font-semibold transition";
    const variantClasses = {
        primary: "bg-violet-500 text-slate-50 shadow-lg shadow-violet-500/40 hover:bg-violet-600",
        secondary: "border border-slate-800 bg-slate-950 text-slate-50 hover:bg-slate-900",
    };

    return `${baseClasses} ${variantClasses[props.variant]}`;
});
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :class="classes"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>
