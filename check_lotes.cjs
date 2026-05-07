const puppeteer = require('puppeteer');

async function checkLotes() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto("https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-JA-2026-256708&ver=1");
    // Print all links
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href })));
    console.log("Links on ver=1:", links);
  } finally {
    await browser.close();
  }
}
checkLotes();
