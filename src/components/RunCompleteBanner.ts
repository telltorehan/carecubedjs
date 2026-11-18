import { Page } from '@playwright/test';

/**
 * Full-width banner shown at the end of a test so whoever is watching a
 * headed run can see it has finished, and whether it passed, before the
 * browser closes.
 */
export class RunCompleteBanner {
  constructor(private readonly page: Page) {}

  async show(title: string, passed: boolean, holdMs = 5000): Promise<void> {
    await this.page.evaluate(
      ({ title, passed }) => {
        document.getElementById('run-complete-banner')?.remove();
        const banner = document.createElement('div');
        banner.id = 'run-complete-banner';
        banner.setAttribute('role', 'alert');
        banner.style.cssText = [
          'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:2147483647',
          'padding:24px', 'font:bold 22px/1.4 sans-serif', 'text-align:center', 'color:#fff',
          `background:${passed ? '#1b7f3b' : '#b3261e'}`, 'box-shadow:0 4px 12px rgba(0,0,0,.4)',
        ].join(';');
        // text first, so the result never depends on colour alone
        banner.textContent = `${passed ? 'PASSED' : 'FAILED'} - Run complete: ${title}`;
        document.body.appendChild(banner);
      },
      { title, passed },
    );
    await this.page.waitForTimeout(holdMs);
  }
}
