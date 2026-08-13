<script>
    let { title, highlight, class: className = "" } = $props();
</script>

<h2 class={`text-4xl font-black leading-none tracking-tight md:text-5xl ${className}`}>
    <span class="text-slate-50">{title}</span>
    <span class="block text-violet-300">{highlight}</span>
</h2>
