export const MARKET_CONFIG = {
  country: { name: "India", code: "IN", iso3: "IND", callingCode: "+91" },
  currency: { code: "INR", symbol: "₹", locale: "en-IN" },
  localization: {
    defaultLocale: "en-IN",
    defaultLanguage: "en",
    secondaryLanguage: "hi",
    languages: ["en", "hi"],
  },
  timezone: "Asia/Kolkata",
  utcOffset: "+05:30",
  address: {
    postalCodeLabel: "PIN Code",
    postalCodeLength: 6,
    placeholder: "110001",
  },
  phone: { placeholder: "98765 43210", nationalLength: 10 },
  map: {
    countryRestriction: "IN",
    center: { latitude: 22.5937, longitude: 78.9629 },
  },
} as const;
export type Language = (typeof MARKET_CONFIG.localization.languages)[number];
export type LanguageDefinition = {
  label: string;
  locale: string;
  direction: "ltr" | "rtl";
};
export const LANGUAGES: Record<Language, LanguageDefinition> = {
  en: { label: "English", locale: "en-IN", direction: "ltr" },
  hi: { label: "हिन्दी", locale: "hi-IN", direction: "ltr" },
};
export const FUTURE_LANGUAGES = [
  "pa",
  "ta",
  "te",
  "mr",
  "bn",
  "gu",
  "kn",
  "ml",
] as const;
export function normalizeMobile(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  return compact.startsWith(MARKET_CONFIG.country.callingCode)
    ? compact
    : `${MARKET_CONFIG.country.callingCode}${compact}`;
}
export function isMobile(value: string) {
  const national = normalizeMobile(value).slice(
    MARKET_CONFIG.country.callingCode.length,
  );
  return /^[6-9]\d{9}$/.test(national);
}
export const BUSINESS_TYPES = [
  "Individual / Proprietor",
  "Sole Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited Company",
  "Public Limited Company",
  "Other",
] as const;
/** Availability and eligibility come from backend capabilities, never this label registry. */
export const PAYMENT_METHOD_LABELS = {
  UPI: "UPI",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  NET_BANKING: "Net Banking",
  WALLET: "Wallet",
  COD: "Cash on Delivery",
} as const;
export interface BankAccountInput {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId?: string;
}
export interface BusinessIdentityInput {
  legalName: string;
  tradeName?: string;
  pan?: string;
  gstin?: string;
  registrationType: (typeof BUSINESS_TYPES)[number];
}
export const maskAccountNumber = (value: string) =>
  `•••• •••• ${value.slice(-4)}`;
