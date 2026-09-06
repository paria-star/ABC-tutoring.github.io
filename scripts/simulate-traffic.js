/**
 * Simulates realistic visitor traffic against the deployed ABC Tutoring site
 * so the PostHog dashboard has real data to show Dana.
 *
 * Requires: Node.js + the "playwright" package, and the site already deployed
 * to GitHub Pages (this drives a real browser so PostHog's client-side
 * autocapture + our custom events actually fire).
 *
 * Usage:
 *   npm install playwright
 *   SITE_URL="https://paria-star.github.io" node scripts/simulate-traffic.js
 */
const { chromium } = require('playwright');

const SITE_URL = process.env.SITE_URL || 'https://paria-star.github.io';
const VISITS = parseInt(process.env.VISITS || '25', 10);

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function simulateOneVisit(browser, i) {
  const page = await browser.newPage();
  try {
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'networkidle' });
    await sleep(300 + Math.random() * 500);

    const cards = await page.$$('.tutor-card');
    if (cards.length === 0) { await page.close(); return; }
    const card = pick(cards);
    await card.click();
    await page.waitForLoadState('networkidle');
    await sleep(400 + Math.random() * 800);

    // ~55% of visitors move on to the booking form
    if (Math.random() < 0.55) {
      const bookBtn = await page.$('a.btn');
      if (bookBtn) {
        await bookBtn.click();
        await page.waitForLoadState('networkidle');
        await sleep(300 + Math.random() * 500);

        // ~65% of people who reach the form complete it (rest abandon — shows drop-off)
        if (Math.random() < 0.65) {
          const slotOptions = await page.$$eval('#slot option', els => els.map(e => e.value).filter(Boolean));
          if (slotOptions.length) {
            await page.fill('#parentName', pick(['Maria Lopez', 'Jen Park', 'Aisha Thomas', 'Karen Diaz', 'Lauren Wu']));
            await page.fill('#parentEmail', `parent${i}@example.com`);
            await page.fill('#studentName', pick(['Noah', 'Ava', 'Liam', 'Mia', 'Ethan', 'Sofia']));
            await page.selectOption('#studentGrade', pick(['3', '4', '5', '6', '7', '8']));
            await page.click('button[type="submit"]');
            await sleep(300);
          }
        }
      }
    }
    await page.close();
  } catch (err) {
    console.error(`Visit ${i} failed:`, err.message);
    await page.close().catch(() => {});
  }
}

(async () => {
  const browser = await chromium.launch();
  for (let i = 0; i < VISITS; i++) {
    await simulateOneVisit(browser, i);
    console.log(`Simulated visit ${i + 1}/${VISITS}`);
  }
  await browser.close();
  console.log('Done. Check your PostHog dashboard in a minute or two.');
})();
