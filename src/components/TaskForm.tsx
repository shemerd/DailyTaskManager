import React, { useState, useRef } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
  onSubmit: (title: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(title.trim());
      setTitle('');
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-base font-medium text-gray-900 mb-3">Add New Task</h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700
            ${!title.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ color: '#ffffff' }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 