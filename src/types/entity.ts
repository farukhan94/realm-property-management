export type EntityType = "management" | "facility" | "hoa";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  code: string;
}
