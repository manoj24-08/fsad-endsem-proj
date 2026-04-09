import { useState } from 'react';
import { User, Mail, Calendar, BookOpen, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { courses, getStudentProgress } = useAppData();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '' });
  const [errors, setErrors] = useState({});

  const progress = user.role === 'student' ? getStudentProgress(user.id) : [];
  const enrolledCourses = courses.filter((c) =>
    progress.some((p) => p.courseId === c.id)
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateProfile({ name: form.name, bio: form.bio });
    setEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setForm({ name: user.name, bio: user.bio || '' });
    setEditing(false);
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-brand-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  error={errors.name}
                  required
                />
                <Textarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" icon={Save} onClick={handleSave}>Save Changes</Button>
                  <Button size="sm" variant="ghost" icon={X} onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 mt-1 capitalize">
                      {user.role === 'admin' ? 'Educator' : 'Student'}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" icon={Edit3} onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                </div>
                {user.bio && <p className="text-sm text-slate-600 mt-3">{user.bio}</p>}
              </>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Mail size={15} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="font-medium text-slate-700">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Calendar size={15} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Member Since</p>
              <p className="font-medium text-slate-700">
                {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          {user.department && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <BookOpen size={15} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Department</p>
                <p className="font-medium text-slate-700">{user.department}</p>
              </div>
            </div>
          )}
          {user.major && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <BookOpen size={15} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Major</p>
                <p className="font-medium text-slate-700">{user.major}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Enrolled Courses (student only) */}
      {user.role === 'student' && (
        <Card>
          <CardHeader title="Enrolled Courses" subtitle={`${enrolledCourses.length} courses`} />
          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No courses enrolled yet.</p>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((course) => {
                const p = progress.find((pr) => pr.courseId === course.id);
                return (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full"
                            style={{ width: `${p?.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">{p?.progress || 0}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-1 rounded-lg">
                      {p?.grade || '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Admin stats */}
      {user.role === 'admin' && (
        <Card>
          <CardHeader title="Teaching Summary" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">4</p>
              <p className="text-xs text-slate-500 mt-1">Courses Created</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700">164</p>
              <p className="text-xs text-slate-500 mt-1">Total Students</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
