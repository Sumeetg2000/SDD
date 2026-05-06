import { useState } from 'react';
import { Button } from 'antd';
import { todayIso } from '../utils/dateUtils';

interface GoalFormProps {
  onSubmit: (title: string, endDate: string) => void;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  endDate?: string;
}

export function GoalForm({ onSubmit, onClose }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be 200 characters or fewer.';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (endDate < todayIso()) {
      newErrors.endDate = 'End date must be today or in the future.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(title.trim(), endDate);
      setTitle('');
      setEndDate('');
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label htmlFor="goal-title" className="block text-sm font-medium text-text-primary mb-1">
          Title
        </label>
        <input
          id="goal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title"
          maxLength={200}
          className="w-full border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-300 border-gray-300"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="goal-end-date" className="block text-sm font-medium text-text-primary mb-1">
          End Date
        </label>
        <input
          id="goal-end-date"
          type="date"
          value={endDate}
          min={todayIso()}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-300 border-gray-300"
        />
        {errors.endDate && (
          <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
        )}
      </div>
      <div className="flex gap-3 justify-end">
        <Button
          htmlType="button"
          className="min-h-[44px]"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="min-h-[44px]"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
