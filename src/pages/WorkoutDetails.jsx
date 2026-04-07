import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAppData } from "../context/AppDataContext";

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Detail view for a single logged workout: focus, intensity, duration, and
 * the exercise-by-exercise breakdown. Notes panel is collapsible to keep the
 * page scannable on mobile.
 */
export default function WorkoutDetails() {
  const { id } = useParams();
  const { fetchWorkoutById } = useAppData();
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(true);
  const notesSectionId = "workout-notes-panel";

  const loadWorkout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWorkoutById(id);
      setWorkout(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWorkoutById, id]);

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWorkoutById(id);
        if (active) setWorkout(data);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [fetchWorkoutById, id]);

  if (isLoading) {
    return <LoadingSpinner label="Loading workout..." />;
  }
  if (error) {
    return <ErrorMessage error={error} onRetry={loadWorkout} />;
  }
  if (!workout) {
    return (
      <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Workout not found
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          The selected workout could not be found. It may have been removed or
          the link may be incorrect.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Return to dashboard
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={workout.focus}
        title={workout.title}
        description={`Logged on ${formatDate(workout.date)} with ${workout.entries.length} exercise entries.`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowNotes((current) => !current)}
              aria-controls={notesSectionId}
              aria-expanded={showNotes}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              {showNotes ? "Hide notes" : "Show notes"}
            </button>
            <Link
              to="/workouts/new"
              className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Log another workout
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Duration"
          value={`${workout.durationMinutes} min`}
          detail="Planned or completed session length"
        />
        <StatCard
          label="Intensity"
          value={workout.intensity}
          detail={`Status: ${workout.status}`}
        />
        <StatCard
          label="Calories"
          value={workout.caloriesBurned}
          detail="Estimated from workout details"
          tone="success"
        />
        <StatCard
          label="Entries"
          value={workout.entries.length}
          detail="Exercises stored in this workout"
          tone="primary"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
                Session notes
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Coaching summary
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowNotes((current) => !current)}
              aria-controls={notesSectionId}
              aria-expanded={showNotes}
              aria-label={showNotes ? "Hide session notes" : "Show session notes"}
              className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              {showNotes ? "Hide" : "Show"}
            </button>
          </div>

          {showNotes ? (
            <p
              id={notesSectionId}
              className="mt-6 rounded-[28px] bg-slate-50 p-5 text-sm leading-7 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {workout.notes || "No notes were captured for this workout."}
            </p>
          ) : (
            <p
              id={notesSectionId}
              className="mt-6 rounded-[28px] bg-slate-50 p-5 text-sm leading-7 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              Notes are currently hidden. Use the toggle to reveal them again.
            </p>
          )}
        </article>

        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Logged entries
          </p>
          <div className="mt-6 space-y-4">
            {workout.entries.map((entry) => (
              <article
                key={`${entry.exerciseId}-${entry.name}`}
                className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {entry.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {entry.sets} sets • {entry.reps}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {entry.durationMinutes} min
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Load
                    </p>
                    <p className="mt-1 font-semibold">{entry.load}</p>
                  </div>
                  <div className="rounded-[20px] bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Prescription
                    </p>
                    <p className="mt-1 font-semibold">
                      {entry.sets} x {entry.reps}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
