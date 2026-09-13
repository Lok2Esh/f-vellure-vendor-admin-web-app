import { Locale, Money } from "./domain";
import { LANGUAGES, MARKET_CONFIG } from "./market";
import type { OnboardingInput } from "./domain";
import { INDIA_SUBDIVISIONS } from "./india-locations";
export const address = (value: Pick<OnboardingInput, "address" | "addressLine2" | "landmark" | "city" | "district" | "state" | "postalCode">) => [
  value.address, value.addressLine2, value.landmark, value.city,
  value.district !== value.city ? value.district : "",
  `${INDIA_SUBDIVISIONS.find(item => item.code === value.state)?.name ?? value.state} ${value.postalCode}`.trim(),
  MARKET_CONFIG.country.name,
].filter(Boolean).join(", ");
export const number = (value: number) =>
  new Intl.NumberFormat(MARKET_CONFIG.currency.locale).format(value);
export const money = (
  value: Money,
  locale: Locale = MARKET_CONFIG.localization.defaultLanguage,
) =>
  new Intl.NumberFormat(LANGUAGES[locale].locale, {
    style: "currency",
    currency: MARKET_CONFIG.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value.amount / 100);
export const date = (
  value: string,
  locale: Locale = MARKET_CONFIG.localization.defaultLanguage,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
) =>
  new Intl.DateTimeFormat(LANGUAGES[locale].locale, {
    ...options,
    timeZone: MARKET_CONFIG.timezone,
  }).format(new Date(value));
export const time = (
  value: string,
  locale: Locale = MARKET_CONFIG.localization.defaultLanguage,
) => date(value, locale, { hour: "2-digit", minute: "2-digit", hour12: true });
