import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3103",
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 1100 },
  },
  reporter: "list",
  webServer: { command: "node node_modules/next/dist/bin/next start -p 3103", url: "http://localhost:3103/login", reuseExistingServer: false, env: { VELLURE_DEMO_MODE: "true" }, timeout: 60000 },
});
