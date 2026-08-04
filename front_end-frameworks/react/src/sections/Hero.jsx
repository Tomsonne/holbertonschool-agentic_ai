import { Astroid, MoveRight } from "lucide-react";

function Hero() {
    return (
        <section
            id="hero-section"
            className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-36 pb-24 text-center"
        >
            <p className="mb-4 inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 border border-violet-500/20">
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
                    The future of coding
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
            </p>

            <h1 className= "text-5xl md:text-7xl font-black tracking-tight leading-none">
                
                <span className="text-slate-50">
                    Build smarter workflows<br />
                </span> 

                <span className="text-violet-300">
                    with Agentic AI
                </span>
            </h1>

            <br />

            <p className="text-sm md:text-base text-slate-300" > 
                Create autonomous AI agents that think, plan, and execute complex tasks. Transform your business with intelligent automation.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#contact-section"
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white transition hover:bg-violet-600 shadow-lg shadow-violet-500/40">
                    Start learning with Holberton School
                    <MoveRight size={32} />
                </a>


                <a href=""
                        type="button"
                        className="px-4 py-2 font-semibold rounded-md border border-slate-800 bg-slate-950 hover:bg-slate-900"
                    >
                        Methodology
                        
                </a>
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className=" flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">           
                    <dt className="order-2 mt-2 text-sm text-slate-400">
                        Active agents
                    </dt>
                        <dd className="order-1 text-4xl font-black text-violet-300" > 10K+ </dd>
                </div>

                <div className=" flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                    <dt className="order-2 mt-2 text-sm text-slate-400">
                        Uptime
                    </dt>
                        <dd className="order-1 text-4xl font-black text-violet-300" > 99,9% </dd>
                </div>

                <div className=" flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                    <dt className="order-2 mt-2 text-sm text-slate-400">
                        Tasks automated
                    </dt>
                        <dd className="order-1 text-4xl font-black text-violet-300" > 50M+ </dd>
                </div>

                <div className=" flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
                    <dt className="order-2 mt-2 text-sm text-slate-400">
                        Support
                    </dt>
                        <dd className="order-1 text-4xl font-black text-violet-300" > 24/7 </dd>
                </div>

            </dl>
        </section>
    );
}

export default Hero;
