import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAppData } from "../context/AppDataContext";

/**
 * Weekly progress summary: per-week consistency bars, focus distribution,
 * and aggregate volume. Reads from `progressRecords` and derives focus
 * counts from the workout list.
 */
export default function UserProgress() {
  const {
    currentUser, progressRecords, summary, workouts,
    isDataLoading, dataError, reloadData,
  } = useAppData();

  if (isDataLoading && progressRecords.length === 0) {
    return <LoadingSpinner label="Loading progress..." />;
  }
  if (dataError && progressRecords.length === 0) {
    return <ErrorMessage error={dataError} onRetry={reloadData} />;
  }

  const strengthSessions = workouts.filter(
    (workout) => workout.focus === "Strength",
  ).length;
  const cardioSessions = workouts.filter(
    (workout) => workout.focus === "Cardio",
  ).length;
  const recoverySessions = workouts.filter(
    (workout) => workout.focus === "Mobility" || workout.focus === "Recovery",
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress tracker"
        title="Review consistency across recent training blocks"
        description="Track consistency, training volume, and weekly trends in one clear progress view."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Workout streak"
          value={`${currentUser?.streak ?? 0} days`}
          detail="Current momentum"
          tone="primary"
        />
        <StatCard
          label="Workouts logged"
          value={summary.completedWorkouts}
          detail="Across all recorded sessions"
        />
        <StatCard
          label="Minutes trained"
          value={summary.totalMinutes}
          detail="Total recorded active minutes"
        />
        <StatCard
          label="Calories"
          value={summary.totalCalories}
          detail="Estimated from workout durations"
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Weekly records
          </p>
          <div className="mt-6 grid gap-4">
            {progressRecords.map((record) => (
              <article
                key={record.label}
                className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {record.label}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {record.workoutsCompleted} workouts • {record.activeMinutes}{" "}
                      minutes • {record.caloriesBurned} kcal
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {record.consistency}% consistency
                  </span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600"
                    style={{ width: `${record.consistency}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Focus mix
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Strength sessions
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {strengthSessions}
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Cardio sessions
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {cardioSessions}
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Mobility / recovery sessions
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {recoverySessions}
              </p>
            </div>
            <div className="rounded-[28px] bg-indigo-700 p-5 text-white">
              <p className="text-sm font-semibold text-indigo-100">
                Current goal
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                {currentUser?.fitnessGoal}
              </p>
              <p className="mt-3 text-sm text-indigo-100">
                Preferred workout length: {currentUser?.preferredWorkoutLength}{" "}
                minutes
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
