<script>
    let {
        children,
        variant = "primary",
        href = undefined,
        class: className = "",
        type = "button",
        disabled = false,
        target = undefined,
        rel = undefined,
    } = $props();

    const baseClasses = "rounded-md px-4 py-2 font-semibold";
    const variantClasses = {
        primary: "bg-violet-500 text-slate-50 shadow-lg shadow-violet-500/40 hover:bg-violet-600",
        secondary: "border border-slate-800 bg-slate-950 text-slate-50 hover:bg-slate-900",
    };

    let classes = $derived(`${baseClasses} ${variantClasses[variant]} ${className}`);
</script>

{#if href}
    <a {href} {target} {rel} class={classes}>
        {@render children?.()}
    </a>
{:else}
    <button {type} {disabled} class={classes}>
        {@render children?.()}
    </button>
{/if}
