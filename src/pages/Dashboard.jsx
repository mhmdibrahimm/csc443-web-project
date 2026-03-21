import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import WorkoutCard from "../components/WorkoutCard";
import { useAppData } from "../context/AppDataContext";

export default function Dashboard() {
  const { currentUser, exercises, progressRecords, recentWorkouts, summary } =
    useAppData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${currentUser?.name?.split(" ")[0] ?? "Athlete"}`}
        description="Your dashboard summarizes your current training cycle, recent workouts, and your next best actions."
        actions={
          <>
            <Link
              to="/workouts/new"
              className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Log new workout
            </Link>
            <Link
              to="/progress"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              View progress
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Workout count"
          value={summary.completedWorkouts}
          detail="Total sessions logged"
        />
        <StatCard
          label="Active minutes"
          value={summary.totalMinutes}
          detail="Combined training time"
        />
        <StatCard
          label="Exercise library"
          value={exercises.length}
          detail="Searchable movements"
          tone="success"
        />
        <StatCard
          label="Current streak"
          value={`${currentUser?.streak ?? 0} days`}
          detail={`Goal: ${currentUser?.weeklyGoal ?? 0} workouts this week`}
          tone="primary"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
                Progress overview
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Weekly consistency
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Goal: {currentUser?.fitnessGoal}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {progressRecords.map((record) => (
              <article
                key={record.label}
                className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {record.label}
                </p>
                <div className="mt-5 flex h-40 items-end">
                  <div className="w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="rounded-full bg-gradient-to-t from-indigo-700 to-indigo-400"
                      style={{
                        height: `${record.consistency}%`,
                      }}
                    />
                  </div>
                </div>
                <p className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {record.consistency}%
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {record.workoutsCompleted} workouts • {record.activeMinutes} min
                </p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Quick actions
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Keep the flow connected
          </h2>

          <div className="mt-6 space-y-4">
            <Link
              to="/exercises"
              className="block rounded-[28px] bg-slate-50 p-5 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <p className="font-semibold text-slate-950 dark:text-white">
                Explore the exercise library
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Browse movements, open details, and use the search/filter tools.
              </p>
            </Link>
            <Link
              to={`/workouts/${recentWorkouts[0]?.id ?? ""}`}
              className="block rounded-[28px] bg-slate-50 p-5 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <p className="font-semibold text-slate-950 dark:text-white">
                Review your latest workout
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Check the workout detail page with entries, notes, and summary
                stats.
              </p>
            </Link>
            <Link
              to="/progress"
              className="block rounded-[28px] bg-slate-50 p-5 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <p className="font-semibold text-slate-950 dark:text-white">
                Compare recent progress
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Use the progress page to display weekly records and goal
                completion trends.
              </p>
            </Link>
          </div>
        </article>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Recent workouts
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Latest logged sessions
            </h2>
          </div>
          <Link
            to="/workouts/new"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            Create another session
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {recentWorkouts.slice(0, 3).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </section>
    </div>
  );
}
