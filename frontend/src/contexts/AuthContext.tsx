import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '@/api';
import { storage, handleApiError } from '@/utils';
import { IUser, IUserLogin, IUserRegister } from '@/types';
import { ROUTES } from '@/constants/constants';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: IUserLogin) => Promise<void>;
  register: (data: IUserRegister) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.getToken();
        const savedUser = storage.getUser();

        if (token && savedUser) {
          const response = await authApi.getProfile();
          setUser(response.data.user);
          storage.setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        storage.clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: IUserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
      setUser(response.data.user);

      toast.success(response.message);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: IUserRegister): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);

      storage.setToken(response.data.token);
      storage.setUser(response.data.user);
      setUser(response.data.user);

      toast.success(response.message);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    storage.clearAuth();
    setUser(null);
    toast.info('Logged out successfully');
    navigate(ROUTES.LOGIN);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data.user);
      storage.setUser(response.data.user);
    } catch (error) {
      handleApiError(error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};