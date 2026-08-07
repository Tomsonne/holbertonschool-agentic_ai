function StatCard({ label, value }) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center shadow-xl shadow-slate-950/40">
            <dt className="order-2 mt-2 text-sm text-slate-400">
                {label}
            </dt>

            <dd className="order-1 text-4xl font-black text-violet-300">
                {value}
            </dd>
        </div>
    );
}

export default StatCard;