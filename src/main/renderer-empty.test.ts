import { ElectronApplication, Page } from "playwright";
import { _electron as electron } from "playwright-core";
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

let window: Page,
  electronApp: ElectronApplication;

beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    args: [
      '.',
      `--user-data-dir=${__dirname.replace('src/main', '')}tests/data/empty`,
      '--window-size=1920,1000'
    ],
    env: {
      ...process.env
    },
  });

  // Get the first window that the app opens, wait if necessary.
  window = await electronApp.firstWindow();

  // Wait for frame actually loaded.
  await window.waitForSelector('main');

  // Direct Electron console to Node terminal.
  window.on('console', console.log);
});

afterAll(async () => {
  await electronApp.close();
});

/*beforeEach(async () => {
    page = await browser.newPage();
});
afterEach(async () => {
    await page.close();
});*/

it('should start the app on an empty state', async () => {
  expect(await window.title()).toBe('Weather Data Center');

  const image = await window.screenshot({ fullPage: true });
  expect(image).toMatchImageSnapshot({
    failureThreshold:3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });

  const mainText = window.locator('.main.bx--content h1');
  expect(await mainText.evaluate(node => node.textContent.replace(/(\r\n|\n|\r)/gm, ""))).toBe('No data found');

  // Open right sidebar.
  await window.click('header.bx--header button[aria-label="Upload Data"]');

  // Expect 0 items to be imported.
  const numberImported = window.locator('header.bx--header .bx--header-panel .import-data');
  expect(await numberImported.evaluate(node => node.textContent)).toBe('');

  const imageSideBarOpen = await window.screenshot({ fullPage: true });
  expect(imageSideBarOpen).toMatchImageSnapshot({
    failureThreshold: 3.5,
    failureThresholdType: 'percent',
    dumpDiffToConsole: true
  });
});

/**
 * @todo Test import new data into empty state.
 * @see https://github.com/microsoft/playwright/issues/5013
 */