"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction<T> {
  label: string;
  onClick?: (row: T) => void;
  href?: string | ((row: T) => string);
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

interface RowActionsProps<T> {
  row: T;
  actions: RowAction<T>[];
}

export function RowActions<T>({ row, actions }: RowActionsProps<T>) {
  const router = useRouter();
  const visible = actions.filter((action) => !action.hidden?.(row));
  if (visible.length === 0) return null;

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visible.map((action) => {
            const disabled = action.disabled?.(row) ?? false;
            if (action.href) {
              const href = typeof action.href === "function" ? action.href(row) : action.href;
              return (
                <DropdownMenuItem
                  key={action.label}
                  variant={action.variant}
                  disabled={disabled}
                  onClick={() => router.push(href)}
                >
                  {action.label}
                </DropdownMenuItem>
              );
            }
            return (
              <DropdownMenuItem
                key={action.label}
                variant={action.variant}
                disabled={disabled}
                onClick={() => action.onClick?.(row)}
              >
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
