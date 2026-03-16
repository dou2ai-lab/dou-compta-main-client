# Dou Compta — Web Client

Next.js frontend for **Dou Expense & Audit AI**: expense management, receipt upload, and AI-powered extraction (OCR + document classification + field extraction).

**Related:** Backend and Docker setup live in the **dou-compta-main-server** repository (auth, expense API, file service).

## Prerequisites

- **Node.js** 18+ and npm
- Backend services running:
  - **Expense API** — `http://localhost:8002`
  - **File service** (upload + receipt extract) — `http://localhost:8005`

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy the example env and set your API URLs:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   | Variable | Description | Default |
   |----------|-------------|---------|
   | `NEXT_PUBLIC_EXPENSE_API_URL` | Expense service base URL | `http://localhost:8002` |
   | `NEXT_PUBLIC_FILE_API_URL` | File service (upload + extract) | `http://localhost:8005` |
   | `LIBRETRANSLATE_API_URL` | Optional: LibreTranslate for FR/EN | — |
   | `LIBRETRANSLATE_API_KEY` | Optional: API key if required | — |

## Run

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Receipt flow

- **New Expense** — Upload a receipt (image or PDF). The app calls the file service **extract** endpoint; if data is returned (supplier, amount, date), the form is pre-filled. Otherwise you can enter details manually or rely on background extraction when using upload-first flows.
- **File service** must be up and reachable at `NEXT_PUBLIC_FILE_API_URL` (e.g. `http://localhost:8005`). Check `http://localhost:8005/health` if upload or extract fails.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check |
| `npm run test` | Run tests |

## Tech stack

- **Next.js 16** (App Router), **React 18**, **TypeScript**
- **SWR** for data fetching, **React Hook Form** + **Zod** for forms
- **Axios** for API calls; proxy routes in `app/api/` forward to backend services

## Project structure

- `app/` — Next.js App Router (pages, API routes)
- `app/api/file/` — Proxies to file service (upload, extract)
- `app/expenses/new/` — New expense page with receipt upload and extract
- `lib/` — API client (`api.ts`), auth, utils
- `types/` — TypeScript types (e.g. receipt extract response)
