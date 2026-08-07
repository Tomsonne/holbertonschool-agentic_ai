import { Astroid } from "lucide-react";
import FeatureCard from "../cards/FeatureCard.jsx";
import features from "../../data/features.js";


function Features() {
    return (
        <section
            id="features-section"
            className="max-w-6xl mx-auto px-6 flex min-h-screen flex-col items-center justify-center py-24 text-center"
        >
            <p className="mb-4 inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-4 py-2 text-xs text-violet-300 border border-violet-500/20">
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
                    Features
                <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
            </p>
            
            <h2 className= "text-4xl md:text-5xl font-black tracking-tight leading-none">
                <span className="text-slate-50">
                    Everything you need to build<br />
                </span> 

                <span className="text-violet-300">
                    With powerful AI agents
                </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Agentic AI combines reasoning, planning, memory, and tool usage
                to complete complex tasks and adapt to changing situations.
            </p>
            
            <div className="mt-12 grid w-full gap-8 md:grid-cols-3 ">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}


export default Features;