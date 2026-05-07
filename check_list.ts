import puppeteer from 'puppeteer';

async function checkList() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto("https://subastas.boe.es/subastas_ava.php");
    
    // Select Barcelona and search
    await page.select('select[name="idProv"]', '08');
    await page.click('input[type="submit"][value="Buscar"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    
    const html = await page.evaluate(() => document.body.innerHTML);
    
    // Find our subasta block
    const items = await page.evaluate(() => {
       const results = [];
       const els = document.querySelectorAll('.resultado-busqueda');
       for (const el of els) {
         results.push(el.innerHTML);
       }
       return results;
    });
    
    const target = items.find(i => i.includes('SUB-JA-2026-256708'));
    if (target) {
        console.log("FOUND SUB-JA-2026-256708 in the list!");
        console.log("HTML:", target);
        
        // Emulate the logic `tasacionMatch = block.match(/appraisalValue:\s*(\d+(\.\d+)?)/);`
        // Wait, the crawler tests on the *JSON* or *HTML*?
        // Let's check `boeSubastasCrawler.ts` line 872:
        // `Array.from(document.querySelectorAll('.resultado-busqueda')).map(...)`
        // Then it returns JSON! And *then* it parses `appraisalValue` in the node script?
        // NO, wait, the page.evaluate returns JSON stringified inside `src/data/auctions.ts`?
        // Wait, the filter `tasacion < 200000` is performed in `boeSubastasCrawler.ts` on `block` which is an object or string?
    } else {
        console.log("NOT FOUND in first page, might need to paginate.");
    }
    
  } finally {
    await browser.close();
  }
}

checkList();
