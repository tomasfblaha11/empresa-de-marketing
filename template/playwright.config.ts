import { defineConfig, devices } from '@playwright/test';

// Runs against the production build (astro preview). In the cloud environment the browser is
// preinstalled; set PW_CHROMIUM_PATH=/opt/pw-browsers/chromium if Playwright cannot find it.
export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  webServer: { command: 'node scripts/serve-dist.mjs', url: 'http://localhost:4321', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
