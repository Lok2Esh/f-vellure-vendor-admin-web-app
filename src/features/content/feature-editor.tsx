"use client";
import { useState, type FormEvent } from "react";
import {
  Button,
  Checkbox,
  Field,
  Form,
  Grid,
  Notice,
  Select,
  Stack,
  Text,
  TextArea,
} from "@/components/portal/ui";
import { MARKET_CONFIG } from "@/platform/market";
import {
  featureInputSchema,
  featureTypes,
  placements,
  targets,
  type Feature,
  type FeatureInput,
} from "./contracts";
const localDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("sv-SE", {
        timeZone: MARKET_CONFIG.timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(new Date(value))
        .replace(" ", "T")
    : "";
export function FeatureEditor({
  feature,
  vendor,
  pending,
  onSave,
}: {
  feature?: Feature;
  vendor: boolean;
  pending: boolean;
  onSave: (value: FeatureInput) => void;
}) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget),
      payload: Record<string, unknown> = {};
    for (const [key, value] of form) payload[key] = value || null;
    payload.isActive = form.has("isActive");
    payload.sortOrder = Number(form.get("sortOrder"));
    payload.placement = vendor ? "VENDOR_DETAIL" : form.get("placement");
    for (const key of ["startsAt", "endsAt"])
      payload[key] = form.get(key)
        ? new Date(
            `${form.get(key)}:00${MARKET_CONFIG.utcOffset}`,
          ).toISOString()
        : null;
    try {
      payload.metadata = form.get("metadata")
        ? JSON.parse(String(form.get("metadata")))
        : null;
    } catch {
      setError("Metadata must be a valid JSON object.");
      return;
    }
    const parsed = featureInputSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    onSave(parsed.data);
  }
  const textFields = [
    ["title", "Title · English"],
    ["titleHindi", "Title · Hindi"],
    ["subtitle", "Subtitle · English"],
    ["subtitleHindi", "Subtitle · Hindi"],
    ["badge", "Badge"],
    ["iconUrl", "Icon URL"],
    ["imageUrl", "Image URL"],
    ["targetId", "Target ID"],
    ["targetUrl", "Target link"],
  ] as const;
  return (
    <Form onSubmit={submit}>
      <Stack>
        <Grid className="v-feature-form-grid">
          {textFields.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              name={key}
              defaultValue={feature?.[key] || ""}
              required={key === "title"}
              lang={key.endsWith("Hindi") ? "hi" : "en"}
              dir="ltr"
            />
          ))}
          <Stack>
            <Text>Format</Text>
            <Select
              label="Feature type"
              name="type"
              defaultValue={feature?.type || "HIGHLIGHT"}
              options={featureTypes.map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
            />
          </Stack>
          <Stack>
            <Text>Placement</Text>
            <Select
              label="Placement"
              name="placement"
              defaultValue={
                vendor ? "VENDOR_DETAIL" : feature?.placement || "HOME_FEED"
              }
              disabled={vendor}
              options={placements.map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
            />
          </Stack>
          <Stack>
            <Text>Destination</Text>
            <Select
              label="Target type"
              name="targetType"
              defaultValue={feature?.targetType || "NONE"}
              options={targets.map((value) => ({
                value,
                label: value.replaceAll("_", " "),
              }))}
            />
          </Stack>
          <Field
            label="Display order"
            name="sortOrder"
            type="number"
            min={0}
            step={1}
            defaultValue={feature?.sortOrder || 0}
          />
          {!vendor && (
            <Field
              label="Vendor ID (optional)"
              name="vendorId"
              defaultValue={feature?.vendorId || ""}
            />
          )}
          <Field
            label={`Starts at · ${MARKET_CONFIG.timezone}`}
            name="startsAt"
            type="datetime-local"
            defaultValue={localDate(feature?.startsAt)}
          />
          <Field
            label={`Ends at · ${MARKET_CONFIG.timezone}`}
            name="endsAt"
            type="datetime-local"
            defaultValue={localDate(feature?.endsAt)}
          />
        </Grid>
        <TextArea
          label="Description · English"
          name="description"
          rows={3}
          defaultValue={feature?.description || ""}
        />
        <TextArea
          label="Description · Hindi"
          name="descriptionHindi"
          rows={3}
          lang="hi"
          dir="ltr"
          defaultValue={feature?.descriptionHindi || ""}
        />
        <TextArea
          label="Display metadata (JSON, optional)"
          name="metadata"
          rows={3}
          defaultValue={
            feature?.metadata ? JSON.stringify(feature.metadata, null, 2) : ""
          }
        />
        <Checkbox
          label="Enable customer visibility within the schedule"
          name="isActive"
          defaultChecked={feature?.isActive ?? false}
        />
        {error && <Notice tone="error">{error}</Notice>}
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : feature ? "Save changes" : "Create feature"}
        </Button>
      </Stack>
    </Form>
  );
}
