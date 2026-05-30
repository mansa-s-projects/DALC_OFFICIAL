import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

function redirectCountFromResponse(response) {
  if (!response) return 0;
  let count = 0;
  let req = response.request();
  while (req.redirectedFrom()) {
    count += 1;
    req = req.redirectedFrom();
  }
  return count;
}

async function auditRoute(page, route, viewport) {
  const consoleErrors = [];
  const hydrationWarnings = [];
  const failedRequests = [];

  const onConsole = (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') consoleErrors.push(text);
    if (/hydration|did not match|server rendered html|mismatch/i.test(text)) {
      hydrationWarnings.push(text);
    }
  };
  const onPageError = (err) => consoleErrors.push(String(err));
  const onRequestFailed = (req) => failedRequests.push(req.url());

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);

  await page.setViewportSize(viewport);
  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(400);

  const imgMeta = await page.evaluate(() => {
    const imgs = Array.from(document.images);
    const broken = imgs
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.getAttribute('src') || '');
    return {
      total: imgs.length,
      broken: Array.from(new Set(broken)).slice(0, 10),
    };
  });

  const ctaMeta = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('a,button'));
    const keyword = /book|request|contact|quote|whatsapp|view|continue|explore/i;
    const ctas = nodes
      .map((n) => ({
        text: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
        href: n instanceof HTMLAnchorElement ? n.getAttribute('href') || '' : '',
      }))
      .filter((x) => keyword.test(x.text) || /wa\.me|whatsapp/i.test(x.href));

    return {
      total: ctas.length,
      whatsappCount: ctas.filter((c) => /wa\.me|whatsapp/i.test(c.href) || /whatsapp/i.test(c.text)).length,
      samples: ctas.slice(0, 8),
    };
  });

  const requestBookingVisible = await page.getByRole('button', { name: /Request Booking/i }).isVisible().catch(() => false);
  const requestBookingDisabled = requestBookingVisible
    ? await page.getByRole('button', { name: /Request Booking/i }).isDisabled().catch(() => true)
    : null;

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('requestfailed', onRequestFailed);

  return {
    route,
    viewport: `${viewport.width}x${viewport.height}`,
    httpStatus: response ? response.status() : null,
    finalUrl: page.url().replace(BASE, ''),
    redirectCount: redirectCountFromResponse(response),
    hydrationWarningCount: hydrationWarnings.length,
    consoleErrorCount: consoleErrors.length,
    missingAssetCount: failedRequests.length,
    brokenImageCount: imgMeta.broken.length,
    brokenImages: imgMeta.broken,
    ctaCount: ctaMeta.total,
    whatsappCtaCount: ctaMeta.whatsappCount,
    requestBookingVisible,
    requestBookingDisabled,
    ctaSamples: ctaMeta.samples,
  };
}

async function getDetailLinks(page, categoryRoute) {
  await page.goto(`${BASE}${categoryRoute}`, { waitUntil: 'networkidle' });
  const links = await page.evaluate((catRoute) => {
    const category = catRoute.split('/').pop();
    const prefix = `/transport/${category}/`;
    const hrefs = Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href') || '')
      .filter((h) => h.startsWith(prefix) && h.split('/').length >= 4);
    return Array.from(new Set(hrefs));
  }, categoryRoute);
  return links;
}

async function runDetailCtaFlow(page, detailRoute) {
  const apiHits = [];
  const onRequestFinished = (req) => {
    const url = req.url();
    if (/\/api\/requests|rest\/v1\/transport_bookings|rest\/v1\/requests/i.test(url)) {
      apiHits.push(url);
    }
  };
  page.on('requestfinished', onRequestFinished);

  await page.setViewportSize(desktop);
  await page.goto(`${BASE}${detailRoute}`, { waitUntil: 'networkidle' });

  const requestBtn = page.getByRole('button', { name: /Request Booking/i });
  const requestBtnVisible = await requestBtn.isVisible().catch(() => false);
  let requestBtnEnabledAfterSelection = false;
  let flowResult = 'no-booking-cta';
  let marker = null;

  if (requestBtnVisible) {
    const dayButtons = page.locator('div.grid.grid-cols-7 button');
    const dayCount = await dayButtons.count();
    for (let i = 0; i < dayCount; i += 1) {
      const btn = dayButtons.nth(i);
      const canClick = await btn.isVisible().catch(() => false) && await btn.isEnabled().catch(() => false);
      if (canClick) {
        await btn.click({ force: true });
        break;
      }
    }

    const timeButtons = page.locator('button').filter({ hasText: /AM|PM/i });
    await timeButtons.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);

    const timeButtonCount = await timeButtons.count();
    for (let i = 0; i < timeButtonCount; i += 1) {
      const btn = timeButtons.nth(i);
      const canClick = await btn.isVisible().catch(() => false) && await btn.isEnabled().catch(() => false);
      if (canClick) {
        await btn.click({ force: true });
        break;
      }
    }

    await page.waitForTimeout(400);
    requestBtnEnabledAfterSelection = await requestBtn.isEnabled().catch(() => false);

    if (!requestBtnEnabledAfterSelection) {
      flowResult = 'booking-cta-still-disabled';
    } else {
      await requestBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const urlAfterClick = page.url();

      if (/\/request/.test(urlAfterClick)) {
        marker = `TR_CERT_${detailRoute.split('/').pop()}_${Date.now()}`;
        await page.getByPlaceholder('Full name').fill('Transport Cert');
        await page.getByPlaceholder('WhatsApp or email').fill('transport.cert@example.com');
        await page.getByPlaceholder('Target venue, area, hotel, aircraft, or ask').fill(detailRoute);
        await page.getByPlaceholder('Tell us what success looks like: timing, atmosphere, budget range, logistics, preferences, edge cases.').fill(`Transport certification submission ${marker}`);
        await page.locator('input[placeholder="Guests"]').focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1800);

        const requestSuccess = await page.getByText('Brief received').isVisible().catch(() => false);
        flowResult = requestSuccess ? 'request-submitted' : 'request-submit-failed';
      } else if (/\/auth\/login/.test(urlAfterClick)) {
        flowResult = 'redirected-to-login';
      } else {
        flowResult = 'cta-click-no-transition';
      }
    }
  }

  page.off('requestfinished', onRequestFinished);

  return {
    detailRoute,
    requestBtnVisible,
    requestBtnEnabledAfterSelection,
    flowResult,
    finalUrl: page.url().replace(BASE, ''),
    apiExecutionCount: apiHits.length,
    marker,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const coreRoutes = ['/transport', '/transport/cars', '/transport/yachts', '/transport/jets'];
  const routeAudits = [];

  for (const route of coreRoutes) {
    routeAudits.push(await auditRoute(page, route, desktop));
    routeAudits.push(await auditRoute(page, route, mobile));
  }

  const categoryRoutes = ['/transport/cars', '/transport/yachts', '/transport/jets'];
  const detailMap = {};
  for (const c of categoryRoutes) {
    detailMap[c] = await getDetailLinks(page, c);
  }

  const detailAudits = [];
  const detailCtaFlows = [];
  for (const c of categoryRoutes) {
    for (const detail of detailMap[c]) {
      detailAudits.push(await auditRoute(page, detail, desktop));
      detailAudits.push(await auditRoute(page, detail, mobile));
      detailCtaFlows.push(await runDetailCtaFlow(page, detail));
    }
  }

  await browser.close();

  const markers = detailCtaFlows.map((f) => f.marker).filter(Boolean);
  console.log(JSON.stringify({ routeAudits, detailMap, detailAudits, detailCtaFlows, markers }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});