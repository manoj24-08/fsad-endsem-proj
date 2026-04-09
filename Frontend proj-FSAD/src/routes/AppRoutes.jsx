import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CreateCoursePage from '../pages/admin/CreateCoursePage';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import CourseContentPage from '../pages/admin/CourseContentPage';
import AssignmentManagementPage from '../pages/admin/AssignmentManagementPage';
import StudentProgressPage from '../pages/admin/StudentProgressPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import AvailableCoursesPage from '../pages/student/AvailableCoursesPage';
import CourseDetailPage from '../pages/student/CourseDetailPage';
import AssignmentSubmissionPage from '../pages/student/AssignmentSubmissionPage';

// Shared
import ProfilePage from '../pages/ProfilePage';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="create-course" element={<CreateCoursePage />} />
        <Route path="manage-courses" element={<ManageCoursesPage />} />
        <Route path="course-content/:courseId" element={<CourseContentPage />} />
        <Route path="assignments" element={<AssignmentManagementPage />} />
        <Route path="progress" element={<StudentProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<AvailableCoursesPage />} />
        <Route path="course/:courseId" element={<CourseDetailPage />} />
        <Route path="assignment/:assignmentId" element={<AssignmentSubmissionPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
