import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Card, { StatCard, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { Badge } from '../../components/ui/Card';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courses, assignments, submissions, getStudentProgress } = useAppData();

  const myProgress = getStudentProgress(user.id);
  const enrolledCourses = courses.filter((c) => myProgress.some((p) => p.courseId === c.id));
  const mySubmissions = submissions.filter((s) => s.studentId === user.id);
  const avgProgress = myProgress.length
    ? Math.round(myProgress.reduce((s, p) => s + p.progress, 0) / myProgress.length)
    : 0;

  // Upcoming assignments for enrolled courses
  const upcomingAssignments = assignments
    .filter((a) => enrolledCourses.some((c) => c.id === a.courseId) && a.status === 'active')
    .filter((a) => !mySubmissions.some((s) => s.assignmentId === a.id))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hello, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Continue your learning journey today.
          </p>
        </div>
        <Link to="/student/courses">
          <Button icon={BookOpen}>Browse Courses</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled Courses"
          value={enrolledCourses.length}
          icon={BookOpen}
          color="brand"
          trend="Active enrollments"
        />
        <StatCard
          label="Avg. Progress"
          value={`${avgProgress}%`}
          icon={TrendingUp}
          color="green"
          trend="Across all courses"
        />
        <StatCard
          label="Assignments Done"
          value={mySubmissions.length}
          icon={CheckCircle}
          color="blue"
          trend="Submitted"
        />
        <StatCard
          label="Pending"
          value={upcomingAssignments.length}
          icon={Clock}
          color="orange"
          trend="Due soon"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader
            title="My Courses"
            action={
              <Link to="/student/courses">
                <Button variant="ghost" size="sm" iconRight={ArrowRight}>Browse</Button>
              </Link>
            }
          />
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-slate-500 text-sm">You haven't enrolled in any courses yet.</p>
              <Link to="/student/courses" className="mt-3 inline-block">
                <Button size="sm">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map((course) => {
                const p = myProgress.find((pr) => pr.courseId === course.id);
                return (
                  <Link key={course.id} to={`/student/course/${course.id}`}>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition cursor-pointer">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {course.thumbnail === 'react' ? '⚛️' :
                         course.thumbnail === 'python' ? '🐍' :
                         course.thumbnail === 'database' ? '🗄️' :
                         course.thumbnail === 'cloud' ? '☁️' : '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{course.title}</p>
                        <ProgressBar value={p?.progress || 0} size="sm" showPercent={false} className="mt-1" />
                        <p className="text-xs text-slate-500 mt-0.5">{p?.progress || 0}% complete</p>
                      </div>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded-lg flex-shrink-0">
                        {p?.grade || '-'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader
            title="Pending Assignments"
            subtitle="Due soon"
          />
          {upcomingAssignments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-slate-500 text-sm">All caught up! No pending assignments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => {
                const course = courses.find((c) => c.id === assignment.courseId);
                const daysLeft = Math.ceil(
                  (new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <Link key={assignment.id} to={`/student/assignment/${assignment.id}`}>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition cursor-pointer">
                      <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{assignment.title}</p>
                        <p className="text-xs text-slate-500 truncate">{course?.title}</p>
                        <p className={`text-xs mt-0.5 font-medium ${daysLeft <= 3 ? 'text-red-500' : 'text-slate-400'}`}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          {daysLeft > 0 ? ` (${daysLeft} days left)` : ' (Overdue)'}
                        </p>
                      </div>
                      <Badge variant={daysLeft <= 3 ? 'danger' : 'warning'}>
                        {assignment.maxScore} pts
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Submissions */}
      {mySubmissions.length > 0 && (
        <Card>
          <CardHeader title="Recent Submissions" />
          <div className="space-y-3">
            {mySubmissions.slice(0, 3).map((sub) => {
              const assignment = assignments.find((a) => a.id === sub.assignmentId);
              return (
                <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{assignment?.title || 'Assignment'}</p>
                    <p className="text-xs text-slate-500">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {sub.score !== null ? (
                      <span className="text-sm font-bold text-brand-700">{sub.score}/100</span>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
