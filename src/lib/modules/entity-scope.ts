import { COMPANY_ID } from "@/lib/mock/navigation";

export const MODULE_ENTITIES = {
  property: COMPANY_ID,
  facility: COMPANY_ID,
} as const;

export type ModuleScope = keyof typeof MODULE_ENTITIES;

export function getModuleEntity(scope: ModuleScope): string {
  return MODULE_ENTITIES[scope];
}
