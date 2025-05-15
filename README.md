# Daily Task Manager

A simple web application for managing daily tasks, built with React, TypeScript, and Express.

## Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (all, active, completed)
- Persistent storage using localStorage
- Clean and responsive UI with Tailwind CSS
- Backend API with Express

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dailytaskmanager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the frontend development server (Vite) and the backend server (Express) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Available Scripts

- `npm run dev` - Start both frontend and backend servers in development mode
- `npm run build` - Build the frontend application for production
- `npm run preview` - Preview the production build locally
- `npm run server` - Start only the backend server
- `npm run lint` - Run ESLint to check for code issues

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Express
- Vite
- Hero Icons

## Project Structure

```
dailytaskmanager/
├── src/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   │   
│   ├── types/
│   │   └── Task.ts
│   │   
│   ├── App.tsx
│   │   
│   └── main.tsx
│   
├── server.js
│   
├── package.json
│   
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
