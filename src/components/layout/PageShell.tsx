"use client";

import { motion } from "@/lib/motion";
import { pageTransition } from "@/lib/motion";

interface PageShellProps {
  title: string;
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
  return (
    <motion.div
      className="space-y-6 p-2 md:space-y-8 md:p-4"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </motion.div>
  );
}
