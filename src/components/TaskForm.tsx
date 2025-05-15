import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
  onSubmit: (title: string) => void;
  editingTask?: Task;
  onUpdate?: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, editingTask, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      inputRef.current?.focus();
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (editingTask && onUpdate) {
        await onUpdate({ ...editingTask, title: title.trim() });
      } else {
        await onSubmit(title.trim());
      }
      setTitle('');
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleCancel = () => {
    setTitle('');
    if (onUpdate) {
      onUpdate(editingTask!);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {editingTask && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className={`px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600
            ${!title.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSubmitting ? "Processing..." : (editingTask ? "Update Task" : "Add Task")}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 