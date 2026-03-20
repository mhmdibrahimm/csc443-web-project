import { Link } from "react-router-dom";

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkoutCard({ workout }) {
  return (
    <article className="rounded-[28px] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            {workout.focus}
          </p>
          <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            {workout.title}
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {workout.intensity}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Date
          </p>
          <p className="mt-1 font-semibold">{formatDate(workout.date)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Duration
          </p>
          <p className="mt-1 font-semibold">{workout.durationMinutes} min</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Exercises
          </p>
          <p className="mt-1 font-semibold">{workout.entries.length}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {workout.notes}
      </p>

      <Link
        to={`/workouts/${workout.id}`}
        className="mt-5 inline-flex rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
      >
        Open workout
      </Link>
    </article>
  );
}
