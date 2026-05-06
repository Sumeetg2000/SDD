export type GoalStatus = 'active' | 'completed';

export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: GoalStatus;
  createdAt: string;
  completedAt: string | null;
}
