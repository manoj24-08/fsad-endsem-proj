import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Users,
  Star,
  Filter,
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Card';

export default function ManageCoursesPage() {
  const { courses, deleteCourse, publishCourse } = useAppData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && c.status === 'published') ||
      (filter === 'draft' && c.status === 'draft');
    return matchSearch && matchFilter;
  });

  const handleDelete = (id) => {
    deleteCourse(id);
    setConfirmDelete(null);
  };

  const levelVariant = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'danger',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} courses total</p>
        </div>
        <Link to="/admin/create-course">
          <Button icon={PlusCircle}>New Course</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding={false} className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published', 'draft'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  filter === f
                    ? 'bg-brand-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Course List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-500 font-medium">No courses found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          <Link to="/admin/create-course" className="mt-4 inline-block">
            <Button icon={PlusCircle} size="sm">Create Course</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <Card key={course.id} padding={false} className="p-4 hover:shadow-soft transition">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {course.thumbnail === 'react' ? '⚛️' :
                   course.thumbnail === 'python' ? '🐍' :
                   course.thumbnail === 'database' ? '🗄️' :
                   course.thumbnail === 'cloud' ? '☁️' : '📚'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{course.title}</h3>
                    <Badge variant={course.status === 'published' ? 'success' : 'default'}>
                      {course.status}
                    </Badge>
                    <Badge variant={levelVariant[course.level] || 'default'}>{course.level}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Users size={11} /> {course.students} students</span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star size={11} fill="currentColor" /> {course.rating}
                      </span>
                    )}
                    <span>{course.category}</span>
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant={course.status === 'published' ? 'outline' : 'secondary'}
                    icon={course.status === 'published' ? EyeOff : Eye}
                    onClick={() => publishCourse(course.id)}
                  >
                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Link to={`/admin/course-content/${course.id}`}>
                    <Button size="sm" variant="outline" icon={Upload}>
                      Content
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger-ghost"
                    icon={Trash2}
                    onClick={() => setConfirmDelete(course.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-soft p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Delete Course?</h3>
            <p className="text-slate-500 text-sm mb-6">
              This action cannot be undone. All course content and student data will be removed.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
