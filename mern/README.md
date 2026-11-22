# 🚀 Futuristic Portfolio — MERN Stack Edition
> **Architect & Developer:** Hafiz Muhammad Saad (HMS Developer)  
> **Stack:** MongoDB • Express.js • React.js • Node.js  

---

## 📁 Project Structure

```
mern/
├── client/                  # React Frontend (Vite + Bootstrap + Futuristic CSS)
│   ├── public/              # Images, PDFs, CSS, Favicon
│   ├── src/
│   │   ├── components/      # Navbar, Hero, About, Skills, Projects, Contact, Footer, etc.
│   │   ├── App.jsx          # Main application & API integration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js + Express.js API
│   ├── models/              # Mongoose Schemas (Project, Skill, Message)
│   ├── data/                # Fallback / Seed data
│   ├── server.js            # Express REST API routes & MongoDB connection
│   └── .env                 # Environment config (PORT, MONGODB_URI)
│
└── package.json             # Root runner scripts
```

---

## ⚡ How to Run Locally

### 1. Run the Backend API (Server):
```bash
cd server
node server.js
```
*Server will listen on `http://localhost:5000` (works with MongoDB or built-in high-performance data mode).*

### 2. Run the React Frontend (Client):
Open a second terminal window:
```bash
cd client
npm run dev
```
*Frontend will launch on `http://localhost:5173`.*

---

## 🌐 Free Deployment Guide

### Frontend (Vercel / Netlify):
1. Import the `client` folder to **Vercel** or **Netlify**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.

### Backend (Render.com / Railway):
1. Connect your repo and set Root Directory to `server`.
2. Build Command: `npm install`.
3. Start Command: `node server.js`.
4. Add Environment Variable:
   - `MONGODB_URI`: Your free MongoDB Atlas connection string.
