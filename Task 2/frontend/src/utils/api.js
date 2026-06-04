import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Attach JWT token to every request ────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 globally (token expired/invalid) ───────────────────────────────
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ── User endpoints ────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getAllUsers: (params) => API.get('/users', { params }),
};

// ── Course endpoints ──────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: (params) => API.get('/courses', { params }),
  getById: (id) => API.get(`/courses/${id}`),
  create: (data) => API.post('/courses', data),
  update: (id, data) => API.put(`/courses/${id}`, data),
  enroll: (id) => API.post(`/courses/${id}/enroll`),
  delete: (id) => API.delete(`/courses/${id}`),
};

// ── Dashboard endpoints ───────────────────────────────────────────────────────
export const dashboardAPI = {
  student: () => API.get('/dashboard/student'),
  instructor: () => API.get('/dashboard/instructor'),
  admin: () => API.get('/dashboard/admin'),
};

export default API;
