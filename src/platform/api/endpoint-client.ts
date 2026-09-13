import { z } from "zod";
import { requestEnvelope } from "./client";
import { EndpointKey, endpoints } from "./endpoints";
import { ApiRecord, JsonValue } from "./contracts";
type PathParams<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : P extends `${string}:${infer Param}`
      ? Param
      : never;
type Params<K extends EndpointKey> = [
  PathParams<(typeof endpoints)[K]["path"]>,
] extends [never]
  ? { params?: never }
  : { params: Record<PathParams<(typeof endpoints)[K]["path"]>, string> };
export type EndpointOptions<K extends EndpointKey> = Params<K> & {
  query?: Record<string, string | number | boolean | undefined>;
  body?: ApiRecord | JsonValue[] | FormData;
  signal?: AbortSignal;
  idempotencyKey?: string;
};
/** Responses remain unknown until callers supply a schema: the blueprint does not define business DTOs. */
export function callEndpoint<K extends EndpointKey, T = unknown>(
  key: K,
  options: EndpointOptions<K>,
  schema: z.ZodType<T> = z.unknown() as z.ZodType<T>,
) {
  const definition = endpoints[key];
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(options.query ?? {}))
    if (value !== undefined) query.set(name, String(value));
  for (const [name, value] of Object.entries(options.params ?? {}))
    query.set(`param.${name}`, String(value));
  const headers = new Headers();
  if (options.idempotencyKey)
    headers.set("Idempotency-Key", options.idempotencyKey);
  return requestEnvelope(`/api/platform/${key}?${query}`, schema, {
    method: definition.method,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    signal: options.signal,
  });
}
type PlatformApi = {
  [K in EndpointKey]: <T = unknown>(
    options: EndpointOptions<K>,
    schema?: z.ZodType<T>,
  ) => ReturnType<typeof callEndpoint<K, T>>;
};
export const platformApi = Object.fromEntries(
  Object.keys(endpoints).map((key) => [
    key,
    (options: EndpointOptions<EndpointKey>, schema?: z.ZodType<unknown>) =>
      callEndpoint(key as EndpointKey, options, schema),
  ]),
) as unknown as PlatformApi;
