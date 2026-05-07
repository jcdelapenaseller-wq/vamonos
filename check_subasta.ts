import puppeteer from 'puppeteer';

async function checkSubasta() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto("https://subastas.boe.es/index.php?idSub=SUB-JA-2026-256708&ver=1&idBus=&idLote=&numPagBus=", { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log("HTML length:", html.length);
    
    // Extracción de datos básicos
    const generalData = await page.evaluate((() => {
        function getVal(label: string) {
          const ths = Array.from(document.querySelectorAll('th'));
          for (const th of ths) {
            if (th.textContent?.trim() === label || (th.textContent || '').includes(label)) {
              return th.nextElementSibling?.textContent?.trim() || null;
            }
          }
          return null;
        }
        var valorSubasta = getVal('Valor subasta');
        var valorTasacion = getVal('Tasación');
        var cantidadReclamada = getVal('Cantidad reclamada');
        var fechaInicio = getVal('Fecha de inicio');
        var fechaFin = getVal('Fecha de conclusión') || getVal('Fecha de fin');
        var estadoSubasta = getVal('Estado');
        return { valorSubasta, valorTasacion, cantidadReclamada, fechaInicio, fechaFin, estadoSubasta };
    }) as any);
    
    console.log("General data:", generalData);
    
    await page.goto("https://subastas.boe.es/index.php?idSub=SUB-JA-2026-256708&ver=2&idBus=&idLote=&numPagBus=", { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    const financialData = await page.evaluate((() => {
        function getVal(label: string) {
          const ths = Array.from(document.querySelectorAll('th'));
          for (const th of ths) {
            if (th.textContent?.trim() === label || (th.textContent || '').includes(label)) {
              return th.nextElementSibling?.textContent?.trim() || null;
            }
          }
          return null;
        }
        var valorSubasta = getVal('Valor subasta');
        var valorTasacion = getVal('Tasación');
        var cantidadReclamada = getVal('Cantidad reclamada');
        return { valorSubasta, valorTasacion, cantidadReclamada };
    }) as any);
    
    console.log("Financial data:", financialData);
  } finally {
    await browser.close();
  }
}

checkSubasta();
