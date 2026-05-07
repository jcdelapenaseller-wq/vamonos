import puppeteer from 'puppeteer';

async function checkPagination() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto("https://subastas.boe.es/index.php?ver=1", { waitUntil: 'domcontentloaded' });
    await page.select('select', '08');
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
    
    const nextPageUrl = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const next = links.find(a => 
            (a.getAttribute('href')?.includes('accion=Mas') || a.getAttribute('title')?.includes('Siguiente')) &&
            (a.textContent?.toLowerCase().includes('siguiente') || a.getAttribute('title')?.toLowerCase().includes('siguiente'))
        );
        return next ? { href: next.getAttribute('href'), title: next.getAttribute('title'), text: next.textContent } : null;
    });
    
    console.log("Next page info:", nextPageUrl);
  } finally {
    await browser.close();
  }
}

checkPagination();
