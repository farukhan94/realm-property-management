"use client";

import { createContext, useContext, type ReactNode } from "react";
import { COMPANY, COMPANY_ID } from "@/lib/mock/navigation";

interface EntityContextType {
  entityId: string;
  entityName: string;
  entityCode: string;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
  return (
    <EntityContext.Provider
      value={{
        entityId: COMPANY_ID,
        entityName: COMPANY.name,
        entityCode: COMPANY.code,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
}

export function useEntity() {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error("useEntity must be used within EntityProvider");
  }
  return context;
}
