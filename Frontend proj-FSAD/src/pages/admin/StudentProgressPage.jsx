import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { analyticsData } from '../../data/mockData';
import Card, { CardHeader, StatCard } from '../../components/ui/Card';
import ProgressBar from '../../components/common/ProgressBar';

const COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#e9d5ff', '#f3e8ff'];
const GRADE_COLORS = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};

export default function StudentProgressPage() {
  const { courses, progress, submissions } = useAppData();

  const totalStudents = [...new Set(progress.map((p) => p.studentId))].length;
  const avgProgress = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.progress, 0) / progress.length)
    : 0;
  const gradedSubmissions = submissions.filter((s) => s.score !== null);
  const avgScore = gradedSubmissions.length
    ? Math.round(gradedSubmissions.reduce((s, sub) => s + sub.score, 0) / gradedSubmissions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Student Progress Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Track student performance and engagement across all courses.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Students" value={totalStudents} icon={Users} color="brand" trend="Enrolled students" />
        <StatCard label="Avg. Progress" value={`${avgProgress}%`} icon={TrendingUp} color="green" trend="Across all courses" />
        <StatCard label="Avg. Score" value={`${avgScore}/100`} icon={Award} color="blue" trend="Graded assignments" />
        <StatCard label="Total Courses" value={courses.length} icon={BookOpen} color="orange" trend="Active courses" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by Month */}
        <Card>
          <CardHeader title="Monthly Enrollment" subtitle="New student enrollments" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.enrollmentByMonth} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="students" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader title="Weekly Activity" subtitle="Logins and submissions" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analyticsData.weeklyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="logins" stroke="#7c3aed" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="submissions" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Rates */}
        <Card>
          <CardHeader title="Course Completion Rates" subtitle="% of students who completed" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={analyticsData.courseCompletionRates}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis dataKey="course" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(v) => [`${v}%`, 'Completion']}
              />
              <Bar dataKey="rate" fill="#a855f7" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader title="Grade Distribution" subtitle="Overall grade breakdown" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={analyticsData.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="grade"
                >
                  {analyticsData.gradeDistribution.map((entry) => (
                    <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {analyticsData.gradeDistribution.map((item) => (
                <div key={item.grade} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: GRADE_COLORS[item.grade] }}
                  />
                  <span className="text-sm text-slate-600 flex-1">Grade {item.grade}</span>
                  <span className="text-sm font-medium text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader title="Individual Student Progress" subtitle="Detailed progress per student per course" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lessons</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {progress.map((p, i) => {
                const course = courses.find((c) => c.id === p.courseId);
                const studentNames = { 2: 'Rahul Verma', 3: 'Sai Kiran Reddy' };
                return (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(studentNames[p.studentId] || 'U').split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-800">{studentNames[p.studentId] || `Student ${p.studentId}`}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 max-w-[160px] truncate">{course?.title || 'Unknown'}</td>
                    <td className="py-3 px-2 w-32">
                      <ProgressBar value={p.progress} size="sm" showPercent={false} />
                      <span className="text-xs text-slate-500 mt-0.5 block">{p.progress}%</span>
                    </td>
                    <td className="py-3 px-2 text-slate-600">{p.completedLessons}/{p.totalLessons}</td>
                    <td className="py-3 px-2 text-slate-600">{p.timeSpent}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${
                        p.grade === 'A' ? 'text-green-600' :
                        p.grade === 'B' || p.grade === 'B+' || p.grade === 'A-' ? 'text-blue-600' :
                        'text-slate-600'
                      }`}>
                        {p.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
