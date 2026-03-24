import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

const workoutFocusOptions = ["Strength", "Cardio", "Mobility", "Recovery"];
const intensityOptions = ["Low", "Moderate", "High"];

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function validate(formData) {
  const nextErrors = {};

  if (!formData.title.trim()) {
    nextErrors.title = "Workout title is required.";
  }

  if (!formData.date) {
    nextErrors.date = "Workout date is required.";
  }

  if (!formData.durationMinutes) {
    nextErrors.durationMinutes = "Duration is required.";
  } else if (Number(formData.durationMinutes) <= 0) {
    nextErrors.durationMinutes = "Duration must be greater than zero.";
  }

  if (formData.exerciseIds.length === 0) {
    nextErrors.exerciseIds = "Select at least one exercise.";
  }

  return nextErrors;
}

export default function LogWorkout() {
  const navigate = useNavigate();
  const { addWorkout, exercises } = useAppData();
  const [formData, setFormData] = useState({
    title: "",
    date: getTodayDate(),
    focus: workoutFocusOptions[0],
    durationMinutes: 45,
    intensity: intensityOptions[1],
    notes: "",
    exerciseIds: [],
  });
  const [errors, setErrors] = useState({});
  const exerciseSelectionDescriptionId = errors.exerciseIds
    ? "workout-exercises-error"
    : "workout-exercises-help";

  const selectedExercises = useMemo(
    () =>
      exercises.filter((exercise) => formData.exerciseIds.includes(exercise.id)),
    [exercises, formData.exerciseIds],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  function toggleExerciseSelection(exerciseId) {
    setFormData((previousFormData) => ({
      ...previousFormData,
      exerciseIds: previousFormData.exerciseIds.includes(exerciseId)
        ? previousFormData.exerciseIds.filter((id) => id !== exerciseId)
        : [...previousFormData.exerciseIds, exerciseId],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const newWorkout = addWorkout(formData);
    navigate(`/workouts/${newWorkout.id}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workout logger"
        title="Create a new session"
        description="Build a session with key details, exercise selections, and notes before you save it."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="workout-title"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Workout title
              </label>
              <input
                id="workout-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "workout-title-error" : undefined}
                placeholder="Example: Push Day Volume"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
              {errors.title && (
                <p
                  id="workout-title-error"
                  className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="workout-date"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Date
              </label>
              <input
                id="workout-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "workout-date-error" : undefined}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
              {errors.date && (
                <p
                  id="workout-date-error"
                  className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="workout-duration"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Duration (minutes)
              </label>
              <input
                id="workout-duration"
                type="number"
                min="1"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                aria-invalid={Boolean(errors.durationMinutes)}
                aria-describedby={
                  errors.durationMinutes ? "workout-duration-error" : undefined
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
              {errors.durationMinutes && (
                <p
                  id="workout-duration-error"
                  className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.durationMinutes}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="workout-focus"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Focus
              </label>
              <select
                id="workout-focus"
                name="focus"
                value={formData.focus}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              >
                {workoutFocusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="workout-intensity"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Intensity
              </label>
              <select
                id="workout-intensity"
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              >
                {intensityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="workout-notes"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Notes
              </label>
              <textarea
                id="workout-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Optional notes about pacing, load, technique, or recovery."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="mt-8">
            <div
              role="group"
              aria-labelledby="workout-exercises-heading"
              aria-describedby={exerciseSelectionDescriptionId}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2
                    id="workout-exercises-heading"
                    className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
                  >
                    Select exercises
                  </h2>
                  <p
                    id="workout-exercises-help"
                    className="mt-1 text-sm text-slate-600 dark:text-slate-300"
                  >
                    Choose at least one movement to include in the session.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {exercises.map((exercise) => {
                  const isSelected = formData.exerciseIds.includes(exercise.id);

                  return (
                    <label
                      key={exercise.id}
                      className={`cursor-pointer rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-500 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleExerciseSelection(exercise.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                        />
                        <span>
                          <span className="block font-semibold text-slate-950 dark:text-white">
                            {exercise.name}
                          </span>
                          <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                            {exercise.category} • {exercise.equipment}
                          </span>
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors.exerciseIds && (
                <p
                  id="workout-exercises-error"
                  className="mt-3 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.exerciseIds}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
          >
            Save workout
          </button>
        </form>

        <aside className="space-y-6">
          <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Live summary
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {formData.title.trim() || "Untitled workout"}
            </h2>
            <dl className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
                <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Focus
                </dt>
                <dd className="mt-1 font-semibold">{formData.focus}</dd>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
                <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Duration
                </dt>
                <dd className="mt-1 font-semibold">
                  {formData.durationMinutes} minutes
                </dd>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
                <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Selected exercises
                </dt>
                <dd className="mt-1 font-semibold">
                  {selectedExercises.length || 0}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Selected list
            </p>
            {selectedExercises.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {selectedExercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="rounded-[24px] bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <p className="font-semibold">{exercise.name}</p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      {exercise.defaultSets} sets • {exercise.repRange}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                No exercises selected yet. Check one or more movement cards from
                the form.
              </p>
            )}
          </article>
        </aside>
      </div>
    </div>
  );
}
