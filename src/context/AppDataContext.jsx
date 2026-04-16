/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const initialUsers = [
  {
    id: "user-sara-chen",
    name: "Sara Chen",
    email: "sara.chen@personalfit.app",
    password: "fit1234",
    fitnessGoal: "Build Muscle",
    level: "Intermediate",
    streak: 5,
    weeklyGoal: 4,
    preferredWorkoutLength: 45,
    joinedDate: "2024-09-12",
    totalWorkouts: 26,
  },
  {
    id: "user-daniel-ortiz",
    name: "Daniel Ortiz",
    email: "daniel.ortiz@personalfit.app",
    password: "fit1234",
    fitnessGoal: "Improve Endurance",
    level: "Beginner",
    streak: 3,
    weeklyGoal: 3,
    preferredWorkoutLength: 35,
    joinedDate: "2025-01-03",
    totalWorkouts: 11,
  },
];

const exercises = [
  {
    id: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "Strength",
    difficulty: "Advanced",
    targetMuscles: ["Quadriceps", "Glutes", "Core"],
    equipment: "Barbell",
    defaultSets: 4,
    repRange: "6-8",
    durationMinutes: 18,
    description:
      "A foundational lower-body compound lift for building leg strength, trunk stability, and power production.",
    coachingCues: [
      "Brace before every rep and keep your ribs stacked over your hips.",
      "Drive through the middle of your foot to stay balanced.",
      "Maintain a steady bar path over your mid-foot.",
    ],
    instructions: [
      "Set the bar across your upper back and grip it evenly.",
      "Stand tall, inhale deeply, and unlock your hips and knees together.",
      "Lower until your thighs reach depth while keeping your chest proud.",
      "Push the floor away and stand up with control.",
    ],
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Strength",
    difficulty: "Intermediate",
    targetMuscles: ["Upper Chest", "Shoulders", "Triceps"],
    equipment: "Dumbbells",
    defaultSets: 3,
    repRange: "8-10",
    durationMinutes: 14,
    description:
      "Targets the upper chest while training pressing strength through a stable and joint-friendly range.",
    coachingCues: [
      "Set your shoulder blades before each set.",
      "Press up and slightly in without bouncing the dumbbells.",
      "Keep your wrists stacked over your elbows.",
    ],
    instructions: [
      "Set a bench to a low incline and sit back with the dumbbells on your thighs.",
      "Kick the weights into position over your chest.",
      "Lower under control until your elbows pass slightly below the bench line.",
      "Press back to the top without letting the shoulders roll forward.",
    ],
  },
  {
    id: "conventional-deadlift",
    name: "Conventional Deadlift",
    category: "Strength",
    difficulty: "Advanced",
    targetMuscles: ["Hamstrings", "Glutes", "Back"],
    equipment: "Barbell",
    defaultSets: 4,
    repRange: "4-6",
    durationMinutes: 18,
    description:
      "A full-body hinge pattern that builds posterior-chain strength and reinforces coordinated tension.",
    coachingCues: [
      "Pull the slack out of the bar before breaking the floor.",
      "Keep the bar close to your legs throughout the lift.",
      "Finish with glutes, not by leaning back.",
    ],
    instructions: [
      "Stand with your mid-foot under the bar and hinge to grab it.",
      "Set your back tight and push your chest long.",
      "Drive your feet through the floor and stand tall.",
      "Return the bar by pushing your hips back before bending the knees.",
    ],
  },
  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    category: "Strength",
    difficulty: "Beginner",
    targetMuscles: ["Mid Back", "Lats", "Biceps"],
    equipment: "Cable Machine",
    defaultSets: 3,
    repRange: "10-12",
    durationMinutes: 12,
    description:
      "A controlled rowing variation that develops upper-back strength and postural awareness.",
    coachingCues: [
      "Lead with your elbows instead of yanking with your hands.",
      "Pause briefly at the torso to own the contraction.",
      "Keep your chest tall and avoid excessive lean.",
    ],
    instructions: [
      "Sit tall with a neutral spine and feet braced on the platform.",
      "Grab the handle and extend your arms fully.",
      "Row the handle toward your lower ribs while squeezing your shoulder blades.",
      "Extend back out slowly without losing posture.",
    ],
  },
  {
    id: "treadmill-intervals",
    name: "Treadmill Intervals",
    category: "Cardio",
    difficulty: "Intermediate",
    targetMuscles: ["Cardiovascular System", "Calves", "Glutes"],
    equipment: "Treadmill",
    defaultSets: 6,
    repRange: "45 sec hard / 75 sec easy",
    durationMinutes: 24,
    description:
      "Alternating bursts of speed and recovery to improve conditioning without a long steady-state session.",
    coachingCues: [
      "Build speed smoothly rather than jumping to the final pace.",
      "Keep your shoulders relaxed during hard rounds.",
      "Use the recovery windows to fully reset your breathing.",
    ],
    instructions: [
      "Warm up for five minutes at an easy pace.",
      "Run hard for forty-five seconds.",
      "Recover at a walk or gentle jog for seventy-five seconds.",
      "Repeat for the planned number of rounds and cool down.",
    ],
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: "Cardio",
    difficulty: "Intermediate",
    targetMuscles: ["Glutes", "Hamstrings", "Shoulders"],
    equipment: "Kettlebell",
    defaultSets: 4,
    repRange: "15 reps",
    durationMinutes: 10,
    description:
      "An explosive hinge movement that trains hip snap, coordination, and conditioning at the same time.",
    coachingCues: [
      "Hinge, do not squat, on the backswing.",
      "Let the bell float from the power of your hips.",
      "Keep your neck neutral and ribs down.",
    ],
    instructions: [
      "Set the kettlebell slightly in front of you and hike it back between your legs.",
      "Snap your hips to project the bell to chest height.",
      "Let the bell fall while staying tight through your trunk.",
      "Repeat without lifting with your arms.",
    ],
  },
  {
    id: "plank-series",
    name: "Plank Series",
    category: "Core",
    difficulty: "Beginner",
    targetMuscles: ["Core", "Shoulders", "Glutes"],
    equipment: "Mat",
    defaultSets: 3,
    repRange: "30-45 sec",
    durationMinutes: 9,
    description:
      "A simple core block that builds anti-extension control and teaches total-body tension.",
    coachingCues: [
      "Push the floor away and spread your shoulder blades.",
      "Squeeze your glutes to keep the pelvis from tipping forward.",
      "Breathe quietly through your nose while staying braced.",
    ],
    instructions: [
      "Set your elbows under your shoulders on the mat.",
      "Lift your knees and create a straight line from shoulders to heels.",
      "Hold tension through your midline for the target time.",
      "Rest and repeat until all sets are complete.",
    ],
  },
  {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch",
    category: "Mobility",
    difficulty: "Beginner",
    targetMuscles: ["Hips", "Thoracic Spine", "Hamstrings"],
    equipment: "Bodyweight",
    defaultSets: 2,
    repRange: "5 reps per side",
    durationMinutes: 8,
    description:
      "A mobility sequence that opens the hips, thoracic spine, and posterior chain before training.",
    coachingCues: [
      "Move slowly and use your breath to guide each position.",
      "Keep your front foot planted and stable.",
      "Reach long through the upper body during the rotation.",
    ],
    instructions: [
      "Start in a lunge position with both hands inside your front foot.",
      "Drop your back knee if needed to keep control.",
      "Rotate your chest toward the front knee and reach upward.",
      "Return to the floor, switch sides, and repeat.",
    ],
  },
  {
    id: "walking-lunge",
    name: "Walking Lunge",
    category: "Strength",
    difficulty: "Intermediate",
    targetMuscles: ["Quadriceps", "Glutes", "Adductors"],
    equipment: "Dumbbells",
    defaultSets: 3,
    repRange: "12 steps",
    durationMinutes: 12,
    description:
      "A unilateral leg exercise that improves balance, control, and lower-body endurance.",
    coachingCues: [
      "Stay tall through your torso rather than pitching forward.",
      "Lower under control and avoid slamming the back knee down.",
      "Push strongly through the front heel to drive into the next step.",
    ],
    instructions: [
      "Stand tall with dumbbells at your sides if loading the movement.",
      "Step forward and lower into a controlled split squat.",
      "Drive through the front foot and bring the back leg through.",
      "Continue alternating steps for the target count.",
    ],
  },
];

