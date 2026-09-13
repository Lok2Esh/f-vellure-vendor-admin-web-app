import type { Dashboard } from "./domain";
export function revenueGeometry(
  data: Dashboard["trend"],
  width = 740,
  height = 190,
) {
  const safe = (value: number) =>
    Number.isFinite(value) ? Math.max(0, value) : 0;
  const ceiling =
    Math.max(
      100,
      ...data.flatMap((point) => [safe(point.services), safe(point.products)]),
    ) * 1.18;
  return {
    ceiling,
    x: (index: number) =>
      data.length <= 1
        ? width / 2
        : 20 + (index * (width - 40)) / (data.length - 1),
    y: (value: number) => height - 15 - (safe(value) / ceiling) * (height - 30),
  };
}
