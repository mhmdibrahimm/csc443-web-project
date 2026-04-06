import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAppData } from "../context/AppDataContext";

/**
 * Detail view for a single exercise. Looks up the exercise by URL param,
 * exposes a collapsible instructions panel, and surfaces related exercises
 * sharing the same category.
 */
export default function ExerciseDetails() {
  const { id } = useParams();
  const { exercises, findExerciseById } = useAppData();
  const [showInstructions, setShowInstructions] = useState(true);
  const instructionsSectionId = "exercise-instructions-panel";

  const exercise = findExerciseById(id);
  const relatedExercises = exercises
    .filter(
      (item) => item.category === exercise?.category && item.id !== exercise?.id,
    )
    .slice(0, 3);

  if (!exercise) {
    return (
      <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Exercise not found
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          The requested exercise could not be found. It may have been removed
          or the link may be incorrect.
        </p>
        <Link
          to="/exercises"
          className="mt-6 inline-flex rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Return to library
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={exercise.category}
        title={exercise.name}
        description={exercise.description}
        actions={
          <>
            <Link
              to="/workouts/new"
              className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Add to a workout
            </Link>
            <button
              type="button"
              onClick={() => setShowInstructions((current) => !current)}
              aria-controls={instructionsSectionId}
              aria-expanded={showInstructions}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              {showInstructions ? "Hide steps" : "Show steps"}
            </button>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
            Key details
          </p>
          <dl className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Difficulty
              </dt>
              <dd className="mt-1 font-semibold">{exercise.difficulty}</dd>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Equipment
              </dt>
              <dd className="mt-1 font-semibold">{exercise.equipment}</dd>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Default prescription
              </dt>
              <dd className="mt-1 font-semibold">
                {exercise.defaultSets} sets • {exercise.repRange}
              </dd>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-800">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Target muscles
              </dt>
              <dd className="mt-1 font-semibold">
                {exercise.targetMuscles.join(", ")}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
                Coaching cues
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {exercise.coachingCues.map((cue) => (
                  <li
                    key={cue}
                    className="rounded-[22px] bg-slate-50 px-4 py-3 dark:bg-slate-800"
                  >
                    {cue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
                  Movement steps
                </p>
                <button
                  type="button"
                  onClick={() => setShowInstructions((current) => !current)}
                  aria-controls={instructionsSectionId}
                  aria-expanded={showInstructions}
                  aria-label={showInstructions ? "Hide movement steps" : "Show movement steps"}
                  className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  {showInstructions ? "Hide" : "Show"}
                </button>
              </div>

              {showInstructions ? (
                <ol
                  id={instructionsSectionId}
                  className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300"
                >
                  {exercise.instructions.map((instruction, index) => (
                    <li
                      key={instruction}
                      className="rounded-[22px] bg-slate-50 px-4 py-3 dark:bg-slate-800"
                    >
                      <span className="font-semibold text-slate-950 dark:text-white">
                        Step {index + 1}:
                      </span>{" "}
                      {instruction}
                    </li>
                  ))}
                </ol>
              ) : (
                <div
                  id={instructionsSectionId}
                  className="mt-4 rounded-[22px] bg-slate-50 px-4 py-5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  Detailed movement instructions are hidden. Use the toggle to
                  reveal them again.
                </div>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
          Related exercises
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {relatedExercises.map((item) => (
            <Link
              key={item.id}
              to={`/exercises/${item.id}`}
              className="rounded-[28px] bg-slate-50 p-5 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                {item.difficulty}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {item.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
