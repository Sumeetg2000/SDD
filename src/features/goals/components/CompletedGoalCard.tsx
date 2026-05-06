import { Button } from 'antd';
import type { Goal } from '../types/goal';

interface CompletedGoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}

export function CompletedGoalCard({ goal, onDelete }: CompletedGoalCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-pastel-lavender mb-2">
      <p className="truncate text-text-primary font-medium flex-1 min-w-0">{goal.title}</p>
      <Button
        danger
        size="small"
        className="min-h-[44px] shrink-0"
        onClick={() => onDelete(goal.id)}
      >
        Delete
      </Button>
    </div>
  );
}
