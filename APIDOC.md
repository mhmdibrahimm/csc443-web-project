# Velo API Documentation

This document describes the backend API for **Velo — Personal Fitness Tracker**.
The Phase 2 backend is built with Node.js, Express, PostgreSQL, JWT authentication,
and bcrypt password hashing.

## Base URLs

| Environment | Base URL |
| --- | --- |
| Local backend | `http://localhost:3001` |
| Deployed app/API | `https://csc443-web-project.vercel.app` |

In production, the React frontend and Express API are served from the same Vercel
project. API routes are available under `/api/*`.

## General Rules

- Request bodies should be JSON.
- Send `Content-Type: application/json` for requests with a body.
- Successful responses are JSON unless the endpoint returns `204 No Content`.
- Error responses use this shape:

```json
{
  "error": "Human readable error message"
}
```

## Authentication

Registration and login return a JWT. Protected endpoints require the token in
the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

If the token is missing, malformed, expired, or invalid, protected routes return
`401 Unauthorized`.

## Data Models

### User

```json
{
  "id": "uuid",
  "name": "Mohammad Ibrahim",
  "email": "mohammad@example.com",
  "fitnessGoal": "Build strength",
  "level": "Beginner",
  "weeklyGoal": 3,
  "preferredWorkoutLength": 45,
  "joinedDate": "2026-04-01T10:00:00.000Z"
}
```

Passwords are never returned by the API. The backend stores password hashes only.

### Exercise

```json
{
  "id": "barbell-back-squat",
  "name": "Barbell Back Squat",
  "category": "Strength",
  "difficulty": "Advanced",
  "targetMuscles": ["Quadriceps", "Glutes", "Core"],
  "equipment": "Barbell",
  "defaultSets": 4,
  "repRange": "6-8",
  "durationMinutes": 18,
  "description": "A foundational lower-body compound lift.",
  "coachingCues": ["Brace before every rep."],
  "instructions": ["Set the bar across your upper back."]
}
```

Exercises are catalog data. They are read from the database and seeded from the
fitness tracker exercise library.

### Workout

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Lower Body Strength",
  "date": "2026-04-20",
  "focus": "Strength",
  "durationMinutes": 55,
  "intensity": "High",
  "caloriesBurned": 385,
  "status": "Completed",
  "notes": "Felt strong on squats.",
  "createdAt": "2026-04-20T12:00:00.000Z",
  "entries": [
    {
      "id": "uuid",
      "exerciseId": "barbell-back-squat",
      "name": "Barbell Back Squat",
      "sets": 4,
      "reps": "6-8",
      "load": "Working sets",
      "durationMinutes": 18
    }
  ]
}
```

Workouts are the main user-owned CRUD entity for Phase 2. Users can only read,
update, or delete workouts that belong to their own account.

### Progress Record

```json
{
  "label": "Week 1",
  "weekStart": "2026-04-06T00:00:00.000Z",
  "workoutsCompleted": 4,
  "activeMinutes": 190,
  "caloriesBurned": 1320,
  "consistency": 80
}
```

Progress records are derived from the authenticated user's workouts.

## Endpoint Summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Check API health. |
| `POST` | `/api/auth/register` | No | Create a user account and return a JWT. |
| `POST` | `/api/auth/login` | No | Authenticate a user and return a JWT. |
| `GET` | `/api/users/me` | Yes | Get the current user's profile. |
| `PUT` | `/api/users/me` | Yes | Update the current user's profile. |
| `GET` | `/api/exercises` | No | List exercise catalog records. |
| `GET` | `/api/exercises/:id` | No | Get one exercise by ID. |
| `GET` | `/api/workouts` | Yes | List the current user's workouts. |
| `GET` | `/api/workouts/:id` | Yes | Get one owned workout by ID. |
| `POST` | `/api/workouts` | Yes | Create a workout for the current user. |
| `PUT` | `/api/workouts/:id` | Yes | Update an owned workout. |
| `DELETE` | `/api/workouts/:id` | Yes | Delete an owned workout. |
| `GET` | `/api/progress` | Yes | Get weekly progress aggregates. |

## Endpoints

### GET `/health`

Checks whether the API is running.

**Auth:** Not required

**Response `200`:**

```json
{
  "status": "ok",
  "uptime": 12.345
}
```

### POST `/api/auth/register`

Creates a new user account. The password is validated, hashed with bcrypt, and
stored as `password_hash` in the database.

**Auth:** Not required

**Request body:**

```json
{
  "fullName": "Mohammad Ibrahim",
  "email": "mohammad@example.com",
  "password": "Password123",
  "fitnessGoal": "Build strength"
}
```

**Validation:**

- `fullName`, `email`, and `password` are required.
- Password must include at least 8 characters, an uppercase letter, a lowercase
  letter, and a number.
- Email must be unique.

**Response `201`:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Mohammad Ibrahim",
    "email": "mohammad@example.com",
    "fitnessGoal": "Build strength",
    "level": "Beginner",
    "weeklyGoal": 3,
    "preferredWorkoutLength": 45,
    "joinedDate": "2026-04-01T10:00:00.000Z"
  },
  "token": "jwt-token"
}
```

