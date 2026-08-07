import { useEffect, useState } from "react";
import InsightCard from "../cards/InsightCard.jsx";
import { getInsights } from "../../services/insightsService.js";
import SectionBadge from "../ui/SectionBadge.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";


function Insights() {
    const [insights, setInsights] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadInsights = async () => {
            try {
                setError("");
                const data = await getInsights();
                setInsights(data);
            } 
            catch {
                setError("Unable to load insights.");
            }
        };
        loadInsights();
    }, 
    []);

    return (
        <section id="insights-section" className="max-w-6xl mx-auto px-6 flex min-h-screen flex-col items-center justify-center py-24 text-center">

            <SectionBadge text="Insights" className="mb-4"/>

            <SectionTitle title="Explore Agentic AI" highlight="Through real-world scenes"/>

            <div className="mt-6 min-h-6" aria-live="polite">
                {error && (
                    <p role="alert" className="text-sm text-red-400">
                        {error}
                    </p>
                )}
            </div>

            <div className="mt-6 grid w-full gap-8 md:grid-cols-2">
                {insights.map((insight, index) => (
                    <InsightCard
                        key={insight.title}
                        category={insight.category}
                        title={insight.title}
                        description={insight.description}
                        image={insight.image}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}


export default Insights;