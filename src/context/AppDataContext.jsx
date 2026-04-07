/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, getAuthToken, setAuthToken } from "../lib/api.js";

const AppDataContext = createContext(null);

/**
 * App-wide data + auth store, backed by the Velo API.
 *
 * Lifecycle:
 *  - On mount, if a JWT is in localStorage, the provider validates it by
 *    calling GET /api/users/me. Success transitions to "authed"; failure
 *    clears the token and falls back to "guest".
 *  - When the user signs in or registers, we store the JWT, set the
 *    `currentUser`, and lazily load exercises / workouts / progress.
 *  - Routes that require auth should still be wrapped in <RequireAuth/>.
 */
export function AppDataProvider({ children }) {
  // "loading" until the boot check finishes; then "authed" or "guest".
  const [authStatus, setAuthStatus] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  // --- Boot: validate any stored JWT ---------------------------------------
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setAuthStatus("guest");
      return;
    }
    (async () => {
      try {
        const { user } = await apiFetch("/api/users/me");
        setCurrentUser(user);
        setAuthStatus("authed");
      } catch {
        setAuthToken(null);
        setAuthStatus("guest");
      }
    })();
  }, []);

  // --- Data loaders --------------------------------------------------------
  const loadUserData = useCallback(async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const [exRes, wkRes, prRes] = await Promise.all([
        apiFetch("/api/exercises"),
        apiFetch("/api/workouts"),
        apiFetch("/api/progress"),
      ]);
      setExercises(exRes.exercises || []);
      setWorkouts(wkRes.workouts || []);
      setProgressRecords(prRes.progress || []);
    } catch (err) {
      setDataError(err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Trigger the data load whenever the user becomes authenticated.
  useEffect(() => {
    if (authStatus === "authed") {
      loadUserData();
    } else {
      // Clear cached state on sign-out so a different user doesn't see stale data.
      setExercises([]);
      setWorkouts([]);
      setProgressRecords([]);
    }
  }, [authStatus, loadUserData]);

  // --- Auth actions --------------------------------------------------------
  async function signIn({ email, password }) {
    try {
      const { user, token } = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setAuthToken(token);
      setCurrentUser(user);
      setAuthStatus("authed");
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function registerUser(formData) {
    try {
      const { user, token } = await apiFetch("/api/auth/register", {
        method: "POST",
        body: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          fitnessGoal: formData.fitnessGoal,
        },
      });
      setAuthToken(token);
      setCurrentUser(user);
      setAuthStatus("authed");
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function signOut() {
    setAuthToken(null);
    setCurrentUser(null);
    setAuthStatus("guest");
  }

  async function updateProfile(updates) {
    try {
      const { user } = await apiFetch("/api/users/me", {
        method: "PUT",
        body: updates,
      });
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- Workout actions -----------------------------------------------------
  async function addWorkout(workoutData) {
    try {
      const entries = (workoutData.exerciseIds || []).map((exerciseId) => {
        const exercise = exercises.find((e) => e.id === exerciseId);
        return {
          exerciseId,
          sets: exercise?.defaultSets ?? null,
          reps: exercise?.repRange ?? null,
          load: workoutData.focus === "Mobility" ? "Bodyweight" : "Working sets",
          durationMinutes: exercise?.durationMinutes ?? null,
        };
      });

      const { workout } = await apiFetch("/api/workouts", {
        method: "POST",
        body: {
          title: workoutData.title,
          date: workoutData.date,
          focus: workoutData.focus,
          durationMinutes: Number(workoutData.durationMinutes),
          intensity: workoutData.intensity,
          notes: workoutData.notes,
          entries,
        },
      });
      setWorkouts((prev) => [workout, ...prev]);
      apiFetch("/api/progress")
        .then((res) => setProgressRecords(res.progress || []))
        .catch((err) => setDataError(err));
      return { success: true, workout };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function deleteWorkout(workoutId) {
    try {
      await apiFetch(`/api/workouts/${workoutId}`, { method: "DELETE" });
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
      apiFetch("/api/progress")
        .then((res) => setProgressRecords(res.progress || []))
        .catch((err) => setDataError(err));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Fetch a single workout by id, including its entries. The list endpoint
   * doesn't include entries, so a detail page needs this dedicated fetch.
   */
  const fetchWorkoutById = useCallback(async (workoutId) => {
    const { workout } = await apiFetch(`/api/workouts/${workoutId}`);
    return workout;
  }, []);

  function findExerciseById(exerciseId) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  function findWorkoutById(workoutId) {
    return workouts.find((workout) => workout.id === workoutId);
  }

  const summary = useMemo(() => {
    const totalMinutes = workouts.reduce((m, w) => m + (w.durationMinutes || 0), 0);
    const totalCalories = workouts.reduce((c, w) => c + (w.caloriesBurned || 0), 0);
    return { totalMinutes, totalCalories, completedWorkouts: workouts.length };
  }, [workouts]);

  const value = {
    authStatus,
    currentUser,
    exercises,
    workouts,
    progressRecords,
    summary,
    featuredExercises: exercises.slice(0, 4),
    recentWorkouts: workouts.slice(0, 4),
    isDataLoading,
    dataError,
    signIn,
    signOut,
    registerUser,
    updateProfile,
    addWorkout,
    deleteWorkout,
    fetchWorkoutById,
    findExerciseById,
    findWorkoutById,
    reloadData: loadUserData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider.");
  }
  return context;
}
