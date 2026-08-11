<script setup>
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
import Hero from "./sections/Hero.vue";
import About from "./sections/About.vue";
import Features from "./sections/Features.vue";
import Insights from "./sections/Insights.vue";
import Contact from "./sections/Contact.vue";
</script>

<template>
  <Header />

  <main>
    <Hero />
    <About />
    <Features />
    <Insights />
    <Contact />
  </main>

  <Footer />
</template>