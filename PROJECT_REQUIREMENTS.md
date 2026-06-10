# Manzel — Project Requirements

## Vision
A unified Real Estate Management / ERP platform for multi-building portfolios spanning Property Management, Facility Management, and HOA/Community Association Management.

## Core data principle (absolute priority)
The system is **unit-centric**. Every unit maintains:
- Ownership history (with transfer dates)
- Tenancy history (lease start/end per tenant)
- Management periods (managed vs not, with date ranges)

**At any selected date**, the system must resolve: owner, occupant, management status.

## Service lines

### Property Management
Leases (create/renew/terminate/escalate), tenant ledger, deposits, owner settlement & payouts, utilities recovery, multi-unit owners, rent invoicing & arrears, owner/tenant portals.

### Facility Management
Work orders, preventive maintenance, job costing (labour/materials/markup), inventory, technician dispatch & mobile access, billing to owners/HOA, job P&L.

### HOA Management (optional)
Per-HOA books, service charges (area/share apportionment), reserve vs operating funds, budgets, procurement, board packs, owner statements.

## Cross-cutting
- Multi-entity accounting (management co + facility entity + HOAs)
- RBAC per service line, full audit trail on financial actions
- VAT-compliant invoicing, integration placeholders (bank, payments, email, listings)
- Migration from legacy systems (Odoo, Tally) with historical preservation

## UI/UX requirements (from /template)
- **Aesthetic**: Professional, high-contrast, data-dense. Slate palette, blue primary, dark header with live KPIs, white bordered sidebar, mono status footer.
- **Typography**: Inter body, Space Grotesk headings.
- **Components**: shadcn/ui (Card, Table, Badge, Tabs). Lucide icons. Recharts for financial charts.
- **Motion**: Subtle Framer Motion page transitions — premium feel, not distracting.
- **Desktop-first**: Optimized for sidebar + dashboard + data grids at 1280px+. Collapsible nav and scrollable tables on mobile.

## Demo MVP (initial presentation)
- [x] Unit record with ownership/tenancy/management timelines
- [x] Lease creation + AI contract generation (mock OK)
- [x] Owner settlement preview
- [x] Work order + costing
- [x] HOA dashboard
- [x] Multi-entity switcher
- [x] Migration map screen
- [x] AI action buttons (mocked)

## Technical stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Folder structure: `/components/ui`, `/components/layout`, `/lib`, `/types`
- Strict typing, server-first data fetching, client components only where needed

## Non-goals (v1)
- Full payment gateway / bank integration (placeholders only)
- Production payroll engine (placeholders aligned to local labour rules)
