import { z } from "zod";
export const featureTypes = [
  "BANNER",
  "HIGHLIGHT",
  "QUICK_ACTION",
  "AMENITY",
  "SPOTLIGHT_SERVICE",
  "SPOTLIGHT_VENDOR",
  "COLLECTION",
] as const;
export const placements = [
  "HOME_HERO",
  "HOME_QUICK_ACTIONS",
  "HOME_FEED",
  "HOME_BANNER",
  "CATEGORY_SCREEN",
  "VENDOR_DETAIL",
  "EXPLORE_PAGE",
] as const;
export const targets = [
  "CATEGORY",
  "SERVICE",
  "VENDOR",
  "PRODUCT",
  "PROMOTION",
  "DEEP_LINK",
  "EXTERNAL_URL",
  "NONE",
] as const;
const optionalText = z.string().nullable().optional();
const safeUrl = z
  .string()
  .refine((value) => {
    try {
      return ["https:", "http:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Use an http or https URL")
  .nullable()
  .optional();
export const featureInputSchema = z
  .object({
    title: z.string().trim().min(1, "Enter a title").max(100),
    titleHindi: z.string().max(100).nullable().optional(),
    subtitle: z.string().max(200).nullable().optional(),
    subtitleHindi: z.string().max(200).nullable().optional(),
    description: optionalText,
    descriptionHindi: optionalText,
    badge: z.string().max(30).nullable().optional(),
    iconUrl: safeUrl,
    imageUrl: safeUrl,
    type: z.enum(featureTypes),
    placement: z.enum(placements),
    targetType: z.enum(targets),
    targetId: optionalText,
    targetUrl: z
      .string()
      .refine((value) => {
        try {
          return ["https:", "http:", "vellure:"].includes(
            new URL(value).protocol,
          );
        } catch {
          return false;
        }
      }, "Use an http, https or vellure link")
      .nullable()
      .optional(),
    sortOrder: z.number().int().min(0),
    isActive: z.boolean(),
    startsAt: z.iso.datetime({ offset: true }).nullable().optional(),
    endsAt: z.iso.datetime({ offset: true }).nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    vendorId: optionalText,
  })
  .refine(
    (value) =>
      !value.startsAt ||
      !value.endsAt ||
      Date.parse(value.endsAt) > Date.parse(value.startsAt),
    { message: "End must be after start", path: ["endsAt"] },
  );
export const featureSchema = featureInputSchema.safeExtend({
  id: z.string(),
  displayTitle: optionalText,
  displaySubtitle: optionalText,
  vendorName: optionalText,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Feature = z.infer<typeof featureSchema>;
export type FeatureInput = z.infer<typeof featureInputSchema>;
export const featurePageSchema = z.object({
  data: z.array(featureSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
export type FeaturePage = z.infer<typeof featurePageSchema>;
export interface FeatureQuery {
  page: number;
  limit: number;
  search?: string;
  placement?: string;
  type?: string;
  isActive?: string;
  locale?: string;
}
export interface FeatureService {
  list(query: FeatureQuery, signal?: AbortSignal): Promise<FeaturePage>;
  details(id: string, signal?: AbortSignal): Promise<Feature>;
  create(input: FeatureInput): Promise<Feature>;
  update(id: string, input: FeatureInput): Promise<Feature>;
  toggle(id: string): Promise<Feature>;
  remove(id: string): Promise<void>;
  reorder(items: { id: string; sortOrder: number }[]): Promise<void>;
  preview(query: FeatureQuery, signal?: AbortSignal): Promise<Feature[]>;
}
