const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/canvas',
  timeout: 45000,
  expect: { timeout: 10000 },
  retries: 0,
  workers: 1,
  fullyParallel: false,
  outputDir: 'test-results/playwright',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    trace: 'off',
  },
});
