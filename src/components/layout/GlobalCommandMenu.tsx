"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getVisibleSections } from "@/lib/mock/navigation";
import { useRole } from "@/lib/role-context";

interface GlobalCommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalCommandMenu({ open, onOpenChange }: GlobalCommandMenuProps) {
  const router = useRouter();
  const { role } = useRole();

  const sections = getVisibleSections(role);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search Manzel" description="Jump to a page or module">
      <CommandInput placeholder="Search pages…" />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>
        {sections.map((section, index) => (
          <div key={section.id}>
            {index > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={section.title}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${section.title} ${item.name}`}
                  onSelect={() => navigate(item.href)}
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <CommandShortcut>⌘K</CommandShortcut> to open · ↑↓ to navigate · Enter to go
      </div>
    </CommandDialog>
  );
}
