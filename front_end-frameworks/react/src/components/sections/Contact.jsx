import { useState } from "react";
import {
    ArrowRight,
    Sparkles,
    FolderCode,
    AtSign,
    Mail,
    User,
    Users,
} from "lucide-react";
import SectionBadge from "../ui/SectionBadge.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import Button from "../ui/Button.jsx";

const initialFormData = {
    fullName: "",
    email: "",
    message: "",
};

const defaultFeedback = "Please fill all required fields.";
const sendingFeedback = "Sending message...";
const successFeedback = "Your message has been sent successfully.";

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

function Contact() {
    const [formData, setFormData] = useState(initialFormData);
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState(defaultFeedback);

    const fullNameIsValid = formData.fullName.trim().length >= 2;

    const emailIsValid =
        formData.email.includes("@") &&
        formData.email.includes(".");

    const messageIsValid = formData.message.trim().length >= 10;

    const formIsValid =
        fullNameIsValid &&
        emailIsValid &&
        messageIsValid;

    const getFieldClasses = (fieldIsValid) => {
        const baseClasses =
            "w-full rounded-md border border-slate-800 bg-black px-4 py-2 text-sm text-slate-50 placeholder:text-slate-500 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

        const validationClasses = fieldIsValid
            ? "focus:border-violet-500 focus:ring-violet-500/20"
            : "focus:border-red-500 focus:ring-red-500/20";

        return `${baseClasses} ${validationClasses}`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (!isSending) {
            setFeedback(defaultFeedback);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formIsValid || isSending) {
            return;
        }

        setIsSending(true);
        setFeedback(sendingFeedback);

        await wait(1200);

        setFormData(initialFormData);
        setIsSending(false);
        setFeedback(successFeedback);

        setTimeout(() => {
            setFeedback(defaultFeedback);
        }, 2500);
    };

    return (
        <section id="contact-section" className="relative overflow-hidden border-t border-slate-900 bg-slate-950 px-6 py-24 text-center">

            {/* Dégradés violet, bleu et bleu nuit */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_85%_60%,rgba(59,130,246,0.25),transparent_28%),linear-gradient(135deg,#1e1238_0%,#0f172a_45%,#020617_100%)]" />

            {/* Grille décorative */}
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

            {/* Assombrissement des bords */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,6,23,0.45)_75%)]" />

            {/* Transition vers le noir */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black" />

            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">

                <SectionBadge text="Start your AI journey" className="mb-4" />

                <SectionTitle title="Ready to Explore" highlight="Agentic AI?" />

                <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">

                    <div className="flex w-full flex-col items-center text-center">

                        <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
                            <Button href="https://www.holbertonschool.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                                Enroll at Holberton School
                                <ArrowRight aria-hidden="true" size={18} />
                            </Button>

                            <Button href="#features-section" variant="secondary" className="inline-flex items-center justify-center">
                                Need more information?
                            </Button>
                        </div>

                        <ul className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <FolderCode aria-hidden="true" size={16} className="text-violet-500" />
                                <span>Project-based learning</span>
                            </li>

                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <Users aria-hidden="true" size={16} className="text-violet-500" />
                                <span>Peer learning environment</span>
                            </li>

                            <li className="flex items-center gap-2 text-sm text-slate-500">
                                <Sparkles aria-hidden="true" size={16} className="text-violet-500" />
                                <span>AI-powered workflows</span>
                            </li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off" noValidate className="mt-12 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">

                        <div>
                            <label htmlFor="fullName" className="mb-2 flex items-center gap-2 text-sm text-slate-50">
                                <User aria-hidden="true" size={18} className="text-violet-300" />
                                Full name
                            </label>

                            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} autoComplete="name" placeholder="Enter your full name" disabled={isSending} required aria-invalid={formData.fullName.length > 0 && !fullNameIsValid} className={getFieldClasses(fullNameIsValid)} />
                        </div>

                        <div className="mt-6">
                            <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm text-slate-50">
                                <AtSign aria-hidden="true" size={18} className="text-violet-300" />
                                Email
                            </label>

                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="Enter your email" disabled={isSending} required aria-invalid={formData.email.length > 0 && !emailIsValid} className={getFieldClasses(emailIsValid)} />
                        </div>

                        <div className="mt-6">
                            <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm text-slate-50">
                                <Mail aria-hidden="true" size={18} className="text-violet-300" />
                                Message
                            </label>

                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Write your message" disabled={isSending} required rows={6} aria-invalid={formData.message.length > 0 && !messageIsValid} className={`${getFieldClasses(messageIsValid)} resize-none`} />
                        </div>

                        <button type="submit" disabled={!formIsValid || isSending} className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-violet-500 px-4 py-3 text-slate-50 shadow-lg shadow-violet-500/40 transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-800 disabled:text-slate-50 disabled:opacity-50">
                            {isSending ? "Sending..." : "Send message"}
                        </button>

                        <div className="mt-4 min-h-6 text-center" aria-live="polite">
                            <p className="text-sm text-slate-500">
                                {feedback}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;