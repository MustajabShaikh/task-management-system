import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Pagination,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { taskApi } from '@/api';
import { ITask, ITaskFilters, TaskStatus, TaskPriority } from '@/types';
import { handleApiError } from '@/utils';
import { useSocketEvents } from '@/hooks';
import { usePermissions } from '@/hooks';
import { PAGINATION } from '@/constants/constants';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import TaskFormModal from '@/components/TaskFormModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { canCreateTask } = usePermissions();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter, page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const filters: ITaskFilters = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (search) filters.search = search;
      if (statusFilter !== '') filters.status = statusFilter;
      if (priorityFilter !== '') filters.priority = priorityFilter;

      const response = await taskApi.getTasks(filters);
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useSocketEvents({
    onTaskCreated: (data) => {
      setTasks((prev) => [data.data, ...prev]);
    },
    onTaskUpdated: (data) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === data.data._id ? data.data : task))
      );
    },
    onTaskDeleted: (data) => {
      setTasks((prev) => prev.filter((task) => task._id !== data.data.taskId));
    },
    showNotifications: true,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  const handleStatusChange = (value: TaskStatus | '') => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePriorityChange = (value: TaskPriority | '') => {
    setPriorityFilter(value);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (task: ITask) => {
    setSelectedTask(task);
    setFormModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    setTaskToDelete({ id: taskId, title: task?.title || '' });
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    fetchTasks();
  };

  const handleDeleteSuccess = () => {
    fetchTasks();
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setSelectedTask(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track your tasks
          </Typography>
        </Box>
        {canCreateTask && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Create Task
          </Button>
        )}
      </Box>

      {/* Filters */}
      <TaskFilters
        search={search}
        status={statusFilter}
        priority={priorityFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* No Tasks */}
      {!loading && tasks.length === 0 && (
        <Alert severity="info">
          No tasks found. {canCreateTask && 'Create your first task to get started!'}
        </Alert>
      )}

      {/* Task Grid */}
      {!loading && tasks.length > 0 && (
        <>
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        open={formModalOpen}
        onClose={handleCloseFormModal}
        task={selectedTask}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        taskId={taskToDelete?.id || null}
        taskTitle={taskToDelete?.title}
        onSuccess={handleDeleteSuccess}
      />
    </Box>
  );
};

export default TasksPage;