import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // TODO: implement login/register
  const authAction = isLoginPage
    ? { to: "/register", label: "Create account" }
    : { to: "/register", label: "Get started" };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-2 md:flex"
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

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {!isRegisterPage && (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              Login
            </Link>
          )}
          {!isRegisterPage && (
            <Link
              to={authAction.to}
              className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              {authAction.label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-public-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-public-menu"
          className="border-t border-slate-200/70 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 md:hidden"
        >
          <nav aria-label="Mobile primary navigation" className="space-y-2">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 grid gap-2">
            {!isRegisterPage && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>
            )}
            {!isRegisterPage && (
              <Link
                to={authAction.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
              >
                {authAction.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
