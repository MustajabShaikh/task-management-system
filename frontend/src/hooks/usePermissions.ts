import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface Permissions {
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;
  canViewAllTasks: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isUser: boolean;
}

export const usePermissions = (): Permissions => {
  const { user } = useAuth();

  const role = user?.role;

  return {
    // Admin permissions
    isAdmin: role === UserRole.ADMIN,
    
    // Manager permissions
    isManager: role === UserRole.MANAGER,
    
    // Regular user
    isUser: role === UserRole.USER,
    
    // Task creation (Admin, Manager only)
    canCreateTask: role === UserRole.ADMIN || role === UserRole.MANAGER,
    
    // Task editing (depends on task ownership, but generally Admin/Manager)
    canEditTask: role === UserRole.ADMIN || role === UserRole.MANAGER,
    
    // Task deletion (Admin, Manager only)
    canDeleteTask: role === UserRole.ADMIN || role === UserRole.MANAGER,
    
    // Task assignment (Admin, Manager only)
    canAssignTask: role === UserRole.ADMIN || role === UserRole.MANAGER,
    
    // View all tasks (all users can view, but different scopes)
    canViewAllTasks: true,
  };
};