import { expect, Page, test } from '@playwright/test';
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
  // keep the browser open for 5 seconds at the end so a headed run can be
  // seen finishing, without eating into the test's own time budget
  testInfo.setTimeout(testInfo.timeout + 10_000);
  await page.waitForTimeout(5000);
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
