export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    STATS: '/tasks/stats',
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'task_management_token',
  USER: 'task_management_user',
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const STATUS_COLORS = {
  0: '#9e9e9e', // TODO - Grey
  1: '#2196f3', // IN_PROGRESS - Blue
  2: '#ff9800', // ON_HOLD - Orange
  3: '#4caf50', // COMPLETED - Green
} as const;

export const PRIORITY_COLORS = {
  0: '#4caf50', // LOW - Green
  1: '#ff9800', // MEDIUM - Orange
  2: '#f44336', // HIGH - Red
} as const;

export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  PROFILE: '/profile',
} as const;