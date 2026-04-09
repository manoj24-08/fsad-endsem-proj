import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, FileText, Video, File, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Card';

const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  video: { icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
  notebook: { icon: File, color: 'text-orange-500', bg: 'bg-orange-50' },
  default: { icon: File, color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function CourseContentPage() {
  const { courseId } = useParams();
  const { courses, materials, addMaterial, deleteMaterial } = useAppData();
  const fileRef = useRef(null);

  const course = courses.find((c) => c.id === parseInt(courseId));
  const courseMaterials = materials.filter((m) => m.courseId === parseInt(courseId));

  const [form, setForm] = useState({ title: '', type: 'pdf', module: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/admin/manage-courses">
          <Button variant="outline" size="sm" className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Material title is required.';
    if (!selectedFile) e.file = 'Please select a file.';
    return e;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setUploading(true);
    await new Promise((r) => setTimeout(r, 800));
    addMaterial({
      courseId: parseInt(courseId),
      title: form.title,
      type: form.type,
      size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
      module: form.module || course.modules[0]?.title || 'General',
    });
    setForm({ title: '', type: 'pdf', module: '' });
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!form.title) setForm((p) => ({ ...p, title: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/manage-courses">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Course Content</h1>
          <p className="text-slate-500 text-sm mt-0.5">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader title="Upload Material" subtitle="Add files to your course" />
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-brand-400 bg-brand-50'
                  : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                    if (!form.title) setForm((p) => ({ ...p, title: file.name.replace(/\.[^/.]+$/, '') }));
                  }
                }}
              />
              <Upload size={28} className={`mx-auto mb-2 ${selectedFile ? 'text-green-500' : 'text-slate-400'}`} />
              {selectedFile ? (
                <>
                  <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-600">Drop file here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Video, Notebook, or any file</p>
                </>
              )}
            </div>
            {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

            <Input
              label="Material Title"
              placeholder="e.g. React Fundamentals PDF"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              error={errors.title}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="File Type"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="notebook">Notebook</option>
                <option value="slides">Slides</option>
                <option value="other">Other</option>
              </Select>
              <Select
                label="Module"
                value={form.module}
                onChange={(e) => setForm((p) => ({ ...p, module: e.target.value }))}
              >
                <option value="">General</option>
                {course.modules.map((m) => (
                  <option key={m.id} value={m.title}>{m.title}</option>
                ))}
              </Select>
            </div>
            <Button type="submit" fullWidth loading={uploading} icon={Upload}>
              Upload Material
            </Button>
          </form>
        </Card>

        {/* Materials List */}
        <Card>
          <CardHeader
            title="Uploaded Materials"
            subtitle={`${courseMaterials.length} files`}
          />
          {courseMaterials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-slate-500 text-sm">No materials uploaded yet.</p>
              <p className="text-slate-400 text-xs mt-1">Upload your first file to get started.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {courseMaterials.map((mat) => {
                const ft = fileTypeIcons[mat.type] || fileTypeIcons.default;
                const Icon = ft.icon;
                return (
                  <div key={mat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                    <div className={`w-9 h-9 ${ft.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={ft.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{mat.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{mat.size}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{mat.module}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="text-slate-300 hover:text-red-500 transition flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Course Modules */}
      <Card>
        <CardHeader title="Course Modules" subtitle={`${course.modules.length} modules`} />
        {course.modules.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No modules defined.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.modules.map((mod) => (
              <div key={mod.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-medium text-slate-800 text-sm">{mod.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>{mod.lessons} lessons</span>
                  <span>•</span>
                  <span>{mod.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
