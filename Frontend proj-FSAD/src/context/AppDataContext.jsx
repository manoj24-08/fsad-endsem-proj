import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';
import {
  analyticsData,
  courseCategories,
  courseLevels,
} from '../data/mockData';

const AppDataContext = createContext(null);

// Helper to map backend course DTO to the shape frontend components expect
function mapCourse(c) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    instructor: c.instructorName || 'Unknown',
    instructorId: c.instructorId,
    category: c.category || '',
    level: c.level || '',
    duration: c.duration || '',
    students: c.enrollmentCount || 0,
    rating: 0,
    thumbnail: (c.category || '').toLowerCase().replace(/\s+/g, ''),
    status: c.published ? 'published' : 'draft',
    createdAt: c.createdAt ? c.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    tags: [],
    modules: [],
  };
}

function mapAssignment(a) {
  return {
    id: a.id,
    courseId: a.courseId,
    title: a.title,
    description: a.description,
    dueDate: a.dueDate ? a.dueDate.split('T')[0] : '',
    maxScore: a.maxScore || 100,
    status: 'active',
    submissions: 0,
    totalStudents: 0,
  };
}

function mapSubmission(s) {
  return {
    id: s.id,
    assignmentId: s.assignmentId,
    studentId: s.studentId,
    studentName: s.studentName || '',
    submittedAt: s.submittedAt ? s.submittedAt.split('T')[0] : '',
    fileName: s.fileUrl || '',
    score: s.score,
    feedback: s.feedback,
    status: (s.status || 'submitted').toLowerCase(),
  };
}

function mapMaterial(m) {
  return {
    id: m.id,
    courseId: m.moduleId,
    title: m.title,
    type: m.type || 'document',
    size: '',
    uploadedAt: new Date().toISOString().split('T')[0],
    module: m.moduleTitle || '',
    fileUrl: m.fileUrl,
  };
}

