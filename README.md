# Scholarship Finder

> A full-stack MERN application that helps students discover and apply to scholarships through intelligent profile-based matching.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-green)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Matching Algorithm](#matching-algorithm)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

---

## Overview

Scholarship Finder addresses a real pain point for students: manually sifting through hundreds of irrelevant scholarships to find the few that actually match their profile. The platform solves this by computing a compatibility score (0–100) for every scholarship against the student's academic profile — covering course, GPA, location, eligibility category, and deadline urgency — and surfacing the most relevant opportunities first.

**Core problem:** Students spend hours searching scholarship portals only to find most opportunities don't match their eligibility.

**Solution:** A profile-aware matching engine that ranks scholarships by compatibility in real time, reducing discovery time from hours to seconds.

---

## Features

### Personalized Scholarship Matching
The primary feature. After a student completes their profile, the system scores every scholarship in the database against five weighted criteria and returns a ranked list with match scores. Students see *why* a scholarship is a good fit, not just *that* it is.

### Advanced Search & Filtering
Browse the full scholarship catalog with filters for amount range, currency (INR/USD), course/field of study, location, and eligibility category. Results can be sorted by nearest deadline.

### Save & Track
Bookmark scholarships for later review. The saved list persists across sessions and serves as a personal application pipeline.

### Secure Authentication
JWT-based auth with bcrypt password hashing. Tokens are stored in secure HTTP-only cookies. Rate limiting and security headers (Helmet) are applied at the middleware level.

---

## Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tooling |
| React Router v7 | Client-side routing |
| TailwindCSS v4 | Utility-first styling |
| Axios | HTTP client |
| Context API | Auth and theme state management |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose v9 | Primary database and ODM |
| JSON Web Tokens (v9) | Stateless authentication |
| bcryptjs v3 | Password hashing |
| Helmet v8 | HTTP security headers |
| express-rate-limit v8 | Request throttling |
| CORS v2 | Cross-origin resource sharing |

---

## System Architecture

```
Client (React + Vite)
        │
        │  HTTP / REST
        ▼
Express REST API (Node.js)
        │
   ┌────┴────┐
   │         │
Auth MW   Route Handlers
(JWT)      │
           ├── authController
           ├── scholarshipController
           ├── matchController  ◄── matchScore utility
           └── userController
                    │
                    ▼
              MongoDB (Mongoose)
              ├── Scholarship collection
              └── User collection
```

**Request flow for personalized matching:**

1. Client sends `GET /website/match` with JWT in cookie
2. Auth middleware verifies token and attaches `req.user`
3. `matchController` fetches the user's profile and all active scholarships
4. `matchScore` utility computes a score for each scholarship
5. Results are sorted by score (descending) and returned

---

## Matching Algorithm

The algorithm lives in `Backend/App/utils/mathScore.js` and evaluates five weighted criteria.

**Total score: 0–100 points**

| Criterion | Weight | Logic |
|---|---|---|
| Course alignment | 30 pts | Exact match → 30; partial keyword match → 10; open to all → 15 |
| Eligibility category | 25 pts | Exact match → 25; scholarship open to all → 12 |
| GPA / academic merit | 20 pts | Meets minimum → 20; within 0.5 of threshold → 8; no minimum → 10 |
| Location | 15 pts | City/state match or nationwide → 15; no restriction → 8 |
| Deadline urgency | 10 pts | ≤30 days → 10; ≤90 days → 5; >90 days → 0 |

**Example calculation:**

```
Student: Computer Science, GPA 3.8, Mumbai, General category

Scholarship: "Google Scholarship for CSE"
  Requirements: CSE/IT, GPA ≥ 3.5, India, General, deadline in 20 days

  Course (CS ↔ CSE):             30 / 30
  Category (General ↔ General):  25 / 25
  GPA (3.8 ≥ 3.5):               20 / 20
  Location (Mumbai → India):     15 / 15
  Deadline (20 days):            10 / 10
  ─────────────────────────────────────
  Match score:                  100 / 100
```

The matching endpoint returns all scholarships with a `matchScore` field, sorted highest-to-lowest, so the client can render them ranked by relevance.

---

## Project Structure

```
Scholarship/
├── Backend/
│   ├── App/
│   │   ├── controller/
│   │   │   ├── authController.js        # Registration, login, logout
│   │   │   ├── scholarshipController.js # CRUD + save/unsave operations
│   │   │   ├── matchController.js       # Personalized matching endpoint
│   │   │   └── userController.js        # Profile read/update
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── scholarship.js
│   │   │   ├── matchRoutes.js
│   │   │   └── users.js
│   │   ├── model/
│   │   │   └── scholarshipmodel.js      # Mongoose schemas (User + Scholarship)
│   │   ├── Middleware/
│   │   │   └── authMiddleware.js        # JWT verification
│   │   └── utils/
│   │       └── mathScore.js             # Matching algorithm
│   ├── index.js                         # Server entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── AllScholarships.jsx          # Browse + filter view
    │   │   ├── PersonalizedScholarships.jsx # Ranked match results
    │   │   ├── SavedScholarships.jsx
    │   │   └── Profile.jsx
    │   ├── components/
    │   │   ├── ScholarshipCard.jsx
    │   │   ├── MatchScoreBadge.jsx
    │   │   ├── FilterPanel.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── ThemeContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── api.js                           # Axios instance + interceptors
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js v14 or higher
- MongoDB (local instance or MongoDB Atlas)
- npm

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
DBURL=mongodb+srv://<username>:<password>@cluster.mongodb.net/scholarship
JWT_SECRET=your_jwt_secret
PORT=8000
```

Start the server:

```bash
npm start
# Server: http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
# App: http://localhost:5173
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/website/auth/signup` | Register a new user |
| POST | `/website/auth/login` | Authenticate and receive JWT cookie |
| POST | `/website/auth/logout` | Invalidate session |

### Scholarships

| Method | Endpoint | Description |
|---|---|---|
| GET | `/website/scholarship` | List all scholarships (supports query filters) |
| GET | `/website/scholarship/saved` | Get authenticated user's saved scholarships |
| POST | `/website/scholarship/:id/save` | Save a scholarship |
| DELETE | `/website/scholarship/:id/save` | Remove a saved scholarship |

**Query parameters for `GET /website/scholarship`:**

```
?category=General
?currency=INR
?minAmount=50000
?maxAmount=500000
?course=Computer Science
?location=Mumbai
```

### Matching

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/website/match` | Return scholarships ranked by match score | Yes |

**Sample response:**

```json
[
  {
    "_id": "...",
    "title": "Google Scholarship for CSE",
    "provider": "Google",
    "amount": "₹5,00,000",
    "amountValue": 500000,
    "currency": "INR",
    "matchScore": 95,
    "eligibility": {
      "courses": ["CSE", "IT"],
      "minGPA": 3.5,
      "locations": ["India"],
      "categories": ["General"]
    },
    "deadline": "2026-05-31",
    "isSaved": false
  }
]
```

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/website/users/profile` | Fetch authenticated user's profile |
| PUT | `/website/users/profile` | Update profile fields |

---

## Database Schema

### Scholarship

```javascript
{
  title:        String,           // "Google Scholarship for CSE"
  provider:     String,           // "Google"
  amount:       String,           // Display string: "₹1,00,000 – ₹5,00,000"
  amountValue:  Number,           // Numeric value for range filtering
  currency:     "INR" | "USD",

  eligibility: {
    courses:    [String],         // ["CSE", "IT", "Computer Science"]
    minGPA:     Number,           // 3.5
    locations:  [String],         // ["Mumbai", "Maharashtra", "India"]
    categories: [String]          // ["General", "OBC"]
  },

  deadline:     Date,
  description:  String,
  url:          String,
  source:       String,
  tags:         [String],
  scrapedAt:    Date
}
```

### User

```javascript
{
  name:          String,
  email:         String,           // unique index

  profile: {
    course:      String,           // "BTech Computer Science"
    gpa:         Number,           // 3.8
    location:    String,           // "Mumbai, Maharashtra"
    categories:  [String]          // ["General"]
  },

  savedScholarships: [ObjectId],   // refs to Scholarship documents
  passwordHash:  String            // bcrypt hash, never returned in API responses
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Good areas to contribute:**

- Extend the matching algorithm with additional criteria (financial need, disability status, etc.)
- Add email notifications for approaching deadlines
- Build an admin panel for scholarship data management
- Improve mobile responsiveness
- Add multi-language support
- Write unit tests for the matching utility

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

[@Pushpak174](https://github.com/Pushpak174) · [GitHub Repository](https://github.com/Pushpak174/Scholarship)
