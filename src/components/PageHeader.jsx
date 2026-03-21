export default function PageHeader({
  eyebrow,
  title,
  description,
  actions = null,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
