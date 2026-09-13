"use client";
import { Field, Select, Stack, Text } from "./ui";
import { MARKET_CONFIG, BUSINESS_TYPES } from "@/platform/market";
import { INDIA_SUBDIVISIONS } from "@/platform/india-locations";
import type { OnboardingInput } from "@/platform/domain";

export function BusinessIdentityFields({
  values,
  onChange,
}: {
  values: OnboardingInput;
  onChange: <K extends keyof OnboardingInput>(
    key: K,
    value: OnboardingInput[K],
  ) => void;
}) {
  return (
    <Stack>
      <Text className="v-field-label">Business Registration Type</Text>
      <Select
        label="Business Registration Type"
        value={values.registrationType}
        options={BUSINESS_TYPES.map((value) => ({ value, label: value }))}
        onChange={(event) =>
          onChange(
            "registrationType",
            event.target.value as OnboardingInput["registrationType"],
          )
        }
      />
      <Field
        label="Business Legal Name (optional)"
        value={values.legalName}
        onChange={(event) => onChange("legalName", event.target.value)}
        maxLength={120}
      />
      <Field
        label="PAN (optional)"
        value={values.pan}
        onChange={(event) => onChange("pan", event.target.value.toUpperCase())}
        maxLength={10}
      />
      <Field
        label="GSTIN (if applicable)"
        value={values.gstin}
        onChange={(event) =>
          onChange("gstin", event.target.value.toUpperCase())
        }
        maxLength={15}
      />
    </Stack>
  );
}

export function MobileField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Stack>
      <Select
        label="Phone country"
        value={MARKET_CONFIG.country.code}
        options={[
          {
            value: MARKET_CONFIG.country.code,
            label: `${MARKET_CONFIG.country.name} (${MARKET_CONFIG.country.callingCode})`,
          },
        ]}
        disabled
      />
      <Field
        label="Mobile number"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={MARKET_CONFIG.phone.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
        required
      />
    </Stack>
  );
}
export function IndiaAddressFields({
  values,
  errors,
  onChange,
}: {
  values: OnboardingInput;
  errors: Partial<Record<keyof OnboardingInput, string>>;
  onChange: <K extends keyof OnboardingInput>(
    key: K,
    value: OnboardingInput[K],
  ) => void;
}) {
  const fields = [
    {
      key: "address",
      label: "Address Line 1",
      required: true,
      autoComplete: "address-line1",
    },
    {
      key: "addressLine2",
      label: "Address Line 2",
      autoComplete: "address-line2",
    },
    { key: "landmark", label: "Landmark" },
    {
      key: "city",
      label: "City",
      required: true,
      autoComplete: "address-level2",
    },
    { key: "district", label: "District", required: true },
  ] as const;
  return (
    <Stack>
      {fields.map((field) => (
        <Field
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(event) => onChange(field.key, event.target.value)}
          error={errors[field.key]}
          required={"required" in field && field.required}
          autoComplete={
            "autoComplete" in field ? field.autoComplete : undefined
          }
        />
      ))}
      <Text className="v-field-label">State / Union Territory</Text>
      <Select
        label="State / Union Territory"
        value={values.state}
        onChange={(event) => onChange("state", event.target.value)}
        options={[
          { value: "", label: "Select state or union territory" },
          ...INDIA_SUBDIVISIONS.map((item) => ({
            value: item.code,
            label: item.name,
          })),
        ]}
      />
      {errors.state && <Text>{errors.state}</Text>}
      <Field
        label={MARKET_CONFIG.address.postalCodeLabel}
        value={values.postalCode}
        onChange={(event) => onChange("postalCode", event.target.value)}
        error={errors.postalCode}
        placeholder={MARKET_CONFIG.address.placeholder}
        inputMode="numeric"
        maxLength={MARKET_CONFIG.address.postalCodeLength}
        autoComplete="postal-code"
        required
      />
      <Field
        label="Country"
        value={MARKET_CONFIG.country.name}
        readOnly
        autoComplete="country-name"
      />
    </Stack>
  );
}
