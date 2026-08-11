<script setup>
import { MoveRight } from "lucide-vue-next";
import StatCard from "../components/cards/StatCard.vue";
import Button from "../components/ui/Button.vue";
import SectionBadge from "../components/ui/SectionBadge.vue";
</script>

<template>
  <section
    id="hero-section"
    class="min-h-screen pb-24 pt-36"
  >
    <div class="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
      <SectionBadge
        text="The future of coding"
        class="mb-4"
      />
      <h1 class="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
        <span class="text-slate-50">Build smarter workflows</span>
        <span class="block text-violet-300">with Agentic AI</span>
      </h1>
      <p class="mt-8 max-w-3xl text-sm text-slate-300 md:text-base">
        Create autonomous AI agents that think, plan, and execute complex tasks.
        Transform your business with intelligent automation.
      </p>
      <div class="mt-12 flex flex-col gap-4 sm:flex-row">
        <Button
          href="#contact-section"
          class="flex items-center gap-2"
        >
          Start learning with Holberton School
          <MoveRight :size="20" />
        </Button>
        <Button
          href="#about-section"
          variant="secondary"
        >
          Methodology
        </Button>
      </div>
      <dl class="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        <StatCard
          label="Active agents"
          value="10K+"
        />
        <StatCard
          label="Uptime"
          value="99,9%"
        />
        <StatCard
          label="Tasks automated"
          value="50M+"
        />
        <StatCard
          label="Support"
          value="24/7"
        />
      </dl>
    </div>
  </section>
</template>
