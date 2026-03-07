import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, LoginType, UserRole } from '../types';
import { getRoleDefinition } from '../utils/rbac';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, loginType: LoginType, locationId?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (
    email: string, 
    _password: string, 
    loginType: LoginType, 
    locationId?: string,
    role?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Determine the user role
    let userRole: UserRole;
    let userName: string;
    let department: string | undefined;
    
    if (loginType === 'super_admin') {
      userRole = 'super_admin';
      userName = 'Super Administrator';
      department = 'Administration';
    } else if (role) {
      userRole = role;
      const roleDefinition = getRoleDefinition(role);
      userName = roleDefinition ? `${roleDefinition.displayName} - ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}` : 'Admin User';
      department = roleDefinition?.displayName;
    } else {
      // Fallback to admin roles
      userRole = loginType === 'hub' ? 'hub_admin' : 'store_admin';
      userName = loginType === 'hub' ? 'Hub Administrator' : 'Store Administrator';
      department = 'Administration';
    }
    
    // Mock user data with role-based information
    const mockUser: User = {
      id: '1',
      name: userName,
      email,
      phone: '+91 9876543210',
      role: userRole,
      loginType,
      hubId: loginType === 'hub' ? locationId || 'hub_1' : undefined,
      storeId: loginType === 'store' ? locationId || 'store_1' : undefined,
      department,
      permissions: [], // Custom permissions can be added here
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('admin_user', JSON.stringify(mockUser));
    setToken(mockToken);
    setUser(mockUser);
    setIsLoading(false);
    
    return true;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
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
