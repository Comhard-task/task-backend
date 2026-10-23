# Taskify — Backend API Specification & Integration Guide

This document defines the complete RESTful API contract for the **Taskify** mindful personal task management system. Use this specification to build the backend service (Node.js/Express, NestJS, Go, Python/FastAPI, or Spring Boot) and integrate seamlessly with the Taskify frontend.

---

## 1. Global Standards & Conventions

### 1.1 Base URL
```
Development: http://localhost:5000/api/v1
Production:  https://api.taskify.space/api/v1
```

### 1.2 Headers
| Header | Value | Description |
|---|---|---|
| `Content-Type` | `application/json` | Standard payload format |
| `Authorization` | `Bearer <JWT_TOKEN>` | Required for all protected endpoints |

### 1.3 Standard Response Envelope
All API endpoints return JSON conforming to the standard envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      { "field": "title", "issue": "Title cannot be empty" }
    ]
  }
}
```

---

## 2. Authentication Endpoints

### 2.1 Sign Up
- **Method / Path:** `POST /api/v1/auth/signup`
- **Access:** Public

#### Request Body
```json
{
  "name": "Eleanor Vance",
  "email": "eleanor@newlight.space",
  "password": "SecurePassword123!"
}
```

#### Response `201 Created`
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67189a7f3e8201a4b9c1d001",
      "name": "Eleanor Vance",
      "email": "eleanor@newlight.space",
      "createdAt": "2026-10-23T07:15:00.000Z"
    }
  }
}
```

---

### 2.2 Log In
- **Method / Path:** `POST /api/v1/auth/login`
- **Access:** Public

#### Request Body
```json
{
  "email": "eleanor@newlight.space",
  "password": "SecurePassword123!"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "67189a7f3e8201a4b9c1d001",
      "name": "Eleanor Vance",
      "email": "eleanor@newlight.space"
    }
  }
}
```

---

### 2.3 Get Current User Profile
- **Method / Path:** `GET /api/v1/auth/me`
- **Access:** Protected (`Bearer <token>`)

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "67189a7f3e8201a4b9c1d001",
    "name": "Eleanor Vance",
    "email": "eleanor@newlight.space",
    "createdAt": "2026-10-23T07:15:00.000Z"
  }
}
```

---

## 3. Tasks Endpoints (With Filter & Pagination)

### 3.1 Get Tasks (Filtered & Paginated)
- **Method / Path:** `GET /api/v1/tasks`
- **Access:** Protected (`Bearer <token>`)

#### Query Parameters
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Current page number (1-indexed) |
| `limit` | integer | `10` | Items per page (max `50`) |
| `search` | string | `""` | Search text in task `title` and `notes` |
| `status` | string | `"all"` | Filter by status: `all`, `active`, `completed` |
| `category` | string | `"all"` | Filter: `all`, `Mindfulness & Health`, `Deep Focus`, `Learning & Growth`, `Life & Admin` |
| `priority` | string | `"all"` | Filter: `all`, `High`, `Medium`, `Gentle` |
| `sortBy` | string | `"createdAt"` | Sort field: `createdAt`, `dueDate`, `priority`, `estimatedMinutes` |
| `sortOrder`| string | `"desc"` | Sort direction: `asc` or `desc` |

#### Example Request
```http
GET /api/v1/tasks?page=1&limit=10&status=active&category=Deep%20Focus&priority=High&sortBy=createdAt&sortOrder=desc
Authorization: Bearer eyJhbGciOi...
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "67189b8e3e8201a4b9c1d002",
        "title": "Deep focus writing: Draft personal reflections essay",
        "notes": "Focus on chapter 3 ideas and core personal values.",
        "category": "Deep Focus",
        "priority": "High",
        "completed": false,
        "completedAt": null,
        "dueDate": "Today",
        "estimatedMinutes": 90,
        "createdAt": "2026-10-23T07:30:00.000Z",
        "updatedAt": "2026-10-23T07:30:00.000Z"
      }
    ],
    "pagination": {
      "totalTasks": 24,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "summary": {
      "totalActive": 14,
      "totalCompleted": 10,
      "highPriorityCount": 5
    }
  }
}
```

---

### 3.2 Create Personal Task
- **Method / Path:** `POST /api/v1/tasks`
- **Access:** Protected (`Bearer <token>`)

#### Request Body
```json
{
  "title": "45-minute evening meditation and breathwork",
  "category": "Mindfulness & Health",
  "priority": "Gentle",
  "dueDate": "Today, 7:00 PM",
  "estimatedMinutes": 45,
  "notes": "Disconnect from devices and practice restorative breathing."
}
```

#### Response `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "67189c4a3e8201a4b9c1d003",
    "title": "45-minute evening meditation and breathwork",
    "category": "Mindfulness & Health",
    "priority": "Gentle",
    "completed": false,
    "completedAt": null,
    "dueDate": "Today, 7:00 PM",
    "estimatedMinutes": 45,
    "notes": "Disconnect from devices and practice restorative breathing.",
    "createdAt": "2026-10-23T07:45:00.000Z",
    "updatedAt": "2026-10-23T07:45:00.000Z"
  }
}
```

---

### 3.3 Toggle Task Completion Status
- **Method / Path:** `PATCH /api/v1/tasks/:id/toggle`
- **Access:** Protected (`Bearer <token>`)

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Task completion state updated",
  "data": {
    "_id": "67189c4a3e8201a4b9c1d003",
    "completed": true,
    "completedAt": "2026-10-23T07:50:12.000Z",
    "updatedAt": "2026-10-23T07:50:12.000Z"
  }
}
```

