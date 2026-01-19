/**
 * Debug script to inspect Nike page structure
 * Run with: npx tsx scripts/debug-nike.ts
 */

import puppeteer from 'puppeteer';

const NIKE_URL = 'https://www.nike.com/gb/t/dunk-low-retro-shoes-76g0RC/DD1391-100';

async function debugNikePage() {
  console.log('🚀 Starting Nike page debug...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  );

  // Override webdriver detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  console.log(`📡 Navigating to: ${NIKE_URL}\n`);

  await page.goto(NIKE_URL, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  // Wait for content
  await new Promise(r => setTimeout(r, 3000));

  // Extract debug info
  const debugInfo = await page.evaluate(() => {
    const info: Record<string, unknown> = {};

    // Get page title
    info.title = document.title;

    // Look for price elements
    const priceSelectors = [
      '[data-test="product-price"]',
      '[data-test="product-price-reduced"]',
      '.product-price',
      '[class*="ProductPrice"]',
      '[class*="product-price"]',
      '[id*="price"]',
      '[class*="price"]',
    ];

    info.priceElements = [];
    for (const sel of priceSelectors) {
      const els = document.querySelectorAll(sel);
      els.forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.includes('£')) {
          (info.priceElements as Array<{selector: string, text: string, classes: string}>).push({
            selector: sel,
            text: text.substring(0, 100),
            classes: el.className,
          });
        }
      });
    }

    // Look for size elements
    const sizeSelectors = [
      'input[type="radio"][name="skuAndSize"]',
      '[data-test="size-selector"]',
      '[class*="sizeSelector"]',
      '[class*="SizeSelector"]',
      'button[data-qa]',
      '[data-qa="size-available"]',
      '[data-qa="size-unavailable"]',
      '[class*="size"]',
    ];

    info.sizeElements = [];
    for (const sel of sizeSelectors) {
      const els = document.querySelectorAll(sel);
      if (els.length > 0) {
        const samples: string[] = [];
        els.forEach((el, i) => {
          if (i < 5) {
            samples.push(el.textContent?.trim()?.substring(0, 50) || '(empty)');
          }
        });
        (info.sizeElements as Array<{selector: string, count: number, samples: string[]}>).push({
          selector: sel,
          count: els.length,
          samples,
        });
      }
    }

    // Look for add to bag button
    const bagSelectors = [
      '[data-test="add-to-cart-btn"]',
      'button[aria-label*="Add"]',
      '[class*="add-to-cart"]',
      '[class*="AddToCart"]',
      'button[type="submit"]',
    ];

    info.addToBagElements = [];
    for (const sel of bagSelectors) {
      const els = document.querySelectorAll(sel);
      els.forEach((el) => {
        (info.addToBagElements as Array<{selector: string, text: string, disabled: boolean}>).push({
          selector: sel,
          text: el.textContent?.trim()?.substring(0, 50) || '',
          disabled: (el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true',
        });
      });
    }

    // Get body HTML snippet around size area
    const bodyHtml = document.body.innerHTML;
    const sizeAreaMatch = bodyHtml.match(/size[^>]{0,500}/gi);
    info.sizeAreaSnippets = sizeAreaMatch?.slice(0, 5) || [];

    // Look for any UK text
    const ukMatches = bodyHtml.match(/UK\s*[\d.]+/gi);
    info.ukSizeMatches = [...new Set(ukMatches || [])].slice(0, 20);

    // Get all button texts
    const buttons = document.querySelectorAll('button');
    info.buttonTexts = [];
    buttons.forEach((btn) => {
      const text = btn.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        (info.buttonTexts as string[]).push(text);
      }
    });
    info.buttonTexts = [...new Set(info.buttonTexts as string[])].slice(0, 30);

    return info;
  });

  console.log('📋 DEBUG INFO:\n');
  console.log('Title:', debugInfo.title);
  console.log('\n💰 Price Elements Found:');
  console.log(JSON.stringify(debugInfo.priceElements, null, 2));
  console.log('\n📏 Size Elements Found:');
  console.log(JSON.stringify(debugInfo.sizeElements, null, 2));
  console.log('\n🛒 Add to Bag Elements:');
  console.log(JSON.stringify(debugInfo.addToBagElements, null, 2));
  console.log('\n🇬🇧 UK Size Matches in HTML:');
  console.log(debugInfo.ukSizeMatches);
  console.log('\n🔘 Button Texts:');
  console.log(debugInfo.buttonTexts);

  // Take screenshot for visual reference
  await page.screenshot({ path: 'scripts/nike-debug.png', fullPage: false });
  console.log('\n📸 Screenshot saved to scripts/nike-debug.png');

  await browser.close();
  console.log('\n✅ Debug complete');
}

debugNikePage().catch(console.error);
