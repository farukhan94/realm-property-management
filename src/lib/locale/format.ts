import { BAHRAIN_LOCALE } from "./bahrain";
import { getLocaleByEntityId, type LocaleConfig } from "./resolver";

export function formatCurrency(
  amount: number,
  options?: { showSymbol?: boolean; entityId?: string; localeConfig?: LocaleConfig }
): string {
  const locale = options?.localeConfig ?? getLocaleByEntityId(options?.entityId);
  const formatted = amount.toLocaleString(locale.locale, {
    minimumFractionDigits: locale.currencyDecimals,
    maximumFractionDigits: locale.currencyDecimals,
  });
  return options?.showSymbol === false
    ? formatted
    : `${locale.currency} ${formatted}`;
}

export function calcVat(amount: number, entityId?: string): number {
  const locale = getLocaleByEntityId(entityId);
  return Math.round(amount * locale.vatRate * 1000) / 1000;
}

export function formatCompact(amount: number, entityId?: string): string {
  const locale = getLocaleByEntityId(entityId);
  if (amount >= 1_000_000) return `${locale.currency} ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${locale.currency} ${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount, { entityId });
}

export function formatCompactBhd(amount: number): string {
  return formatCompact(amount);
}
