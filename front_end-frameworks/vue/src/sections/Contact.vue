<script setup>
import { computed, reactive, ref } from "vue";
import {
    ArrowRight,
    AtSign,
    FolderCode,
    Mail,
    Sparkles,
    User,
    Users,
} from "lucide-vue-next";
import Button from "../components/ui/Button.vue";
import SectionBadge from "../components/ui/SectionBadge.vue";
import SectionTitle from "../components/ui/SectionTitle.vue";

const defaultFeedback = "Please fill all required fields.";
const formData = reactive({
    fullName: "",
    email: "",
    message: "",
});
const isSending = ref(false);
const feedback = ref(defaultFeedback);

const fullNameIsValid = computed(() => formData.fullName.trim().length >= 2);
const emailIsValid = computed(() => formData.email.includes("@") && formData.email.includes("."));
const messageIsValid = computed(() => formData.message.trim().length >= 10);
const formIsValid = computed(() => (
    fullNameIsValid.value && emailIsValid.value && messageIsValid.value
));

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function resetFeedback() {
    if (!isSending.value) {
        feedback.value = defaultFeedback;
    }
}

function getFieldClasses(fieldIsValid) {
    const baseClasses = "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";
    const validationClasses = fieldIsValid
        ? "focus:border-violet-500 focus:ring-violet-500/20"
        : "focus:border-red-500 focus:ring-red-500/20";

    return `${baseClasses} ${validationClasses}`;
}

async function handleSubmit() {
    if (!formIsValid.value || isSending.value) {
        return;
    }

    isSending.value = true;
    feedback.value = "Sending message...";
    await wait(1200);

    formData.fullName = "";
    formData.email = "";
    formData.message = "";
    isSending.value = false;
    feedback.value = "Your message has been sent successfully.";

    setTimeout(() => {
        feedback.value = defaultFeedback;
    }, 2500);
}
</script>

<template>
  <section
    id="contact-section"
    class="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4 px-6 py-24 text-center"
  >
    <SectionBadge
      text="Start your AI journey"
      class="mb-4"
    />
    <SectionTitle
      title="Ready to explore"
      highlight="Agentic AI?"
    />

    <div class="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <div class="flex w-full flex-col items-center">
        <div class="mt-8 flex flex-col justify-center gap-4 md:flex-row">
          <Button
            href="https://www.holbertonschool.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2"
          >
            Enroll at Holberton School
            <ArrowRight :size="18" />
          </Button>
          <Button
            href="#features-section"
            variant="secondary"
            class="inline-flex items-center justify-center"
          >
            Need more information?
          </Button>
        </div>

        <ul class="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <li class="flex items-center gap-2 text-sm text-slate-500">
            <FolderCode
              :size="16"
              class="text-violet-500"
            />
            <span>Project-based learning</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-500">
            <Users
              :size="16"
              class="text-violet-500"
            />
            <span>Peer learning environment</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles
              :size="16"
              class="text-violet-500"
            />
            <span>AI-powered workflows</span>
          </li>
        </ul>
      </div>

      <form
        class="mt-12 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40"
        autocomplete="off"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div>
          <label
            for="fullName"
            class="mb-2 flex items-center gap-2 text-sm text-slate-50"
          >
            <User
              :size="18"
              class="text-violet-300"
            />
            Full name
          </label>
          <input
            id="fullName"
            v-model="formData.fullName"
            name="fullName"
            type="text"
            autocomplete="off"
            placeholder="Enter your full name"
            :disabled="isSending"
            :aria-invalid="!fullNameIsValid"
            :class="getFieldClasses(fullNameIsValid)"
            required
            @input="resetFeedback"
          >
        </div>

        <div class="mt-6">
          <label
            for="email"
            class="mb-2 flex items-center gap-2 text-sm text-slate-50"
          >
            <AtSign
              :size="18"
              class="text-violet-300"
            />
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            autocomplete="off"
            placeholder="Enter your email"
            :disabled="isSending"
            :aria-invalid="!emailIsValid"
            :class="getFieldClasses(emailIsValid)"
            required
            @input="resetFeedback"
          >
        </div>

        <div class="mt-6">
          <label
            for="message"
            class="mb-2 flex items-center gap-2 text-sm text-slate-50"
          >
            <Mail
              :size="18"
              class="text-violet-300"
            />
            Message
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            name="message"
            autocomplete="off"
            placeholder="Write your message"
            :disabled="isSending"
            :aria-invalid="!messageIsValid"
            :class="`${getFieldClasses(messageIsValid)} resize-none`"
            required
            rows="6"
            @input="resetFeedback"
          />
        </div>

        <button
          type="submit"
          :disabled="!formIsValid || isSending"
          class="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-violet-500 px-4 py-3 text-slate-50 shadow-lg shadow-violet-500/40 transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-800 disabled:opacity-50"
        >
          {{ isSending ? "Sending..." : "Send message" }}
        </button>
        <div
          class="mt-4 min-h-6 text-center"
          aria-live="polite"
        >
          <p class="text-sm text-slate-500">
            {{ feedback }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>
