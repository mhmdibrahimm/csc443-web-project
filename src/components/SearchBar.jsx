export default function SearchBar({
  value,
  onChange,
  label = "Search exercises",
  placeholder = "Search by name, muscle group, or equipment",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
      />
    </label>
  );
}
