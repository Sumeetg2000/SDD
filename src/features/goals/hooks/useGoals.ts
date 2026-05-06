import { useState, useEffect } from 'react';
import type { Goal } from '../types/goal';
import { loadGoals, saveGoals } from '../utils/storageUtils';
import { todayIso } from '../utils/dateUtils';

export interface UseGoalsReturn {
  activeGoals: Goal[];
  completedGoals: Goal[];
  checkedIds: Set<string>;
  isModalOpen: boolean;
  toggleChecked: (id: string) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  openModal: () => void;
  closeModal: () => void;
  addGoal: (title: string, endDate: string) => void;
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const activeGoals = goals
    .filter((g) => g.status === 'active')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const completedGoals = goals
    .filter((g) => g.status === 'completed')
    .sort((a, b) => {
      const aDate = a.completedAt ?? '';
      const bDate = b.completedAt ?? '';
      return bDate.localeCompare(aDate);
    });

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completeGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'completed' as const, completedAt: todayIso() }
          : g,
      ),
    );
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addGoal = (title: string, endDate: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      endDate,
      status: 'active',
      createdAt: todayIso(),
      completedAt: null,
    };
    setGoals((prev) => [newGoal, ...prev]);
    closeModal();
  };

  return {
    activeGoals,
    completedGoals,
    checkedIds,
    isModalOpen,
    toggleChecked,
    completeGoal,
    deleteGoal,
    openModal,
    closeModal,
    addGoal,
  };
}
