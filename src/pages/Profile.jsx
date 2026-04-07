import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

const goalOptions = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "Stay Consistent",
];
const levelOptions = ["Beginner", "Intermediate", "Advanced"];

/**
 * User profile page — view summary stats and edit personal training preferences.
 * Backed by the AppDataContext (mock data in phase 1; will be wired to
 * GET/PUT /api/users/me in phase 2).
 */
export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, signOut, summary } = useAppData();
  const [formData, setFormData] = useState({
    name: currentUser?.name ?? "",
    fitnessGoal: currentUser?.fitnessGoal ?? goalOptions[0],
    level: currentUser?.level ?? levelOptions[0],
    weeklyGoal: currentUser?.weeklyGoal ?? 3,
    preferredWorkoutLength: currentUser?.preferredWorkoutLength ?? 45,
  });
  const [savedAt, setSavedAt] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setIsSaving(true);
    const result = await updateProfile(formData);
    setIsSaving(false);

    if (!result?.success) {
      setSubmitError(result?.error || "Could not save changes. Try again.");
      return;
    }
    setSavedAt(new Date().toLocaleTimeString());
  }

  function handleSignOut() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Manage the personal details that shape your training plan and goals."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <aside className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Member since
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {currentUser?.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {currentUser?.email}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Joined {currentUser?.joinedDate}
          </p>

          <dl className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Total workouts
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-slate-950 dark:text-white">
                {currentUser?.totalWorkouts ?? 0}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Active minutes (all-time)
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-slate-950 dark:text-white">
                {summary?.totalMinutes ?? 0}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Current streak
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-slate-950 dark:text-white">
                {currentUser?.streak ?? 0} days
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
          >
            Sign out
          </button>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            Edit details
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Updates apply immediately to your dashboard and weekly summaries.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Display name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="profile-goal" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Primary goal
              </label>
              <select
                id="profile-goal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              >
                {goalOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="profile-level" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Training level
              </label>
              <select
                id="profile-level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              >
                {levelOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="profile-weekly-goal" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Weekly workout target
              </label>
              <input
                id="profile-weekly-goal"
                name="weeklyGoal"
                type="number"
                min="1"
                max="14"
                value={formData.weeklyGoal}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="profile-length" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Preferred session length (min)
              </label>
              <input
                id="profile-length"
                name="preferredWorkoutLength"
                type="number"
                min="10"
                max="180"
                value={formData.preferredWorkoutLength}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {savedAt && (
            <p
              role="status"
              className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              Profile saved at {savedAt}.
            </p>
          )}
          {submitError && (
            <p
              role="alert"
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
