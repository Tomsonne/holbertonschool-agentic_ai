import { MoveRight } from "lucide-react";
import SectionBadge from "../ui/SectionBadge.jsx";
import StatCard from "../cards/StatCard.jsx";
import Button from "../ui/Button.jsx";

function Hero() {
    return (
        <section
            id="hero-section"
            className="relative overflow-hidden border-b border-slate-900 bg-slate-950 pb-24 pt-36"
        >
            {/* Dégradés violet, bleu et bleu nuit */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.35),transparent_32%),radial-gradient(circle_at_85%_60%,rgba(59,130,246,0.25),transparent_28%),linear-gradient(135deg,#1e1238_0%,#0f172a_45%,#020617_100%)]"
            />

            {/* Grille décorative */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30"
            />

            {/* Assombrissement sur les bords */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(2,6,23,0.45)_75%)]"
            />

            {/* Transition vers la section suivante */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black"
            />

            {/* Contenu principal */}
            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
                <SectionBadge
                    text="The future of coding"
                    className="mb-4"
                />

                <h1 className="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
                    <span className="text-slate-50">
                        Build smarter workflows
                    </span>

                    <span className="block text-violet-300">
                        with Agentic AI
                    </span>
                </h1>

                <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Create autonomous AI agents that think, plan, and execute
                    complex tasks. Transform your business with intelligent
                    automation.
                </p>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                    <Button
                        href="#contact-section"
                        className="flex items-center gap-2"
                    >
                        Start learning with Holberton School
                        <MoveRight
                            aria-hidden="true"
                            size={20}
                        />
                    </Button>

                    <Button
                        href="#about-section"
                        variant="secondary"
                    >
                        Methodology
                    </Button>
                </div>

                <dl className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
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
    );
}

export default Hero;