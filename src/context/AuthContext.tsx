import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, LoginType, UserRole } from '../types';
import { getRoleDefinition } from '../utils/rbac';
import { authApi } from '../utils/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, loginType: LoginType, locationId?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredUser(): User | null {
  const saved = localStorage.getItem('admin_user');

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (
    email: string,
    password: string,
    loginType: LoginType,
    locationId?: string,
    role?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
        loginType,
        locationId,
        role,
      });

      const payload = response.data?.data;

      if (!payload?.user || !payload?.session?.accessToken) {
        return false;
      }

      const backendUser = payload.user as Partial<User> & {
        role?: string;
        loginType?: string;
      };

      const resolvedRole = (backendUser.role || role || (loginType === 'hub' ? 'hub_main_admin' : loginType === 'store' ? 'store_main_admin' : 'super_admin')) as UserRole;
      const roleDefinition = getRoleDefinition(resolvedRole);

      const mappedUser: User = {
        id: String(backendUser.id || ''),
        name: String(backendUser.name || 'Admin User'),
        email: String(backendUser.email || email),
        phone: String(backendUser.phone || ''),
        role: resolvedRole,
        loginType: (backendUser.loginType || loginType) as LoginType,
        hubId: backendUser.hubId,
        storeId: backendUser.storeId,
        department: backendUser.department || roleDefinition?.displayName,
        permissions: Array.isArray(backendUser.permissions) ? backendUser.permissions : [],
      };

      localStorage.setItem('auth_token', payload.session.accessToken);
      localStorage.setItem('auth_refresh_token', payload.session.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(mappedUser));

      setToken(payload.session.accessToken);
      setUser(mappedUser);

      return true;
    } catch (error) {
      console.error('Admin login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('auth_refresh_token') || undefined;

    void authApi.logout(refreshToken).catch(() => {
      // Ignore logout transport failures and clear local auth state anyway.
    });

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
