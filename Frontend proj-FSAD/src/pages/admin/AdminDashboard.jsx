import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Star,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Card, { StatCard, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Card';
import ProgressBar from '../../components/common/ProgressBar';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { courses, assignments, submissions, progress } = useAppData();

  const publishedCourses = courses.filter((c) => c.status === 'published');
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted').length;
  const avgCompletion = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.progress, 0) / progress.length)
    : 0;

  const recentCourses = [...courses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const recentSubmissions = [...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's happening with your courses today.
          </p>
        </div>
        <Link to="/admin/create-course">
          <Button icon={PlusCircle}>New Course</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Courses"
          value={courses.length}
          icon={BookOpen}
          trend={`${publishedCourses.length} published`}
          color="brand"
        />
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          trend="Across all courses"
          color="blue"
        />
        <StatCard
          label="Assignments"
          value={assignments.length}
          icon={ClipboardList}
          trend={`${pendingSubmissions} pending review`}
          color="orange"
        />
        <StatCard
          label="Avg. Completion"
          value={`${avgCompletion}%`}
          icon={TrendingUp}
          trend="Student progress"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardHeader
            title="Recent Courses"
            action={
              <Link to="/admin/manage-courses">
                <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
              </Link>
            }
          />
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users size={11} /> {course.students}
                    </span>
                    {course.rating > 0 && (
                      <span className="text-xs text-yellow-500 flex items-center gap-1">
                        <Star size={11} fill="currentColor" /> {course.rating}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={course.status === 'published' ? 'success' : 'default'}>
                  {course.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader
            title="Recent Submissions"
            action={
              <Link to="/admin/assignments">
                <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
              </Link>
            }
          />
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {sub.studentName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{sub.studentName}</p>
                    <p className="text-xs text-slate-500 truncate">{sub.fileName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {sub.score !== null ? (
                      <span className="text-sm font-bold text-brand-700">{sub.score}/100</span>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Course Progress Overview */}
      <Card>
        <CardHeader title="Course Enrollment Overview" />
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4">
              <div className="w-32 sm:w-48 truncate text-sm text-slate-700 flex-shrink-0">
                {course.title}
              </div>
              <div className="flex-1">
                <ProgressBar
                  value={course.students}
                  max={60}
                  showPercent={false}
                  size="sm"
                />
              </div>
              <div className="text-sm font-medium text-slate-700 w-16 text-right flex-shrink-0">
                {course.students} students
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Create Course', to: '/admin/create-course', icon: PlusCircle, color: 'bg-brand-700' },
          { label: 'Manage Courses', to: '/admin/manage-courses', icon: BookOpen, color: 'bg-blue-600' },
          { label: 'Assignments', to: '/admin/assignments', icon: ClipboardList, color: 'bg-orange-500' },
          { label: 'Analytics', to: '/admin/progress', icon: TrendingUp, color: 'bg-green-600' },
        ].map((action) => (
          <Link key={action.label} to={action.to}>
            <div className="card p-4 text-center hover:-translate-y-0.5 transition cursor-pointer">
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <action.icon size={18} className="text-white" />
              </div>
              <p className="text-sm font-medium text-slate-700">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
