import { createContext, useContext, useState } from "react";

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

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState(initialUsers[0]?.id ?? null);

  const currentUser =
    users.find((user) => user.id === currentUserId) ?? initialUsers[0] ?? null;

  function signIn({ email }) {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser =
      users.find((user) => user.email.toLowerCase() === normalizedEmail) ??
      users[0];

    setCurrentUserId(matchedUser.id);

    return {
      success: true,
      user: matchedUser,
    };
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

  const value = {
    users,
    currentUser,
    signIn,
    registerUser,
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
