# FSAD-PS44: Online Course Management System for Educators

A complete, production-ready frontend web application built with **React + Vite + Tailwind CSS** for the FSAD Problem Statement 44.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin (Educator)** | admin@edu.com | admin123 |
| **Student** | student@edu.com | student123 |

> Use the **Demo Credentials** buttons on the login page for one-click auto-fill.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Recharts | Analytics charts |
| Lucide React | Icon library |
| clsx | Conditional class names |

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── common/          # Shared components (Navbar, Sidebar, CourseCard, ProgressBar)
│   └── ui/              # Base UI components (Button, Input, Card, Toast)
├── context/
│   ├── AuthContext.jsx  # Authentication state & actions
│   └── AppDataContext.jsx # App data state (courses, assignments, progress)
├── data/
│   └── mockData.js      # All mock data (users, courses, assignments, analytics)
├── layouts/
│   ├── PublicLayout.jsx # Layout for public pages
│   ├── AdminLayout.jsx  # Layout with admin sidebar
│   └── StudentLayout.jsx # Layout with student sidebar
├── pages/
│   ├── LandingPage.jsx  # Public landing page
│   ├── ProfilePage.jsx  # Shared profile page
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── CreateCoursePage.jsx
│   │   ├── ManageCoursesPage.jsx
│   │   ├── CourseContentPage.jsx
│   │   ├── AssignmentManagementPage.jsx
│   │   └── StudentProgressPage.jsx
│   └── student/
│       ├── StudentDashboard.jsx
│       ├── AvailableCoursesPage.jsx
│       ├── CourseDetailPage.jsx
│       └── AssignmentSubmissionPage.jsx
└── routes/
    └── AppRoutes.jsx    # Route definitions with protected routes
```

---

## 🎯 Features

### 🔐 Authentication & Authorization
- Role-based login (Admin / Student)
- Protected routes with automatic redirects
- Persistent session via localStorage
- Registration with role selection and form validation

### 👨‍🏫 Admin (Educator) Portal
- **Dashboard** — Stats overview (courses, students, assignments, avg. completion)
- **Create Course** — Full form with modules, categories, levels, tags, validation
- **Manage Courses** — Search, filter, publish/unpublish, delete courses
- **Course Content** — Drag-and-drop file upload UI, material management per module
- **Assignment Management** — Create assignments, view submissions with grading status
- **Student Progress Analytics** — 4 interactive charts (bar, line, horizontal bar, pie) + progress table

### 👨‍🎓 Student Portal
- **Dashboard** — Enrolled courses, pending assignments, submission history
- **Browse Courses** — Search, filter by category/level, enroll with one click
- **Course Detail** — Overview, curriculum modules, materials, assignments tabs
- **Assignment Submission** — Drag-and-drop file upload, notes, submission confirmation
- **Profile** — View/edit profile, enrolled courses with progress

### 🎨 Design System
- **Color Theme**: Deep purple (`#5b21b6`) primary, light purple accents, white background
- **Components**: Reusable Button (6 variants), Input/Textarea/Select, Card/StatCard/Badge, ProgressBar, Toast notifications
- **Responsive**: Mobile-first with hamburger sidebar on small screens
- **Animations**: Hover transitions, loading spinners, progress bars

---

## 📊 Application Flow

```
Landing Page
    ↓
Login / Register (role selection)
    ↓
Admin Dashboard ──→ Create Course ──→ Manage Courses ──→ Course Content
                ──→ Assignment Management ──→ Student Progress Analytics
    OR
Student Dashboard ──→ Browse Courses ──→ Course Detail ──→ Assignment Submission
                  ──→ Profile
```

---

## 🗂️ Mock Data

All data is in-memory (no backend required):
- **3 mock users** (1 admin, 2 students)
- **4 courses** with modules, tags, ratings
- **5 course materials** (PDF, video, notebook)
- **5 assignments** across courses
- **3 submissions** with grades and feedback
- **4 student progress records**
- **Analytics data** for all charts

---

## 📝 Notes

- All data resets on page refresh (in-memory state)
- File uploads are simulated (no actual file storage)
- Charts use Recharts with responsive containers
- Build output: ~728 KB JS (includes Recharts), ~32 KB CSS
