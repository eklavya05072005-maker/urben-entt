# URBEN.ENTT — Architecture & Independent Two-Repository Suite

> **WE CREATE MOMENTS THAT MATTER.**  
> Official Event Management, Staging, and Immersive Nightlife Platform for URBEN.ENTT.

---

## 1. Final Architecture: Two Independent Repositories

This project is architected for export into **TWO SEPARATE, INDEPENDENT GitHub repositories**:

1. **`URBEN-ENTT-Frontend`** (located locally in `frontend/`):
   - **Stack**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons.
   - **Target Hosting**: **Vercel** (or any modern Next.js hosting platform).
   - **Key Features**: High-impact brand experience, full-screen background video reels (`hero-promo.mov`, `past-event-reel.mov`), NOCTURNE key visual posters, MISTERY MATCH cards, SortMyScene ticketing links, validated booking enquiry form, protected admin portal, and centralized API client.
   - **Standalone Assets**: Dedicated `package.json`, dedicated `package-lock.json`, `.gitignore`, `.env.example`, `README.md`, and `.github/workflows/ci.yml`.

2. **`URBEN-ENTT-Backend`** (located locally in `backend/`):
   - **Stack**: Node.js, Express 5, TypeScript.
   - **Target Hosting**: **Render** (as a Web Service).
   - **Key Features**: REST API (`/api/health`, `/api/auth/*`, `/api/events/*`, `/api/admin/*`, `/api/enquiries/*`), cryptographic HMAC-SHA256 session management, server-side RBAC (`owner`, `event_admin`, `developer`), resilient file-based data store with seed fallback, and PostgreSQL / Supabase migration schema.
   - **Standalone Assets**: Dedicated `package.json`, dedicated `package-lock.json`, `.gitignore`, `.env.example`, `README.md`, `.github/workflows/ci.yml`, `render.yaml`, and `migrations/`.

---

## 2. Local Workspace Structure

```text
urben.ett/new project/
├── frontend/                       # URBEN-ENTT-Frontend repository root
│   ├── public/assets/              # Videos, posters, and brand visuals
│   ├── src/                        # Next.js app, components, lib, types
│   ├── .github/workflows/ci.yml    # Frontend CI workflow (Lint, Typecheck, Build)
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend git exclusions
│   ├── next.config.ts              # Next.js config with dynamic backend host
│   ├── package-lock.json           # Dedicated reproducible lockfile
│   ├── package.json                # Frontend package configuration
│   └── README.md                   # Dedicated frontend documentation
│
├── backend/                        # URBEN-ENTT-Backend repository root
│   ├── src/                        # Express server, routes, controllers, repositories
│   ├── tests/                      # Automated unit and validation test suite
│   ├── migrations/                 # PostgreSQL / Supabase schema & RLS policies
│   ├── .github/workflows/ci.yml    # Backend CI workflow (Test, Typecheck, Build)
│   ├── .data/                      # Resilient local JSON data store
│   ├── .env.example                # Backend environment template
│   ├── .gitignore                  # Backend git exclusions
│   ├── package-lock.json           # Dedicated reproducible lockfile
│   ├── package.json                # Backend package configuration
│   ├── render.yaml                 # Render Blueprint specification
│   └── README.md                   # Dedicated backend documentation
│
├── docs/                           # Architectural audit and migration records
├── supabase/                       # Workspace database references
├── .gitignore                      # Workspace-level exclusions
├── .env.example                    # Workspace environment template
├── package.json                    # Workspace orchestrator
└── README.md                       # This file
```

---

## 3. How to Create and Push the Two GitHub Repositories

### Step 3.1: Create Two New Repositories on GitHub
1. Open your browser and go to [github.com/new](https://github.com/new).
2. Create repository 1: Name it **`URBEN-ENTT-Frontend`** (Public or Private). Do NOT initialize with README, .gitignore, or license.
3. Create repository 2: Name it **`URBEN-ENTT-Backend`** (Public or Private). Do NOT initialize with README, .gitignore, or license.

### Step 3.2: Push `URBEN-ENTT-Frontend`
Run the following commands in your terminal:

```bash
cd "c:\Users\gauta\Downloads\urben.ett\new project\frontend"
git init
git add .
git commit -m "feat: initial commit for URBEN-ENTT-Frontend"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/URBEN-ENTT-Frontend.git
git push -u origin main
```

### Step 3.3: Push `URBEN-ENTT-Backend`
Run the following commands in your terminal:

```bash
cd "c:\Users\gauta\Downloads\urben.ett\new project\backend"
git init
git add .
git commit -m "feat: initial commit for URBEN-ENTT-Backend"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/URBEN-ENTT-Backend.git
git push -u origin main
```

---

## 4. Render Backend Deployment

1. Log in to [render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your **`URBEN-ENTT-Backend`** repository.
3. Settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Environment Variables:
   - `NODE_ENV`: `production`
   - `FRONTEND_ORIGIN`: `https://your-frontend-project.vercel.app` (your Vercel URL)
   - `ADMIN_SESSION_SECRET`: A secure 32+ character random string
5. Click **Create Web Service**.
6. Render will assign you an HTTPS URL (e.g. `https://urben-entt-backend.onrender.com`).

---

## 5. Vercel Frontend Deployment

1. Log in to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Import your **`URBEN-ENTT-Frontend`** repository.
3. Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm ci`
4. Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-frontend-project.vercel.app`
   - `NEXT_PUBLIC_API_URL`: `https://urben-entt-backend.onrender.com` (your Render backend URL)
5. Click **Deploy**.

---

## 6. Local Development Commands

```bash
# Install root workspace dependencies
npm install

# Start Backend on port 5000
npm run dev:backend

# Start Frontend on port 3000
npm run dev:frontend

# Run Backend Automated Tests (6/6 passing)
npm test

# Run TypeScript Typecheck across both apps
npm run typecheck

# Build both applications for production
npm run build
```

---

## 7. Verification Results Summary

- **Frontend Typecheck**: Passed (0 TypeScript errors)
- **Frontend ESLint**: Passed (0 linting errors)
- **Frontend Production Build**: Passed (All 12 routes generated, SSG & dynamic routes compiled)
- **Backend Typecheck**: Passed (0 TypeScript errors)
- **Backend Test Suite**: Passed (6/6 tests passing)
- **Backend Production Build**: Passed (Compiled to `backend/dist`)
- **Backend Health Check**: Verified (`/api/health` returns status `ok`)
- **Authentication & Authorization**: Verified (`/api/auth/login` issues HMAC JWT token; protected admin routes verify token successfully)
- **CORS & Origin Handling**: Dynamic parsing with credentialed HTTPS support