**Common errors:**

- `400` when required fields are missing or the password is weak.
- `409` when an account already exists for the email.

### POST `/api/auth/login`

Authenticates an existing user against the stored bcrypt password hash.

**Auth:** Not required

**Request body:**

```json
{
  "email": "mohammad@example.com",
  "password": "Password123"
}
```

**Response `200`:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Mohammad Ibrahim",
    "email": "mohammad@example.com",
    "fitnessGoal": "Build strength",
    "level": "Beginner",
    "weeklyGoal": 3,
    "preferredWorkoutLength": 45,
    "joinedDate": "2026-04-01T10:00:00.000Z"
  },
  "token": "jwt-token"
}
```

**Common errors:**

- `400` when `email` or `password` is missing.
- `401` when the credentials are invalid.

### GET `/api/users/me`

Returns the authenticated user's profile.

**Auth:** Required

**Response `200`:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Mohammad Ibrahim",
    "email": "mohammad@example.com",
    "fitnessGoal": "Build strength",
    "level": "Beginner",
    "weeklyGoal": 3,
    "preferredWorkoutLength": 45,
    "joinedDate": "2026-04-01T10:00:00.000Z"
  }
}
```

**Common errors:**

- `401` when the JWT is missing or invalid.
- `404` when the token is valid but the user record no longer exists.

### PUT `/api/users/me`

Updates editable profile fields for the authenticated user.

**Auth:** Required

**Request body:** all fields are optional.

```json
{
  "name": "Mohammad Ibrahim",
  "fitnessGoal": "Improve endurance",
  "level": "Intermediate",
  "weeklyGoal": 4,
  "preferredWorkoutLength": 50
}
```

**Allowed `level` values:**

- `Beginner`
- `Intermediate`
- `Advanced`

