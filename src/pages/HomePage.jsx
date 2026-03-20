import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import StatCard from "../components/StatCard";
import WorkoutCard from "../components/WorkoutCard";

const features = [
  {
    title: "Track workouts with structure",
    description:
      "Log exercises, duration, intensity, and notes in a clean, consistent workflow."
  },
  {
    title: "Browse a realistic exercise library",
    description:
      "Search by movement, muscle group, and equipment to quickly find the right exercises for your training plan."
  },
  {
    title: "See progress clearly",
    description:
      "Use dashboard summaries and progress records to understand consistency, minutes trained, and recent momentum."
  }
];

const recentWorkouts = [
  {
    id: "home-workout-1",
    focus: "Upper Body",
    title: "Push Strength Session",
    intensity: "Moderate",
    date: "2026-03-17",
    durationMinutes: 55,
    entries: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    notes:
      "Bench press, incline dumbbell press, overhead press, and triceps finishers with controlled tempo."
  },
  {
    id: "home-workout-2",
    focus: "Cardio",
    title: "Interval Conditioning",
    intensity: "High",
    date: "2026-03-15",
    durationMinutes: 35,
    entries: [{ id: 1 }, { id: 2 }, { id: 3 }],
    notes:
      "Treadmill intervals alternating sprint and recovery with a short cooldown walk."
  },
  {
    id: "home-workout-3",
    focus: "Lower Body",
    title: "Leg Day Volume",
    intensity: "Moderate",
    date: "2026-03-13",
    durationMinutes: 60,
    entries: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    notes:
      "Back squats, Romanian deadlifts, split squats, leg press, and calf raises with progressive overload."
  }
];

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
            PERSONAL FITNESS TRACKER
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Build better training habits with one connected fitness workspace.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Plan your sessions, track your effort, and review your progress in
            one place. Velo helps you stay consistent with clear workout logs,
            focused exercise details, and practical insights you can act on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Create account
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              Explore dashboard
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Exercises"
              value={20}
              detail="Searchable library"
            />
            <StatCard label="Workouts" value={10} detail="Completed sessions" />
            <StatCard
              label="Minutes"
              value={180}
              detail="Tracked this cycle"
              tone="success"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-indigo-200 blur-3xl dark:bg-indigo-600/25" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-emerald-200 blur-3xl dark:bg-emerald-500/20" />

          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/60 bg-white p-5 shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
              <img
                src={heroImage}
                alt="interface preview"
                className="mx-auto max-h-72 object-contain"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-indigo-700 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-100">
                  Weekly goal
                </p>
                <p className="mt-3 font-display text-3xl font-extrabold">
                  4 sessions
                </p>
                <p className="mt-2 text-sm text-indigo-100">
                  A realistic target for consistent training and recovery.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Focus split
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <li>Strength days for overload</li>
                  <li>Cardio sessions for conditioning</li>
                  <li>Mobility blocks for recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-slate-200/60 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] bg-slate-50 p-6 dark:bg-slate-800"
              >
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
                  Feature
                </p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {feature.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Recent training
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Recent training sessions
            </h2>
          </div>
          <Link
            to="/workouts/new"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-200"
          >
            Log a workout
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {recentWorkouts.slice(0, 3).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[40px] bg-gradient-to-r from-slate-950 to-indigo-700 px-6 py-10 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-100">
            Ready to start?
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Keep your training routine organized from planning to progress.
              </h2>
              <p className="mt-4 text-base leading-7 text-indigo-100">
                Create your account, log sessions, explore exercises, and follow
                your momentum week after week.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
              >
                Login
              </Link>
              <Link
                to="/exercises"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse exercises
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
