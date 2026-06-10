"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/property/leases", label: "Leases" },
  { href: "/property/settlements", label: "Settlements" },
  { href: "/property/invoices", label: "Invoices" },
  { href: "/property/utilities", label: "Utilities" },
  { href: "/property/payouts", label: "Payouts" },
  { href: "/property/cheques", label: "PDC Registry" },
];

export function PropertySubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-border pb-px">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent",
            pathname.startsWith(link.href)
              ? "border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
