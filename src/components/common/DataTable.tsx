import type { ReactNode } from 'react';
import { Table, Th, Td, Button } from '../ui';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  const hasActions = onView || onEdit || onDelete;

  const getColumnValue = (item: T, columnKey: keyof T | string): unknown => {
    if (typeof columnKey === 'string' && columnKey.includes('.')) {
      return columnKey.split('.').reduce<unknown>((current, keyPart) => {
        if (current && typeof current === 'object') {
          return (current as Record<string, unknown>)[keyPart];
        }
        return undefined;
      }, item);
    }

    return (item as Record<string, unknown>)[String(columnKey)];
  };

  const getDisplayValue = (value: unknown): ReactNode => {
    if (value == null) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    return JSON.stringify(value);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="h-12 bg-gray-100 rounded-t-xl"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200 bg-gray-50"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
        <p className="text-gray-500 text-sm sm:text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table className={className}>
          <thead>
            <tr>
              {columns.map((column) => (
                <Th key={String(column.key)} className={column.width ? `w-[${column.width}]` : ''}>
                  {column.label}
                </Th>
              ))}
              {hasActions && <Th>Actions</Th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const value = getColumnValue(item, column.key);
                  
                  return (
                    <Td key={String(column.key)} className={column.className}>
                      {column.render ? column.render(value, item) : getDisplayValue(value)}
                    </Td>
                  );
                })}
                {hasActions && (
                  <Td>
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(item)}
                          className="h-10 w-10 p-0"
                        >
                          <Eye className="h-6 w-6" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                          className="h-10 w-10 p-0"
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(item)}
                          className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            {/* Main content */}
            <div className="space-y-2">
              {columns.filter(col => col.key !== 'select').map((column) => {
                const value = getColumnValue(item, column.key);
                
                if (!value && value !== 0) return null;
                
                return (
                  <div key={String(column.key)} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 min-w-0 flex-shrink-0 mr-3">
                      {column.label}:
                    </span>
                    <div className="text-sm text-gray-900 text-right min-w-0 flex-1">
                      {column.render ? column.render(value, item) : getDisplayValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Actions */}
            {hasActions && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                {onView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(item)}
                    className="h-9 px-3 text-xs"
                  >
                    <Eye className="h-5 w-5 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(item)}
                    className="h-9 px-3 text-xs"
                  >
                    <Edit className="h-5 w-5 mr-1" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(item)}
                    className="h-9 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
