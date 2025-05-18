import React from 'react';
import type { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  filter: 'all' | 'active' | 'completed';
  stats: { total: number; active: number; completed: number };
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  filter,
  stats,
  onFilterChange,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm">
        <button
          onClick={() => onFilterChange('all')}
          className={`${filter === 'all' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`${filter === 'active' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`${filter === 'completed' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Done ({stats.completed})
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                  task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300'
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && (
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <div>
                <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-gray-400">{formatDate(task.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                onClick={() => onEditTask(task)}
                className="text-gray-500 hover:text-blue-600"
                aria-label="Edit task"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-500 hover:text-red-600"
                aria-label="Delete task"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList; 