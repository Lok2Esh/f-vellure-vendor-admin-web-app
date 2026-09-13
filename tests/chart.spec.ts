import { test, expect } from "@playwright/test";
import { revenueGeometry } from "../src/platform/chart";
test("revenue geometry includes both series and handles empty, zero and single point data", () => {
  for (const data of [
    [],
    [{ label: "Today", services: 0, products: 0 }],
    [{ label: "Today", services: 100, products: 100000 }],
  ]) {
    const geometry = revenueGeometry(data);
    expect(Number.isFinite(geometry.x(0))).toBe(true);
    expect(Number.isFinite(geometry.y(0))).toBe(true);
    for (const point of data) {
      expect(geometry.y(point.products)).toBeGreaterThanOrEqual(0);
      expect(geometry.y(point.services)).toBeGreaterThanOrEqual(0);
    }
  }
});
