export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export enum TaskStatus {
  TODO = 0,
  IN_PROGRESS = 1,
  ON_HOLD = 2,
  COMPLETED = 3
}

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2
}

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.ON_HOLD:
      return 'On Hold';
    case TaskStatus.COMPLETED:
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'Low';
    case TaskPriority.MEDIUM:
      return 'Medium';
    case TaskPriority.HIGH:
      return 'High';
    default:
      return 'Unknown';
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.MANAGER:
      return 'Manager';
    case UserRole.USER:
      return 'User';
    default:
      return 'Unknown';
  }
};