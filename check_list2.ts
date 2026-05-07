import puppeteer from 'puppeteer';

async function checkList() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto("https://subastas.boe.es/index.php?ver=1");
    
    // Select Barcelona and search
    await page.select('select', '08');
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    
    const items = await page.evaluate(() => {
       const results = [];
       const els = document.querySelectorAll('.resultado-busqueda li');
       for (const el of els) {
         const anchor = el.querySelector('a[href*="idSub="]');
         if (anchor) results.push(anchor.getAttribute('href'));
       }
       return results;
    });
    
    const target = items.find(i => i.includes('SUB-JA-2026-256708'));
    console.log("Found ids:", items.length);
    console.log("Contains SUB-JA-2026-256708?", !!target);
  } finally {
    await browser.close();
  }
}

checkList();
