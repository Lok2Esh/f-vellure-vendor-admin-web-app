import { z } from "zod";
import { apiRequest, requestEnvelope } from "@/platform/api/client";
import {
  featurePageSchema,
  featureSchema,
  type FeatureService,
  type FeatureQuery,
} from "./contracts";
const params = (query: FeatureQuery) =>
  new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => [key, String(value)]),
  );
const input = (method: string, body?: unknown) => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});
export const featureService: FeatureService = {
  list: async (query, signal) => {
    const response = await apiRequest(`/api/features?${params(query)}`, {
      signal,
    });
    return featurePageSchema.parse(await response.json());
  },
  details: async (id, signal) =>
    (
      await requestEnvelope(
        `/api/features/${encodeURIComponent(id)}`,
        featureSchema,
        { signal },
      )
    ).data,
  create: async (body) =>
    (await requestEnvelope("/api/features", featureSchema, input("POST", body)))
      .data,
  update: async (id, body) =>
    (
      await requestEnvelope(
        `/api/features/${encodeURIComponent(id)}`,
        featureSchema,
        input("PATCH", body),
      )
    ).data,
  toggle: async (id) =>
    (
      await requestEnvelope(
        `/api/features/${encodeURIComponent(id)}/toggle`,
        featureSchema,
        input("PATCH"),
      )
    ).data,
  remove: async (id) => {
    await apiRequest(
      `/api/features/${encodeURIComponent(id)}`,
      input("DELETE"),
    );
  },
  reorder: async (items) => {
    await apiRequest("/api/features/reorder", input("PUT", { items }));
  },
  preview: async (query, signal) =>
    (
      await requestEnvelope(
        `/api/features/preview?${params(query)}`,
        z.array(featureSchema),
        { signal },
      )
    ).data,
};
