function FeatureCard({ icon: Icon, title, description }) {
    return (
        <article className="group flex flex-col items-start rounded-3xl border border-slate-800 bg-slate-950 p-8 text-start shadow-xl shadow-slate-950/40">
            <div className="rounded-lg bg-violet-500 p-2 text-slate-50">
                <Icon aria-hidden="true" size={20} />
            </div>


            <h3 className="mt-6 text-base font-bold text-slate-50">
                {title}
            </h3>


            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {description}
            </p>
        </article>
    );
}



export default FeatureCard;