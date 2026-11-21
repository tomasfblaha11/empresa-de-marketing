import { test, expect } from '@playwright/test';
import client from '../src/data/client.json' with { type: 'json' };

const digits = (s: string) => s.replace(/[^\d+]/g, '');

test('home page shows the business, photos and contact', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(client.business.name);
  await expect(page.locator('h1')).toHaveCount(1);

  // Every image has alt text and actually loads.
  const imgs = page.locator('main img');
  expect(await imgs.count()).toBeGreaterThanOrEqual(client.photos.gallery.length + 1);
  for (const img of await imgs.all()) {
    await expect(img).toHaveAttribute('alt', /.+/);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }

  // Phone links dial the right number; contact section and form are present.
  const tel = page.locator(`a[href="tel:${digits(client.contact.phone)}"]`);
  expect(await tel.count()).toBeGreaterThanOrEqual(2);
  await expect(page.locator('#contact form')).toBeVisible();
  await expect(page.locator(`a[href="mailto:${client.contact.email}"]`)).toBeVisible();
});

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('internal links resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!))]);
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  for (const id of await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!.slice(1)))) {
    expect(await page.locator(`[id="${id}"]`).count(), `#${id}`).toBe(1);
  }
});

test('demo pages are never indexable', async ({ page, request }) => {
  test.skip(!client.demo, 'only for demos');
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('note')).toContainText('not their official website');
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
});

test('demo form explains it is not connected', async ({ page }) => {
  test.skip(!client.demo || Boolean(client.contact.formEndpoint), 'only for unconnected demo forms');
  await page.goto('/#contact');
  const form = page.locator('#contact form');
  await form.getByLabel('Name').fill('Test');
  await form.getByLabel('Phone or email').fill('test@example.com');
  await form.getByLabel('What do you need?').fill('A new driveway');
  await form.getByRole('button', { name: 'Send my enquiry' }).click();
  await expect(form.getByRole('status')).toContainText('not connected');
});

test('mobile quick-contact bar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const bar = page.getByRole('navigation', { name: 'Quick contact' });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Call' })).toHaveAttribute('href', `tel:${digits(client.contact.phone)}`);
});
