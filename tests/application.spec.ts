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

test.afterEach(async ({ page, headless }, testInfo) => {
  // keep the browser open for 5 seconds so a headed run can be seen
  // finishing; headless runs have nobody watching, so skip it there
  if (headless) return;
  testInfo.setTimeout(testInfo.timeout + 10_000);
  // if the page already crashed the real error is reported by the test,
  // a second one from here would only add noise
  await page.waitForTimeout(5000).catch(() => {});
});

test('logs in and lists applications', async ({ page }) => {
  const dashboard = await logIn(page);
  await expect(dashboard.openApplicationLinks.first()).toBeVisible();
});

test('opens the first application', async ({ page }) => {
  const dashboard = await logIn(page);
  const dashboardUrl = page.url();

  const status = await dashboard.openApplication(0);

  // the application screen itself isn't mapped yet, so for now prove the
  // click landed on a real page: no server error, not bounced to login,
  // and not still sitting on the dashboard. status 0 means the app swapped
  // the page in place without a full load, so there's no status to check
  if (status !== 0) {
    expect(status, `application page returned HTTP ${status}`).toBeLessThan(400);
  }
  await expect(page).not.toHaveURL(/\/login(\/|\?|#|$)/i);
  await expect(page).not.toHaveURL(dashboardUrl);
});
