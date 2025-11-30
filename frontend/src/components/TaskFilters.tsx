import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { TaskStatus, TaskPriority, getStatusLabel, getPriorityLabel } from '@/types';

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | '') => void;
  onPriorityChange: (value: TaskPriority | '') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Status Filter */}
        <TextField
          fullWidth
          select
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value === '' ? '' : Number(e.target.value) as TaskStatus)}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value={TaskStatus.TODO}>{getStatusLabel(TaskStatus.TODO)}</MenuItem>
          <MenuItem value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</MenuItem>
          <MenuItem value={TaskStatus.ON_HOLD}>{getStatusLabel(TaskStatus.ON_HOLD)}</MenuItem>
          <MenuItem value={TaskStatus.COMPLETED}>{getStatusLabel(TaskStatus.COMPLETED)}</MenuItem>
        </TextField>

        {/* Priority Filter */}
        <TextField
          fullWidth
          select
          label="Priority"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value === '' ? '' : Number(e.target.value) as TaskPriority)}
        >
          <MenuItem value="">All Priorities</MenuItem>
          <MenuItem value={TaskPriority.LOW}>{getPriorityLabel(TaskPriority.LOW)}</MenuItem>
          <MenuItem value={TaskPriority.MEDIUM}>{getPriorityLabel(TaskPriority.MEDIUM)}</MenuItem>
          <MenuItem value={TaskPriority.HIGH}>{getPriorityLabel(TaskPriority.HIGH)}</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
};

export default TaskFilters;