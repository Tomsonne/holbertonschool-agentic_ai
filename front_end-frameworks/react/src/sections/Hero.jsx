import { Astroid, MoveRight } from "lucide-react";

function Hero() {
    return (
        <section
            id="hero-section"
            className="min-h-screen pt-36 pb-24"
        >
            <div className="max-w-6xl mx-auto flex flex-col items-center px-6 text-center">
                <p className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
                    <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />

                    The future of coding

                    <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
                </p>

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
                    <a
                        href="#contact-section"
                        className="flex items-center gap-2 rounded-md bg-violet-500 px-4 py-2 font-semibold text-slate-50 shadow-lg shadow-violet-500/40 hover:bg-violet-600"
                    >
                        Start learning with Holberton School

                        <MoveRight size={20} />
                    </a>

                    <a
                        href="#about-section"
                        className="rounded-md border border-slate-800 bg-slate-950 px-4 py-2 font-semibold text-slate-50 hover:bg-slate-900"
                    >
                        Methodology
                    </a>
                </div>

                <dl className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                        <dt className="order-2 mt-2 text-sm text-slate-400">
                            Active agents
                        </dt>

                        <dd className="order-1 text-4xl font-black text-violet-300">
                            10K+
                        </dd>
                    </div>

                    <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                        <dt className="order-2 mt-2 text-sm text-slate-400">
                            Uptime
                        </dt>

                        <dd className="order-1 text-4xl font-black text-violet-300">
                            99,9%
                        </dd>
                    </div>

                    <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                        <dt className="order-2 mt-2 text-sm text-slate-400">
                            Tasks automated
                        </dt>

                        <dd className="order-1 text-4xl font-black text-violet-300">
                            50M+
                        </dd>
                    </div>

                    <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                        <dt className="order-2 mt-2 text-sm text-slate-400">
                            Support
                        </dt>

                        <dd className="order-1 text-4xl font-black text-violet-300">
                            24/7
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}

export default Hero;