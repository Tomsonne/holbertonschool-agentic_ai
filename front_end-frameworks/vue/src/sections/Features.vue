<script setup>
import FeatureCard from "../components/cards/FeatureCard.vue";
import SectionBadge from "../components/ui/SectionBadge.vue";
import SectionTitle from "../components/ui/SectionTitle.vue";
import features from "../data/features.js";
</script>

<template>
  <section
    id="features-section"
    class="bg-black"
  >
    <div class="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <SectionBadge
        text="Features"
        class="mb-4"
      />
      <SectionTitle
        title="Everything you need to build"
        highlight="With powerful AI agents"
      />
      <p class="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
        Agentic AI combines reasoning, planning, memory, and tool usage
        to complete complex tasks and adapt to changing situations.
      </p>
      <div class="mt-12 grid w-full gap-8 md:grid-cols-3">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </div>
  </section>
</template>
