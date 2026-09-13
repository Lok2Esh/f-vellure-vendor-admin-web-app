import { cookies } from "next/headers";
import { MARKET_CONFIG, type Language } from "./market";
export async function getLocale(): Promise<Language> {
  const value = (await cookies()).get("vellure_locale")?.value;
  return (
    MARKET_CONFIG.localization.languages.find(
      (language) => language === value,
    ) ?? MARKET_CONFIG.localization.defaultLanguage
  );
}
