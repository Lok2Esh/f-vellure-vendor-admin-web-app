import { test, expect } from "@playwright/test";
import { money, date, number } from "../src/platform/format";
import {
  isMobile,
  normalizeMobile,
  LANGUAGES,
  MARKET_CONFIG,
  maskAccountNumber,
} from "../src/platform/market";
import { INDIA_SUBDIVISIONS } from "../src/platform/india-locations";
import { onboardingSchema } from "../src/platform/domain";
import { fromApiAmount } from "../src/platform/api/contracts";
test("India grouping preserves minor units and dates cross midnight in Kolkata", () => {
  expect(money({ amount: 12500000, currency: "INR" })).toBe("₹1,25,000");
  expect(money({ amount: 129950, currency: "INR" })).toBe("₹1,299.5");
  expect(number(1250000)).toBe("12,50,000");
  expect(date("2026-09-06T20:00:00Z", "en")).toBe("7 September 2026");
  expect(LANGUAGES.hi.direction).toBe("ltr");
  expect(MARKET_CONFIG.localization.languages).toEqual(["en", "hi"]);
});
test("Indian mobile and subdivision configuration", () => {
  for (const value of ["9876543210", "+91 98765 43210", "6987654321"])
    expect(isMobile(value)).toBe(true);
  for (const value of [
    "1234567890",
    "987654321",
    "+1 9876543210",
    "98765432100",
  ])
    expect(isMobile(value)).toBe(false);
  expect(normalizeMobile("98765 43210")).toBe("+919876543210");
  expect(
    INDIA_SUBDIVISIONS.filter((item) => item.type === "STATE"),
  ).toHaveLength(28);
  expect(
    INDIA_SUBDIVISIONS.filter((item) => item.type === "UNION_TERRITORY"),
  ).toHaveLength(8);
  expect(new Set(INDIA_SUBDIVISIONS.map((item) => item.code)).size).toBe(36);
  expect(maskAccountNumber("123456784821")).toBe("•••• •••• 4821");
});
test("PIN validation, optional tax registration and explicit API currency", () => {
  const input = {
    businessName: "Demo Salon",
    secondaryName: "",
    category: "Salon",
    ownerName: "Demo Owner",
    email: "demo@example.com",
    phone: "+91 98765 43210",
    city: "Chandigarh",
    address: "SCO 34, Sector 17",
    addressLine2: "",
    landmark: "",
    district: "Chandigarh",
    state: "CH",
    postalCode: "160017",
    country: "IN",
    terms: true,
  };
  expect(onboardingSchema.safeParse(input).success).toBe(true);
  for (const postalCode of ["12345", "1234567", "ABCDEF", "012345"])
    expect(onboardingSchema.safeParse({ ...input, postalCode }).success).toBe(
      false,
    );
  expect(fromApiAmount("125000.50", "INR")).toEqual({
    amount: 12500050,
    currency: "INR",
  });
  expect(() => fromApiAmount("125000.50", "USD")).toThrow(
    "unsupported currency",
  );
});
