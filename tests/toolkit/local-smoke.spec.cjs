const { test, expect } = require('@playwright/test');
const { AppProvider, AppType, AppLaunchMode, CanvasAppRuntimePage } = require('power-platform-playwright-toolkit');
// All requests are fulfilled in memory. No tenant, Microsoft login or live app.
const origin = 'http://127.0.0.1:19876';
const fixture = `<div data-control-name="Ready">ready</div>
<input aria-label="Search"><div data-control-name="Observed">empty</div>
<button>Apply</button><script>
document.querySelector('input').addEventListener('keyup', e => document.querySelector('[data-control-name="Observed"]').textContent = e.target.value);
document.querySelector('button').onclick = () => document.querySelector('[data-control-name="Observed"]').textContent = 'applied';
</script>`;
test('Toolkit launches a local iframe and types/clicks through its runtime helpers', async ({ page, context }) => {
  await context.route('**/*', route => route.fulfill({
    contentType: 'text/html',
    body: route.request().url() === origin + '/frame' ? fixture : '<iframe name="fullscreen-app-host" src="/frame"></iframe>',
  }));
  const provider = new AppProvider(page, context);
  await provider.launch({ app: 'local-toolkit-fixture', type: AppType.Canvas, mode: AppLaunchMode.Play, skipMakerPortal: true, directUrl: origin + '/app' });
  const runtime = new CanvasAppRuntimePage(provider.getAppPage());
  const frame = runtime.getCanvasFrame('iframe[name="fullscreen-app-host"]');
  await expect(frame.locator('[data-control-name="Ready"]')).toHaveText('ready');
  await runtime.fillInput(frame.getByRole('textbox', { name: 'Search', exact: true }), 'toolkit');
  await expect(frame.locator('[data-control-name="Observed"]')).toHaveText('toolkit');
  await runtime.clickButton(frame.getByRole('button', { name: 'Apply', exact: true }));
  await expect(frame.locator('[data-control-name="Observed"]')).toHaveText('applied');
});
test('Toolkit rejects a missing readiness control', async ({ page }) => {
  await page.setContent('<div>not ready</div>');
  const runtime = new CanvasAppRuntimePage(page);
  await expect(runtime.waitForAppReady('[data-control-name="Missing"]', 250)).rejects.toThrow();
});
