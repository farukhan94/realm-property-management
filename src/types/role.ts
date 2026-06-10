export const ROLES = ["Admin", "Property Manager", "Owner", "Tenant", "Technician"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_PERSON_MAP: Record<Role, string | null> = {
  Admin: null,
  "Property Manager": null,
  Owner: "own-2",
  Tenant: "ten-1",
  Technician: "tech-1",
};
