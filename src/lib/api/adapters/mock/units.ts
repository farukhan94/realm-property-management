import { mockStore } from "@/lib/mock/store";
import { getPersonName } from "@/lib/mock/seeds";
import type { Building } from "@/types/building";
import type { Unit } from "@/types/unit";
import { getUnitStatusAtDate } from "@/lib/unit-status";

export interface UnitWithBuilding extends Unit {
  buildingName: string;
  buildingLocation: string;
}

export interface UnitDetail extends UnitWithBuilding {
  ownerName: string | null;
  tenantName: string | null;
}

function enrichUnit(unit: Unit): UnitWithBuilding {
  const building = mockStore.buildings.find((b) => b.id === unit.buildingId);
  return {
    ...unit,
    buildingName: building?.name ?? unit.buildingId,
    buildingLocation: building?.location ?? "",
  };
}

export const mockUnitsAdapter = {
  listBuildings(entityId?: string): Building[] {
    if (!entityId) return mockStore.buildings;
    return mockStore.buildings.filter((b) => b.managingEntityId === entityId || b.hoaId === entityId);
  },

  listUnits(buildingId?: string, entityId?: string): UnitWithBuilding[] {
    let units = mockStore.units.map(enrichUnit);
    if (buildingId) units = units.filter((u) => u.buildingId === buildingId);
    if (entityId) {
      const buildingIds = new Set(
        mockStore.buildings.filter((b) => b.managingEntityId === entityId || b.hoaId === entityId).map((b) => b.id)
      );
      units = units.filter((u) => buildingIds.has(u.buildingId));
    }
    return units;
  },

  getUnit(id: string): UnitDetail | null {
    const unit = mockStore.units.find((u) => u.id === id);
    if (!unit) return null;
    const enriched = enrichUnit(unit);
    const status = getUnitStatusAtDate(unit, new Date().toISOString().slice(0, 10));
    return {
      ...enriched,
      ownerName: status.ownerId ? getPersonName(status.ownerId) : null,
      tenantName: status.tenantId ? getPersonName(status.tenantId) : null,
    };
  },

  getUnitStatusAtDate(unitId: string, date: string) {
    const unit = mockStore.units.find((u) => u.id === unitId);
    if (!unit) return null;
    const status = getUnitStatusAtDate(unit, date);
    return {
      ...status,
      ownerName: status.ownerId ? getPersonName(status.ownerId) : null,
      tenantName: status.tenantId ? getPersonName(status.tenantId) : null,
    };
  },
};
