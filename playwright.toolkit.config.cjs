const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/toolkit',
  timeout: 20000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/toolkit/results.json' }]],
  outputDir: 'test-results/toolkit/artifacts',
  use: { channel: 'chrome', headless: true, serviceWorkers: 'block' },
});