**Response `200`:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Mohammad Ibrahim",
    "email": "mohammad@example.com",
    "fitnessGoal": "Improve endurance",
    "level": "Intermediate",
    "weeklyGoal": 4,
    "preferredWorkoutLength": 50,
    "joinedDate": "2026-04-01T10:00:00.000Z"
  }
}
```

**Common errors:**

- `400` when `level` is not one of the allowed values.
- `401` when the JWT is missing or invalid.

### GET `/api/exercises`

Returns the exercise catalog.

**Auth:** Not required by the API. In the React app, the exercise library page is
shown inside the authenticated app shell.

**Query parameters:**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| `category` | No | `Strength` | Filters exercises by category. |
| `difficulty` | No | `Advanced` | Filters exercises by difficulty. |

**Response `200`:**

```json
{
  "exercises": [
    {
      "id": "barbell-back-squat",
      "name": "Barbell Back Squat",
      "category": "Strength",
      "difficulty": "Advanced",
      "targetMuscles": ["Quadriceps", "Glutes", "Core"],
      "equipment": "Barbell",
      "defaultSets": 4,
      "repRange": "6-8",
      "durationMinutes": 18,
      "description": "A foundational lower-body compound lift.",
      "coachingCues": ["Brace before every rep."],
      "instructions": ["Set the bar across your upper back."]
    }
  ]
}
```

### GET `/api/exercises/:id`

Returns one exercise by ID.

**Auth:** Not required

**Path parameters:**

| Name | Description |
| --- | --- |
| `id` | Exercise ID, such as `barbell-back-squat`. |

**Response `200`:**

```json
{
  "exercise": {
    "id": "barbell-back-squat",
    "name": "Barbell Back Squat",
    "category": "Strength",
    "difficulty": "Advanced",
    "targetMuscles": ["Quadriceps", "Glutes", "Core"],
    "equipment": "Barbell",
    "defaultSets": 4,
    "repRange": "6-8",
    "durationMinutes": 18,
    "description": "A foundational lower-body compound lift.",
    "coachingCues": ["Brace before every rep."],
    "instructions": ["Set the bar across your upper back."]
  }
}
```

**Common errors:**

- `404` when the exercise ID does not exist.

### GET `/api/workouts`

Returns the authenticated user's workouts, ordered newest first.

**Auth:** Required

**Response `200`:**

```json
{
  "workouts": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Lower Body Strength",
      "date": "2026-04-20",
      "focus": "Strength",
      "durationMinutes": 55,
      "intensity": "High",
      "caloriesBurned": 385,
      "status": "Completed",
      "notes": "Felt strong on squats.",
      "createdAt": "2026-04-20T12:00:00.000Z",
      "entries": []
    }
  ]
}
```

The list endpoint returns workout metadata. Use `GET /api/workouts/:id` to load
exercise entries for a single workout.

### GET `/api/workouts/:id`

Returns one workout owned by the authenticated user, including exercise entries.

**Auth:** Required

**Authorization rule:** the workout must belong to the authenticated user.

**Path parameters:**

| Name | Description |
| --- | --- |
| `id` | Workout UUID. |

**Response `200`:**

```json
{
  "workout": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Lower Body Strength",
    "date": "2026-04-20",
    "focus": "Strength",
    "durationMinutes": 55,
    "intensity": "High",
    "caloriesBurned": 385,
    "status": "Completed",
    "notes": "Felt strong on squats.",
    "createdAt": "2026-04-20T12:00:00.000Z",
    "entries": [
      {
        "id": "uuid",
        "exerciseId": "barbell-back-squat",
        "name": "Barbell Back Squat",
        "sets": 4,
        "reps": "6-8",
        "load": "Working sets",
        "durationMinutes": 18
      }
    ]
  }
}
```

**Common errors:**

- `401` when the JWT is missing or invalid.
- `404` when the workout does not exist or belongs to another user.

### POST `/api/workouts`

Creates a workout for the authenticated user.

**Auth:** Required

**Request body:**

```json
{
  "title": "Lower Body Strength",
  "date": "2026-04-20",
  "focus": "Strength",
  "durationMinutes": 55,
  "intensity": "High",
  "notes": "Felt strong on squats.",
  "entries": [
    {
      "exerciseId": "barbell-back-squat",
      "sets": 4,
      "reps": "6-8",
      "load": "Working sets",
      "durationMinutes": 18
    }
  ]
}
```

**Required fields:**

- `title`
- `date`
- `durationMinutes`

**Allowed `focus` values:**

- `Strength`
- `Cardio`
- `Mobility`
- `Recovery`

**Allowed `intensity` values:**

- `Low`
- `Moderate`
- `High`

`caloriesBurned` and `status` may also be sent. If `caloriesBurned` is omitted,
the server estimates it from duration and focus.

**Response `201`:**

```json
{
  "workout": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Lower Body Strength",
    "date": "2026-04-20",
    "focus": "Strength",
    "durationMinutes": 55,
    "intensity": "High",
    "caloriesBurned": 385,
    "status": "Completed",
    "notes": "Felt strong on squats.",
    "createdAt": "2026-04-20T12:00:00.000Z",
    "entries": [
      {
        "id": "uuid",
        "exerciseId": "barbell-back-squat",
        "name": "Barbell Back Squat",
        "sets": 4,
        "reps": "6-8",
        "load": "Working sets",
        "durationMinutes": 18
      }
    ]
  }
}
```

**Common errors:**

- `400` when required fields are missing or enum values are invalid.
- `401` when the JWT is missing or invalid.

### PUT `/api/workouts/:id`

Updates an existing workout owned by the authenticated user.

**Auth:** Required

**Authorization rule:** the workout must belong to the authenticated user.

**Request body:** all fields are optional.

```json
{
  "title": "Updated Lower Body Strength",
  "date": "2026-04-21",
  "focus": "Strength",
  "durationMinutes": 60,
  "intensity": "Moderate",
  "notes": "Reduced intensity and added more warmup.",
  "status": "Completed"
}
```

**Response `200`:**

```json
{
  "workout": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Updated Lower Body Strength",
    "date": "2026-04-21",
    "focus": "Strength",
    "durationMinutes": 60,
    "intensity": "Moderate",
    "caloriesBurned": 385,
    "status": "Completed",
    "notes": "Reduced intensity and added more warmup.",
    "createdAt": "2026-04-20T12:00:00.000Z",
    "entries": []
  }
}
```

**Common errors:**

- `400` when enum values are invalid.
- `401` when the JWT is missing or invalid.
- `404` when the workout does not exist or belongs to another user.

### DELETE `/api/workouts/:id`

Deletes an existing workout owned by the authenticated user. Related
`workout_entries` are deleted automatically by the database cascade rule.

**Auth:** Required

**Authorization rule:** the workout must belong to the authenticated user.

**Response `204`:**

No response body.

**Common errors:**

- `401` when the JWT is missing or invalid.
- `404` when the workout does not exist or belongs to another user.

### GET `/api/progress`

Returns weekly progress aggregates derived from the authenticated user's
workouts. The API returns up to the latest four workout weeks, oldest first.

**Auth:** Required

**Response `200`:**

```json
{
  "progress": [
    {
      "label": "Week 1",
      "weekStart": "2026-04-06T00:00:00.000Z",
      "workoutsCompleted": 4,
      "activeMinutes": 190,
      "caloriesBurned": 1320,
      "consistency": 80
    }
  ]
}
```

**Common errors:**

- `401` when the JWT is missing or invalid.
