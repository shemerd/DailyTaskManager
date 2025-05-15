import { useState, useEffect } from 'react';
import type { Task } from './types/Task';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const API_URL = 'http://localhost:5001/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error('Error parsing tasks from localStorage:', err);
      }
    }
    
    // Fetch tasks from API
    fetchTasks();
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/tasks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Using local storage data.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      // First add to local state for immediate feedback
      const tempTask: Task = {
        id: `temp-${Date.now()}`,
        title,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      setTasks(prevTasks => [...prevTasks, tempTask]);
      
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const newTask = await response.json();
      console.log('Added task:', newTask);
      
      // Replace the temp task with the real one from the server
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === tempTask.id ? newTask : task)
      );
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Update local state immediately
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t)
      );

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      
      // Ensure server state is reflected
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Update local state immediately
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('Deleted task:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      fetchTasks();
    }
  };

  const updateTask = async (task: Task) => {
    try {
      // Update local state immediately
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? task : t)
      );
      setEditingTask(undefined);
      
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      console.log('Updated task:', updatedTask);
      
      // Ensure server state is reflected
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
      fetchTasks();
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            Daily Task Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">Organize your tasks efficiently</p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="border-b border-gray-100 px-3 py-2">
            <h2 className="text-sm font-medium text-gray-700">Add New Task</h2>
          </div>
          
          <div className="p-3">
            <TaskForm
              onSubmit={addTask}
              editingTask={editingTask}
              onUpdate={updateTask}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Tasks ({filteredTasks.length})</h2>
            <div className="flex space-x-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                    : 'text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  filter === 'active' 
                    ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                    : 'text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  filter === 'completed' 
                    ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                    : 'text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                Done ({stats.completed})
              </button>
            </div>
          </div>
          
          <div className="p-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400">
                    {filter === 'all' 
                      ? 'No tasks yet. Add your first task above!' 
                      : `No ${filter} tasks found.`}
                  </div>
                ) : (
                  <TaskList
                    tasks={filteredTasks}
                    onToggleComplete={toggleComplete}
                    onDeleteTask={deleteTask}
                    onEditTask={setEditingTask}
                  />
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-400 text-xs">
          <p>© {new Date().getFullYear()} Daily Task Manager</p>
        </div>
      </div>
    </div>
  );
}

export default App;
