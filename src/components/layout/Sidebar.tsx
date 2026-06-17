"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { getVisibleSections, PORTAL_LINKS } from "@/lib/mock/navigation";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/hoa") return pathname === "/hoa";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const sections = getVisibleSections(role);

  return (
    <aside className="hidden h-full w-sidebar shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-100 bg-slate-50 p-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Navigation
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-2 text-sm">
        {PORTAL_LINKS[role] && (
          <Link
            href={PORTAL_LINKS[role]}
            className={cn(
              "flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary"
            )}
          >
            My portal
          </Link>
        )}
        {sections.map((section) => (
          <div key={section.id}>
            <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/5 font-semibold text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-100 p-3">
        <div className="mb-4 flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-slate-200 text-xs font-bold text-slate-600">
            AS
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">Alex Sterling</span>
            <span className="text-[10px] text-slate-500">{role}</span>
          </div>
        </div>
        {role !== "Tenant" && role !== "Providers / Suppliers" && role !== "Property Portal" && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 rounded bg-slate-100 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Plus className="h-3 w-3" /> Add Property
          </button>
        )}
      </div>
    </aside>
  );
}
