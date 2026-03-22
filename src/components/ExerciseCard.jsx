import { Link } from "react-router-dom";

function formatTargets(targetMuscles) {
  return targetMuscles.slice(0, 2).join(" • ");
}

export default function ExerciseCard({ exercise }) {
  return (
    <article className="rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
            {exercise.category}
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {exercise.name}
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {exercise.difficulty}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {exercise.description}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
          <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Target
          </dt>
          <dd className="mt-1 font-semibold">{formatTargets(exercise.targetMuscles)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
          <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Equipment
          </dt>
          <dd className="mt-1 font-semibold">{exercise.equipment}</dd>
        </div>
      </dl>

      <Link
        to={`/exercises/${exercise.id}`}
        className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-200"
      >
        View details
      </Link>
    </article>
  );
}
