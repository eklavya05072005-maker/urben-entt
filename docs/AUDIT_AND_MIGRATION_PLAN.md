# URBEN.ENTT — CODE AUDIT & SAFE SEPARATION MIGRATION PLAN

**Date:** October 2026  
**Project Path:** `C:\Users\gauta\OneDrive\Desktop\new project`  
**Architect:** Senior Full-Stack Architect  

---

## 1. Executive Summary & Current State Audit

### 1.1 Repository & Git Status
- **Current Directory:** `C:\Users\gauta\OneDrive\Desktop\new project`
- **Git Repository:** Initialized on `main` branch with 1 local root commit.
- **Git Remotes:** **None** (`git remote -v` returns empty). Zero connection to any external repository.
- **Deployment Status:** **Strictly Local**. Not deployed to Vercel, Supabase Cloud, or any hosting platform.

### 1.2 Inspection of Existing Assets & Media
- **Videos:**
  - `public/assets/videos/hero-promo.mov` (10.9 MB) — Verified upcoming event promotional reel used in Homepage Hero.
  - `public/assets/videos/past-event-reel.mov` (9.3 MB) — Verified club audio-visual footage used in Past Events reel.
- **Posters & Images:**
  - `public/assets/events/nocturne/main-poster.png` (1.85 MB) — Verified official Red Skull King NOCTURNE poster (31 Oct 2026, Mall of Asia, DJ KATZ, SortMyScene).
  - `public/assets/events/nocturne/dj-katz-poster.png` (2.31 MB) — Verified DJ KATZ featured artist poster.
  - `public/assets/events/nocturne/mystery-match.png` (1.72 MB) — Verified MISTERY MATCH cards poster ("Same Number. Different Souls.").
  - `public/assets/reference/bengaluru-schedule.png` (349 KB) — Verified SortMyScene Bengaluru historical event schedule reference.
- **Audit File:** [`ASSET_INVENTORY.md`](../ASSET_INVENTORY.md) cataloging all original sources from `C:\Users\gauta\Downloads`.

### 1.3 Audit of Current Frontend Code
- **Framework:** Next.js 15.5.28 (App Router), React 19, Tailwind CSS.
- **Pages:**
  - `/` — Homepage with full-screen video hero, brand philosophy, featured NOCTURNE card, services overview, past events, collaborators, and enquiry form.
  - `/events` — Searchable and filterable events calendar.
  - `/events/[slug]` — Dynamic event detail page (`/events/nocturne`) with high-resolution poster display, DJ KATZ profile, MISTERY MATCH breakdown, and SortMyScene ticketing.
  - `/past-events` — Archive with on-demand video lightbox modal and SortMyScene reference calendar.
  - `/services` — Detailed breakdown of Festivals & Concerts, Nightlife, Corporate Events, and Experiences.
  - `/about` — Brand story, 4 core pillars (Cinematic, Curated, Immersive, Reliable), and verified venue network.
  - `/contact` — Production enquiry form with field validations and honeypot spam protection.
  - `/event-admin` — Administrative interface with role-based dashboard.
- **Components:**
  - `Header.tsx`, `Footer.tsx`, `HeroVideo.tsx`, `HomeClientWrapper.tsx`, `FeaturedEventSection.tsx`, `BrandIntroSection.tsx`, `ServicesSection.tsx`, `PastEventsSection.tsx`, `CollaboratorsSection.tsx`, `SocialSection.tsx`, `VideoModal.tsx`, `EnquiryForm.tsx`, `EventsListClient.tsx`, `PastEventsClient.tsx`, `admin/AdminLogin.tsx`, `admin/AdminDashboard.tsx`, `admin/EventModal.tsx`.

