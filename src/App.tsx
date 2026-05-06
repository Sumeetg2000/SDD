import { Button } from 'antd';
import { useGoals } from './features/goals/hooks/useGoals';
import { GoalColumn } from './features/goals/components/GoalColumn';
import { GoalCard } from './features/goals/components/GoalCard';
import { CompletedGoalCard } from './features/goals/components/CompletedGoalCard';
import { AddGoalModal } from './features/goals/components/AddGoalModal';

function App() {
  const {
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
  } = useGoals();

  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Tracker</h1>
      </header>
      <main className="flex flex-col md:flex-row gap-6">
        <GoalColumn
          title="Active Goals"
          isEmpty={activeGoals.length === 0}
          emptyMessage="No active goals. Add one to get started!"
          headerAction={
            <Button type="primary" onClick={openModal} className="min-h-[44px]">
              + Add Goal
            </Button>
          }
        >
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isChecked={checkedIds.has(goal.id)}
              onToggleCheck={toggleChecked}
              onComplete={completeGoal}
              onDelete={deleteGoal}
            />
          ))}
        </GoalColumn>
        <GoalColumn
          title="Completed Goals"
          isEmpty={completedGoals.length === 0}
          emptyMessage="No completed goals yet. Keep going!"
        >
          {completedGoals.map((goal) => (
            <CompletedGoalCard
              key={goal.id}
              goal={goal}
              onDelete={deleteGoal}
            />
          ))}
        </GoalColumn>
      </main>
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addGoal}
      />
    </div>
  );
}

export default App;

