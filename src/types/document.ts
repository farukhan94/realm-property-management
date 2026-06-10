export type DocumentType =
  | "lease"
  | "title_deed"
  | "board_pack"
  | "policy"
  | "invoice"
  | "report";

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  unitId?: string;
  buildingId?: string;
  hoaId?: string;
  date: string;
  size: string;
  visibility: string[];
  entityId: string;
}
