import { useState } from 'react';
import { PlusCircle, Trash2, ClipboardList, Users, Calendar, CheckCircle } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import Card, { CardHeader, Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';

export default function AssignmentManagementPage() {
  const { courses, assignments, submissions, createAssignment, deleteAssignment } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    maxScore: '100',
    totalStudents: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments');

  const validate = () => {
    const e = {};
    if (!form.courseId) e.courseId = 'Please select a course.';
    if (!form.title.trim()) e.title = 'Assignment title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.dueDate) e.dueDate = 'Due date is required.';
    return e;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const course = courses.find((c) => c.id === parseInt(form.courseId));
    createAssignment({
      courseId: parseInt(form.courseId),
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      maxScore: parseInt(form.maxScore) || 100,
      totalStudents: course?.students || 0,
    });
    setForm({ courseId: '', title: '', description: '', dueDate: '', maxScore: '100', totalStudents: '' });
    setShowForm(false);
    setLoading(false);
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const getCourseName = (id) => courses.find((c) => c.id === id)?.title || 'Unknown';

  const statusVariant = {
    active: 'success',
    upcoming: 'info',
    closed: 'default',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assignment Management</h1>
          <p className="text-slate-500 text-sm mt-1">{assignments.length} assignments across all courses</p>
        </div>
        <Button icon={PlusCircle} onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'New Assignment'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader title="Create Assignment" subtitle="Add a new assignment to a course" />
          <form onSubmit={handleCreate} className="space-y-4">
            <Select
              label="Course"
              value={form.courseId}
              onChange={set('courseId')}
              error={errors.courseId}
              required
            >
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
            <Input
              label="Assignment Title"
              placeholder="e.g. Build a Todo App with React Hooks"
              value={form.title}
              onChange={set('title')}
              error={errors.title}
              required
            />
            <Textarea
              label="Description"
              placeholder="Describe the assignment requirements..."
              value={form.description}
              onChange={set('description')}
              error={errors.description}
              rows={3}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={set('dueDate')}
                error={errors.dueDate}
                required
              />
              <Input
                label="Max Score"
                type="number"
                min="1"
                max="1000"
                value={form.maxScore}
                onChange={set('maxScore')}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" loading={loading}>Create Assignment</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['assignments', 'submissions'].map((tab) => (
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

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500">No assignments yet.</p>
            </Card>
          ) : (
            assignments.map((assignment) => {
              const submissionCount = submissions.filter((s) => s.assignmentId === assignment.id).length;
              const submissionRate = assignment.totalStudents
                ? Math.round((submissionCount / assignment.totalStudents) * 100)
                : 0;
              return (
                <Card key={assignment.id} padding={false} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{assignment.title}</h3>
                        <Badge variant={statusVariant[assignment.status] || 'default'}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{assignment.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {submissionCount}/{assignment.totalStudents} submitted
                        </span>
                        <span className="text-brand-600 font-medium">{getCourseName(assignment.courseId)}</span>
                      </div>
                      {/* Submission progress */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all"
                            style={{ width: `${submissionRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{submissionRate}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="danger-ghost"
                      icon={Trash2}
                      onClick={() => deleteAssignment(assignment.id)}
                    />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-4xl mb-3">📬</div>
              <p className="text-slate-500">No submissions yet.</p>
            </Card>
          ) : (
            submissions.map((sub) => {
              const assignment = assignments.find((a) => a.id === sub.assignmentId);
              return (
                <Card key={sub.id} padding={false} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-700 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {sub.studentName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{sub.studentName}</p>
                      <p className="text-xs text-slate-500 truncate">{assignment?.title || 'Unknown Assignment'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString()} • {sub.fileName}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {sub.score !== null ? (
                        <div>
                          <p className="text-lg font-bold text-brand-700">{sub.score}</p>
                          <p className="text-xs text-slate-400">/ {assignment?.maxScore || 100}</p>
                        </div>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </div>
                  </div>
                  {sub.feedback && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700">
                        <span className="font-medium">Feedback:</span> {sub.feedback}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
