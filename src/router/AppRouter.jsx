import { Link, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import ExerciseDetails from "../pages/ExerciseDetails";
import ExerciseLibrary from "../pages/ExerciseLibrary";
import LogWorkout from "../pages/LogWorkout";
import UserProgress from "../pages/UserProgress";
import WorkoutDetails from "../pages/WorkoutDetails";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
        Missing route
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        We could not find that page.
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        The route may have changed, or it has not been built yet.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
      >
        Return home
      </Link>
    </main>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route path="/exercises/:id" element={<ExerciseDetails />} />
        <Route path="/workouts/new" element={<LogWorkout />} />
        <Route path="/workouts/:id" element={<WorkoutDetails />} />
        <Route path="/progress" element={<UserProgress />} />
      </Route>

      <Route path="/home" element={<Navigate replace to="/" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
