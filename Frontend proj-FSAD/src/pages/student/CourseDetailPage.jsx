import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  FileText,
  Video,
  File,
  ClipboardList,
  PlayCircle,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Card, { CardHeader, Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/common/ProgressBar';

const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  video: { icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
  notebook: { icon: File, color: 'text-orange-500', bg: 'bg-orange-50' },
  default: { icon: File, color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { courses, materials, assignments, submissions, enrollCourse, isEnrolled, getCourseProgress, updateProgress } = useAppData();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const course = courses.find((c) => c.id === parseInt(courseId));
  const enrolled = isEnrolled(user.id, parseInt(courseId));
  const progress = getCourseProgress(user.id, parseInt(courseId));
  const courseMaterials = materials.filter((m) => m.courseId === parseInt(courseId));
  const courseAssignments = assignments.filter((a) => a.courseId === parseInt(courseId));
  const mySubmissions = submissions.filter((s) => s.studentId === user.id);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/student/courses">
          <Button variant="outline" size="sm" className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const handleEnroll = async () => {
    setEnrolling(true);
    await new Promise((r) => setTimeout(r, 500));
    enrollCourse(user.id, course.id);
    setEnrolling(false);
  };

  const handleLessonComplete = (moduleIdx) => {
    if (!enrolled) return;
    const currentDone = progress?.completedLessons || 0;
    updateProgress(user.id, course.id, Math.min(currentDone + 1, progress?.totalLessons || 20));
  };

  const thumbnailColors = {
    react: 'from-cyan-400 to-blue-500',
    python: 'from-yellow-400 to-orange-500',
    database: 'from-green-400 to-teal-500',
    cloud: 'from-sky-400 to-indigo-500',
    default: 'from-brand-400 to-brand-700',
  };

  const gradientClass = thumbnailColors[course.thumbnail] || thumbnailColors.default;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/student/courses">
        <Button variant="ghost" size="sm" icon={ArrowLeft}>Back to Courses</Button>
      </Link>

      {/* Hero */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradientClass} p-8 text-white`}>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="text-6xl">{
            course.thumbnail === 'react' ? '⚛️' :
            course.thumbnail === 'python' ? '🐍' :
            course.thumbnail === 'database' ? '🗄️' :
            course.thumbnail === 'cloud' ? '☁️' : '📚'
          }</div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default" className="bg-white/20 text-white border-0">{course.level}</Badge>
              <Badge variant="default" className="bg-white/20 text-white border-0">{course.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-white/80 text-sm mb-4">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1"><Users size={14} /> {course.students} students</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
              {course.rating > 0 && (
                <span className="flex items-center gap-1 text-yellow-300">
                  <Star size={14} fill="currentColor" /> {course.rating}
                </span>
              )}
              <span>By {course.instructor}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            {enrolled ? (
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[140px]">
                <CheckCircle size={24} className="text-green-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Enrolled</p>
                <p className="text-xs text-white/70 mt-1">{progress?.progress || 0}% complete</p>
                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress?.progress || 0}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg"
                loading={enrolling}
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['overview', 'materials', 'assignments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              activeTab === tab ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Progress */}
          {enrolled && progress && (
            <Card>
              <CardHeader title="Your Progress" />
              <div className="space-y-3">
                <ProgressBar value={progress.progress} label="Overall Completion" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-brand-700">{progress.completedLessons}</p>
                    <p className="text-xs text-slate-500">Lessons Done</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-700">{progress.timeSpent}</p>
                    <p className="text-xs text-slate-500">Time Spent</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-700">{progress.grade}</p>
                    <p className="text-xs text-slate-500">Current Grade</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Modules */}
          <Card>
            <CardHeader title="Course Curriculum" subtitle={`${course.modules.length} modules`} />
            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <div key={mod.id} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{mod.title}</p>
                        <p className="text-xs text-slate-500">{mod.lessons} lessons • {mod.duration}</p>
                      </div>
                    </div>
                    {enrolled ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={PlayCircle}
                        onClick={() => handleLessonComplete(i)}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Lock size={16} className="text-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags */}
          {course.tags?.length > 0 && (
            <Card>
              <CardHeader title="Topics Covered" />
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <Card>
          <CardHeader title="Course Materials" subtitle={`${courseMaterials.length} files`} />
          {!enrolled ? (
            <div className="text-center py-10">
              <Lock size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Enroll to access course materials.</p>
              <Button size="sm" className="mt-3" loading={enrolling} onClick={handleEnroll}>
                Enroll Now
              </Button>
            </div>
          ) : courseMaterials.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {courseMaterials.map((mat) => {
                const ft = fileTypeIcons[mat.type] || fileTypeIcons.default;
                const Icon = ft.icon;
                return (
                  <div key={mat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                    <div className={`w-9 h-9 ${ft.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={ft.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{mat.title}</p>
                      <p className="text-xs text-slate-400">{mat.size} • {mat.module}</p>
                    </div>
                    <Badge variant="default">{mat.type.toUpperCase()}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {courseAssignments.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500">No assignments for this course yet.</p>
            </Card>
          ) : (
            courseAssignments.map((assignment) => {
              const submitted = mySubmissions.find((s) => s.assignmentId === assignment.id);
              const daysLeft = Math.ceil(
                (new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return (
                <Card key={assignment.id} padding={false} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{assignment.title}</h3>
                        {submitted ? (
                          <Badge variant="success">Submitted</Badge>
                        ) : (
                          <Badge variant={daysLeft <= 3 ? 'danger' : 'warning'}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{assignment.description}</p>
                      <p className="text-xs text-slate-400">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.maxScore} points
                      </p>
                      {submitted?.score !== null && submitted?.score !== undefined && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Score: {submitted.score}/{assignment.maxScore}
                        </p>
                      )}
                    </div>
                    {!submitted && enrolled && (
                      <Link to={`/student/assignment/${assignment.id}`}>
                        <Button size="sm">Submit</Button>
                      </Link>
                    )}
                    {submitted && (
                      <Badge variant="success">✓ Done</Badge>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
