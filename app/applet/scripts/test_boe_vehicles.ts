import puppeteer from 'puppeteer';

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto(`https://subastas.boe.es/subastas_ava.php`, { waitUntil: 'domcontentloaded' });
  
  await page.click('input[name="dato[3]"][value="V"]'); // Vehículos
  await page.click('input[name="dato[2]"][value="EJ"]'); // Celebrándose
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('input[type="submit"][value="Buscar"]')
  ]);
  
  const results = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.resultado-busqueda li')).slice(0, 10);
    return items.map(li => {
      const anchor = li.querySelector('a[href*="subastas_det.php"]') || li.querySelector('a[href*="idSub="]');
      const href = anchor ? anchor.getAttribute('href') : null;
      return href ? (href.startsWith('http') ? href : 'https://subastas.boe.es/' + href.replace(/^\.\//, '')) : null;
    }).filter(Boolean);
  });
  
  for (let i = 0; i < results.length; i++) {
    console.log(`\nChecking URL ${i+1}:`, results[i]);
    await page.goto(results[i] + '&ver=3', { waitUntil: 'domcontentloaded' }); // Bienes
    
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => !src.includes('logo') && !src.includes('ayuda') && !src.includes('portal_subastas'));
    });
    
    if (images.length > 0) {
      console.log('FOUND IMAGES:', images);
    } else {
      console.log('No vehicle images found.');
    }
  }
  
  await browser.close();
}
run();
