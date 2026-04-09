import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { courseCategories, courseLevels } from '../../data/mockData';

export default function CreateCoursePage() {
  const { createCourse } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    thumbnail: 'default',
    tags: '',
  });
  const [modules, setModules] = useState([{ title: '', lessons: '', duration: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Course title is required.';
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.';
    if (!form.description.trim()) e.description = 'Description is required.';
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters.';
    if (!form.category) e.category = 'Please select a category.';
    if (!form.level) e.level = 'Please select a level.';
    if (!form.duration.trim()) e.duration = 'Duration is required.';
    modules.forEach((m, i) => {
      if (!m.title.trim()) e[`module_${i}`] = 'Module title is required.';
    });
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const course = createCourse({
      ...form,
      instructor: user.name,
      instructorId: user.id,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      modules: modules.map((m, i) => ({
        id: i + 1,
        title: m.title,
        lessons: parseInt(m.lessons) || 0,
        duration: m.duration || '0h',
      })),
    });
    setLoading(false);
    navigate('/admin/manage-courses');
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const addModule = () => setModules((p) => [...p, { title: '', lessons: '', duration: '' }]);
  const removeModule = (i) => setModules((p) => p.filter((_, idx) => idx !== i));
  const setModule = (i, field, val) =>
    setModules((p) => p.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));

  const thumbnailOptions = [
    { value: 'react', label: '⚛️ React / Frontend' },
    { value: 'python', label: '🐍 Python / Data Science' },
    { value: 'database', label: '🗄️ Database' },
    { value: 'cloud', label: '☁️ Cloud / DevOps' },
    { value: 'default', label: '📚 General' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create New Course</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to create a new course.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader title="Course Information" subtitle="Basic details about your course" />
          <div className="space-y-4">
            <Input
              label="Course Title"
              placeholder="e.g. Introduction to React Development"
              value={form.title}
              onChange={set('title')}
              error={errors.title}
              required
            />
            <Textarea
              label="Course Description"
              placeholder="Describe what students will learn in this course..."
              value={form.description}
              onChange={set('description')}
              error={errors.description}
              rows={4}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={form.category}
                onChange={set('category')}
                error={errors.category}
                required
              >
                <option value="">Select category...</option>
                {courseCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <Select
                label="Level"
                value={form.level}
                onChange={set('level')}
                error={errors.level}
                required
              >
                <option value="">Select level...</option>
                {courseLevels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Duration"
                placeholder="e.g. 8 weeks"
                value={form.duration}
                onChange={set('duration')}
                error={errors.duration}
                required
              />
              <Select
                label="Thumbnail Style"
                value={form.thumbnail}
                onChange={set('thumbnail')}
              >
                {thumbnailOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <Input
              label="Tags"
              placeholder="React, JavaScript, Frontend (comma-separated)"
              value={form.tags}
              onChange={set('tags')}
              hint="Separate tags with commas"
            />
          </div>
        </Card>

        {/* Modules */}
        <Card>
          <CardHeader
            title="Course Modules"
            subtitle="Organize your course into modules"
            action={
              <Button type="button" size="sm" variant="outline" icon={PlusCircle} onClick={addModule}>
                Add Module
              </Button>
            }
          />
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Module {i + 1}</span>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(i)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <Input
                      label="Module Title"
                      placeholder="e.g. Getting Started"
                      value={mod.title}
                      onChange={(e) => setModule(i, 'title', e.target.value)}
                      error={errors[`module_${i}`]}
                      required
                    />
                  </div>
                  <Input
                    label="Lessons"
                    type="number"
                    placeholder="5"
                    min="1"
                    value={mod.lessons}
                    onChange={(e) => setModule(i, 'lessons', e.target.value)}
                  />
                  <Input
                    label="Duration"
                    placeholder="2h 30m"
                    value={mod.duration}
                    onChange={(e) => setModule(i, 'duration', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/manage-courses')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} icon={BookOpen}>
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
