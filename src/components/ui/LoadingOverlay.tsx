import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'branded';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backdrop?: 'light' | 'dark' | 'blur';
  children?: React.ReactNode;
}

export function LoadingOverlay({ 
  isLoading, 
  text = 'Loading...', 
  variant = 'branded',
  size = 'lg',
  backdrop = 'light',
  children 
}: LoadingOverlayProps) {
  const backdropClasses = {
    light: 'bg-white/80',
    dark: 'bg-gray-900/50',
    blur: 'bg-white/70 backdrop-blur-sm',
  };

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children && (
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      )}
      
      <div className={`absolute inset-0 flex items-center justify-center z-50 ${backdropClasses[backdrop]}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <LoadingSpinner 
            variant={variant} 
            size={size} 
            text={text}
          />
        </div>
      </div>
    </div>
  );
}