import { Link, NavLink, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

const primaryLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/exercises", label: "Exercises" },
  { to: "/progress", label: "Progress" },
  { to: "/dashboard", label: "Dashboard" }
];

function getNavLinkClasses({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
  ].join(" ");
}

export default function Navbar() {
  const location = useLocation();

  // TODO: implement login/register
  const authAction =
    location.pathname === "/login"
      ? { to: "/register", label: "Create account" }
      : location.pathname === "/register"
        ? { to: "/login", label: "Login" }
        : { to: "/register", label: "Get started" };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full flex-wrap gap-2 sm:order-none sm:w-auto"
        >
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={getNavLinkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            Login
          </Link>
          <Link
            to={authAction.to}
            className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
          >
            {authAction.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
