import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    /* 🟢 Update this to match Vite's default port */
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // You can keep Firefox and Webkit, but for faster CI, 
    // many devs start with just Chromium.
  ],

  /* 🟢 Activate and update the WebServer */
  webServer: {
    command: 'npm run dev',        // The command to start your Cara frontend
    url: 'http://localhost:5173', // The URL to wait for
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,           // Give it 2 minutes to boot up in CI
  },
});