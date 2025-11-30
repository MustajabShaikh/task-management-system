import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  AssignmentTurnedIn,
  AssignmentLate,
  Assignment,
  AccessTime,
  Refresh,
} from '@mui/icons-material';
import { ITaskStats } from '@/types';

interface DashboardLayoutProps {
  stats: ITaskStats | null;
  error: string | null;
  onRefresh: () => void;
}

const StatCard: React.FC<{
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, count, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {count}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ProgressCard: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
}> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {value}/{total}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#f0f0f0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ stats, error, onRefresh }) => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography color="textSecondary">Welcome back! Here's your task overview.</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      {stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Tasks"
                count={stats.total}
                icon={<Assignment sx={{ fontSize: 32 }} />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                count={stats.completed}
                icon={<AssignmentTurnedIn sx={{ fontSize: 32 }} />}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="In Progress"
                count={stats.inProgress}
                icon={<AccessTime sx={{ fontSize: 32 }} />}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                count={stats.pending}
                icon={<AssignmentLate sx={{ fontSize: 32 }} />}
                color="#f44336"
              />
            </Grid>
          </Grid>

          {/* Progress Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Task Progress
                  </Typography>
                  <ProgressCard
                    label="Completed"
                    value={stats.completed}
                    total={stats.total}
                    color="#4caf50"
                  />
                  <ProgressCard
                    label="In Progress"
                    value={stats.inProgress}
                    total={stats.total}
                    color="#ff9800"
                  />
                  <ProgressCard
                    label="On Hold"
                    value={stats.onHold}
                    total={stats.total}
                    color="#9e9e9e"
                  />
                  <ProgressCard
                    label="Pending"
                    value={stats.pending}
                    total={stats.total}
                    color="#f44336"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Quick Stats
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="textSecondary">Completion Rate</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {stats.total > 0
                          ? `${Math.round((stats.completed / stats.total) * 100)}%`
                          : '0%'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="textSecondary">Active Tasks</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {stats.inProgress}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="textSecondary">Remaining Tasks</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#f44336' }}>
                        {stats.pending + stats.inProgress + stats.onHold}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="textSecondary">On Hold</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#9e9e9e' }}>
                        {stats.onHold}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardLayout;
