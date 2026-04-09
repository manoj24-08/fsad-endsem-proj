import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import Card, { CardHeader, Badge } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';

export default function AssignmentSubmissionPage() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const { assignments, courses, submissions, submitAssignment } = useAppData();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const assignment = assignments.find((a) => a.id === parseInt(assignmentId));
  const course = assignment ? courses.find((c) => c.id === assignment.courseId) : null;
  const existingSubmission = submissions.find(
    (s) => s.assignmentId === parseInt(assignmentId) && s.studentId === user.id
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!assignment) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Assignment not found.</p>
        <Link to="/student">
          <Button variant="outline" size="sm" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const validate = () => {
    const e = {};
    if (!selectedFile) e.file = 'Please select a file to submit.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingSubmission) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    submitAssignment({
      assignmentId: assignment.id,
      studentId: user.id,
      studentName: user.name,
      fileName: selectedFile.name,
      notes,
    });
    setSubmitting(false);
    navigate(`/student/course/${assignment.courseId}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link to={`/student/course/${assignment.courseId}`}>
        <Button variant="ghost" size="sm" icon={ArrowLeft}>Back to Course</Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Submit Assignment</h1>
        <p className="text-slate-500 text-sm mt-1">{course?.title}</p>
      </div>

      {/* Assignment Info */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={22} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-slate-800 text-lg">{assignment.title}</h2>
            <p className="text-slate-600 text-sm mt-2">{assignment.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock size={14} />
                Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
              <Badge variant={daysLeft <= 0 ? 'danger' : daysLeft <= 3 ? 'warning' : 'success'}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
              </Badge>
              <span className="text-brand-700 font-medium">{assignment.maxScore} points</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Already Submitted */}
      {existingSubmission ? (
        <Card>
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Assignment Submitted!</h3>
            <p className="text-slate-500 text-sm mb-4">
              You submitted this assignment on{' '}
              {new Date(existingSubmission.submittedAt).toLocaleDateString()}.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 text-left max-w-sm mx-auto">
              <p className="text-sm text-slate-600">
                <span className="font-medium">File:</span> {existingSubmission.fileName}
              </p>
              {existingSubmission.score !== null && (
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Score:</span>{' '}
                  <span className="text-brand-700 font-bold">{existingSubmission.score}/{assignment.maxScore}</span>
                </p>
              )}
              {existingSubmission.feedback && (
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Feedback:</span> {existingSubmission.feedback}
                </p>
              )}
              {existingSubmission.score === null && (
                <p className="text-sm text-orange-500 mt-2 flex items-center gap-1">
                  <Clock size={13} /> Awaiting grading...
                </p>
              )}
            </div>
            <Link to={`/student/course/${assignment.courseId}`} className="mt-6 inline-block">
              <Button variant="outline">Back to Course</Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader title="Upload Your Work" subtitle="Accepted: any file format" />

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
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
                  if (file) setSelectedFile(file);
                }}
              />
              {selectedFile ? (
                <>
                  <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-green-700">{selectedFile.name}</p>
                  <p className="text-sm text-green-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-slate-400 mt-2">Click to change file</p>
                </>
              ) : (
                <>
                  <Upload size={36} className="text-slate-300 mx-auto mb-3" />
                  <p className="font-medium text-slate-600">Drop your file here</p>
                  <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                  <p className="text-xs text-slate-300 mt-2">ZIP, PDF, IPYNB, or any format</p>
                </>
              )}
            </div>
            {errors.file && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.file}
              </p>
            )}
          </Card>

          <Card>
            <CardHeader title="Additional Notes" subtitle="Optional comments for your instructor" />
            <Textarea
              placeholder="Add any notes, questions, or comments about your submission..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </Card>

          {/* Submission checklist */}
          <Card>
            <CardHeader title="Before You Submit" />
            <ul className="space-y-2">
              {[
                'I have reviewed the assignment requirements',
                'My work is original and properly cited',
                'The file is complete and not corrupted',
                'I understand late submissions may be penalized',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex gap-3">
            <Link to={`/student/course/${assignment.courseId}`} className="flex-1">
              <Button variant="outline" fullWidth>Cancel</Button>
            </Link>
            <Button
              type="submit"
              fullWidth
              loading={submitting}
              icon={Upload}
              className="flex-1"
            >
              Submit Assignment
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
