import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests/e2e",
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    env: {
      OPENAI_API_KEY: "",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
  workers: process.env.CI ? 1 : undefined,
});
