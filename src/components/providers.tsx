"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { EntityProvider } from "@/lib/entity-context";
import { RoleProvider } from "@/lib/role-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <RoleProvider>
        <EntityProvider>{children}</EntityProvider>
      </RoleProvider>
    </TooltipProvider>
  );
}
