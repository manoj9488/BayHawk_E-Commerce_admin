import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'branded';
  showLogo?: boolean;
}

export function PageLoader({ 
  text = 'Loading...', 
  variant = 'branded',
  showLogo = true 
}: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <img 
                src="https://bayhawk.clientstagingdemo.com/_next/static/media/BayHawk.207595da.svg" 
                alt="BayHawk" 
                className="h-12 w-auto"
              />
            </div>
          </div>
        )}
        
        <LoadingSpinner 
          variant={variant} 
          size="xl" 
          text={text}
        />
      </div>
    </div>
  );
}