---

### 3.4 Update Task Details
- **Method / Path:** `PUT /api/v1/tasks/:id`
- **Access:** Protected (`Bearer <token>`)

#### Request Body
```json
{
  "title": "Extended 60-minute evening breathwork",
  "category": "Mindfulness & Health",
  "priority": "Medium",
  "dueDate": "Today, 8:00 PM",
  "estimatedMinutes": 60,
  "notes": "Add 15 minutes of light yoga stretching."
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "67189c4a3e8201a4b9c1d003",
    "title": "Extended 60-minute evening breathwork",
    "category": "Mindfulness & Health",
    "priority": "Medium",
    "completed": false,
    "dueDate": "Today, 8:00 PM",
    "estimatedMinutes": 60,
    "notes": "Add 15 minutes of light yoga stretching.",
    "updatedAt": "2026-10-23T07:55:00.000Z"
  }
}
```

---

### 3.5 Delete Task
- **Method / Path:** `DELETE /api/v1/tasks/:id`
- **Access:** Protected (`Bearer <token>`)

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "67189c4a3e8201a4b9c1d003"
  }
}
```

---

## 4. Analytics & Telemetry Endpoints (Line Chart & Dimensions)

### 4.1 Get Weekly Telemetry for Line Chart
- **Method / Path:** `GET /api/v1/analytics/weekly`
- **Access:** Protected (`Bearer <token>`)

#### Query Parameters
- `startDate` (optional, default: Monday of current week, e.g. `2026-10-19`)
- `endDate` (optional, default: Sunday of current week, e.g. `2026-10-25`)

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "weeklyStats": [
      { "day": "Mon", "date": "2026-10-19", "completed": 6, "pending": 2, "focusMinutes": 180 },
      { "day": "Tue", "date": "2026-10-20", "completed": 8, "pending": 1, "focusMinutes": 240 },
      { "day": "Wed", "date": "2026-10-21", "completed": 5, "pending": 3, "focusMinutes": 160 },
      { "day": "Thu", "date": "2026-10-22", "completed": 9, "pending": 2, "focusMinutes": 270 },
      { "day": "Fri", "date": "2026-10-23", "completed": 7, "pending": 1, "focusMinutes": 210 },
      { "day": "Sat", "date": "2026-10-24", "completed": 4, "pending": 2, "focusMinutes": 120 },
      { "day": "Sun", "date": "2026-10-25", "completed": 6, "pending": 1, "focusMinutes": 150 }
    ],
    "totalCompletedThisWeek": 45,
    "totalFocusMinutesThisWeek": 1330,
    "weeklyConsistencyRate": 84
  }
}
```

---

### 4.2 Get Life Dimension Alignment
- **Method / Path:** `GET /api/v1/analytics/dimensions`
- **Access:** Protected (`Bearer <token>`)

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "dimensions": [
      { "name": "Mindfulness & Health", "percentage": 85, "tasksCount": 12, "color": "#c4965d" },
      { "name": "Deep Focus Work", "percentage": 70, "tasksCount": 10, "color": "#121b2d" },
      { "name": "Learning & Growth", "percentage": 50, "tasksCount": 6, "color": "#b08752" },
      { "name": "Life & Admin", "percentage": 60, "tasksCount": 8, "color": "#8e8578" }
    ]
  }
}
```

---

## 5. User Settings Endpoints

### 5.1 Get Personal Settings
- **Method / Path:** `GET /api/v1/settings`
- **Access:** Protected (`Bearer <token>`)

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "dailyGoal": 5,
    "dailyFocusMinutes": 180,
    "gentleReminders": true,
    "digitalDetoxReminder": true
  }
}
```

---

### 5.2 Update Personal Settings
- **Method / Path:** `PUT /api/v1/settings`
- **Access:** Protected (`Bearer <token>`)

#### Request Body
```json
{
  "dailyGoal": 5,
  "dailyFocusMinutes": 180,
  "gentleReminders": true,
  "digitalDetoxReminder": true
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "dailyGoal": 5,
    "dailyFocusMinutes": 180,
    "gentleReminders": true,
    "digitalDetoxReminder": true,
    "updatedAt": "2026-10-23T08:00:00.000Z"
  }
}
```
