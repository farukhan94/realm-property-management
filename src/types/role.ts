export const ROLES = [
  "SaaS Provider",
  "SaaS Super Admin",
  "Building Owner",
  "Flat Owner",
  "Tenant",
  "Providers / Suppliers",
  "Maintenance Manager",
  "Property Portal",
  "Auditor",
  "Accounting Firm",
] as const;

export type Role = (typeof ROLES)[number];

/** Maps demo roles to mock person / entity IDs where applicable */
export const ROLE_PERSON_MAP: Record<Role, string | null> = {
  "SaaS Provider": null,
  "SaaS Super Admin": null,
  "Building Owner": "own-1",
  "Flat Owner": "own-2",
  Tenant: "ten-1",
  "Providers / Suppliers": "sup-1",
  "Maintenance Manager": "mm-1",
  "Property Portal": null,
  Auditor: null,
  "Accounting Firm": null,
};

/** Roles that use the full ERP sidebar (property / facility / HOA ops) */
export const OPS_ROLES: Role[] = ["SaaS Super Admin", "Maintenance Manager"];

/** Roles with dedicated portal routes */
export const PORTAL_ROLES: Role[] = [
  "Building Owner",
  "Flat Owner",
  "Tenant",
  "Providers / Suppliers",
];

export function isOpsRole(role: Role): boolean {
  return OPS_ROLES.includes(role);
}

export function isPortalRole(role: Role): boolean {
  return PORTAL_ROLES.includes(role);
}

export function isLimitedNavRole(role: Role): boolean {
  return ["Tenant", "Providers / Suppliers", "Property Portal", "Auditor", "Accounting Firm"].includes(role);
}
