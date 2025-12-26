# 📌 TaskPilot

TaskPilot is a full-stack task management application built with the MERN stack.
It allows admins and employees to manage tasks efficiently with a clean, modern UI and a scalable backend connected to MongoDB Atlas.

This project started as a frontend-only idea and was later extended with a custom Express backend to support real database persistence and future authentication.

## 🚀 Features

- ✅ Implemented

- 📋 Task creation and management

- 🗂 Task status handling (assigned / completed)

- 🧑‍💼 Admin & employee workflow logic (single API design)

- 🌐 RESTful API built with Express

- 🗄 MongoDB Atlas integration using Mongoose

- 🎨 Modern responsive UI using Tailwind CSS

- ⚡ Fast frontend setup with Vite

- 🔔 Interactive alerts using SweetAlert2

## 🛠 Planned / In Progress

- 🔐 Authentication & authorization using JWT
- ⚡ Integrate AI With IT

# 🛠 Tech Stack

### Frontend (Client)

- React 19

- Vite

- Tailwind CSS

- React Icons

- SweetAlert2

### Backend (Server)

- Node.js

- Express.js

- MongoDB Atlas

- Mongoose ODM

- bcryptjs

## 📂 Project Structure

```text
taskpilot/
│
├── client/            # React + Vite frontend
│   ├── src/
│   ├── package.json
│
├── server/            # Express backend
│   ├── index.js
│   ├── models/
│   ├── routes/
│   ├── package.json
│
└── README.md
```

## ⚙️ Environment Variables

```text
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key   # (for future use)
```

## 🧪 Installation & Setup

Follow the steps below to run the project locally.

---

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/taskpilot.git
cd taskpilot
```

### 2 Backend Setup

```bash
cd server
npm install
npm run dev
```

### 3 Frontend Setup

```bash
cd client
npm install
npm run dev
```

## 🔗 Database

- The app uses MongoDB Atlas
- Connected via Mongoose
- You can view and manage data using MongoDB Compass

## 🧠 Design Decisions

- Single backend API for both admin and employee logic
- Backend introduced early to avoid reliance on localStorage
- Clean separation between frontend and backend
- Scalable structure to easily add authentication later
