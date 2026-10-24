# URBEN-ENTT-Frontend

> **WE CREATE MOMENTS THAT MATTER.**  
> Public Website, Event Showcase & Administrative Client for URBEN.ENTT.  
> Built with Next.js 15 (App Router), React 19, Tailwind CSS, and Framer Motion. Ready for deployment on Vercel.

---

## 1. Overview & Architecture

`URBEN-ENTT-Frontend` is an independent, production-grade Next.js 15 client providing:
- High-impact brand experience with responsive background video reels and dark cinematic aesthetics (`#080808` background, `#D92332` brand red).
- Full events discovery calendar, detailed event showcases (NOCTURNE at Mall of Asia, MISTERY MATCH cards, SortMyScene ticketing), past event archives with on-demand video lightboxes, service breakdowns, and company background.
- Validated client booking and enquiry submission form.
- Protected event administration dashboard with role-based access control (`owner`, `event_admin`, `developer`).
- Unified API client configured to communicate with the standalone `URBEN-ENTT-Backend` over HTTPS.

### Repository Layout

```text
URBEN-ENTT-Frontend/
├── public/
│   └── assets/                    # Preserved brand videos & high-resolution posters
│       ├── branding/              # Brand logos & icons
│       ├── events/nocturne/       # NOCTURNE official posters & MISTERY MATCH key visuals
│       ├── reference/             # Bengaluru SortMyScene electronic schedule reference
│       └── videos/                # hero-promo.mov and past-event-reel.mov
├── src/
│   ├── app/                       # Next.js 15 App Router pages & layouts
│   │   ├── about/page.tsx         # Brand narrative & Pillars
│   │   ├── contact/page.tsx       # Contact page with EnquiryForm
│   │   ├── event-admin/page.tsx   # Protected admin portal gateway
│   │   ├── events/page.tsx        # Events listing & search
│   │   ├── events/[slug]/page.tsx # Dynamic event page (e.g. /events/nocturne)
│   │   ├── past-events/page.tsx   # Past event reels & video modal
│   │   ├── services/page.tsx      # Production services catalog
│   │   ├── layout.tsx             # Root layout with fonts, SEO & metadata
│   │   ├── page.tsx               # Homepage with video hero & sections
│   │   ├── globals.css            # Custom CSS & design system tokens
│   │   ├── robots.ts              # SEO robots.txt configuration
│   │   └── sitemap.ts             # Dynamic XML sitemap generator
│   ├── components/                # Modular UI components
│   │   ├── admin/                 # AdminLogin, AdminDashboard, EventModal
│   │   ├── EnquiryForm.tsx        # Client enquiry submission with validation
│   │   ├── FeaturedEventSection.tsx # NOCTURNE headline feature card
│   │   ├── HeroVideo.tsx          # Full-screen responsive video hero
│   │   ├── VideoModal.tsx         # Lightbox video modal for archives
│   │   ├── Header.tsx & Footer.tsx
│   │   └── ...                    # Section components
│   ├── lib/                       # Utility helpers & API client
│   │   ├── api.ts                 # Unified typed API client
│   │   └── utils.ts               # Tailwind merge & className utility
│   └── types/                     # Canonical domain TypeScript models
│       └── index.ts
├── .github/workflows/             # GitHub Actions CI workflow
│   └── ci.yml
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git exclusions
├── next.config.ts                 # Next.js configuration & rewrite proxy
├── package.json                   # Package scripts & dependencies
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS tokens & color palette
└── tsconfig.json                  # TypeScript compiler configuration
```

---

## 2. API Communication & Backend Integration

The frontend uses a single, centralized API client in [`src/lib/api.ts`](src/lib/api.ts) to interface with `URBEN-ENTT-Backend`.

- **Base URL Resolution**: Automatically normalizes `NEXT_PUBLIC_API_URL` (ensuring no trailing slashes or duplicate `/api` segments).
- **Environment Detection**:
  - In local development: Defaults to `http://localhost:5000/api`.
  - In production on Vercel: Targets your deployed Render backend (e.g. `https://urben-entt-backend.onrender.com/api`) over secure HTTPS.
- **Authentication**: Supports both cross-origin HTTP-only cookies (`credentials: 'include'`) and bearer tokens stored securely in `sessionStorage` for cross-origin deployments.

---

## 3. Environment Variables Reference

Create a `.env.local` file in the root of `frontend/`:

| Variable | Required | Default (Local) | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Canonical public URL of this website (used for SEO metadata and OpenGraph) |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000` | Public HTTPS URL of the deployed `URBEN-ENTT-Backend` Express API |
| `BACKEND_URL` | Optional | `http://localhost:5000` | Server-to-server backend URL used by Next.js SSR / Server Components |

---

## 4. Local Development

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
# Start Next.js development server on port 3000
npm run dev

# Run TypeScript type check
npm run typecheck

# Run ESLint validation
npm run lint

# Compile production bundle
npm run build

# Start production server locally
npm start
```

---

## 5. Deployment Guide: Vercel

### Prerequisites
- A Vercel account ([vercel.com](https://vercel.com)).
- The `URBEN-ENTT-Frontend` repository pushed to GitHub.
- Your `URBEN-ENTT-Backend` deployed on Render (e.g. `https://urben-entt-backend.onrender.com`).

### Step-by-Step Deployment on Vercel

1. Log in to Vercel and click **Add New...** -> **Project**.
2. Import your **`URBEN-ENTT-Frontend`** GitHub repository.
3. In the project configuration:
   - **Framework Preset**: `Next.js` (automatically selected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm ci`
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-project.vercel.app` (or your custom domain)
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g., `https://urben-entt-backend.onrender.com`)
   - `BACKEND_URL`: Your deployed Render backend URL (e.g., `https://urben-entt-backend.onrender.com`)
5. Click **Deploy**.
6. Once deployed, copy your production Vercel URL and add it to `FRONTEND_ORIGIN` in your Render backend settings so CORS permits requests.
