import { Fish } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'branded';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: { container: 'h-16', spinner: 'h-4 w-4', text: 'text-xs', dot: 'h-1.5 w-1.5' },
    md: { container: 'h-24', spinner: 'h-6 w-6', text: 'text-sm', dot: 'h-2 w-2' },
    lg: { container: 'h-32', spinner: 'h-8 w-8', text: 'text-base', dot: 'h-2.5 w-2.5' },
    xl: { container: 'h-40', spinner: 'h-12 w-12', text: 'text-lg', dot: 'h-3 w-3' },
  };

  const sizes = sizeClasses[size];

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizes.dot} bg-blue-600 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizes.spinner} bg-blue-600 rounded-full animate-pulse`} />
        );

      case 'branded':
        return (
          <div className="relative">
            <div className={`${sizes.spinner} rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Fish className="h-3 w-3 text-blue-600" />
            </div>
          </div>
        );

      default: // spinner
        return (
          <div className={`${sizes.spinner} rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin`} />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${sizes.container} ${className}`}>
      {renderSpinner()}
      {text && (
        <p className={`mt-3 font-medium text-gray-600 ${sizes.text}`}>
          {text}
        </p>
      )}
    </div>
  );
}