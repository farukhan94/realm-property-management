"use client";

import { useRole } from "@/lib/role-context";
import { SaasProviderDashboard } from "./SaasProviderDashboard";
import { SaasSuperAdminDashboard } from "./SaasSuperAdminDashboard";
import { BuildingOwnerDashboard } from "./BuildingOwnerDashboard";
import { FlatOwnerDashboard } from "./FlatOwnerDashboard";
import { TenantDashboard } from "./TenantDashboard";
import { SupplierDashboard } from "./SupplierDashboard";
import { MaintenanceManagerDashboard } from "./MaintenanceManagerDashboard";
import { PropertyPortalDashboard } from "./PropertyPortalDashboard";
import { AuditorDashboard } from "./AuditorDashboard";
import { AccountingFirmDashboard } from "./AccountingFirmDashboard";

export function DashboardView() {
  const { role } = useRole();

  switch (role) {
    case "SaaS Provider":
      return <SaasProviderDashboard />;
    case "SaaS Super Admin":
      return <SaasSuperAdminDashboard />;
    case "Building Owner":
      return <BuildingOwnerDashboard />;
    case "Flat Owner":
      return <FlatOwnerDashboard />;
    case "Tenant":
      return <TenantDashboard />;
    case "Providers / Suppliers":
      return <SupplierDashboard />;
    case "Maintenance Manager":
      return <MaintenanceManagerDashboard />;
    case "Property Portal":
      return <PropertyPortalDashboard />;
    case "Auditor":
      return <AuditorDashboard />;
    case "Accounting Firm":
      return <AccountingFirmDashboard />;
    default:
      return <SaasSuperAdminDashboard />;
  }
}
