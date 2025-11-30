import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  Pending,
  PlayCircle,
  PauseCircle,
} from "@mui/icons-material";
import { taskApi } from "@/api";
import { ITaskStats } from "@/types";
import { handleApiError } from "@/utils";
import { useSocketEvents } from "@/hooks";
import StatCard from "@/components/StatCard";

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<ITaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getTaskStats();
        setStats(response.data.stats);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useSocketEvents({
    onTaskCreated: () => {
      if (stats) {
        setStats((prev) =>
          prev
            ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 }
            : null
        );
      }
    },
    onTaskDeleted: () => {
      if (stats) {
        setStats((prev) => (prev ? { ...prev, total: prev.total - 1 } : null));
      }
    },
    onTaskStatusChanged: (data) => {
      if (stats) {
        setStats((prev) => {
          if (!prev) return null;
          const newStats = { ...prev };

          if (data.data.oldStatus === 0) newStats.pending--;
          else if (data.data.oldStatus === 1) newStats.inProgress--;
          else if (data.data.oldStatus === 2) newStats.onHold--;
          else if (data.data.oldStatus === 3) newStats.completed--;

          if (data.data.newStatus === 0) newStats.pending++;
          else if (data.data.newStatus === 1) newStats.inProgress++;
          else if (data.data.newStatus === 2) newStats.onHold++;
          else if (data.data.newStatus === 3) newStats.completed++;

          return newStats;
        });
      }
    },
    showNotifications: false, // Don't show notifications on dashboard
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Alert severity="error">
        Failed to load statistics. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Overview of your tasks and statistics
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<Assignment fontSize="large" />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle fontSize="large" />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<PlayCircle fontSize="large" />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Pending fontSize="large" />}
            color="#9e9e9e"
          />
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PauseCircle sx={{ color: "warning.main" }} />
              <Typography variant="body2">
                On Hold: <strong>{stats.onHold}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body2">
                Completion Rate:{" "}
                <strong>
                  {stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}
                  %
                </strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
