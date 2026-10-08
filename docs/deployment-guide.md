# Deployment Guide

This project is built for seamless deployment on modern PaaS providers.

## 1. Database (Supabase)
- Go to [Supabase](https://supabase.com) and create a new project.
- Open the **SQL Editor** and paste the contents of `database/schema.sql`.
- Execute the schema to provision the tables.
- Go to **Project Settings > API** to locate your Project URL and `service_role` key.

## 2. Backend (Render)
- Go to [Render](https://render.com) and create a new **Web Service**.
- Connect your GitHub repository.
- Render will automatically detect the `render.yaml` configuration in the `server` directory.
- Alternatively, manually configure:
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
- Under **Environment Variables**, add:
  - `SUPABASE_URL`: (Your Supabase Project URL)
  - `SUPABASE_SERVICE_ROLE_KEY`: (Your `service_role` secret key)
  - `FRONTEND_URL`: (The URL where your frontend will be hosted, e.g., `https://my-app.vercel.app`)

## 3. Frontend (Vercel)
- Go to [Vercel](https://vercel.com) and import your GitHub repository.
- Edit the **Root Directory** to point to `client`.
- In the **Environment Variables** section, add:
  - `VITE_API_BASE_URL`: (Your Render backend URL, e.g., `https://micro-url-backend.onrender.com`)
- Deploy the application. Vercel automatically detects Vite and builds the project using `npm run build`.

## Security Note
Never commit your `SUPABASE_SERVICE_ROLE_KEY` or expose it in the frontend. It should strictly reside in the backend's environment variables.
