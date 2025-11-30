import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, Person, CalendarToday } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ITask, getStatusLabel, getPriorityLabel, TaskStatus } from '@/types';
import { STATUS_COLORS, PRIORITY_COLORS } from '@/constants/constants';
import { formatDate, isOverdue, handleApiError } from '@/utils';
import { useAuth } from '@/contexts';
import { usePermissions } from '@/hooks';
import { taskApi } from '@/api';

interface TaskCardProps {
  task: ITask;
  onEdit?: (task: ITask) => void;
  onDelete?: (taskId: string) => void;
  onStatusUpdate?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusUpdate }) => {
  const { user } = useAuth();
  const { canEditTask, canDeleteTask, isAdmin } = usePermissions();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isOwner = typeof task.createdBy === 'object' 
    ? task.createdBy._id === user?._id 
    : task.createdBy === user?._id;
  
  const isAssigned = typeof task.assignedTo === 'object'
    ? task.assignedTo?._id === user?._id
    : task.assignedTo === user?._id;

  const canEdit = isAdmin || (canEditTask && (isOwner || isAssigned));
  const canDelete = isAdmin || (canDeleteTask && isOwner);
  const canUpdateStatus = isAssigned; // Assigned users can update status

  const assignedUser = typeof task.assignedTo === 'object' ? task.assignedTo : null;
  const createdUser = typeof task.createdBy === 'object' ? task.createdBy : null;

  const isDue = isOverdue(task.dueDate);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setUpdatingStatus(true);
      await taskApi.updateTask(task._id, { status: newStatus });
      toast.success('Status updated successfully!');
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description}
            </Typography>
          </Box>
          {(canEdit || canDelete) && (
            <Box>
              {canEdit && onEdit && (
                <Tooltip title="Edit Task">
                  <IconButton size="small" onClick={() => onEdit(task)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {canDelete && onDelete && (
                <Tooltip title="Delete Task">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDelete(task._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Status - Editable for assigned users */}
        {canUpdateStatus ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Status
            </Typography>
            <Select
              value={task.status}
              onChange={(e) => handleStatusChange(Number(e.target.value) as TaskStatus)}
              disabled={updatingStatus}
              size="small"
              fullWidth
              sx={{
                backgroundColor: STATUS_COLORS[task.status],
                color: 'white',
                '& .MuiSelect-icon': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              }}
            >
              <MenuItem value={TaskStatus.TODO}>{getStatusLabel(TaskStatus.TODO)}</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</MenuItem>
              <MenuItem value={TaskStatus.ON_HOLD}>{getStatusLabel(TaskStatus.ON_HOLD)}</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>{getStatusLabel(TaskStatus.COMPLETED)}</MenuItem>
            </Select>
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Status
            </Typography>
            <Chip
              label={getStatusLabel(task.status)}
              size="small"
              sx={{
                backgroundColor: STATUS_COLORS[task.status],
                color: 'white',
              }}
            />
          </Box>
        )}

        {/* Priority */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={getPriorityLabel(task.priority)}
            size="small"
            sx={{
              backgroundColor: PRIORITY_COLORS[task.priority],
              color: 'white',
            }}
          />
        </Box>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {task.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Due Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarToday fontSize="small" color={isDue ? 'error' : 'action'} />
          <Typography variant="caption" color={isDue ? 'error' : 'text.secondary'}>
            Due: {formatDate(task.dueDate)} {isDue && '(Overdue)'}
          </Typography>
        </Box>

        {/* Assigned To */}
        {assignedUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
              {assignedUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              Assigned to: {assignedUser.name}
            </Typography>
          </Box>
        )}

        {/* Created By */}
        {createdUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Created by: {createdUser.name}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;