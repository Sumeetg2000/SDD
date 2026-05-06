import { Modal } from 'antd';
import { GoalForm } from './GoalForm';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, endDate: string) => void;
}

export function AddGoalModal({ isOpen, onClose, onSubmit }: AddGoalModalProps) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      title="Add New Goal"
      className="bg-surface"
    >
      <GoalForm onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  );
}
