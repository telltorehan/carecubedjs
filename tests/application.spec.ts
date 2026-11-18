import { expect, Page, test } from '@playwright/test';
import { RunCompleteBanner } from '../src/components/RunCompleteBanner';
import { DashboardPage } from '../src/pages/DashboardPage';
import { LoginPage } from '../src/pages/LoginPage';

const email = process.env.CARECUBE_EMAIL ?? '';
const password = process.env.CARECUBE_PASSWORD ?? '';

async function logIn(page: Page): Promise<DashboardPage> {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(email, password);

  const dashboard = new DashboardPage(page);
  await dashboard.waitForLoaded();
  return dashboard;
}

test.beforeEach(() => {
  expect(email, 'CARECUBE_EMAIL is not set').not.toBe('');
  expect(password, 'CARECUBE_PASSWORD is not set').not.toBe('');
});

test.afterEach(async ({ page }, testInfo) => {
  // the 5 second hold must not eat into the test's own time budget
  testInfo.setTimeout(testInfo.timeout + 15_000);
  const passed = testInfo.status === testInfo.expectedStatus;
  console.log(`${passed ? 'PASSED' : 'FAILED'} - run complete: ${testInfo.title}`);
  try {
    await new RunCompleteBanner(page).show(testInfo.title, passed);
    await testInfo.attach('run-complete', { body: await page.screenshot(), contentType: 'image/png' });
  } catch {
    // page already closed or crashed, the console line above still reports the result
  }
});

test('logs in and lists applications', async ({ page }) => {
  const dashboard = await logIn(page);
  await expect(dashboard.openApplicationLinks.first()).toBeVisible();
});

test('opens the first application', async ({ page }) => {
  const dashboard = await logIn(page);
  const dashboardUrl = page.url();

  await dashboard.openApplication(0);

  await expect(page).not.toHaveURL(dashboardUrl);
});
