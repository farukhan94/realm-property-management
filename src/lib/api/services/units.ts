import { apiConfig } from "@/lib/api/config";
import {
  mockUnitsAdapter,
  type UnitDetail,
  type UnitWithBuilding,
} from "@/lib/api/adapters/mock/units";
import { notImplemented } from "@/lib/api/adapters/http/stub";
import type { Building } from "@/types/building";

export const unitsService = {
  listBuildings: (entityId?: string): Promise<Building[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockUnitsAdapter.listBuildings(entityId))
      : notImplemented(),

  listUnits: (
    buildingId?: string,
    entityId?: string
  ): Promise<UnitWithBuilding[]> =>
    apiConfig.useMock
      ? Promise.resolve(mockUnitsAdapter.listUnits(buildingId, entityId))
      : notImplemented(),

  getUnit: (id: string): Promise<UnitDetail | null> =>
    apiConfig.useMock
      ? Promise.resolve(mockUnitsAdapter.getUnit(id))
      : notImplemented(),

  getUnitStatusAtDate: (
    unitId: string,
    date: string
  ): Promise<ReturnType<typeof mockUnitsAdapter.getUnitStatusAtDate>> =>
    apiConfig.useMock
      ? Promise.resolve(mockUnitsAdapter.getUnitStatusAtDate(unitId, date))
      : notImplemented(),
};
