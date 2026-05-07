import puppeteer from 'puppeteer';

async function checkNav() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    const nextPageUrl = 'subastas_ava.php?accion=Mas';
    await page.goto(nextPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log("Success");
  } catch (e) {
    console.log("Error:", e.message);
  } finally {
    await browser.close();
  }
}
checkNav();
