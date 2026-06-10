export type PersonRole = "owner" | "tenant" | "technician" | "board_member";

export interface Person {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  role: PersonRole;
  cpr?: string;
  passportNo?: string;
  lmraPermit?: string;
  lmraExpiry?: string;
  ownedUnitIds?: string[];
  nationality?: "bahraini" | "expat";
}