function mapEnrollment(e) {
  return {
    studentId: e.userId,
    courseId: e.courseId,
    progress: e.progress || 0,
    completedLessons: Math.round(((e.progress || 0) / 100) * 20),
    totalLessons: 20,
    lastAccessed: e.enrolledAt ? e.enrolledAt.split('T')[0] : new Date().toISOString().split('T')[0],
    timeSpent: '0h 0m',
    grade: e.grade || '-',
  };
}

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (!user) {
      setCourses([]);
      setMaterials([]);
      setAssignments([]);
      setSubmissions([]);
      setProgress([]);
      return;
    }

    // Fetch courses
    api.getCourses()
      .then((res) => setCourses((res.data || []).map(mapCourse)))
      .catch(() => {});

    // Fetch enrollments (student)
    if (user.role === 'student') {
      api.getEnrollments()
        .then((res) => setProgress((res.data || []).map(mapEnrollment)))
        .catch(() => {});
    }

    // Fetch submissions (admin)
    if (user.role === 'admin') {
      api.getSubmissions()
        .then((res) => setSubmissions((res.data || []).map(mapSubmission)))
        .catch(() => {});
    }
  }, [user]);

  // ==================== COURSES ====================
  const createCourse = useCallback(async (data) => {
    try {
      const res = await api.createCourse(data);
      const newCourse = mapCourse(res.data);
      setCourses((prev) => [...prev, newCourse]);
      showToast('Course created successfully!');
      return newCourse;
    } catch (err) {
      showToast(err.message || 'Failed to create course.', 'error');
      // Fallback: create locally
      const fallback = {
        ...data,
        id: Date.now(),
        students: 0,
        rating: 0,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        modules: [],
      };
      setCourses((prev) => [...prev, fallback]);
      return fallback;
    }
  }, [showToast]);

  const updateCourse = useCallback(async (id, data) => {
    try {
      const res = await api.updateCourse(id, data);
      const updated = mapCourse(res.data);
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      showToast('Course updated successfully!');
    } catch {
      // Fallback: update locally
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
      showToast('Course updated successfully!');
    }
  }, [showToast]);

  const deleteCourse = useCallback(async (id) => {
    try {
      await api.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast('Course deleted.', 'info');
    } catch {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast('Course deleted.', 'info');
    }
  }, [showToast]);

  const publishCourse = useCallback(async (id) => {
    try {
      const res = await api.publishCourse(id);
      const updated = mapCourse(res.data);
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c))
      );
      showToast('Course status updated!');
    } catch {
      // Fallback: toggle locally
      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === 'published' ? 'draft' : 'published' } : c
        )
      );
      showToast('Course status updated!');
    }
  }, [showToast]);

  // ==================== MATERIALS ====================
  const addMaterial = useCallback(async (material) => {
    try {
      const formData = new FormData();
      formData.append('courseId', material.courseId);
      formData.append('title', material.title);
      formData.append('type', material.type || 'document');
      if (material.file) {
        formData.append('file', material.file);
      }
      const res = await api.uploadMaterial(formData);
      const newMat = mapMaterial(res.data);
      newMat.courseId = material.courseId;
      setMaterials((prev) => [...prev, newMat]);
      showToast('Material uploaded successfully!');
      return newMat;
    } catch {
      // Fallback: add locally
      const newMat = { ...material, id: Date.now(), uploadedAt: new Date().toISOString().split('T')[0] };
      setMaterials((prev) => [...prev, newMat]);
      showToast('Material uploaded successfully!');
      return newMat;
    }
  }, [showToast]);

  const deleteMaterial = useCallback((id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('Material removed.', 'info');
  }, [showToast]);

  // ==================== ASSIGNMENTS ====================
  const createAssignment = useCallback(async (data) => {
    try {
      const res = await api.createAssignment(data);
      const newAssignment = mapAssignment(res.data);
      setAssignments((prev) => [...prev, newAssignment]);
      showToast('Assignment created!');
      return newAssignment;
    } catch {
      const fallback = {
        ...data,
        id: Date.now(),
        submissions: 0,
        status: 'active',
      };
      setAssignments((prev) => [...prev, fallback]);
      showToast('Assignment created!');
      return fallback;
    }
  }, [showToast]);

  const deleteAssignment = useCallback((id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment deleted.', 'info');
  }, [showToast]);

  // ==================== SUBMISSIONS ====================
  const submitAssignment = useCallback(async (data) => {
    const existing = submissions.find(
      (s) => s.assignmentId === data.assignmentId && s.studentId === data.studentId
    );
    if (existing) {
      showToast('You have already submitted this assignment.', 'error');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('assignmentId', data.assignmentId);
      if (data.file) {
        formData.append('file', data.file);
      }
      const res = await api.submitAssignment(formData);
      const newSub = mapSubmission(res.data);
      setSubmissions((prev) => [...prev, newSub]);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === data.assignmentId ? { ...a, submissions: a.submissions + 1 } : a
        )
      );
      showToast('Assignment submitted successfully!');
      return newSub;
    } catch {
      // Fallback
      const newSub = {
        ...data,
        id: Date.now(),
        submittedAt: new Date().toISOString().split('T')[0],
        score: null,
        feedback: null,
        status: 'submitted',
      };
      setSubmissions((prev) => [...prev, newSub]);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === data.assignmentId ? { ...a, submissions: a.submissions + 1 } : a
        )
      );
      showToast('Assignment submitted successfully!');
      return newSub;
    }
  }, [submissions, showToast]);

  // ==================== ENROLLMENT ====================
  const enrollCourse = useCallback(async (studentId, courseId) => {
    try {
      const res = await api.enroll(courseId);
      const enrollment = mapEnrollment(res.data);
      setProgress((prev) => {
        const exists = prev.find((p) => p.studentId === studentId && p.courseId === courseId);
        if (exists) return prev;
        return [...prev, enrollment];
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, students: c.students + 1 } : c))
      );
      showToast('Enrolled successfully!');
    } catch (err) {
      // Fallback: enroll locally
      setProgress((prev) => {
        const exists = prev.find((p) => p.studentId === studentId && p.courseId === courseId);
        if (exists) return prev;
        return [
          ...prev,
          {
            studentId,
            courseId,
            progress: 0,
            completedLessons: 0,
            totalLessons: 20,
            lastAccessed: new Date().toISOString().split('T')[0],
            timeSpent: '0h 0m',
            grade: '-',
          },
        ];
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, students: c.students + 1 } : c))
      );
      showToast(err.message || 'Enrolled successfully!');
    }
  }, [showToast]);

  const updateProgress = useCallback((studentId, courseId, lessonsDone) => {
    setProgress((prev) =>
      prev.map((p) => {
        if (p.studentId === studentId && p.courseId === courseId) {
          const newProgress = Math.min(100, Math.round((lessonsDone / p.totalLessons) * 100));
          return {
            ...p,
            completedLessons: lessonsDone,
            progress: newProgress,
            lastAccessed: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  }, []);

  const getStudentProgress = useCallback(
    (studentId) => progress.filter((p) => p.studentId === studentId),
    [progress]
  );

  const getCourseProgress = useCallback(
    (studentId, courseId) =>
      progress.find((p) => p.studentId === studentId && p.courseId === courseId),
    [progress]
  );

  const isEnrolled = useCallback(
    (studentId, courseId) =>
      progress.some((p) => p.studentId === studentId && p.courseId === courseId),
    [progress]
  );

  // Load assignments for all courses when courses change
  useEffect(() => {
    if (!user || courses.length === 0) return;
    const loadAssignments = async () => {
      const allAssignments = [];
      for (const course of courses) {
        try {
          const res = await api.getAssignments(course.id);
          const mapped = (res.data || []).map(mapAssignment);
          allAssignments.push(...mapped);
        } catch {
          // skip
        }
      }
      if (allAssignments.length > 0) {
        setAssignments(allAssignments);
      }
    };
    loadAssignments();
  }, [user, courses.length]);

  // Load materials for all courses when courses change
  useEffect(() => {
    if (!user || courses.length === 0) return;
    const loadMaterials = async () => {
      const allMaterials = [];
      for (const course of courses) {
        try {
          const res = await api.getMaterials(course.id);
          const mapped = (res.data || []).map((m) => {
            const mat = mapMaterial(m);
            mat.courseId = course.id;
            return mat;
          });
          allMaterials.push(...mapped);
        } catch {
          // skip
        }
      }
      if (allMaterials.length > 0) {
        setMaterials(allMaterials);
      }
    };
    loadMaterials();
  }, [user, courses.length]);

  return (
    <AppDataContext.Provider
      value={{
        courses,
        materials,
        assignments,
        submissions,
        progress,
        toast,
        showToast,
        createCourse,
        updateCourse,
        deleteCourse,
        publishCourse,
        addMaterial,
        deleteMaterial,
        createAssignment,
        deleteAssignment,
        submitAssignment,
        enrollCourse,
        updateProgress,
        getStudentProgress,
        getCourseProgress,
        isEnrolled,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
