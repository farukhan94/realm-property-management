# Manzel — API Contracts (Target)

Frontend services in `src/lib/api/services/` map to these REST endpoints when `NEXT_PUBLIC_USE_MOCK_API=false`.

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`)

Locale: Bahrain — BHD (3 decimals), 10% VAT, EWA utilities.

## Units & portfolio

| Method | Path | Description |
|--------|------|-------------|
| GET | `/buildings?entityId=` | List buildings |
| GET | `/units?buildingId=&entityId=` | List units |
| GET | `/units/:id` | Unit detail with histories |
| GET | `/units/:id/status?date=YYYY-MM-DD` | Owner, tenant, management at date |

## Property management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/leases?entityId=` | List leases |
| POST | `/leases` | Create lease |
| GET | `/leases/:id` | Lease detail |
| POST | `/leases/:id/renew` | Renew lease |
| POST | `/leases/:id/terminate` | Terminate lease |
| POST | `/leases/:id/generate-contract` | AI contract draft (Bahrain law) |
| GET | `/invoices?entityId=` | Tenant ledger |
| GET | `/invoices/arrears` | Arrears aging summary |
| POST | `/invoices/:id/payments` | Record receipt |
| GET | `/deposits` | Deposit ledger |
| GET | `/deposits?leaseId=` | Deposit by lease |
| GET | `/utilities/accounts?entityId=` | EWA accounts |
| GET | `/utilities/alerts` | High-usage cap alerts |
| GET | `/settlements?entityId=` | Owner settlements |
| GET | `/settlements/preview?feePercent=&entityId=` | Settlement preview |
| GET | `/settlements/consolidated?ownerId=` | Multi-unit owner statement |
| GET | `/payouts?entityId=` | Owner payout batches |

## Facility management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/work-orders?entityId=` | List work orders |
| POST | `/work-orders` | Create work order |
| GET | `/work-orders/:id` | Work order with costing |
| PATCH | `/work-orders/:id/status` | Update status |
| POST | `/work-orders/:id/cost-lines` | Add cost line |
| GET | `/inventory/parts` | Parts catalog |
| POST | `/inventory/consume` | Consume part on work order |
| GET | `/maintenance/schedules?entityId=` | PM schedules |
| GET | `/maintenance/dispatch?date=` | Technician dispatch slots |

## HOA

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hoa/service-charges?entityId=` | Service charge rows |
| GET | `/hoa/summary?entityId=` | Aggregated HOA KPIs |
| GET | `/hoa/apportionment?hoaId=` | Apportionment rules |
| GET | `/hoa/invoices?hoaId=` | Service charge invoices |
| GET | `/hoa/budgets?hoaId=` | Budget vs actual |
| GET | `/hoa/procurement?hoaId=` | Purchase orders |

## Reports & cross-cutting

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports/property-pnl` | Property P&L (BHD) |
| GET | `/reports/facility-pnl` | Facility P&L |
| GET | `/reports/hoa-summary` | HOA fund summary |
| GET | `/reports/occupancy` | Occupancy by building |
| GET | `/reports/arrears-aging` | Arrears buckets |
| GET | `/reports/financial-metrics` | Dashboard chart data |
| GET | `/documents?entityId=&unitId=&hoaId=` | Document library |
| GET | `/integrations` | Integration status cards |
| GET | `/audit?limit=` | Audit log |
| GET | `/audit/export` | CSV export |
| GET | `/dashboard/kpis` | Live header/dashboard KPIs |

## Portals

| Method | Path | Description |
|--------|------|-------------|
| GET | `/portal/owner` | Owner-filtered data |
| GET | `/portal/tenant` | Tenant-filtered data |
| GET | `/portal/technician` | Technician job list |

## Migration

| Method | Path | Description |
|--------|------|-------------|
| GET | `/migration/steps` | Migration map steps |
| POST | `/migration/suggest-mapping` | AI field mapping suggestion |
| POST | `/migration/import` | CSV validate & commit |

## Persons

| Method | Path | Description |
|--------|------|-------------|
| GET | `/persons?role=` | List owners, tenants, technicians |
| GET | `/persons/:id` | Person detail |

## Auth (future)

All mutating endpoints require `Authorization: Bearer <token>`. Entity scope enforced server-side.

## Response shapes

DTOs are defined in `src/lib/api/adapters/mock/` return types. HTTP adapters should return identical JSON shapes.
