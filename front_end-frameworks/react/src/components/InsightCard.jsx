function InsightCard({category, title, description, image, index},) {
    const isFirstCard = index === 0;

    return (
        <article
            className={`overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/40 ${
                isFirstCard
                    ? "md:col-span-2 md:grid md:grid-cols-2"
                    : "flex flex-col"
            }`}
        >
            <div className={isFirstCard ? "h-64 md:h-full" : "h-56"}>
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-col items-start p-8 text-start">
                <p className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
                    {category}
                </p>

                <h3
                    className={`mt-6 font-bold text-slate-50 ${
                        isFirstCard
                            ? "text-2xl md:text-3xl"
                            : "text-xl"
                    }`}
                >
                    {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {description}
                </p>
            </div>
        </article>
    );
}


export default InsightCard;