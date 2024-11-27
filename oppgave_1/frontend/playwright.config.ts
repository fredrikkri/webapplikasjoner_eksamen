import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: undefined,
  reporter: "list", // Changed from "html" to "list" for minimal console output
  use: {
    baseURL: "http://localhost:4000",
    actionTimeout: 30000,
    navigationTimeout: 30000,
    viewport: { width: 900, height: 600 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
});
