# 🔗 Mini LinkedIn – Community Platform

A minimalist, professional social network inspired by LinkedIn – built using modern technologies and styled with a bold **Neo-brutalist** design aesthetic.

---

## 🚀 Live Demo

**Frontend:** [mini-linkdin](https://mini-linkdin-three.vercel.app/)  
**Backend API:** [Backend](https://mini-linkdin-ktmx.onrender.com)

---

## 🧱 Tech Stack

### 🖥️ Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Design**: Inspired by **Neo-brutalism**
- **Deployment**: [Vercel](https://vercel.com/)
- **Authentication UI**: Custom forms integrated with backend JWT auth

### ⚙️ Backend
- **Server**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Authentication**: JSON Web Tokens (JWT)
- **REST API Endpoints**:
  - `POST /api/auth/login` – User login
  - `POST /api/auth/register` – User registration
  - `GET /api/users/:id` – Fetch user profile
  - `PUT /api/users/:id` – Update user bio
  - `POST /api/posts` – Create a new post
  - `GET /api/posts` – Get all posts
- **Deployment**: [Render](https://render.com/)

### 🧠 Database
- **Provider**: FireBase🔥
- **Stores**:
  - User data (name, email, bio)
  - Posts (content, author, timestamp)

---

## ✨ Features

- 🔐 **Secure user authentication** using JWT
- 🏠 **Public post feed** showing all user posts
- 🧑 **User profile pages** with bio and post history
- 📝 **Create posts** (text only)
- 🎨 Brutalist UI with thick borders, shadows, and flat colors
- 📱 **Responsive design** for mobile and desktop
- 🌐 Fully deployed with real-time backend + database

---

## 📁 Folder Structure

```bash
/mini-linkedin
│
├── frontend/          # Next.js App (Vercel)
├── backend/           # Express API (Render)
└── firebase/          # Firebase setup and config
