<script>
    import { BrainCircuit } from "@lucide/svelte";

    let {
        name = "Agentic AI",
        href = "#hero-section",
        class: className = "",
    } = $props();
</script>

<a {href} class={`flex items-center gap-2 ${className}`}>
    <span class="rounded-lg bg-violet-500 p-2 text-slate-50">
        <BrainCircuit aria-hidden="true" size={14} />
    </span>

    <span class="text-slate-50">{name}</span>
</a>
