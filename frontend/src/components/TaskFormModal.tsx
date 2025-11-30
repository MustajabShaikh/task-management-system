import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Chip,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { taskApi } from '@/api';
import { ITask, ITaskCreate, ITaskUpdate, TaskStatus, TaskPriority, getStatusLabel, getPriorityLabel } from '@/types';
import { handleApiError } from '@/utils';
import { formatDateForInput } from '@/utils';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: ITask | null;
  onSuccess: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ open, onClose, task, onSuccess }) => {
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ITaskCreate>({
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: '',
      tags: [],
      assignedTo: '',
    },
  });

  const tags = watch('tags') || [];

  useEffect(() => {
    if (open) {
      // Fetch from /api/users endpoint
    }
  }, [open]);

  useEffect(() => {
    if (task && open) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: formatDateForInput(task.dueDate),
        tags: task.tags || [],
        assignedTo: typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo || '',
      });
    } else if (open) {
      reset({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: '',
        tags: [],
        assignedTo: '',
      });
    }
  }, [task, open, reset]);

  const onSubmit = async (data: ITaskCreate) => {
    try {
      setLoading(true);
      
      if (isEdit && task) {
        const updateData: ITaskUpdate = {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
          tags: data.tags,
          assignedTo: data.assignedTo || undefined,
        };
        await taskApi.updateTask(task._id, updateData);
        toast.success('Task updated successfully!');
      } else {
        await taskApi.createTask(data);
        toast.success('Task created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      if (tags.length >= 10) {
        toast.error('Maximum 10 tags allowed');
        return;
      }
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToDelete));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <TextField
              fullWidth
              label="Title"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
            />

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={loading}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {/* Priority */}
              <TextField
                fullWidth
                select
                label="Priority"
                {...register('priority', { required: 'Priority is required' })}
                error={!!errors.priority}
                helperText={errors.priority?.message}
                disabled={loading}
                defaultValue={TaskPriority.LOW}
              >
                <MenuItem value={TaskPriority.LOW}>{getPriorityLabel(TaskPriority.LOW)}</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>{getPriorityLabel(TaskPriority.MEDIUM)}</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>{getPriorityLabel(TaskPriority.HIGH)}</MenuItem>
              </TextField>

              {/* Status */}
              <TextField
                fullWidth
                select
                label="Status"
                {...register('status')}
                disabled={loading}
                defaultValue={TaskStatus.TODO}
              >
                <MenuItem value={TaskStatus.TODO}>{getStatusLabel(TaskStatus.TODO)}</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</MenuItem>
                <MenuItem value={TaskStatus.ON_HOLD}>{getStatusLabel(TaskStatus.ON_HOLD)}</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>{getStatusLabel(TaskStatus.COMPLETED)}</MenuItem>
              </TextField>
            </Box>

            {/* Due Date */}
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              {...register('dueDate', {
                required: 'Due date is required',
              })}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              disabled={loading}
            />

            {/* Assigned To (Optional - simplified for now) */}
            <TextField
              fullWidth
              label="Assigned To (User ID)"
              {...register('assignedTo')}
              helperText="Optional: Enter user ID to assign task"
              disabled={loading}
            />

            {/* Tags */}
            <Box>
              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                helperText="Press Enter to add tag (max 10 tags)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleAddTag} size="small" disabled={loading}>
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    size="small"
                    disabled={loading}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskFormModal;