import { LoadingSpinner } from './LoadingSpinner';
import { LoadingOverlay } from './LoadingOverlay';
import { PageLoader } from './PageLoader';
import { CardSkeleton, TableSkeleton, StatCardSkeleton } from './SkeletonLoader';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  type?: 'overlay' | 'page' | 'inline' | 'skeleton';
  skeletonType?: 'card' | 'table' | 'stats' | 'custom';
  skeletonCount?: number;
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'branded';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingWrapper({
  isLoading,
  children,
  type = 'overlay',
  skeletonType = 'card',
  skeletonCount = 3,
  text = 'Loading...',
  variant = 'branded',
  size = 'md',
  className = '',
}: LoadingWrapperProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  switch (type) {
    case 'page':
      return <PageLoader text={text} variant={variant} />;

    case 'inline':
      return (
        <div className={`flex items-center justify-center py-8 ${className}`}>
          <LoadingSpinner variant={variant} size={size} text={text} />
        </div>
      );

    case 'skeleton':
      const renderSkeleton = () => {
        switch (skeletonType) {
          case 'card':
            return Array.from({ length: skeletonCount }).map((_, index) => (
              <CardSkeleton key={index} />
            ));
          case 'table':
            return <TableSkeleton rows={skeletonCount} />;
          case 'stats':
            return Array.from({ length: skeletonCount }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ));
          default:
            return <CardSkeleton />;
        }
      };

      return (
        <div className={`space-y-4 ${className}`}>
          {renderSkeleton()}
        </div>
      );

    default: // overlay
      return (
        <LoadingOverlay
          isLoading={isLoading}
          text={text}
          variant={variant}
          size={size}
        >
          {children}
        </LoadingOverlay>
      );
  }
}