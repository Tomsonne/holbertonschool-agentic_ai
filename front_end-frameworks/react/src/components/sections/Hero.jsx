import { MoveRight } from "lucide-react";
import SectionBadge from "../ui/SectionBadge.jsx";
import StatCard from "../cards/StatCard.jsx";


function Hero() {
    return (
        <section
            id="hero-section"
            className="min-h-screen pt-36 pb-24"
        >
            <div className="max-w-6xl mx-auto flex flex-col items-center px-6 text-center">

                <SectionBadge text="The future of coding" className="mb-4"/>

                <h1 className="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
                    <span className="text-slate-50">
                        Build smarter workflows
                    </span>

                    <span className="block text-violet-300">
                        with Agentic AI
                    </span>
                </h1>

                <p className="mt-8 max-w-3xl text-sm text-slate-300 md:text-base">
                    Create autonomous AI agents that think, plan, and execute
                    complex tasks. Transform your business with intelligent
                    automation.
                </p>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                    <a href="#contact-section" className="flex items-center gap-2 rounded-md bg-violet-500 px-4 py-2 text-slate-50 shadow-lg shadow-violet-500/40 hover:bg-violet-600">
                        Start learning with Holberton School

                        <MoveRight size={20} />
                    </a>

                    <a href="#about-section" className="rounded-md border border-slate-800 bg-slate-950 px-4 py-2 text-slate-50 hover:bg-slate-900">
                        Methodology
                    </a>
                </div>

                <dl className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    <StatCard label="Active agents" value="10K+"/>

                    <StatCard label="Uptime" value="99,9%"/>

                    <StatCard label="Tasks automated" value="50M+"/>

                    <StatCard label="Support" value="24/7"/>
                </dl>
            </div>
        </section>
    );
}

export default Hero;