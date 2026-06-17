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
  Search,
  Users,
  BookOpen,
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

const ALL_OPS: Role[] = ["SaaS Super Admin", "Maintenance Manager"];
const SAAS_PROVIDER: Role[] = ["SaaS Provider"];
const ACCOUNTING: Role[] = ["Accounting Firm", "SaaS Super Admin"];
const AUDITOR_ROLES: Role[] = ["Auditor", "SaaS Super Admin"];

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "core",
    title: "Core Operations",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: [...ALL_OPS, ...SAAS_PROVIDER, "Building Owner", "Flat Owner", "Tenant", "Providers / Suppliers", "Property Portal", "Auditor", "Accounting Firm"] },
      { name: "Portfolio", href: "/portfolio", icon: Building, roles: ["SaaS Super Admin", "Building Owner"] },
      { name: "Companies", href: "/admin/companies", icon: Users, roles: ["SaaS Provider"] },
    ],
  },
  {
    id: "property",
    title: "Property Management",
    items: [
      { name: "Leases", href: "/property/leases", icon: CreditCard, roles: ["SaaS Super Admin"] },
      { name: "Invoices & Ledger", href: "/property/invoices", icon: Receipt, roles: ["SaaS Super Admin", "Accounting Firm"] },
      { name: "Owner Settlements", href: "/property/settlements", icon: Wallet, roles: ["SaaS Super Admin", "Building Owner", "Flat Owner"] },
      { name: "Utilities (EWA)", href: "/property/utilities", icon: Zap, roles: ["SaaS Super Admin"] },
      { name: "Owner Payouts", href: "/property/payouts", icon: Banknote, roles: ["SaaS Super Admin", "Accounting Firm"] },
      { name: "Search Listings", href: "/portal/listings", icon: Search, roles: ["Property Portal", "SaaS Super Admin"] },
    ],
  },
  {
    id: "facility",
    title: "Facility Management",
    items: [
      { name: "Work Orders", href: "/facility/work-orders", icon: Wrench, roles: ["SaaS Super Admin", "Maintenance Manager", "Providers / Suppliers"] },
      { name: "PM Schedules", href: "/facility/maintenance", icon: Calendar, roles: ["SaaS Super Admin", "Maintenance Manager"] },
      { name: "Dispatch", href: "/facility/dispatch", icon: ClipboardList, roles: ["SaaS Super Admin", "Maintenance Manager"] },
      { name: "Inventory", href: "/facility/inventory", icon: Package, roles: ["SaaS Super Admin", "Maintenance Manager"] },
      { name: "GuestBook", href: "/facility/guestbook", icon: BookOpen, roles: ["SaaS Super Admin", "Maintenance Manager"] },
      { name: "Reservations", href: "/facility/reservations", icon: Calendar, roles: ["SaaS Super Admin", "Maintenance Manager", "Tenant", "Flat Owner", "Building Owner"] },
    ],
  },
  {
    id: "hoa",
    title: "HOA Management",
    items: [
      { name: "HOA Overview", href: "/hoa", icon: Building2, roles: ["SaaS Super Admin"] },
      { name: "Service Charges", href: "/hoa/charges", icon: Receipt, roles: ["SaaS Super Admin", "Accounting Firm"] },
      { name: "Budgets", href: "/hoa/budgets", icon: PieChart, roles: ["SaaS Super Admin", "Accounting Firm"] },
      { name: "Procurement", href: "/hoa/procurement", icon: ShoppingCart, roles: ["SaaS Super Admin"] },
      { name: "Owner Statements", href: "/hoa/statements", icon: FileText, roles: ["SaaS Super Admin", "Accounting Firm", "Building Owner", "Flat Owner"] },
    ],
  },
  {
    id: "admin",
    title: "Admin & Tools",
    items: [
      { name: "Reports", href: "/reports", icon: FileBarChart, roles: ["SaaS Super Admin", "Accounting Firm"] },
      { name: "Documents", href: "/documents", icon: FolderOpen, roles: ["SaaS Super Admin", "Tenant", "Building Owner", "Flat Owner"] },
      { name: "Migration", href: "/migration", icon: ArrowLeftRight, roles: ["SaaS Super Admin"] },
      { name: "Integrations", href: "/integrations", icon: Blocks, roles: ["SaaS Super Admin", "SaaS Provider"] },
      { name: "Audit Log", href: "/admin/audit", icon: Shield, roles: [...AUDITOR_ROLES] },
    ],
  },
];

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
  name: "MANZIL Bahrain W.L.L.",
  type: "management" as const,
  code: "MBW",
  country: "BH" as const,
};

export const ENTITIES = [COMPANY];

export const PORTAL_LINKS: Partial<Record<Role, string>> = {
  "Building Owner": "/portal/owner",
  "Flat Owner": "/portal/owner",
  Tenant: "/portal/tenant",
  "Providers / Suppliers": "/portal/supplier",
};
