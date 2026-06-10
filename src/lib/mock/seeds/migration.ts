export const MIGRATION_STEPS = [
  { source: "Odoo", target: "Buildings & Units", status: "Mapped" as const, records: "12 buildings, 159 units (Bahrain portfolio)" },
  { source: "Odoo", target: "Leases & Tenants", status: "In Progress" as const, records: "85 leases, CPR/passport/LMRA fields" },
  { source: "Tally", target: "HOA Ledgers", status: "Pending" as const, records: "2 HOAs, 8 years history" },
  { source: "Legacy FM", target: "Work Orders", status: "Mapped" as const, records: "2,100 historical jobs (2019–2025)" },
  { source: "EWA Export", target: "Utility Accounts", status: "In Progress" as const, records: "312 EWA account mappings" },
  { source: "NBB CSV", target: "Owner Payouts", status: "Mapped" as const, records: "6 months payout history, IBAN validation" },
  { source: "BenefitPay API", target: "Rent Collections", status: "In Progress" as const, records: "1,240 tenant payment records" },
  { source: "Sijilat", target: "Owner CR Verification", status: "Mapped" as const, records: "20 owner CR numbers validated" },
  { source: "LMRA Portal", target: "Tenant Permits", status: "In Progress" as const, records: "48 expat tenant LMRA permits" },
  { source: "SLRB", target: "Lease Registrations", status: "Pending" as const, records: "Historical tenancy contracts (2018–2025)" },
  { source: "PropertyFinder", target: "Vacancy Listings", status: "Mapped" as const, records: "14 active vacancy postings" },
  { source: "Otis Bahrain", target: "Elevator Assets", status: "Mapped" as const, records: "28 elevator assets across 6 buildings" },
];
