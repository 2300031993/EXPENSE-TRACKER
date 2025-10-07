# Expense Tracker - Full Stack Setup Guide

This guide will help you set up both the frontend and backend for your Expense Tracker application.

## Prerequisites

Before starting, make sure you have the following installed:
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git (optional)

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the example environment file:
     ```bash
     cp env.example .env
     ```
   - Edit the `.env` file with your MySQL credentials:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=expense_tracker
     PORT=3001
     NODE_ENV=development
     FRONTEND_URL=http://localhost:5173
     ```

4. **Initialize the database:**
   ```bash
   npm run init-db
   ```

5. **Start the backend server:**
   ```bash
   # For development (with auto-restart)
   npm run dev
   
   # For production
   npm start
   ```

   The backend will be available at `http://localhost:3001`

## Frontend Setup

1. **Navigate to the root directory (if not already there):**
   ```bash
   cd ..
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Testing the Setup

1. **Check backend health:**
   Visit `http://localhost:3001/health` in your browser. You should see a JSON response with server status.

2. **Test the frontend:**
   Visit `http://localhost:5173` in your browser. You should see the Expense Tracker application.

3. **Test the integration:**
   - Try adding a new expense in the frontend
   - Check if it appears in the list
   - Try deleting an expense
   - Verify the summary updates correctly

## API Endpoints

The backend provides the following API endpoints:

- `GET /health` - Health check
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `GET /api/expenses/summary` - Get expenses summary
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Troubleshooting

### Backend Issues

1. **Database connection failed:**
   - Verify MySQL is running
   - Check your credentials in the `.env` file
   - Ensure the database exists (run `npm run init-db`)

2. **Port already in use:**
   - Change the PORT in your `.env` file
   - Kill any process using port 3001

3. **CORS errors:**
   - Verify FRONTEND_URL in `.env` matches your frontend URL

### Frontend Issues

1. **API connection failed:**
   - Ensure the backend is running on port 3001
   - Check browser console for error messages
   - Verify CORS settings in backend

2. **Build errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors in the console

## Development Workflow

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `npm run dev`
3. Make changes to either frontend or backend
4. Both servers will auto-reload on changes

## Production Deployment

For production deployment:

1. **Backend:**
   - Set `NODE_ENV=production` in `.env`
   - Use a production MySQL database
   - Consider using PM2 for process management

2. **Frontend:**
   - Run `npm run build` to create production build
   - Serve the `dist` folder with a web server like Nginx

## Database Schema

The application uses a single `expenses` table with the following structure:

```sql
CREATE TABLE expenses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Support

If you encounter any issues:
1. Check the console logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure MySQL is running and accessible
4. Check that both servers are running on the correct ports
