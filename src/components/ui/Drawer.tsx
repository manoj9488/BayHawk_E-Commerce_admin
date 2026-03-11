import { forwardRef } from 'react';
import { X } from 'lucide-react';

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ isOpen, onClose, title, children, size = 'md', position = 'right' }, ref) => {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
    };

    const positions = {
      left: 'left-0',
      right: 'right-0',
    };

    const transformClasses = {
        left: {
            open: 'translate-x-0',
            closed: '-translate-x-full'
        },
        right: {
            open: 'translate-x-0',
            closed: 'translate-x-full'
        }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-40 overflow-hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            'absolute top-0 bottom-0 w-full bg-white shadow-xl transition-transform duration-300 ease-in-out',
            sizes[size],
            positions[position],
            isOpen ? transformClasses[position].open : transformClasses[position].closed
          )}
        >
          <div className="flex h-full flex-col overflow-y-scroll">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close panel</span>
                </button>
              </div>
            </div>
            <div className="flex-1 px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
