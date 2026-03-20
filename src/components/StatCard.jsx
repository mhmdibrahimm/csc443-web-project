const toneClasses = {
  default:
    "bg-white text-slate-950 dark:bg-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-800",
  primary:
    "bg-gradient-to-br from-indigo-700 to-indigo-500 text-white shadow-lg shadow-indigo-500/20",
  success:
    "bg-emerald-50 text-slate-950 dark:bg-emerald-500/10 dark:text-white border border-emerald-200 dark:border-emerald-500/20",
};

export default function StatCard({
  label,
  value,
  detail,
  tone = "default",
}) {
  return (
    <article
      className={`rounded-3xl p-6 shadow-sm ${toneClasses[tone] ?? toneClasses.default}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-80">
        {label}
      </p>
      <p className="mt-4 font-display text-3xl font-extrabold tracking-tight">
        {value}
      </p>
      {detail && <p className="mt-2 text-sm opacity-80">{detail}</p>}
    </article>
  );
}
