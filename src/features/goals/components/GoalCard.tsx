import { Checkbox, Button } from 'antd';
import type { Goal } from '../types/goal';
import { daysRemaining, isUrgent, formatDaysLabel } from '../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, isChecked, onToggleCheck, onComplete, onDelete }: GoalCardProps) {
  const urgent = isUrgent(goal.endDate);
  const days = daysRemaining(goal.endDate);
  const label = formatDaysLabel(days);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border mb-2 ${
        urgent
          ? 'bg-urgent border-urgent-border'
          : 'bg-surface-card border-gray-200'
      }`}
    >
      <Checkbox
        checked={isChecked}
        onChange={() => onToggleCheck(goal.id)}
        className="mt-0.5 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-text-primary font-medium">{goal.title}</p>
        <p className={`text-xs mt-0.5 ${urgent ? 'text-orange-600 font-semibold' : 'text-text-muted'}`}>
          {label}
        </p>
        {isChecked && (
          <div className="flex gap-2 mt-2">
            <Button
              size="small"
              className="min-h-[44px]"
              onClick={() => onComplete(goal.id)}
            >
              Move to Completed
            </Button>
            <Button
              danger
              size="small"
              className="min-h-[44px]"
              onClick={() => onDelete(goal.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
