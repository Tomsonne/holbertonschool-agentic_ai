import FeatureCard from "../cards/FeatureCard.jsx";
import features from "../../data/features.js";
import SectionBadge from "../ui/SectionBadge.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";


function Features() {
    return (
        <section
            id="features-section"
            className="max-w-6xl mx-auto px-6 flex min-h-screen flex-col items-center justify-center py-24 text-center"
        >

            <SectionBadge text="Features" className="mb-4"/>

            <SectionTitle title="Everything you need to build" highlight="With powerful AI agents"/>

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