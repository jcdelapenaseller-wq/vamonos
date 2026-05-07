const puppeteer = require('puppeteer');

async function checkSubasta() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    // 1. General tab
    await page.goto("https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-JA-2026-256708&ver=1");
    const generalData = await page.evaluate(() => {
        function getVal(label) {
          const ths = Array.from(document.querySelectorAll('th'));
          for (const th of ths) {
            if (th.textContent.includes(label)) {
              return th.nextElementSibling ? th.nextElementSibling.textContent.trim() : null;
            }
          }
          return null;
        }
        return {
          fechaInicio: getVal('Fecha de inicio'),
          fechaFin: getVal('Fecha de conclusión'),
          estado: getVal('Estado') || getVal('situación')
        };
    });
    console.log("General:", generalData);
    
    // 2. Financial tab
    await page.goto("https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-JA-2026-256708&ver=2");
    const financialData = await page.evaluate(() => {
        function getVal(label) {
          const ths = Array.from(document.querySelectorAll('th'));
          for (const th of ths) {
            if (th.textContent.includes(label)) {
              return th.nextElementSibling ? th.nextElementSibling.textContent.trim() : null;
            }
          }
          return null;
        }
        return {
          valorSubasta: getVal('Valor subasta'),
          valorTasacion: getVal('Tasación'),
          cantidadReclamada: getVal('Cantidad reclamada')
        };
    });
    console.log("Financial:", financialData);
  } finally {
    await browser.close();
  }
}
checkSubasta();
