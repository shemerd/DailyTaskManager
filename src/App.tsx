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
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      fetchTasks();
    }
  };

  const updateTask = async (task: Task) => {
    try {
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
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="app-container" style={{
        width: '380px',
        maxWidth: '90vw',
        margin: '0 auto',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">
            Daily Task Manager
          </h1>
          <p className="text-sm text-gray-500">
            Organize your tasks efficiently
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 text-red-600 text-sm">
            {error}
          </div>
        )}

        <TaskForm onSubmit={addTask} />

        <div>
          <h2 className="text-base font-medium text-gray-900 mb-2">
            Tasks ({filteredTasks.length})
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
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
                  filter={filter}
                  stats={stats}
                  onFilterChange={setFilter}
                />
              )}
            </>
          )}
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Daily Task Manager
        </div>
      </div>
    </div>
  );
}

export default App;
