import puppeteer from 'puppeteer';

async function checkIndex() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto("https://subastas.boe.es/index.php?ver=1", { waitUntil: 'domcontentloaded' });
    
    const hasSubmit = await page.$('input[type="submit"]');
    console.log("Has submit?", !!hasSubmit);
    
    if (hasSubmit) {
      await page.select('select', '08');
      await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'domcontentloaded' })
      ]);
      const items = await page.evaluate(() => document.querySelectorAll('.resultado-busqueda li').length);
      console.log("Items found:", items);
    }
  } finally {
    await browser.close();
  }
}

checkIndex();
