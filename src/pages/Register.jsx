import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

const goalOptions = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "Stay Consistent",
];

// Password rules — kept in one place so the live hint and the validator stay
// in sync. Mirrors the rules the backend will enforce in phase 2.
const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /\d/.test(p) },
];

function getPasswordError(password) {
  if (!password.trim()) return "Password is required.";
  const failed = passwordRules.filter((rule) => !rule.test(password));
  if (failed.length === 0) return null;
  return `Password must include: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
}

function validate(formData) {
  const nextErrors = {};

  if (!formData.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  }

  if (!formData.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    nextErrors.email = "Enter a valid email address.";
  }

  const passwordError = getPasswordError(formData.password);
  if (passwordError) {
    nextErrors.password = passwordError;
  }

  if (!formData.confirmPassword.trim()) {
    nextErrors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  if (!formData.fitnessGoal.trim()) {
    nextErrors.fitnessGoal = "Select a primary fitness goal.";
  }

  return nextErrors;
}

/**
 * Account-creation form. Phase 2 will replace `registerUser` with a
 * POST /api/auth/register call; the validator already mirrors the
 * server-side rules so the client and API agree.
 */
export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAppData();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    fitnessGoal: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser(formData);
    setIsSubmitting(false);

    if (!result?.success) {
      setSubmitError(result?.error || "Registration failed. Please try again.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="flex flex-col items-center justify-center rounded-[36px] bg-gradient-to-br from-indigo-700 to-indigo-500 p-8 text-white shadow-xl shadow-indigo-500/20 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-100">
            Create account
          </p>
          <h1 className="mt-4 font-display text-4xl text-center font-extrabold tracking-tight">
            Start building a training routine you can actually review.
          </h1>
        </aside>

        <div className="rounded-[36px] border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 lg:p-10">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300">
              Register
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Set up your profile
            </h2>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Full name
                </label>
                <input
                  id="register-name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? "register-name-error" : undefined
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                />
                {errors.fullName && (
                  <p
                    id="register-name-error"
                    className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "register-email-error" : undefined
                  }
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                />
                {errors.email && (
                  <p
                    id="register-email-error"
                    className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby="register-password-rules"
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                />
                <ul
                  id="register-password-rules"
                  className="mt-2 space-y-1 text-xs"
                >
                  {passwordRules.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <li
                        key={rule.id}
                        className={
                          passed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      >
                        <span aria-hidden="true">{passed ? "✓" : "○"}</span>{" "}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
                {errors.password && (
                  <p
                    id="register-password-error"
                    className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Confirm password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword
                      ? "register-confirm-password-error"
                      : undefined
                  }
                  placeholder="Confirm your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                />
                {errors.confirmPassword && (
                  <p
                    id="register-confirm-password-error"
                    className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="register-goal"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Primary goal
                </label>
                <select
                  id="register-goal"
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.fitnessGoal)}
                  aria-describedby={
                    errors.fitnessGoal ? "register-goal-error" : undefined
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10"
                >
                  <option value="">Select your goal</option>
                  {goalOptions.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
                {errors.fitnessGoal && (
                  <p
                    id="register-goal-error"
                    className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                  >
                    {errors.fitnessGoal}
                  </p>
                )}
              </div>
            </div>

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
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-700 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
