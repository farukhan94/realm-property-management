# Realm — Real Estate Management / ERP

Multi-building property, facility, and HOA management platform. Desktop-first dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | External backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_USE_MOCK_API` | Use mock adapters instead of HTTP | `true` |

## Modules

- **Portfolio** — Buildings, units, ownership/tenancy/management timelines
- **Property** — Leases, owner settlements, tenant ledger (demo)
- **Facility** — Work orders, job costing
- **HOA** — Service charges, segregated funds
- **Migration** — Legacy system import map

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Architecture

UI calls typed services in `src/lib/api/services/`. Mock adapters (`NEXT_PUBLIC_USE_MOCK_API=true`) use seed data in `src/lib/mock/`. HTTP adapters target the external API when ready.

See [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) and [docs/api-contracts.md](./docs/api-contracts.md).
