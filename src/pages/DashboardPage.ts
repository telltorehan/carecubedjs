import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  get openApplicationLinks(): Locator {
    // one link per application row, all with the same text, so callers
    // pick a row by position
    return this.page.getByRole('link', { name: 'Open application' });
  }

  async waitForLoaded(): Promise<void> {
    await this.openApplicationLinks.first().waitFor({ state: 'visible' });
  }

  async openApplication(index = 0): Promise<void> {
    await this.openApplicationLinks.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
