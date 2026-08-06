import { useEffect, useState } from "react";
import { Astroid } from "lucide-react";
import InsightCard from "../components/InsightCard.jsx";
import { getInsights } from "../services/insightsService.js";


function Insights() {
    const [insights, setInsights] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadInsights = async () => {
            try {
                setError("");

                const data = await getInsights();

                setInsights(data);
            } catch {
                setError("Unable to load insights.");
            }
        };

        loadInsights();
    }, []);

    return (

        
        <section
            id="insights-section"
            className="max-w-6xl mx-auto px-6 flex min-h-screen flex-col items-center justify-center py-24 text-center"
        >
            <p className="inline-flex items-center gap-1 mb-4 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
                    <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />

                    Insights

                    <Astroid color="#C4B5FD" fill="#C4B5FD" size={8} />
            </p>

            <h2 className="text-4xl font-black leading-none tracking-tight md:text-5xl">
                <span className="text-slate-50">
                    Explore Agentic AI
                </span>

                <span className="block text-violet-300">
                    Through real-world scenes
                </span>
            </h2>



            <div
                className="mt-6 min-h-6"
                aria-live="polite"
            >
                {error && (
                    <p
                        role="alert"
                        className="text-sm text-red-400"
                    >
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