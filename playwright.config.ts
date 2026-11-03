import { defineConfig, devices } from "@playwright/test";
const managed = process.env.SITES_MANAGED_LINUX_CONTAINER === "1";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5173/FilmAcademy/",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer:
    managed || process.env.PLAYWRIGHT_BASE_URL
      ? undefined
      : {
          command: "npm run preview -- --port 5173",
          url: "http://127.0.0.1:5173/FilmAcademy/",
          reuseExistingServer: !process.env.CI,
        },
});
