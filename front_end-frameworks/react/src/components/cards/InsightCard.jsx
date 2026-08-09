function InsightCard({ category, title, description, image, index }) {
    const isFirstCard = index === 0;

    return (
        <article
            className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/40 ${
                isFirstCard
                    ? "sm:col-span-2 lg:col-span-2"
                    : ""
            }`}
        >
            <img
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-10 flex min-h-80 flex-col items-start justify-end p-8 text-start">
                <p className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
                    {category}
                </p>

                <h3
                    className={`mt-4 font-bold text-slate-50 ${
                        isFirstCard
                            ? "text-2xl md:text-3xl"
                            : "text-xl"
                    }`}
                >
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {description}
                </p>
            </div>
        </article>
    );
}

export default InsightCard;