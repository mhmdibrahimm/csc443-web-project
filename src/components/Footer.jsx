import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-base font-bold text-slate-900 dark:text-white">
            Velo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
          <Link to="/dashboard" className="transition hover:text-indigo-600 dark:hover:text-indigo-300">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
