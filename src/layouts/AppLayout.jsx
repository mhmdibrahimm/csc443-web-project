import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import ThemeToggle from "../components/ThemeToggle";
import { useAppData } from "../context/AppDataContext";

const appLinks = [
  {
    to: "/home",
    label: "Home",
    description: "Main home page",
    icon: (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    ),
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Overview and recent activity",
    icon: (
      <path d="M4.75 5.75h6.5v5.5h-6.5zm8 0h6.5v8.5h-6.5zm-8 7h6.5v5.5h-6.5zm8 1.5h6.5v4h-6.5z" />
    ),
  },
  {
    to: "/exercises",
    label: "Exercises",
    description: "Search the movement library",
    icon: (
      <path d="M6 8.25h12M6 15.75h12M8.25 5.5v5.5M15.75 13v5.5M4.75 9.5h3.5v-2.5h-3.5zm11 7h3.5V14h-3.5z" />
    ),
  },
  {
    to: "/workouts/new",
    label: "Log Workout",
    description: "Add a new training session",
    icon: <path d="M12 5v14M5 12h14" />,
  },
  {
    to: "/progress",
    label: "Progress",
    description: "Track weekly momentum",
    icon: <path d="M5 17.5 9.5 13l3 3 6.5-7M5 5.5v12h14" />,
  },
];

const routeTitles = [
  { match: "/dashboard", title: "Training dashboard" },
  { match: "/exercises", title: "Exercise library" },
  { match: "/workouts/new", title: "Workout logger" },
  { match: "/workouts/", title: "Workout details" },
  { match: "/progress", title: "Progress tracker" },
];

const mobileRouteTitles = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/exercises", title: "Exercises" },
  { match: "/workouts/new", title: "Log workout" },
  { match: "/workouts/", title: "Workout details" },
  { match: "/progress", title: "Progress" },
];

function getLinkClasses({ isActive }) {
  return [
    "group flex items-start gap-3 rounded-[24px] px-4 py-4 transition",
    isActive
      ? "bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
  ].join(" ");
}

function SignOutIcon() {
  return (
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
      <path d="M10 6.75V5.5A2.5 2.5 0 0 1 12.5 3h4A2.5 2.5 0 0 1 19 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 10 18.5v-1.25" />
      <path d="M4 12h10M7.5 8.5 4 12l3.5 3.5" />
    </svg>
  );
}

function SignOutButton({ onSignOut }) {
  return (
    <button
      type="button"
      onClick={onSignOut}
      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:border-rose-400/50 dark:hover:bg-rose-500/20"
      aria-label="Sign out of your account"
    >
      <SignOutIcon />
      <span>Sign out</span>
    </button>
  );
}

/**
 * Layout shell for authenticated routes. Provides the desktop sidebar and
 * a slide-out mobile menu. The mobile menu intentionally exposes a "Back to
 * landing page" link so users on small screens can escape the app shell.
 */
export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAppData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTitle =
    routeTitles.find((item) => location.pathname.startsWith(item.match))?.title ??
    "Personal Fitness Tracker";
  const mobileTitle =
    mobileRouteTitles.find((item) => location.pathname.startsWith(item.match))?.title ??
    "Dashboard";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  function handleSignOut() {
    signOut();
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-transparent">
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-80 md:flex-col md:overflow-y-auto md:border-r md:border-slate-200/70 md:bg-white/90 md:px-6 md:py-6 md:backdrop-blur dark:md:border-slate-800 dark:md:bg-slate-950/85">
                <BrandMark />


        <nav aria-label="App navigation" className="mt-6 space-y-2">
          {appLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getLinkClasses}>
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition",
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-slate-200 bg-white text-slate-500 group-hover:border-indigo-200 group-hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:group-hover:border-indigo-500/40 dark:group-hover:text-indigo-300",
                    ].join(" ")}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      {link.icon}
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <span
                      className={[
                        "mt-1 block text-xs",
                        isActive ? "text-indigo-100" : "text-slate-500 dark:text-slate-400",
                      ].join(" ")}
                    >
                      {link.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <Link
            to="/profile"
            aria-label="Open your profile"
            className="block rounded-[30px] border border-slate-200/70 bg-slate-50 p-5 transition hover:border-indigo-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Active user
            </p>
            <p className="mt-2 font-display text-xl font-bold text-slate-950 dark:text-white">
              {currentUser?.name}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Goal: {currentUser?.fitnessGoal}
            </p>
            <p className="mt-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              {currentUser?.streak} day streak
            </p>
          </Link>
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
            <SignOutButton onSignOut={handleSignOut} />
          </div>
        </div>
      </aside>

      <div className="md:pl-80">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-3 sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="hidden text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300 sm:block">
                  Personal Fitness Tracker
                </p>
                <h1 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:mt-2 sm:text-2xl">
                  <span className="sm:hidden">{mobileTitle}</span>
                  <span className="hidden sm:inline">{currentTitle}</span>
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-2 self-center">
                <span className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:inline-flex">
                  🔥 {currentUser?.streak} day streak
                </span>
                <button
                  type="button"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-app-menu"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setIsMobileMenuOpen((current) => !current)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300 md:hidden"
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

          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Close mobile app menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px]"
            />
            <aside
              id="mobile-app-menu"
              className="fixed inset-y-0 left-0 z-40 flex w-[88vw] max-w-sm flex-col border-r border-slate-200/70 bg-white px-5 py-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4 rounded-[28px] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Open your profile"
                  className="-m-1 flex-1 rounded-2xl p-1 transition hover:bg-white/60 dark:hover:bg-slate-800/60"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Active user
                  </p>
                  <p className="mt-2 font-display text-lg font-bold text-slate-950 dark:text-white">
                    {currentUser?.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Goal: {currentUser?.fitnessGoal}
                  </p>
                </Link>
                <button
                  type="button"
                  aria-label="Close mobile app menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                >
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
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav aria-label="Mobile app navigation" className="mt-6 space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-[24px] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
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
                      <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />
                    </svg>
                  </span>
                  Back to landing page
                </Link>
                {appLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-start gap-3 rounded-[24px] px-4 py-4 transition",
                        isActive
                          ? "bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={[
                            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                            isActive
                              ? "border-white/20 bg-white/10 text-white"
                              : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400",
                          ].join(" ")}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            {link.icon}
                          </svg>
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{link.label}</span>
                          <span
                            className={[
                              "mt-1 block text-xs",
                              isActive ? "text-indigo-100" : "text-slate-500 dark:text-slate-400",
                            ].join(" ")}
                          >
                            {link.description}
                          </span>
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto rounded-[28px] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {currentUser?.streak} day streak
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ThemeToggle />
                  <SignOutButton onSignOut={handleSignOut} />
                </div>
              </div>
            </aside>
          </div>
        )}

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
