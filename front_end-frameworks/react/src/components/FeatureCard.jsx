function FeatureCard({ icon: Icon, title, description }) {
    return (
        <article className="p-8 rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/40 group flex flex-col items-start text-start  ">
            
            
            <div className="rounded-lg bg-violet-500 p-2">
                <Icon size={20} />
            </div>

            <h3 className="mt-6 text-md font-bold text-slate-50">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {description}
            </p>
        </article>
    );
}


export default FeatureCard;