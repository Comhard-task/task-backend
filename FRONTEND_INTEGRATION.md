# Taskify — Frontend Integration Guide 🌿

This guide provides end-to-end instructions, code snippets, and React hooks to integrate the **Taskify Frontend** (both local and deployed on Vercel: `https://taskify-frontend-gray.vercel.app`) with the **Taskify Backend API**.

---

## 1. Environment Setup

### Local Development (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Production Deployment (Vercel Project Settings > Environment Variables):
```env
VITE_API_BASE_URL=https://<your-backend-api-domain>/api/v1
```

---

## 2. Production URLs & CORS

- **Frontend Production URL:** `https://taskify-frontend-gray.vercel.app`
- **Backend Port / Base URL:** `http://localhost:5000/api/v1`
- The backend's CORS policy is pre-configured in `app.js` and `.env` to permit requests from:
  - `https://taskify-frontend-gray.vercel.app`
  - `http://localhost:5173`
  - `http://localhost:3000`

---

## 3. Production API Service Client (`src/services/api.js`)

Save this code in your frontend under `src/services/api.js`:

```javascript
/**
 * Taskify Frontend API Client
 * Configured for both Localhost and Vercel Production
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('taskify_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Generic fetch wrapper with standard envelope unpacking & error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    // If token expired, clear localStorage and notify
    if (response.status === 401 && localStorage.getItem('taskify_token')) {
      localStorage.removeItem('taskify_token');
      window.dispatchEvent(new Event('taskify:unauthorized'));
    }

    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = json?.error?.details || [];
    throw err;
  }

  // Returns standard data payload: { success: true, message: "...", data: { ... } }
  return json;
}

// 1. Authentication APIs
export const authAPI = {
  signup: (userData) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => request('/auth/me')
};

// 2. Tasks APIs (Filters, Search & Pagination)
export const tasksAPI = {
  getTasks: ({
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    category = 'all',
    priority = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status,
      category,
      priority,
      sortBy,
      sortOrder
    });

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    return request(`/tasks?${params.toString()}`);
  },

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  toggleTask: (id) =>
    request(`/tasks/${id}/toggle`, {
      method: 'PATCH'
    }),

  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE'
    })
};

// 3. Analytics & Telemetry APIs
export const analyticsAPI = {
  getWeeklyStats: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/analytics/weekly${query}`);
  },

  getDimensions: () => request('/analytics/dimensions')
};

// 4. Personal Settings APIs
export const settingsAPI = {
  getSettings: () => request('/settings'),
  updateSettings: (settingsData) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    })
};
```

---

## 4. Pre-Seeded Demo Credentials

Pre-loaded for immediate testing:
- **Email:** `eleanor@newlight.space`
- **Password:** `SecurePassword123!`

---

## 5. API Response Envelope

Every endpoint adheres to this standard response contract:

### Success Response (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response (`400`, `401`, `404`, `500`):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title cannot be empty",
    "details": [
      { "field": "title", "issue": "Title cannot be empty" }
    ]
  }
}
```
