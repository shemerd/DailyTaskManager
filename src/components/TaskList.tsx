import React from 'react';
import type { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-1.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`border-b border-gray-100 pb-1.5 last:border-b-0 last:pb-0 pt-1`}
        >
          <div className="flex items-center justify-between group">
            <div className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={`mr-2 flex-shrink-0 w-4 h-4 ${
                  task.completed 
                    ? 'text-green-600 bg-green-50 rounded-full' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? "✓" : "○"}
              </button>
              
              <div className="flex-1 min-w-0 pr-2">
                <p
                  className={`text-sm truncate ${
                    task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex opacity-70 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditTask(task)}
                className="p-1 text-gray-500 hover:text-blue-500"
                title="Edit task"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-gray-500 hover:text-red-500 ml-1"
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 