const initialWorkouts = [
  {
    id: "workout-401",
    title: "Lower Body Power",
    date: "2025-02-18",
    focus: "Strength",
    durationMinutes: 58,
    intensity: "High",
    caloriesBurned: 420,
    status: "Completed",
    notes: "Strong session overall. Added weight on squats and stayed consistent through accessories.",
    entries: [
      {
        exerciseId: "barbell-back-squat",
        name: "Barbell Back Squat",
        sets: 4,
        reps: "6-8",
        load: "85 kg",
        durationMinutes: 18,
      },
      {
        exerciseId: "walking-lunge",
        name: "Walking Lunge",
        sets: 3,
        reps: "12 steps",
        load: "18 kg dumbbells",
        durationMinutes: 12,
      },
      {
        exerciseId: "plank-series",
        name: "Plank Series",
        sets: 3,
        reps: "40 sec",
        load: "Bodyweight",
        durationMinutes: 9,
      },
    ],
  },
  {
    id: "workout-402",
    title: "Upper Body Push",
    date: "2025-02-20",
    focus: "Strength",
    durationMinutes: 46,
    intensity: "Moderate",
    caloriesBurned: 310,
    status: "Completed",
    notes: "Moved with clean tempo and kept rest times tighter than usual.",
    entries: [
      {
        exerciseId: "incline-dumbbell-press",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-10",
        load: "22 kg",
        durationMinutes: 14,
      },
      {
        exerciseId: "seated-cable-row",
        name: "Seated Cable Row",
        sets: 3,
        reps: "10-12",
        load: "55 kg",
        durationMinutes: 12,
      },
      {
        exerciseId: "plank-series",
        name: "Plank Series",
        sets: 3,
        reps: "30 sec",
        load: "Bodyweight",
        durationMinutes: 8,
      },
    ],
  },
  {
    id: "workout-403",
    title: "Conditioning Intervals",
    date: "2025-02-22",
    focus: "Cardio",
    durationMinutes: 32,
    intensity: "High",
    caloriesBurned: 355,
    status: "Completed",
    notes: "Short but hard. Finished with swings after the treadmill rounds.",
    entries: [
      {
        exerciseId: "treadmill-intervals",
        name: "Treadmill Intervals",
        sets: 6,
        reps: "45/75 sec",
        load: "Self-paced",
        durationMinutes: 24,
      },
      {
        exerciseId: "kettlebell-swing",
        name: "Kettlebell Swing",
        sets: 4,
        reps: "15 reps",
        load: "20 kg",
        durationMinutes: 10,
      },
    ],
  },
  {
    id: "workout-404",
    title: "Reset and Mobility",
    date: "2025-02-24",
    focus: "Mobility",
    durationMinutes: 28,
    intensity: "Low",
    caloriesBurned: 150,
    status: "Completed",
    notes: "Recovery-focused session to stay fresh before the next strength block.",
    entries: [
      {
        exerciseId: "worlds-greatest-stretch",
        name: "World's Greatest Stretch",
        sets: 2,
        reps: "5 reps / side",
        load: "Bodyweight",
        durationMinutes: 8,
      },
      {
        exerciseId: "plank-series",
        name: "Plank Series",
        sets: 3,
        reps: "35 sec",
        load: "Bodyweight",
        durationMinutes: 9,
      },
    ],
  },
];

