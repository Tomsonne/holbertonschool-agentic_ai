import { Astroid } from "lucide-react";

function SectionBadge({ text, className = "" }) {
    return (
        <p className="px-4 py-2 text-xs text-violet-300 rounded-full border border-violet-500/20 bg-violet-500/10 inline-flex items-center gap-1 ">
            <Astroid color="#C4B5FD" fill="#C4B5FD" size={4} />
                {text}
            <Astroid color="#C4B5FD" fill="#C4B5FD" size={4} />
        </p>

    );
}

export default SectionBadge ;