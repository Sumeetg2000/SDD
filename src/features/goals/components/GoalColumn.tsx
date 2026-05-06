import type { ReactNode } from 'react';

interface GoalColumnProps {
  title: string;
  headerAction?: ReactNode;
  children?: ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
}

export function GoalColumn({
  title,
  headerAction,
  children,
  emptyMessage,
  isEmpty,
}: GoalColumnProps) {
  return (
    <div className="flex flex-col w-full md:w-1/2 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
        {isEmpty ? (
          <p className="text-text-muted text-sm py-4 text-center">{emptyMessage}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
