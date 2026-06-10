import { BAHRAIN_LOCALE } from "./bahrain";

export type LocaleConfig = typeof BAHRAIN_LOCALE;

export function getLocaleByCountry(_country?: string): LocaleConfig {
  return BAHRAIN_LOCALE;
}

export function getLocaleByEntityId(_entityId?: string): LocaleConfig {
  return BAHRAIN_LOCALE;
}
