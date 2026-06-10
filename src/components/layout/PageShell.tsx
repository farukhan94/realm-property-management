"use client";

import { motion } from "@/lib/motion";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PageShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageShell({
  title,
  description,
  children,
  actions,
}: PageShellProps) {
  const showHeader = title != null && title !== "";

  return (
    <motion.div
      className={cn(
        "p-2 md:p-4",
        showHeader ? "space-y-6 md:space-y-8" : "space-y-0"
      )}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {showHeader ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </motion.div>
  );
}
