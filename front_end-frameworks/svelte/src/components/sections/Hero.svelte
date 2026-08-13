<script>
    import { MoveRight } from "@lucide/svelte";
    import SectionBadge from "../ui/SectionBadge.svelte";
    import StatCard from "../cards/StatCard.svelte";
    import Button from "../ui/Button.svelte";

    const stats = [
        { label: "Active agents", value: "10K+" },
        { label: "Uptime", value: "99,9%" },
        { label: "Tasks automated", value: "50M+" },
        { label: "Support", value: "24/7" },
    ];
</script>

<section id="hero-section" class="relative overflow-hidden border-b border-slate-900 bg-slate-950 pb-24 pt-36">
    <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_85%_60%,rgba(59,130,246,0.25),transparent_28%),linear-gradient(135deg,#1e1238_0%,#0f172a_45%,#020617_100%)]"></div>
    <div aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30"></div>
    <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,6,23,0.45)_75%)]"></div>
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black"></div>

    <div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <SectionBadge text="The future of coding" class="mb-4" />
        <h1 class="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
            <span class="text-slate-50">Build smarter workflows</span>
            <span class="block text-violet-300">with Agentic AI</span>
        </h1>
        <p class="mt-8 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">Create autonomous AI agents that think, plan, and execute complex tasks. Transform your business with intelligent automation.</p>

        <div class="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button href="#contact-section" class="flex items-center gap-2">
                Start learning with Holberton School
                <MoveRight aria-hidden="true" size={20} />
            </Button>
            <Button href="#about-section" variant="secondary">Methodology</Button>
        </div>

        <dl class="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {#each stats as stat (stat.label)}
                <StatCard {...stat} />
            {/each}
        </dl>
    </div>
</section>
