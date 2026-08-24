import axios from 'axios';

export const TOKEN_KEY = 'pm_token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export type AuthUser = { id: string; name: string; email: string; role: 'admin' | 'member' };

export type Project = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export type BoardColumn = { id: string; name: string; order: number; projectId: string };

export type User = { id: string; name: string; email: string };

export type Member = { id: string; name: string; email: string; role: 'admin' | 'member'; hourlyRate: number | null };

export type Task = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  progress: number;
  projectId: string;
  parentTaskId?: string;
  columnId?: string;
  assigneeId?: string;
  subtasks?: Task[];
  project?: Project;
  column?: BoardColumn;
  assignee?: User;
  inProgressSince?: string | null;
};

export type Comment = {
  id: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  taskId: string;
  authorId?: string;
  author?: User;
  createdAt: string;
};

export const register = (data: { name: string; email: string; password: string }) =>
  api.post<{ token: string; user: AuthUser }>('/auth/register', data).then((r) => r.data);
export const login = (data: { email: string; password: string }) =>
  api.post<{ token: string; user: AuthUser }>('/auth/login', data).then((r) => r.data);
export const getMe = () => api.get<AuthUser>('/auth/me').then((r) => r.data);

export const getProjects = () => api.get<Project[]>('/projects').then((r) => r.data);
export const getProject = (id: string) => api.get<Project>(`/projects/${id}`).then((r) => r.data);
export const createProject = (data: Partial<Project>) =>
  api.post<Project>('/projects', data).then((r) => r.data);
export const getUsers = () => api.get<User[]>('/users').then((r) => r.data);
export const getColumns = (projectId: string) =>
  api.get<BoardColumn[]>('/board-columns', { params: { projectId } }).then((r) => r.data);
export const getTasks = (projectId: string) =>
  api.get<Task[]>('/tasks', { params: { projectId } }).then((r) => r.data);
export const getAgenda = (from: string, to: string) =>
  api.get<Task[]>('/tasks/agenda', { params: { from, to } }).then((r) => r.data);
export const updateTask = (id: string, data: Partial<Task>) =>
  api.patch<Task>(`/tasks/${id}`, data).then((r) => r.data);
export const createTask = (data: Partial<Task>) =>
  api.post<Task>('/tasks', data).then((r) => r.data);
export const logTime = (data: { taskId: string; userId: string; hours: number; loggedAt: string; note?: string }) =>
  api.post('/time-entries', data).then((r) => r.data);

export const getComments = (taskId: string) => api.get<Comment[]>(`/tasks/${taskId}/comments`).then((r) => r.data);
export const addComment = (taskId: string, data: { text: string; file?: File | null }) => {
  const form = new FormData();
  form.append('text', data.text);
  if (data.file) form.append('file', data.file);
  return api
    .post<Comment>(`/tasks/${taskId}/comments`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
export const attachmentUrl = (path: string) => `${api.defaults.baseURL}${path}`;

export const getMembers = () => api.get<Member[]>('/admin/members').then((r) => r.data);
export const inviteMember = (data: { name: string; email: string; hourlyRate?: number }) =>
  api.post<{ user: Member; temporaryPassword: string }>('/admin/members', data).then((r) => r.data);
export const updateMemberRate = (id: string, hourlyRate: number) =>
  api.patch<Member>(`/admin/members/${id}/rate`, { hourlyRate }).then((r) => r.data);
