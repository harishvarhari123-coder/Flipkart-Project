# Harikart - E-Commerce Platform

This repository contains the Harikart e-commerce platform, which is divided into a frontend (React/Vite) and a backend (Node.js/Express).

## Project Structure
- `/frontend` - Contains the React user interface.
- `/backend` - Contains the Node.js API and MySQL database connection.
- `database_queries.sql` - SQL commands to initialize the required database tables.

---

## 🌐 Online Database Options
The backend currently uses MySQL (`mysql2` package). To deploy this project online, you cannot use MongoDB Atlas (which is only for NoSQL). Instead, use one of these free online MySQL hosting providers:

1. **[Aiven](https://aiven.io/) (Highly Recommended)** - Generous free tier for MySQL.
2. **[TiDB Serverless](https://www.pingcap.com/tidb-serverless/)** - Excellent free tier and MySQL-compatible.
3. **[Railway](https://railway.app/)** - Easy to spin up databases with a developer credit system.

### Database Setup
Once you create an online MySQL database, you will receive connection credentials. Run the contents of `database_queries.sql` in your new online database to set up your tables.

---

## 🚀 Deployment Procedure

### 1. Deploying the Backend (Render)
We recommend deploying the Node.js backend using [Render.com](https://render.com/).

1. Sign up on Render and create a **New Web Service**.
2. Connect this GitHub repository.
3. Set the following configurations:
   * **Root Directory:** `backend`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
4. Add the following **Environment Variables** (using the credentials from your online database):
   * `DB_HOST` = (e.g., your-db-host.aivencloud.com)
   * `DB_USER` = (e.g., avnadmin)
   * `DB_PASSWORD` = (your database password)
   * `DB_NAME` = (e.g., defaultdb)
   * `DB_PORT` = (e.g., 25060)
5. Click **Deploy**. Note the URL (e.g., `https://harikart-backend.onrender.com`).

### 2. Deploying the Frontend (Vercel)
We recommend deploying the React frontend using [Vercel.com](https://vercel.com/).

**Important:** Before deploying, ensure that any API calls in your frontend code (e.g., `http://localhost:5000`) are updated to point to your new Render backend URL!

1. Sign up on Vercel and click **Add New Project**.
2. Connect this GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Vercel will automatically detect Vite and set the build commands.
5. Click **Deploy**.

---

*Note: The backend `db.js` file has already been pre-configured to accept these Environment Variables during deployment.*
