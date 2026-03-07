import { forwardRef, type ButtonHTMLAttributes } from 'react';

// Simple cn function
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200 cursor-pointer',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | string;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const style = variants[variant] || variant;
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      style,
      className
    )}>
      {children}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card = ({ children, className, onClick, hover = false }: CardProps) => (
  <div 
    className={cn(
      'rounded-xl bg-white p-6 shadow-sm border border-gray-200',
      hover && 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200',
      onClick && 'cursor-pointer',
      className
    )} 
    onClick={onClick}
  >
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    '4xl': 'max-w-7xl',
    '5xl': 'max-w-full',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-2xl',
          'transform transition-all duration-200',
          sizes[size]
        )}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button 
              onClick={onClose} 
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
    <table className={cn('min-w-full divide-y divide-gray-200', className)}>
      {children}
    </table>
  </div>
);

export const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn('bg-gray-50 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600', className)}>
    {children}
  </th>
);

export const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn('px-4 py-4 text-sm text-gray-700', className)}>
    {children}
  </td>
);

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex items-center">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
          className
        )}
        {...props}
      />
      {label && (
        <label className="ml-2 block text-sm text-gray-900">{label}</label>
      )}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
);

// Loading Spinner
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizes[size])} />
  );
};

// Empty State
export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: { 
  icon?: React.ElementType; 
  title: string; 
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && <Icon className="h-12 w-12 text-gray-400 mb-4" />}
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    {actionLabel && onAction && (
      <button 
        onClick={onAction}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
// Export new components
export { RoleCard } from './RoleCard';
export { UserProfile } from './UserProfile';
export { LoadingSpinner } from './LoadingSpinner';
export { LoadingOverlay } from './LoadingOverlay';
export { PageLoader } from './PageLoader';
export { Skeleton, CardSkeleton, TableSkeleton, StatCardSkeleton } from './SkeletonLoader';
export { LoadingWrapper } from './LoadingWrapper';
export { RichTextEditor } from './RichTextEditor';
export { SimpleRichTextEditor } from './SimpleRichTextEditor';
export { ImageUpload } from './ImageUpload';
export { EnhancedImageUpload } from './EnhancedImageUpload';

// Export common components
export * from '../common';
export * from './Drawer';
export { ExpiryAlertSettings } from './ExpiryAlertSettings';
export { ExpiryAnalyticsDashboard } from './ExpiryAnalyticsDashboard';
export { ExpiryAnalyticsControls, trackNotificationEvent, generateTrackingUrl } from './ExpiryAnalyticsControls';