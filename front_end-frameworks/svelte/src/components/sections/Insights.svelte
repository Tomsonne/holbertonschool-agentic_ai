<script>
    import { onMount } from "svelte";
    import InsightCard from "../cards/InsightCard.svelte";
    import SectionBadge from "../ui/SectionBadge.svelte";
    import SectionTitle from "../ui/SectionTitle.svelte";
    import { getInsights } from "../../services/insightsService.js";

    let insights = $state([]);
    let error = $state("");

    onMount(async () => {
        try {
            error = "";
            insights = await getInsights();
        } catch {
            error = "Unable to load insights.";
        }
    });
</script>

<section id="insights-section" class="bg-black">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <SectionBadge text="Insights" class="mb-4" />
        <SectionTitle title="Explore Agentic AI" highlight="Through real-world scenes" />

        <div class="mt-6 min-h-6" aria-live="polite">
            {#if error}
                <p role="alert" class="text-sm text-red-400">{error}</p>
            {/if}
        </div>

        <div class="mt-6 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
            {#each insights as insight, index (insight.title)}
                <InsightCard {...insight} {index} />
            {/each}
        </div>
    </div>
</section>
