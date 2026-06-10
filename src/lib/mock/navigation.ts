import {
  Building,
  Building2,
  CreditCard,
  FileBarChart,
  FolderOpen,
  LayoutDashboard,
  Blocks,
  Wrench,
  ArrowLeftRight,
  Shield,
  Receipt,
  Wallet,
  Zap,
  Banknote,
  Calendar,
  Package,
  ClipboardList,
  PieChart,
  ShoppingCart,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/role";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "core",
    title: "Core Operations",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["Admin", "Property Manager", "Tenant", "Technician", "Owner"] },
      { name: "Portfolio", href: "/portfolio", icon: Building, roles: ["Admin", "Property Manager"] },
    ],
  },
  {
    id: "property",
    title: "Property Management",
    items: [
      { name: "Leases", href: "/property/leases", icon: CreditCard, roles: ["Admin", "Property Manager"] },
      { name: "Invoices & Ledger", href: "/property/invoices", icon: Receipt, roles: ["Admin", "Property Manager"] },
      { name: "Owner Settlements", href: "/property/settlements", icon: Wallet, roles: ["Admin", "Property Manager"] },
      { name: "Utilities (EWA)", href: "/property/utilities", icon: Zap, roles: ["Admin", "Property Manager"] },
      { name: "Owner Payouts", href: "/property/payouts", icon: Banknote, roles: ["Admin", "Property Manager"] },
    ],
  },
  {
    id: "facility",
    title: "Facility Management",
    items: [
      { name: "Work Orders", href: "/facility/work-orders", icon: Wrench, roles: ["Admin", "Property Manager", "Technician"] },
      { name: "PM Schedules", href: "/facility/maintenance", icon: Calendar, roles: ["Admin", "Property Manager"] },
      { name: "Dispatch", href: "/facility/dispatch", icon: ClipboardList, roles: ["Admin", "Property Manager"] },
      { name: "Inventory", href: "/facility/inventory", icon: Package, roles: ["Admin", "Property Manager"] },
    ],
  },
  {
    id: "hoa",
    title: "HOA Management",
    items: [
      { name: "HOA Overview", href: "/hoa", icon: Building2, roles: ["Admin", "Property Manager"] },
      { name: "Service Charges", href: "/hoa/charges", icon: Receipt, roles: ["Admin", "Property Manager"] },
      { name: "Budgets", href: "/hoa/budgets", icon: PieChart, roles: ["Admin", "Property Manager"] },
      { name: "Procurement", href: "/hoa/procurement", icon: ShoppingCart, roles: ["Admin", "Property Manager"] },
      { name: "Owner Statements", href: "/hoa/statements", icon: FileText, roles: ["Admin", "Property Manager"] },
    ],
  },
  {
    id: "admin",
    title: "Admin & Tools",
    items: [
      { name: "Reports", href: "/reports", icon: FileBarChart, roles: ["Admin", "Property Manager"] },
      { name: "Documents", href: "/documents", icon: FolderOpen, roles: ["Admin", "Property Manager", "Tenant", "Owner"] },
      { name: "Migration", href: "/migration", icon: ArrowLeftRight, roles: ["Admin"] },
      { name: "Integrations", href: "/integrations", icon: Blocks, roles: ["Admin"] },
      { name: "Audit Log", href: "/admin/audit", icon: Shield, roles: ["Admin"] },
    ],
  },
];

/** Flat list for backward compatibility */
export const NAVIGATION: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

export function getVisibleSections(role: Role): NavSection[] {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.includes(role)),
  })).filter((section) => section.items.length > 0);
}

export const COMPANY_ID = "ent-mgmt";

export const COMPANY = {
  id: COMPANY_ID,
  name: "Manzel Bahrain W.L.L.",
  type: "management" as const,
  code: "MBW",
  country: "BH" as const,
};

/** Single operating company for demo / client presentation */
export const ENTITIES = [COMPANY];

export const PORTAL_LINKS: Record<string, string> = {
  Owner: "/portal/owner",
  Tenant: "/portal/tenant",
  Technician: "/portal/technician",
};
