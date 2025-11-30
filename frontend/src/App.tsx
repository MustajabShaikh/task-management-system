import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, SocketProvider } from '@/contexts';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import MainLayout from '@/layouts/MainLayout';
import { LoginPage, RegisterPage, DashboardPage, TasksPage } from '@/pages';
import { ROUTES } from '@/constants/constants';
import { Box, Typography } from '@mui/material';

const ProfilePage = () => (
  <Box>
    <Typography variant="h4">Profile Page (Coming Soon)</Typography>
  </Box>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Public routes - redirect to dashboard if authenticated */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>

          {/* Protected routes with layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.TASKS} element={<TasksPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
          </Route>

          {/* 404 - Not found */}
          <Route
            path="*"
            element={
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4">404 - Page Not Found</Typography>
              </Box>
            }
          />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;