import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/AuthContext';
import { Button, Input, Select } from '../../../components/ui';
import { loginSchema, type LoginInput } from '../../../utils/validations';
import type { LoginType, UserRole } from '../../../types';
import { getRolesByModule } from '../../../utils/rbac';
import { Fish, Store, Shield, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>('super_admin');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginType: 'super_admin' },
  });

  const onSubmit = async (data: LoginInput) => {
    const success = await login(
      data.email, 
      data.password, 
      data.loginType as LoginType, 
      data.locationId,
      selectedRole as UserRole
    );
    if (success) navigate('/dashboard');
  };

  const handleLoginTypeChange = (type: LoginType) => {
    setLoginType(type);
    setSelectedRole('');
    setValue('loginType', type);
  };

  const loginTypes = [
    { 
      type: 'super_admin' as LoginType, 
      icon: Shield, 
      label: 'Super Admin', 
      desc: 'Full access',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      type: 'hub' as LoginType, 
      icon: Fish, 
      label: 'Hub', 
      desc: 'Fish products',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      type: 'store' as LoginType, 
      icon: Store, 
      label: 'Store', 
      desc: 'All products',
      gradient: 'from-green-500 to-green-600'
    },
  ];

  const availableRoles = loginType !== 'super_admin' ? getRolesByModule(loginType) : [];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Compact Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+CjwvZz4KPC9nPgo8L3N2Zz4=')]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img 
              src="https://bayhawk.clientstagingdemo.com/_next/static/media/BayHawk.207595da.svg" 
              alt="BayHawk" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        
        <div className="space-y-6 relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Role-Based Access<br />
              <span className="text-blue-300">Control System</span>
            </h2>
            <p className="text-blue-200">
              Secure management for your seafood business operations.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '10K+', label: 'Orders', icon: '📦' },
              { value: '500+', label: 'Products', icon: '🐟' },
              { value: '50+', label: 'Locations', icon: '🏪' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-lg mb-1">{stat.icon}</div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-xs text-blue-300 relative z-10">© 2024 Bayhawk. All rights reserved.</p>
      </div>

      {/* Right Side - Compact Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2">
              <img 
                src="https://bayhawk.clientstagingdemo.com/_next/static/media/BayHawk.207595da.svg" 
                alt="BayHawk" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
              <p className="text-sm text-gray-600">Sign in to your admin account</p>
            </div>

            {/* Horizontal Login Type Selector */}
            <div className="mb-4 sm:mb-5">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Login Type</label>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {loginTypes.map(({ type, icon: Icon, label, desc, gradient }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleLoginTypeChange(type)}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      loginType === type
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mx-auto mb-1 sm:mb-2`}>
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <p className={`text-xs font-semibold ${loginType === type ? 'text-blue-900' : 'text-gray-900'}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              {/* Location Selection */}
              {loginType === 'hub' && (
                <Select
                  label="Select Hub"
                  {...register('locationId')}
                  options={[
                    { value: '', label: 'Choose a hub...' },
                    { value: 'hub_1', label: 'Central Hub - Chennai' },
                  ]}
                />
              )}
              
              {loginType === 'store' && (
                <Select
                  label="Select Store"
                  {...register('locationId')}
                  options={[
                    { value: '', label: 'Choose a store...' },
                    { value: 'store_1', label: 'Store - Anna Nagar' },
                    { value: 'store_2', label: 'Store - T Nagar' },
                    { value: 'store_3', label: 'Store - Velachery' },
                  ]}
                />
              )}

              {/* Simple Role Selection Dropdown */}
              {loginType !== 'super_admin' && availableRoles.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Select Your Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <option value="">Choose your role...</option>
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                placeholder="admin@bayhawk.com"
                error={errors.email?.message}
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                disabled={isLoading || (loginType !== 'super_admin' && !selectedRole)}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>

          <p className="mt-3 sm:mt-4 text-center text-xs text-gray-500">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
