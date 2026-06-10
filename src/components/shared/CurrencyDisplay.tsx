"use client";

import { formatCurrency } from "@/lib/locale/format";
import { BAHRAIN_LOCALE } from "@/lib/locale/bahrain";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
}

export function CurrencyDisplay({
  amount,
  className,
  showSymbol = true,
}: CurrencyDisplayProps) {
  const text = formatCurrency(amount, {
    showSymbol,
    localeConfig: BAHRAIN_LOCALE,
  });

  return <span className={cn("font-mono tabular-nums", className)}>{text}</span>;
}
