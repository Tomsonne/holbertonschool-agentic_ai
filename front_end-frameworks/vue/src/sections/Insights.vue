<script setup>
import { onMounted, ref } from "vue";
import InsightCard from "../components/cards/InsightCard.vue";
import SectionBadge from "../components/ui/SectionBadge.vue";
import SectionTitle from "../components/ui/SectionTitle.vue";
import { getInsights } from "../services/insightsServices.js";

const insights = ref([]);
const error = ref("");

onMounted(async () => {
    try {
        error.value = "";
        insights.value = await getInsights();
    } catch {
        error.value = "Unable to load insights.";
    }
});
</script>

<template>
  <section
    id="insights-section"
    class="bg-slate-950"
  >
    <div class="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <SectionBadge
        text="Insights"
        class="mb-4"
      />
      <SectionTitle
        title="Explore Agentic AI"
        highlight="Through real-world scenes"
      />
      <div
        class="mt-6 min-h-6"
        aria-live="polite"
      >
        <p
          v-if="error"
          role="alert"
          class="text-sm text-red-400"
        >
          {{ error }}
        </p>
      </div>
      <div class="mt-6 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          v-for="(insight, index) in insights"
          :key="insight.title"
          :category="insight.category"
          :title="insight.title"
          :description="insight.description"
          :image="insight.image"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>
