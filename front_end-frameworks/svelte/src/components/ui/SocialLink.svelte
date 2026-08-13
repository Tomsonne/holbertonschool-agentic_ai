<script>
    let { href, label, icon: Icon } = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" aria-label={label} class="text-slate-500 transition hover:text-slate-50">
    <Icon aria-hidden="true" size={24} />
</a>
