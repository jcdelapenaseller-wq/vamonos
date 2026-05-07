const puppeteer = require('puppeteer');

async function checkLotes() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto("https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-JA-2026-256708&ver=1");
    const json = await page.evaluate(() => {
        const result = {};
        const ths = Array.from(document.querySelectorAll('th'));
        for (const th of ths) {
           result[th.textContent.trim()] = th.nextElementSibling ? th.nextElementSibling.textContent.trim() : null;
        }
        return result;
    });
    console.log("General tab:", json);
  } finally {
    await browser.close();
  }
}
checkLotes();
