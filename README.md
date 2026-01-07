# TaskPilot

A modern, full-stack task management application built with the MERN stack. TaskPilot enables seamless collaboration between administrators and employees, featuring AI-powered task generation, real-time analytics, and an intuitive user interface.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication with role-based access control
- **Role-Based Dashboards** - Separate interfaces for administrators and employees
- **Task Management** - Complete CRUD operations for task creation, editing, deletion, and tracking
- **Task Status Tracking** - Monitor tasks with statuses: assigned, completed, and failed
- **Automatic Task Failure Detection** - Tasks automatically marked as failed when past due date
- **Employee Assignment** - Assign tasks to specific employees with due dates and priorities

### AI Integration
- **AI-Powered Task Descriptions** - Automatically generate professional task descriptions using Google Gemini AI
- **Smart Categorization** - AI suggests appropriate categories (General, Design, Development, Debugging) and priorities (General, Average, High) based on task titles

### Analytics & Visualization
- **Task Status Distribution** - Visual pie chart showing task status breakdown
- **Employee Performance Metrics** - Bar chart displaying tasks completed per employee
- **Responsive Charts** - Interactive charts built with Recharts, optimized for all screen sizes

### User Experience
- **Modern UI/UX** - Beautiful, responsive design built with Tailwind CSS
- **Interactive Alerts** - User-friendly notifications using SweetAlert2
- **Real-time Updates** - Dynamic task status updates and real-time data synchronization

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Icons** - Comprehensive icon library
- **Recharts** - Composable charting library for React
- **SweetAlert2** - Beautiful, responsive, customizable popup boxes

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcryptjs** - Password hashing for secure authentication
- **Google Generative AI** - AI integration for task enhancement
- **CORS** - Cross-origin resource sharing support
- **Cookie Parser** - HTTP cookie parsing middleware

### Development Tools
- **Nodemon** - Automatic server restart during development
- **ESLint** - Code linting and quality assurance
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google Gemini API Key** (for AI features)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taskpilot.git
cd taskpilot
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📂 Project Structure

```
taskpilot/
│
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Analytics/    # Dashboard charts and analytics
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Dashboard/    # Admin and Employee dashboards
│   │   │   ├── Footer/       # Footer component
│   │   │   ├── Header/       # Header component
│   │   │   └── Task Boxes/   # Task management components
│   │   ├── context/          # React Context providers
│   │   ├── services/         # API service functions
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Express backend application
│   ├── config/               # Configuration files
│   │   ├── db.js            # MongoDB connection
│   │   └── gemini.service.js # AI service integration
│   ├── controllers/          # Route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── geminiController.js
│   │   └── taskController.js
│   ├── middleware/           # Custom middleware
│   │   ├── authCheck.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── logger.middleware.js
│   │   └── roleCheck.middleware.js
│   ├── models/              # Mongoose data models
│   │   ├── admin.model.js
│   │   ├── employee.model.js
│   │   └── task.model.js
│   ├── routes/               # API routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── geminiRoutes.js
│   │   └── taskRoutes.js
│   ├── index.js             # Server entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current authenticated user

### Task Routes (`/api/tasks`)
- `GET /api/tasks` - Get all tasks (Admin & Employee)
- `POST /api/tasks` - Create a new task (Admin only)
- `PATCH /api/tasks/:taskId/complete` - Mark task as completed (Employee only)
- `PATCH /api/tasks/:taskId/edit` - Edit a task (Admin only)
- `DELETE /api/tasks/:taskId/delete` - Delete a task (Admin only)

### Employee Routes (`/api/allemployees`)
- `GET /api/allemployees` - Get all employees (for task assignment dropdown)

### AI Routes (`/api/ai/`)
- `POST /api/ai/gendesc` - Generate task description using AI (requires task title in request body)
- `POST /api/ai/gencatpri` - Generate category and priority suggestions (requires task title in request body)

### Health Check
- `GET /healthcheck` - Server health check endpoint

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for enhanced security.

### Roles
- **Admin**: Full access to all features including task creation, editing, deletion, and analytics
- **Employee**: Access to assigned tasks, ability to mark tasks as completed, view personal task list

### Protected Routes
All task management routes require authentication. Role-based middleware ensures that only authorized users can perform specific actions.

## 🎨 Key Features Explained

### Task Status Management
- **Assigned**: Newly created tasks assigned to employees
- **Completed**: Tasks marked as completed by employees
- **Failed**: Tasks automatically marked as failed when past their due date

### AI Integration
The application leverages Google Gemini AI to:
- Generate professional task descriptions from task titles
- Automatically categorize tasks (General, Design, Development, Debugging)
- Suggest appropriate priority levels (General, Average, High)

### Analytics Dashboard
The admin dashboard includes:
- **Task Status Distribution**: Visual representation of task completion rates
- **Employee Performance**: Track tasks completed by each employee
- Real-time data updates as tasks are created and completed

## 🚀 Deployment

### Frontend Deployment
The frontend is configured for deployment on platforms like Netlify or Vercel. Update the CORS configuration in `server/index.js` to include your production frontend URL.

### Backend Deployment
The backend can be deployed on platforms like:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Ensure environment variables are properly configured in your deployment platform.

## 🧪 Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_google_gemini_api_key
```

## 📝 Database Schema

### Task Model
- `title` (String, required)
- `description` (String)
- `category` (String, required)
- `priority` (String: Low, Medium, High, Average, General)
- `status` (String: assigned, completed)
- `dueDate` (Date, required)
- `assignedTo` (ObjectId, reference to Employee)
- `assignedBy` (String)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

### Employee Model
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, default: "employee")

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Developed with ❤️ for efficient task management and team collaboration.

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Add `.env` to your `.gitignore` file.
