import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import { useAppData } from "../context/AppDataContext";

const categoryFilters = ["All", "Strength", "Cardio", "Core", "Mobility"];
const difficultyFilters = ["All", "Beginner", "Intermediate", "Advanced"];

function getButtonClasses(isActive) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
      : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  ].join(" ");
}

export default function ExerciseLibrary() {
  const { exercises } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        exercise.name.toLowerCase().includes(normalizedSearch) ||
        exercise.equipment.toLowerCase().includes(normalizedSearch) ||
        exercise.targetMuscles.some((muscle) =>
          muscle.toLowerCase().includes(normalizedSearch),
        );

      const matchesCategory =
        categoryFilter === "All" || exercise.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "All" || exercise.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [categoryFilter, deferredSearchTerm, difficultyFilter, exercises]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Exercise library"
        title="Search, filter, and compare movement options"
        actions={
          <Link
            to="/workouts/new"
            className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
          >
            Build a workout
          </Link>
        }
      />

      <section className="rounded-[32px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SearchBar
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Matching exercises
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {filteredExercises.length}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Filter by category, difficulty, and search term.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p
              id="exercise-category-filter-label"
              className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Category
            </p>
            <div
              role="group"
              aria-labelledby="exercise-category-filter-label"
              className="flex flex-wrap gap-2"
            >
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setCategoryFilter(filter)}
                  aria-pressed={categoryFilter === filter}
                  className={getButtonClasses(categoryFilter === filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              id="exercise-difficulty-filter-label"
              className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Difficulty
            </p>
            <div
              role="group"
              aria-labelledby="exercise-difficulty-filter-label"
              className="flex flex-wrap gap-2"
            >
              {difficultyFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDifficultyFilter(filter)}
                  aria-pressed={difficultyFilter === filter}
                  className={getButtonClasses(difficultyFilter === filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {filteredExercises.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            No exercises match these filters.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Try clearing the search input or switching the category and
            difficulty filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All");
              setDifficultyFilter("All");
            }}
            className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-200"
          >
            Reset filters
          </button>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </section>
      )}
    </div>
  );
}
