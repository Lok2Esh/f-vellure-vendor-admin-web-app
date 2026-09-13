import { test, expect } from "@playwright/test";
import { spawn, ChildProcess } from "node:child_process";
import { createServer, Server } from "node:http";
import { once } from "node:events";
import { adminRoutes, adminChildren } from "../src/platform/routes";
import { featureFixture } from "./feature-fixture";
let portal: ChildProcess;
let identity: Server;
const origin = "http://localhost:3101";
const fixtureUser = {
  id: "test-owner",
  firstName: "Test",
  lastName: "Owner",
  email: "test@example.com",
  phone: null,
  status: "ACTIVE",
  roles: ["VENDOR_OWNER"],
  vendorIds: ["tenant-test"],
  permissions: ["dashboard.view", "vendor.view"],
};
const fixtureAdmin = {
  ...fixtureUser,
  id: "test-admin",
  email: "admin@example.com",
  roles: ["SUPER_ADMIN"],
  vendorIds: [],
  permissions: [],
};
test("feature management uses create, detail, update, toggle, reorder, preview and delete APIs", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([
      {
        name: "vellure_session",
        value: "verified-admin-token",
        domain: "localhost",
        path: "/",
      },
    ]);
  await page.goto(`${origin}/admin/content`);
  await expect(
    page.getByText("Salon highlight", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add feature", exact: true }).click();
  await page
    .getByLabel("Title · English", { exact: true })
    .fill("Demo feature");
  await page.getByLabel("Title · Hindi", { exact: true }).fill("डेमो फीचर");
  await page
    .getByRole("button", { name: "Create feature", exact: true })
    .click();
  const row = () => page.getByRole("row").filter({ hasText: "Demo feature" });
  await expect(row()).toBeVisible();
  await row().getByRole("button", { name: "Enable", exact: true }).click();
  await expect(row().getByText("Enabled", { exact: true })).toBeVisible();
  await row().getByRole("button", { name: "Details", exact: true }).click();
  await page.getByRole("button", { name: "Edit feature", exact: true }).click();
  await page
    .getByLabel("Subtitle · English", { exact: true })
    .fill("A polished content card");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(row().getByText("A polished content card")).toBeVisible();
  await page.getByRole("button", { name: "Reorder", exact: true }).click();
  await page.getByLabel("Demo feature", { exact: true }).fill("7");
  await page
    .getByRole("button", { name: "Save display order", exact: true })
    .click();
  await expect(
    row().getByRole("cell", { name: "7", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Customer preview", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Demo feature", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.screenshot({
    path: "test-results/features-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await row().getByRole("button", { name: "Details", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete feature", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(row()).toHaveCount(0);
});

test("feature proxy scopes vendor lists and rejects global content mutations", async () => {
  const headers = { cookie: "vellure_session=verified-vendor-token" };
  const list = await fetch(`${origin}/api/features`, { headers });
  expect(list.status).toBe(200);
  const body = await list.json();
  expect(
    body.data.every(
      (feature: { vendorId: string }) => feature.vendorId === "tenant-test",
    ),
  ).toBe(true);
  const other = await fetch(
    `${origin}/api/features/11111111-1111-4111-8111-111111111111`,
    { headers },
  );
  expect(other.status).toBe(403);
  const remove = await fetch(
    `${origin}/api/features/22222222-2222-4222-8222-222222222222`,
    { method: "DELETE", headers: { ...headers, origin } },
  );
  expect(remove.status).toBe(403);
  const reorder = await fetch(`${origin}/api/features/reorder`, {
    method: "PUT",
    headers: { ...headers, origin },
  });
  expect(reorder.status).toBe(403);
});
// Production Next server, demo disabled; isolated identity contract fixture.
test.beforeAll(async () => {
  identity = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (await featureFixture(req, res)) return;
    if (req.url === "/auth/logout")
      return res.end(JSON.stringify({ data: { message: "Signed out" } }));
    if (
      req.url === "/auth/me" &&
      req.headers.authorization === "Bearer verified-admin-token"
    )
      return res.end(JSON.stringify({ data: fixtureAdmin }));
    if (
      req.url === "/auth/me" &&
      req.headers.authorization === "Bearer other-admin-token"
    )
      return res.end(
        JSON.stringify({
          data: { ...fixtureAdmin, email: "other@example.com" },
        }),
      );
    if (req.url === "/auth/login" || req.url === "/auth/register") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw);
      if (
        req.url === "/auth/register" ||
        body.password === "TestPassword123!"
      ) {
        const user =
          req.url === "/auth/register"
            ? { ...fixtureUser, vendorIds: [] }
            : body.identifier === "admin@example.com"
              ? fixtureAdmin
              : fixtureUser;
        return res.end(
          JSON.stringify({
            data: {
              accessToken:
                user === fixtureAdmin
                  ? "verified-admin-token"
                  : "verified-vendor-token",
              refreshToken: "fixture-refresh",
              tokenType: "Bearer",
              expiresIn: 900,
              user,
            },
          }),
        );
      }
    }
    if (
      req.url === "/auth/me" &&
      req.headers.authorization === "Bearer verified-vendor-token"
    )
      return res.end(
        JSON.stringify({
          data: {
            id: "test-owner",
            firstName: "Test",
            lastName: "Owner",
            email: "test@example.com",
            phone: null,
            status: "ACTIVE",
            roles: ["VENDOR_OWNER"],
            vendorIds: ["tenant-test"],
            workspace: "vendor",
            vendorId: "tenant-test",
            permissions: ["dashboard.view", "vendor.view"],
          },
        }),
      );
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized" }));
  });
  identity.listen(3102);
  await once(identity, "listening");
  portal = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", "3101"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        VELLURE_DEMO_MODE: "false",
        VELLURE_ADMIN_EMAIL: "admin@example.com",
        VELLURE_API_URL: "http://localhost:3102",
      },
      stdio: "ignore",
      windowsHide: true,
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${origin}/login`);
      if (res.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Production test server did not start");
});

test("vendor signup cannot request admin privileges and returns a secure session", async () => {
  const input = {
    firstName: "Test",
    lastName: "Owner",
    email: "signup@example.com",
    phone: "9876543210",
    password: "TestPassword123!",
  };
  const register = (data: unknown) =>
    fetch(`${origin}/api/auth/register`, {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  expect((await register({ ...input, role: "SUPER_ADMIN" })).status).toBe(422);
  expect((await register({ ...input, role: "CUSTOMER" })).status).toBe(422);
  const response = await register(input);
  expect(response.status).toBe(201);
  expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  expect((await response.json()).data.redirect).toBe("/vendor/onboarding");
});

test("only the configured administrator can open every admin page", async () => {
  const denied = await fetch(`${origin}/admin/dashboard`, {
    headers: { cookie: "vellure_session=other-admin-token" },
    redirect: "manual",
  });
  expect(denied.status).toBe(307);
  for (const path of [
    ...adminRoutes.map((route) => route.path),
    ...adminChildren.map((path) => `/admin/${path.replace("[id]", "test-id")}`),
  ]) {
    const response = await fetch(`${origin}${path}`, {
      headers: { cookie: "vellure_session=verified-admin-token" },
    });
    expect(response.status, path).toBe(200);
    expect(await response.text(), path).not.toContain("permission to access");
  }
  const deniedApi = await fetch(`${origin}/api/platform/getAdminMetrics`, {
    headers: { cookie: "vellure_session=verified-vendor-token" },
  });
  expect(deniedApi.status).toBe(403);
});

test("credential sign-in and signup pages remain usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/register`);
  await expect(
    page.getByRole("heading", { name: "Let’s grow your business." }),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/register-mobile.png",
    fullPage: true,
  });
  await page.goto(`${origin}/login`);
  await page.getByLabel("Email or mobile number").fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/admin/dashboard`);
});
test.afterAll(async () => {
  portal?.kill();
  if (identity) { identity.closeAllConnections();
    await new Promise<void>((resolve) => identity.close(() => resolve())); }
});
test("live mode denies missing and forged sessions without a demo fallback", async () => {
  for (const cookie of [
    "",
    "vellure_session=forged-token; vellure_user=%7B%22role%22%3A%22ADMIN%22%7D",
  ]) {
    const page = await fetch(`${origin}/vendor/dashboard`, {
      redirect: "manual",
      headers: { cookie },
    });
    expect(page.status).toBe(307);
    expect(page.headers.get("location")).toContain("/login");
    const api = await fetch(`${origin}/api/portal/dashboard`, {
      headers: { cookie },
    });
    expect(api.status).toBe(401);
  }
  const login = await fetch(`${origin}/api/auth/login`, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "admin@example.com",
      password: "wrong-password",
    }),
  });
  expect(login.status).toBe(401);
  expect(login.headers.get("set-cookie")).toBeNull();
});
test("verified workspace and granular permissions are enforced on the server", async () => {
  const headers = { cookie: "vellure_session=verified-vendor-token" };
  const vendor = await fetch(`${origin}/vendor/services`, { headers });
  expect(vendor.status).toBe(200);
  expect(await vendor.text()).toContain("permission to access");
  const admin = await fetch(`${origin}/admin/dashboard`, {
    headers,
    redirect: "manual",
  });
  expect(admin.status).toBe(307);
  expect(admin.headers.get("location")).toContain("/login");
  const write = await fetch(`${origin}/api/portal/application`, {
    method: "POST",
    headers: { ...headers, origin, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  expect(write.status).toBe(403);
});
