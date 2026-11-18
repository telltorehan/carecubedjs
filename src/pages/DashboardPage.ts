import { Locator, Page, Response } from '@playwright/test';

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

  /**
   * Opens the application at the given row and returns the HTTP status of
   * the page it landed on, after any redirects.
   */
  async openApplication(index = 0): Promise<number> {
    const before = this.page.url();
    let last: Response | null = null;
    const track = (r: Response) => {
      if (r.request().isNavigationRequest() && r.frame() === this.page.mainFrame()) last = r;
    };
    this.page.on('response', track);
    try {
      await this.openApplicationLinks.nth(index).click();
      // waitForLoadState alone can return before navigation even starts,
      // because the dashboard itself already counts as loaded
      await this.page.waitForURL((url) => url.href !== before);
      await this.page.waitForLoadState('domcontentloaded');
    } finally {
      this.page.off('response', track);
    }
    return (last as Response | null)?.status() ?? 0;
  }
}
