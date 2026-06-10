"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiActionButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm";
}

export function AiActionButton({
  label,
  onClick,
  className,
  size = "default",
}: AiActionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "sm" : "default"}
      onClick={onClick}
      className={cn("gap-2 border-violet-200 text-violet-700 hover:bg-violet-50", className)}
    >
      <Sparkles className="h-4 w-4" />
      {label}
    </Button>
  );
}
