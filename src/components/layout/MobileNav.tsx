"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { getVisibleSections, PORTAL_LINKS } from "@/lib/mock/navigation";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/hoa") return pathname === "/hoa";
  return pathname.startsWith(href);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useRole();
  const sections = getVisibleSections(role);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-slate-800 hover:text-white lg:hidden"
          />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-slate-100 bg-slate-50 p-4">
          <SheetTitle className="text-left text-sm font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-4 overflow-y-auto p-2">
          {PORTAL_LINKS[role] && (
            <Link
              href={PORTAL_LINKS[role]}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary"
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
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/5 font-semibold text-primary"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
