<script>
    import SectionBadge from "../ui/SectionBadge.svelte";
    import SectionTitle from "../ui/SectionTitle.svelte";
    import steps from "../../data/steps.js";
</script>

<section id="about-section" class="bg-black">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <SectionBadge text="What is Agentic AI?" class="mb-4" />
        <SectionTitle title="AI that does more than answer" highlight="It acts with purpose" />
        <p class="text-sm text-slate-300 md:text-base">Agentic AI refers to artificial intelligence systems designed to pursue goals, make decisions, use tools, and adapt their actions across multiple steps. Instead of only responding to a single prompt, an AI agent can break down a task, plan a strategy, execute actions, evaluate results, and continue until the objective is reached.</p>

        <div class="mt-8 grid w-full gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">
                <div>
                    <h3 class="text-lg text-slate-50">Traditional AI</h3>
                    <p class="mt-2 text-sm text-slate-500">Responds to direct instructions, generates content, answers questions, or analyzes information within a limited interaction.</p>
                </div>
                <div aria-hidden="true" class="h-px w-full bg-slate-800"></div>
                <div>
                    <h3 class="text-lg text-violet-300">Agentic AI</h3>
                    <p class="mt-2 text-sm text-slate-500">Understands a goal, chooses actions, uses external tools, follows a plan, and adjusts its behavior based on feedback.</p>
                </div>
            </div>

            <ol class="flex flex-col gap-6">
                {#each steps as step (step.number)}
                    <li class="relative flex flex-col items-start pl-12 text-start">
                        <span class="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-xs font-black text-slate-50 shadow-lg shadow-violet-500/40">{step.number}</span>
                        <h3 class="mt-1 text-slate-50">{step.title}</h3>
                        <p class="mt-1 text-sm text-slate-300">{step.description}</p>
                    </li>
                {/each}
            </ol>
        </div>
    </div>
</section>
