import { BrainCircuit } from "lucide-react";

function Brand({ name = "Agentic AI", href = "#hero-section", className = ""}) {
    return (
        <a href={href} className={`flex items-center gap-2 ${className}`}>
            <div className="rounded-lg bg-violet-500 p-2 text-slate-50">
                <BrainCircuit size={14} />
            </div>

            <span className="text-slate-50">
                {name}
            </span>
        </a>
    );
}

export default Brand;