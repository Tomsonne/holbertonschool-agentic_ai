import { Astroid, MoveRight } from "lucide-react";
import steps from "../data/steps.Js";


function About() {
    return (
        <section
            id="about-section"
            className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-36 pb-24 text-center"
        >
            <p className="mb-4 inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 border border-violet-500/20">
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
                    What is Agentic AI?
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
            </p>

            <h2 className= "text-4xl md:text-5xl font-black tracking-tight leading-none">
                
                <span className="text-slate-50">
                    AI that does more than answer<br />
                </span> 

                <span className="text-violet-300">
                    It acts with purpose
                </span>
            </h2>

            <br />

            <p className="text-sm md:text-base text-slate-300" > 
                Agentic AI refers to artificial intelligence systems designed to pursue goals, make decisions, use tools,
                and adapt their actions across multiple steps. Instead of only responding to a single prompt, an AI agent can break down a task, plan a strategy, execute actions, evaluate results, and continue until
                the objective is reached.
            </p>
            
            <div className="mt-8 grid w-full gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">

                <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">
                    <div>
                        <h3 className="text-lg font-bold text-slate-50">
                            Traditional AI
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Responds to direct instructions, generates content, answers
                            questions, or analyzes information within a limited interaction.
                        </p>
                    </div>

                    <div className="h-px w-full bg-slate-800" />

                    <div>
                        <h3 className="text-lg font-bold text-violet-300">
                            Agentic AI
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Understands a goal, chooses actions, uses external tools, follows
                            a plan, and adjusts its behavior based on feedback.
                        </p>
                    </div>
                </div>
                
                <ol className="flex flex-col gap-6">
                    {steps.map((step) => (
                        <li
                            key = {step.number}
                            className="relative flex flex-col items-start pl-12 text-start"
                        >
                            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-xs font-black text-white shadow-lg shadow-violet-500/40">
                                {step.number}
                            </span>

                            <h3 className="mt-1 font-bold texte-slate-50">
                                {step.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-300">
                                {step.description}
                            </p>

                        </li>

                        ))}
                    </ol>
            </div>
        </section>
    );
}

export default About;
