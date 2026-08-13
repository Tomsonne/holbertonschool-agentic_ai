<script>
    import { ArrowRight, Sparkles, FolderCode, AtSign, Mail, User, Users } from "@lucide/svelte";
    import SectionBadge from "../ui/SectionBadge.svelte";
    import SectionTitle from "../ui/SectionTitle.svelte";
    import Button from "../ui/Button.svelte";

    const initialFormData = { fullName: "", email: "", message: "" };
    const defaultFeedback = "Please fill all required fields.";
    const sendingFeedback = "Sending message...";
    const successFeedback = "Your message has been sent successfully.";

    let formData = $state({ ...initialFormData });
    let isSending = $state(false);
    let feedback = $state(defaultFeedback);

    let fullNameIsValid = $derived(formData.fullName.trim().length >= 2);
    let emailIsValid = $derived(formData.email.includes("@") && formData.email.includes("."));
    let messageIsValid = $derived(formData.message.trim().length >= 10);
    let formIsValid = $derived(fullNameIsValid && emailIsValid && messageIsValid);

    function wait(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    function getFieldClasses(fieldIsValid) {
        const baseClasses = "w-full rounded-md border border-slate-800 bg-black px-4 py-2 text-sm text-slate-50 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";
        const validationClasses = fieldIsValid
            ? "focus:border-violet-500 focus:ring-violet-500/20"
            : "focus:border-red-500 focus:ring-red-500/20";
        return `${baseClasses} ${validationClasses}`;
    }

    function handleInput() {
        if (!isSending) {
            feedback = defaultFeedback;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!formIsValid || isSending) return;

        isSending = true;
        feedback = sendingFeedback;
        await wait(1200);

        formData.fullName = "";
        formData.email = "";
        formData.message = "";
        isSending = false;
        feedback = successFeedback;

        setTimeout(() => {
            feedback = defaultFeedback;
        }, 2500);
    }
</script>

<section id="contact-section" class="relative overflow-hidden border-t border-slate-900 bg-slate-950 px-6 py-24 text-center">
    <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_85%_60%,rgba(59,130,246,0.25),transparent_28%),linear-gradient(135deg,#1e1238_0%,#0f172a_45%,#020617_100%)]"></div>
    <div aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30"></div>
    <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,6,23,0.45)_75%)]"></div>
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black"></div>

    <div class="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
        <SectionBadge text="Start your AI journey" class="mb-4" />
        <SectionTitle title="Ready to Explore" highlight="Agentic AI?" />

        <div class="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
            <div class="flex w-full flex-col items-center text-center">
                <div class="mt-8 flex flex-col justify-center gap-4 md:flex-row">
                    <Button href="https://www.holbertonschool.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2">
                        Enroll at Holberton School
                        <ArrowRight aria-hidden="true" size={18} />
                    </Button>
                    <Button href="#features-section" variant="secondary" class="inline-flex items-center justify-center">Need more information?</Button>
                </div>

                <ul class="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
                    <li class="flex items-center gap-2 text-sm text-slate-500"><FolderCode aria-hidden="true" size={16} class="text-violet-500" /><span>Project-based learning</span></li>
                    <li class="flex items-center gap-2 text-sm text-slate-500"><Users aria-hidden="true" size={16} class="text-violet-500" /><span>Peer learning environment</span></li>
                    <li class="flex items-center gap-2 text-sm text-slate-500"><Sparkles aria-hidden="true" size={16} class="text-violet-500" /><span>AI-powered workflows</span></li>
                </ul>
            </div>

            <form onsubmit={handleSubmit} autocomplete="off" novalidate class="mt-12 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">
                <div>
                    <label for="fullName" class="mb-2 flex items-center gap-2 text-sm text-slate-50"><User aria-hidden="true" size={18} class="text-violet-300" />Full name</label>
                    <input id="fullName" name="fullName" type="text" bind:value={formData.fullName} oninput={handleInput} autocomplete="name" placeholder="Enter your full name" disabled={isSending} required aria-invalid={formData.fullName.length > 0 && !fullNameIsValid} class={getFieldClasses(fullNameIsValid)}>
                </div>

                <div class="mt-6">
                    <label for="email" class="mb-2 flex items-center gap-2 text-sm text-slate-50"><AtSign aria-hidden="true" size={18} class="text-violet-300" />Email</label>
                    <input id="email" name="email" type="email" bind:value={formData.email} oninput={handleInput} autocomplete="email" placeholder="Enter your email" disabled={isSending} required aria-invalid={formData.email.length > 0 && !emailIsValid} class={getFieldClasses(emailIsValid)}>
                </div>

                <div class="mt-6">
                    <label for="message" class="mb-2 flex items-center gap-2 text-sm text-slate-50"><Mail aria-hidden="true" size={18} class="text-violet-300" />Message</label>
                    <textarea id="message" name="message" bind:value={formData.message} oninput={handleInput} placeholder="Write your message" disabled={isSending} required rows={6} aria-invalid={formData.message.length > 0 && !messageIsValid} class={`${getFieldClasses(messageIsValid)} resize-none`}></textarea>
                </div>

                <button type="submit" disabled={!formIsValid || isSending} class="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-violet-500 px-4 py-3 text-slate-50 shadow-lg shadow-violet-500/40 transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-800 disabled:opacity-50">
                    {isSending ? "Sending..." : "Send message"}
                </button>

                <div class="mt-4 min-h-6 text-center" aria-live="polite"><p class="text-sm text-slate-500">{feedback}</p></div>
            </form>
        </div>
    </div>
</section>