const initialProgressRecords = [
  {
    label: "Week 1",
    workoutsCompleted: 3,
    activeMinutes: 136,
    caloriesBurned: 940,
    consistency: 72,
  },
  {
    label: "Week 2",
    workoutsCompleted: 4,
    activeMinutes: 181,
    caloriesBurned: 1210,
    consistency: 88,
  },
  {
    label: "Week 3",
    workoutsCompleted: 4,
    activeMinutes: 168,
    caloriesBurned: 1105,
    consistency: 84,
  },
  {
    label: "Week 4",
    workoutsCompleted: 5,
    activeMinutes: 205,
    caloriesBurned: 1370,
    consistency: 94,
  },
];

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [progressRecords, setProgressRecords] = useState(initialProgressRecords);
  // Phase 2: start unauthenticated by default. Routes that require a user
  // should be wrapped by <RequireAuth/> so guests can't access them.
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser =
    users.find((user) => user.id === currentUserId) ?? null;

  function signIn({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (!matchedUser || (password && matchedUser.password !== password)) {
      return { success: false, error: "Invalid email or password." };
    }

    setCurrentUserId(matchedUser.id);
    return { success: true, user: matchedUser };
  }

  function signOut() {
    setCurrentUserId(null);
  }

  function registerUser(formData) {
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      fitnessGoal: formData.fitnessGoal,
      level: "Beginner",
      streak: 1,
      weeklyGoal: 3,
      preferredWorkoutLength: 40,
      joinedDate: new Date().toISOString().slice(0, 10),
      totalWorkouts: 0,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);
    setCurrentUserId(newUser.id);

    return newUser;
  }

  function addWorkout(workoutData) {
    // Defensive guard: never let an unauthenticated user mutate state.
    // Routes are also wrapped by <RequireAuth/>, but this protects against
    // direct calls (and matches the API contract phase 2 will enforce).
    if (!currentUserId) {
      return null;
    }

    const selectedExercises = workoutData.exerciseIds
      .map((exerciseId) => exercises.find((exercise) => exercise.id === exerciseId))
      .filter(Boolean);

    const entryCount = Math.max(selectedExercises.length, 1);
    const newWorkout = {
      id: `workout-${Date.now()}`,
      title: workoutData.title.trim(),
      date: workoutData.date,
      focus: workoutData.focus,
      durationMinutes: Number(workoutData.durationMinutes),
      intensity: workoutData.intensity,
      caloriesBurned: Math.round(
        Number(workoutData.durationMinutes) *
          (workoutData.focus === "Cardio"
            ? 10
            : workoutData.focus === "Mobility"
              ? 4
              : 7),
      ),
      status: "Planned",
      notes: workoutData.notes.trim(),
      entries: selectedExercises.map((exercise) => ({
        exerciseId: exercise.id,
        name: exercise.name,
        sets: exercise.defaultSets,
        reps: exercise.repRange,
        load: workoutData.focus === "Mobility" ? "Bodyweight" : "Working sets",
        durationMinutes: Math.max(
          6,
          Math.round(Number(workoutData.durationMinutes) / entryCount),
        ),
      })),
    };

    setWorkouts((previousWorkouts) => [newWorkout, ...previousWorkouts]);
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              totalWorkouts: user.totalWorkouts + 1,
            }
          : user,
      ),
    );
    setProgressRecords((previousRecords) =>
      previousRecords.map((record, index) =>
        index === previousRecords.length - 1
          ? {
              ...record,
              workoutsCompleted: record.workoutsCompleted + 1,
              activeMinutes: record.activeMinutes + newWorkout.durationMinutes,
              caloriesBurned: record.caloriesBurned + newWorkout.caloriesBurned,
              consistency: Math.min(record.consistency + 2, 100),
            }
          : record,
      ),
    );

    return newWorkout;
  }

  function updateProfile(updates) {
    if (!currentUserId) return null;
    const safeUpdates = {
      name: updates.name?.trim(),
      fitnessGoal: updates.fitnessGoal,
      level: updates.level,
      weeklyGoal: Number(updates.weeklyGoal) || undefined,
      preferredWorkoutLength: Number(updates.preferredWorkoutLength) || undefined,
    };
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUserId
          ? { ...u, ...Object.fromEntries(Object.entries(safeUpdates).filter(([, v]) => v !== undefined)) }
          : u,
      ),
    );
    return users.find((u) => u.id === currentUserId);
  }

  function findExerciseById(exerciseId) {
    return exercises.find((exercise) => exercise.id === exerciseId);
  }

  function findWorkoutById(workoutId) {
    return workouts.find((workout) => workout.id === workoutId);
  }

  const summary = useMemo(() => {
    const totalMinutes = workouts.reduce(
      (minutes, workout) => minutes + workout.durationMinutes,
      0,
    );
    const totalCalories = workouts.reduce(
      (calories, workout) => calories + workout.caloriesBurned,
      0,
    );

    return {
      totalMinutes,
      totalCalories,
      completedWorkouts: workouts.length,
    };
  }, [workouts]);

  const value = {
    users,
    currentUser,
    exercises,
    workouts,
    progressRecords,
    summary,
    featuredExercises: exercises.slice(0, 4),
    recentWorkouts: workouts.slice(0, 4),
    signIn,
    signOut,
    registerUser,
    updateProfile,
    addWorkout,
    findExerciseById,
    findWorkoutById,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider.");
  }

  return context;
}
