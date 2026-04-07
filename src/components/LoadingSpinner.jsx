/** Centered loading indicator for in-page data fetches. */
export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 py-12 text-slate-500 dark:text-slate-400"
    >
      <span
        aria-hidden="true"
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-700 dark:border-slate-700 dark:border-t-indigo-400"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
