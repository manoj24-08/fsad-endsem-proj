import { useState } from 'react';
import { Search, Filter, Star, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { courseCategories, courseLevels } from '../../data/mockData';
import clsx from 'clsx';

const thumbnailColors = {
  react: 'from-cyan-400 to-blue-500',
  python: 'from-yellow-400 to-orange-500',
  database: 'from-green-400 to-teal-500',
  cloud: 'from-sky-400 to-indigo-500',
  default: 'from-brand-400 to-brand-700',
};

const thumbnailIcons = {
  react: '⚛️',
  python: '🐍',
  database: '🗄️',
  cloud: '☁️',
  default: '📚',
};

export default function AvailableCoursesPage() {
  const { user } = useAuth();
  const { courses, enrollCourse, isEnrolled, getStudentProgress } = useAppData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

  const published = courses.filter((c) => c.status === 'published');
  const filtered = published.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || c.category === category;
    const matchLevel = !level || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const myProgress = getStudentProgress(user.id);
  const enrolledIds = myProgress.map((p) => p.courseId);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    await new Promise((r) => setTimeout(r, 500));
    enrollCourse(user.id, courseId);
    setEnrollingId(null);
  };

  const levelVariant = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Browse Courses</h1>
        <p className="text-slate-500 text-sm mt-1">
          {published.length} courses available • {enrolledIds.length} enrolled
        </p>
      </div>

      {/* Filters */}
      <Card padding={false} className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input sm:w-44"
          >
            <option value="">All Categories</option>
            {courseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input sm:w-36"
          >
            <option value="">All Levels</option>
            {courseLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 font-medium">No courses found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((course) => {
            const enrolled = enrolledIds.includes(course.id);
            const progress = myProgress.find((p) => p.courseId === course.id);
            const gradientClass = thumbnailColors[course.thumbnail] || thumbnailColors.default;
            const icon = thumbnailIcons[course.thumbnail] || thumbnailIcons.default;

            return (
              <div key={course.id} className="card flex flex-col overflow-hidden">
                {/* Thumbnail */}
                <div className={clsx('h-36 bg-gradient-to-br flex items-center justify-center text-4xl relative', gradientClass)}>
                  {icon}
                  {enrolled && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={11} /> Enrolled
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={levelVariant[course.level] || 'default'}>{course.level}</Badge>
                    <Badge variant="default">{course.category}</Badge>
                  </div>

                  <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{course.description}</p>

                  <p className="text-xs text-slate-500 mb-2">By {course.instructor}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Users size={12} /> {course.students}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" /> {course.rating}
                      </span>
                    )}
                  </div>

                  {/* Progress bar if enrolled */}
                  {enrolled && progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    {enrolled ? (
                      <Link to={`/student/course/${course.id}`} className="flex-1">
                        <Button fullWidth size="sm" variant="secondary">
                          Continue Learning
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to={`/student/course/${course.id}`} className="flex-1">
                          <Button fullWidth size="sm" variant="outline">
                            Preview
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          loading={enrollingId === course.id}
                          onClick={() => handleEnroll(course.id)}
                          className="flex-1"
                        >
                          Enroll
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
