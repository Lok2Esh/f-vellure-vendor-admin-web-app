import { expect, test } from "@playwright/test";
import {
  adminRoutes,
  vendorRoutes,
  adminChildren,
  vendorChildren,
} from "../src/platform/routes";
test("dashboard filters, table, details, export and responsive Hindi LTR", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/vendor/dashboard");
  await expect(
    page.getByRole("heading", {
      name: "A beautiful day for business, Neha.",
    }),
  ).toBeVisible();
  await expect(page.getByText("₹24,850", { exact: true })).toBeVisible();
  await page.getByLabel("Branch", { exact: true }).selectOption("indiranagar");
  await expect(page.getByText("₹8,697.5", { exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Priya Sharma" })).toHaveCount(0);
  await page.getByLabel("Branch", { exact: true }).selectOption("all");
  await page.getByRole("button", { name: "30 days", exact: true }).click();
  await expect(page.getByText("₹4,42,800", { exact: true })).toBeVisible();
  await page.getByLabel("Search appointments", { exact: true }).fill("Priya");
  await expect(page.getByRole("cell", { name: "Priya Sharma" })).toBeVisible();
  await page
    .getByRole("button", { name: "View APT-1042", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Appointment details" }),
  ).toBeVisible();
  await expect(page.getByText("Prefers a natural finish.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("vellure-appointments.csv");
  await page.getByLabel("Search appointments", { exact: true }).fill("");
  await page.getByRole("button", { name: "7 days", exact: true }).click();
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  await page.getByRole("button", { name: "Change language" }).click();
  await expect(page.locator(".v-portal")).toHaveAttribute("dir", "ltr");
  await expect(page.locator(".v-portal")).toHaveAttribute("lang", "hi");
  await page.reload();
  await expect(page.locator(".v-portal")).toHaveAttribute("lang", "hi");
  await expect(
    page.getByRole("heading", { name: "स्वागत है, Neha" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/dashboard-mobile-hindi.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("onboarding validates, saves draft, persists and submits once", async ({
  page,
}) => {
  await page.goto("/vendor/onboarding");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Enter your business name", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Business name · English").fill("Demo Beauty Studio");
  await page.getByLabel("Business name · Hindi").fill("ब्यूटी स्टूडियो");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Owner’s full name").fill("Demo Owner");
  await page.getByLabel("Business email").fill("demo@example.com");
  await page.getByLabel("Mobile number").fill("+91 98765 43210");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Address Line 1").fill("SCO 34, Sector 17");
  await page.getByLabel("City", { exact: true }).fill("Chandigarh");
  await page.getByLabel("District", { exact: true }).fill("Chandigarh");
  await page
    .getByLabel("State / Union Territory", { exact: true })
    .selectOption("CH");
  await page.getByLabel("PIN Code").fill("160017");
  await expect(page.getByLabel("Country", { exact: true })).toHaveValue(
    "India",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(
    page.getByText("Your draft has been saved.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Business name · English")).toHaveValue(
    "Demo Beauty Studio",
  );
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.screenshot({
    path: "test-results/onboarding-review.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Looking good, Demo Beauty Studio." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Submitted for review", { exact: true }),
  ).toBeVisible();
});
test("API rejects invalid input and cross-origin writes", async ({
  request,
}) => {
  const invalid = await request.post("/api/portal/application", {
    headers: { origin: "http://localhost:3103" },
    data: { data: { businessName: "" }, submit: true },
  });
  expect(invalid.status()).toBe(400);
  const crossOrigin = await request.post("/api/portal/application", {
    headers: { origin: "https://untrusted.example" },
    data: {},
  });
  expect(crossOrigin.status()).toBe(403);
  const filter = await request.get("/api/portal/dashboard?period=invalid");
  expect(filter.status()).toBe(400);
});
test("all requested route families resolve and unknown routes render not-found", async ({
  request,
}) => {
  const paths = [...vendorRoutes, ...adminRoutes]
    .map((r) => r.path)
    .concat(
      vendorChildren.map((p) => "/vendor/" + p.replace("[id]", "example-id")),
      adminChildren.map((p) => "/admin/" + p.replace("[id]", "example-id")),
    );
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  // Next streams the authenticated layout before notFound(), so the HTTP status may already be 200.
  const missing = await request.get("/vendor/nonexistent");
  expect(await missing.text()).toContain("This page could not be found");
});
