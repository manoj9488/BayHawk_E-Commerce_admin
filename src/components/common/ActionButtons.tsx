import { Button } from '../ui';
import { Eye, Edit, Trash2, Download, Plus, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  downloadLabel?: string;
  addLabel?: string;
  refreshLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  className?: string;
}

export function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onDownload,
  onAdd,
  onRefresh,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  downloadLabel = 'Export',
  addLabel = 'Add New',
  refreshLabel = 'Refresh',
  size = 'sm',
  variant = 'default',
  className = ''
}: ActionButtonsProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {onAdd && (
        <Button
          onClick={onAdd}
          size={size}
          className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? addLabel : ''}</span>
        </Button>
      )}
      
      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="secondary"
          size={size}
          className="text-xs sm:text-sm px-2 sm:px-3"
          title={refreshLabel}
        >
          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? refreshLabel : ''}</span>
        </Button>
      )}
      
      {onDownload && (
        <Button
          onClick={onDownload}
          variant="secondary"
          size={size}
          className="text-xs sm:text-sm px-2 sm:px-3"
          title={downloadLabel}
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? downloadLabel : ''}</span>
        </Button>
      )}
      
      {onView && (
        <Button
          onClick={onView}
          variant="ghost"
          size={size}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3"
          title={viewLabel}
        >
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? viewLabel : ''}</span>
        </Button>
      )}
      
      {onEdit && (
        <Button
          onClick={onEdit}
          variant="ghost"
          size={size}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs sm:text-sm px-2 sm:px-3"
          title={editLabel}
        >
          <Edit className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? editLabel : ''}</span>
        </Button>
      )}
      
      {onDelete && (
        <Button
          onClick={onDelete}
          variant="ghost"
          size={size}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
          title={deleteLabel}
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">{!isCompact ? deleteLabel : ''}</span>
        </Button>
      )}
    </div>
  );
}
