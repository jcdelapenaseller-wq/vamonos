import puppeteer from 'puppeteer';

async function checkBOE() {
  const url = 'https://subastas.boe.es/index.php?ver=1';
  console.log(`Iniciando crawler en: ${url}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const provinces = await page.evaluate(() => {
      const select = document.querySelector('select');
      if (!select) return [];
      const options = Array.from(select.options);
      
      return options.map((opt: HTMLOptionElement) => {
        const provinceCountMatch = opt.text.match(/\((\d+)\)/);
        return { value: opt.value, text: opt.text, count: provinceCountMatch ? parseInt(provinceCountMatch[1]) : 0 };
      }).filter((o: any) => o.value && o.count > 0)
        .sort((a: any, b: any) => b.count - a.count);
    });

    console.log(`Total subastas detectadas (suma de provincias BOE): ${provinces.reduce((acc, p) => acc + p.count, 0)}`);
    
    const bcn = provinces.find(p => p.value === '08');
    console.log(`Barcelona en BOE: ${bcn?.count || 0}`);
    console.log(`Provincias recorridas:`, provinces.map(p => p.text).join(', '));
  } finally {
    await browser.close();
  }
}

checkBOE();
