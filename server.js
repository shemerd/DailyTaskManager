// Using ES modules syntax
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5001;

// In-memory database
let tasks = [];

// Add some sample tasks for testing
tasks = [
  {
    id: '1',
    title: 'Learn React',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Build a task manager',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks - Returning tasks:', tasks);
  const { status } = req.query;
  if (status) {
    const filteredTasks = tasks.filter(task => task.completed === (status === 'completed'));
    return res.json(filteredTasks);
  }
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  console.log('POST /api/tasks - Body:', req.body);
  const task = {
    id: Date.now().toString(),
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  console.log('Created task:', task);
  res.status(201).json(task);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  console.log(`PUT /api/tasks/${taskId} - Body:`, req.body);
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    console.log(`Task with ID ${taskId} not found`);
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    id: taskId // Ensure ID remains unchanged
  };

  console.log('Updated task:', tasks[taskIndex]);
  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  console.log(`DELETE /api/tasks/${taskId}`);
  
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    console.log(`Task with ID ${taskId} not found`);
    return res.status(404).json({ message: 'Task not found' });
  }

  const deletedTask = tasks[taskIndex];
  tasks = tasks.filter(task => task.id !== taskId);
  
  console.log('Deleted task:', deletedTask);
  res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
  console.log('Initial tasks:', tasks);
}); 