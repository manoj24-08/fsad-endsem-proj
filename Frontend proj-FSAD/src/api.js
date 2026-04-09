const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cms_token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
  } catch (err) {
    throw new Error('Unable to connect to server. Is the backend running?');
  }

  // Safely parse JSON — handle empty bodies (Spring Security 401/403)
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (res.status === 401 ? 'Unauthorized. Please log in.' :
       res.status === 403 ? 'Access denied.' :
       `Request failed with status ${res.status}`);
    throw new Error(message);
  }

  return data || { success: true, message: 'OK', data: null };
}

const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Profile
  getProfile: () => request('/users/profile'),

  updateProfile: (data) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Courses
  getCourses: () => request('/courses'),

  getCourse: (id) => request(`/courses/${id}`),

  createCourse: (data) =>
    request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCourse: (id, data) =>
    request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCourse: (id) =>
    request(`/admin/courses/${id}`, { method: 'DELETE' }),

  publishCourse: (id) =>
    request(`/admin/courses/${id}/publish`, { method: 'PUT' }),

  // Enrollments
  enroll: (courseId) =>
    request(`/courses/${courseId}/enroll`, { method: 'POST' }),

  getEnrollments: () => request('/student/enrollments'),

  // Materials
  getMaterials: (courseId) => request(`/courses/${courseId}/materials`),

  uploadMaterial: (formData) =>
    request('/admin/materials/upload', {
      method: 'POST',
      body: formData,
    }),

  // Assignments
  getAssignments: (courseId) => request(`/courses/${courseId}/assignments`),

  createAssignment: (data) =>
    request('/admin/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Submissions
  submitAssignment: (formData) =>
    request('/student/submissions', {
      method: 'POST',
      body: formData,
    }),

  getSubmissions: () => request('/admin/submissions'),

  gradeSubmission: (id, data) =>
    request(`/admin/submissions/${id}/grade`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default api;