### 1.4 Audit of Current Backend Code & Persistence
- **API Routes Currently in Next.js App Router:**
  - `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
  - `/api/admin/events`, `/api/admin/events/[id]`, `/api/admin/events/[id]/status`, `/api/admin/audit`
  - `/api/enquiries`
- **Database Status (CRITICAL DISCLOSURE):**
  - **The application currently uses a resilient local JSON file store** (`.data/urben_store.json`), **NOT live Supabase**.
  - PostgreSQL schema and RLS policies are prepared in `supabase/migrations/20261022000000_urben_initial_schema.sql`, but live Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are not yet configured in `.env.local`.
  - We do not claim Supabase is actively connected until live credentials are provided.
- **Authentication:**
  - Server-side HMAC token generation with cookie signing in `src/lib/auth.ts`.
  - Enforces role separation (`event_admin` vs `owner` vs `developer`).

---

## 2. Target Architecture & Separation Strategy

### 2.1 The Architectural Decision
To achieve true architectural clarity and prepare for independent frontend and backend scaling, the project will be structured as an organized monorepo:
1. `frontend/`: Dedicated Next.js 15 client application containing all pages, UI components, styling, and public media assets.
2. `backend/`: Dedicated Node.js + Express + TypeScript service containing all REST API routes, controllers, services, repositories (local file store + Supabase bridge), auth middleware, and validation.
3. `supabase/`: Centralized SQL migrations and schema documentation.
4. `docs/`: Technical guides, audit notes, and deployment manuals.
5. Root Monorepo orchestration: Root `package.json` with npm workspaces (`"workspaces": ["frontend", "backend"]`) enabling single-command startup (`npm run dev`) or independent execution (`npm run dev:frontend`, `npm run dev:backend`).

---

## 3. File-by-File Migration Plan

### 3.1 Files Moving to `frontend/`
| Source File | Destination | Action / Changes |
|---|---|---|
| `public/` (all assets) | `frontend/public/` | Preserved intact. Retains all videos and event posters. |
| `src/app/` (all pages & styling) | `frontend/src/app/` | Moved to frontend. Remove internal `/api` folder once backend is connected. |
| `src/components/` (all UI components) | `frontend/src/components/` | Moved to frontend. Preserved intact. |
| `src/types/index.ts` | `frontend/src/types/index.ts` | Reused for frontend typing and API contracts. |
| `src/lib/utils.ts` | `frontend/src/lib/utils.ts` | Moved to frontend (styling helpers). |
| `tailwind.config.ts` | `frontend/tailwind.config.ts` | Moved to frontend. |
| `postcss.config.mjs` | `frontend/postcss.config.mjs` | Moved to frontend. |
| `next.config.ts` | `frontend/next.config.ts` | Moved to frontend. Added API rewrite proxy to backend (`http://localhost:5000`). |
| `tsconfig.json` | `frontend/tsconfig.json` | Adapted for frontend directory paths. |

### 3.2 Files Moving to / Formed in `backend/`
| Source Concept / File | Destination | Responsibility |
|---|---|---|
| `src/lib/store.ts` | `backend/src/repositories/eventRepository.ts` & `enquiryRepository.ts` | Persistent event storage, status state machine, query filters. |
| `src/lib/auth.ts` | `backend/src/middleware/authMiddleware.ts` & `services/authService.ts` | HMAC signing, password hashing, role-based route guard. |
| `src/lib/validations.ts` | `backend/src/validation/enquiryValidation.ts` | Form input validation schema. |
| `src/data/seedData.ts` | `backend/src/data/seedData.ts` | Verified seed dataset for NOCTURNE and partners. |
| `src/types/index.ts` | `backend/src/types/index.ts` | Shared domain interfaces and models. |
| `src/app/api/auth/*` | `backend/src/controllers/authController.ts` & `routes/authRoutes.ts` | Express authentication endpoints. |
| `src/app/api/admin/*` | `backend/src/controllers/eventController.ts` & `routes/eventRoutes.ts` | Express event workflow and administration endpoints. |
| `src/app/api/enquiries/*` | `backend/src/controllers/enquiryController.ts` & `routes/enquiryRoutes.ts` | Express client enquiry endpoints. |
| New server entry point | `backend/src/server.ts` | Express server bootstrap on port 5000 with CORS and cookie-parser. |
| `src/tests/*` | `backend/tests/` | Unit and integration test suite. |

### 3.3 Root Orchestration & Shared Files
- `package.json` (Root): Defines npm workspaces, concurrent run scripts, and global lint/build commands.
- `package-lock.json`: Preserved and updated for workspaces.
- `.gitignore`: Updated to cover root, frontend, and backend build artifacts (`frontend/.next/`, `backend/dist/`, `.env.local`).
- `.env.example`: Updated with clear frontend and backend environment variables.
- `README.md`: Updated with full instructions for both frontend and backend services.

---

## 4. Verification Checkpoints

1. **Backend Verification:**
   - Compile backend TypeScript (`npx tsc --noEmit` in `backend/`).
   - Run automated unit tests in `backend/`.
   - Verify Express API responds on `http://localhost:5000/api/health`.
   - Verify protected endpoints reject unauthenticated requests with HTTP 401.
2. **Frontend Verification:**
   - Compile frontend TypeScript (`npx tsc --noEmit` in `frontend/`).
   - Run production Next.js build (`npm run build` in `frontend/`).
   - Verify Next.js routes proxy or communicate with Express API seamlessly.
3. **No File Loss Guarantee:** Original project code is safely structured and verified before any legacy artifacts are cleaned.
