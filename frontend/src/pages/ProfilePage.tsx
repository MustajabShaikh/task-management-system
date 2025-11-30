import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useAuth } from '@/contexts';
import { userApi } from '@/api';
import { IUser } from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { toast } from 'react-toastify';

const getRoleColor = (role: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'manager':
      return 'warning';
    case 'user':
      return 'info';
    default:
      return 'default';
  }
};

const getRoleIcon = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return '👨‍💼';
    case 'manager':
      return '👤';
    case 'user':
      return '👥';
    default:
      return '';
  }
};

const ProfilePage: React.FC = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser?._id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await userApi.getUserProfile(authUser._id);
        if (response.success) {
          setProfile(response.data.user);
          setEditedName(response.data.user.name);
        }
      } catch (err) {
        handleApiError(err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser?._id]);

  const handleSave = async () => {
    if (!profile?._id || !editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const response = await userApi.updateProfile(profile._id, { name: editedName });

      if (response.success) {
        setProfile(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        // Refresh auth context to update global user
        await refreshUser();
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(profile?.name || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            My Profile
          </Typography>
          <Typography color="textSecondary">Manage your profile information</Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Name
            </Typography>
            <TextField
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={!isEditing}
              variant={isEditing ? 'outlined' : 'filled'}
              placeholder="Your name"
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>

          {/* Email Field (Disabled) */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              value={profile.email}
              disabled
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>

          {/* Role Badge */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Role
            </Typography>
            <Box>
              <Chip
                label={`${getRoleIcon(profile.role)} ${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`}
                color={getRoleColor(profile.role)}
                variant="outlined"
                sx={{ fontSize: '0.95rem', py: 2.5 }}
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setIsEditing(true)}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving || !editedName.trim()}
                    sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ flex: 1, textTransform: 'none', py: 1.5 }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
