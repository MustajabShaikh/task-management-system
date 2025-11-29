export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_RETRIEVED: 'User profile retrieved successfully',
  USER_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NOT_AUTHENTICATED: 'User not authenticated',
  NOT_AUTHORIZED: 'Not authorized to access this route',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  USER_NOT_FOUND: 'User not found'
} as const;

export const TASK_MESSAGES = {
  CREATED: 'Task created successfully',
  UPDATED: 'Task updated successfully',
  DELETED: 'Task deleted successfully',
  RETRIEVED: 'Task retrieved successfully',
  LIST_RETRIEVED: 'Tasks retrieved successfully',
  STATS_RETRIEVED: 'Task statistics retrieved successfully',
  NOT_FOUND: 'Task not found',
  CANNOT_DELETE: 'You do not have permission to delete this task',
  CANNOT_UPDATE: 'You do not have permission to update this task',
  CANNOT_CREATE: 'You do not have permission to create tasks',
  ASSIGNED_SUCCESS: 'Task assigned successfully',
  STATUS_UPDATED: 'Task status updated successfully'
} as const;

export const GENERAL_MESSAGES = {
  SERVER_RUNNING: 'Server is running',
  ROUTE_NOT_FOUND: 'Route not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_ID: 'Invalid ID format',
  ACCESS_DENIED: 'Access denied'
} as const;

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  NAME_LENGTH: 'Name must be between 5 and 30 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_LENGTH: 'Password must be at least 6 characters long',
  PASSWORD_STRENGTH: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  ROLE_INVALID: 'Invalid role',
  TITLE_REQUIRED: 'Title is required',
  TITLE_LENGTH: 'Title must be between 3 and 50 characters',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_LENGTH: 'Description must be between 10 and 1000 characters',
  PRIORITY_REQUIRED: 'Priority is required',
  PRIORITY_INVALID: 'Priority must be 0 (Low), 1 (Medium), or 2 (High)',
  STATUS_INVALID: 'Status must be 0 (TODO), 1 (IN_PROGRESS), 2 (ON_HOLD), or 3 (COMPLETED)',
  DUE_DATE_REQUIRED: 'Due date is required',
  DUE_DATE_INVALID: 'Due date must be a valid date',
  DUE_DATE_FUTURE: 'Due date must be in the future',
  TAGS_ARRAY: 'Tags must be an array',
  TAGS_MAX: 'Cannot have more than 10 tags',
  TAG_STRING: 'Each tag must be a string',
  TAG_LENGTH: 'Each tag must be between 1 and 20 characters',
  USER_ID_INVALID: 'Invalid user ID',
  TASK_ID_INVALID: 'Invalid task ID',
  PAGE_INVALID: 'Page must be a positive integer',
  LIMIT_INVALID: 'Limit must be between 1 and 100',
  SORT_BY_INVALID: 'Invalid sortBy field',
  SORT_ORDER_INVALID: 'Sort order must be asc or desc',
  SEARCH_STRING: 'Search must be a string'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;