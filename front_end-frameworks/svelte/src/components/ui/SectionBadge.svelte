<script>
    import { Circle } from "@lucide/svelte";

    let { text, class: className = "" } = $props();
</script>

<p class={`inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300 ${className}`}>
    <Circle aria-hidden="true" color="#C4B5FD" fill="#C4B5FD" size={4} />
    {text}
    <Circle aria-hidden="true" color="#C4B5FD" fill="#C4B5FD" size={4} />
</p>
