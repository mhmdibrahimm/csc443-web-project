import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

function validate(formData) {
  const nextErrors = {};

  if (!formData.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!formData.password.trim()) {
    nextErrors.password = "Password is required.";
  } else if (formData.password.length < 6) {
    nextErrors.password = "Password must be at least 6 characters.";
  }

  return nextErrors;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAppData();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "sara.chen@personalfit.app",
    password: "fit1234",
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = signIn(formData);
    if (!result?.success) {
      setSubmitError(result?.error || "Sign-in failed. Please try again.");
      return;
    }

    // Bounce back to wherever the guest was trying to reach, or fall through
    // to the dashboard.
    const destination = location.state?.from || "/dashboard";
    navigate(destination, { replace: true });
  }

  return (
    <section className="mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="order-2 rounded-[36px] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/30 dark:bg-slate-900 dark:shadow-black/30 lg:order-1 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-200">
            Welcome back
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
            Continue where your last session left off.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Use the credentials below to sign in quickly and continue your
            training journey.
          </p>

          <div className="mt-8 rounded-[28px] bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Sign-in credentials
            </p>
            <p className="mt-3 text-sm text-slate-200">
              Email: <span className="font-semibold">sara.chen@personalfit.app</span>
            </p>
            <p className="mt-1 text-sm text-slate-200">
              Password: <span className="font-semibold">fit1234</span>
            </p>
          </div>
        </div>

        <div className="order-1 rounded-[36px] border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 lg:order-2 lg:p-10">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Login
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Access your dashboard
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Enter your credentials to manage workouts, review exercise details,
              and track progress.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                placeholder="name@example.com"
              />
              {errors.email && (
                <p
                  id="login-email-error"
                  className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-controls="login-password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p
                  id="login-password-error"
                  className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
              />
              Keep me signed in on this device
            </label>

            {submitError && (
              <p
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Login to dashboard
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            New to the project?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
