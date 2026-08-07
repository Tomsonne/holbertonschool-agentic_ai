function SectionTitle({ title, highlight, className = "" }) {
    return (
        <h2 className={`text-4xl font-black leading-none tracking-tight md:text-5xl ${className}`}>
            <span className="text-slate-50">
                {title}
            </span>

            <span className="block text-violet-300">
                {highlight}
            </span>
        </h2>
    );
}

export default SectionTitle;