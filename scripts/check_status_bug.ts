
import puppeteer from 'puppeteer';

async function checkAuction() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const url = 'https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-AT-2026-25R2886001818&ver=1';
  
  console.log(`Checking URL: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const result = await page.evaluate(`
    (function() {
      const getVal = (label) => {
        var elements = Array.from(document.querySelectorAll('td, th, dt, dd, span, label, p, div.dato'))
          .filter(function(el) { 
            return !el.closest('#pestanas') && !el.closest('.pestanas') && !el.closest('ul.tab') && !el.closest('#cabecera') && !el.closest('#pie'); 
          });
        
        var foundLabel = null;
        var foundValue = null;
        var htmlContext = null;

        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          var text = el.innerText.trim();
          if (text.toLowerCase().startsWith(label.toLowerCase())) {
            foundLabel = text;
            var next = el.nextElementSibling;
            if (next) {
              foundValue = next.innerText.trim();
              htmlContext = el.parentElement.outerHTML;
            }
            break;
          }
        }
        return { foundLabel, foundValue, htmlContext };
      };

      const estadoInfo = getVal('Estado');
      const allText = document.body.innerText;
      const hasSuspendedText = allText.includes('temporalmente suspendida');
      
      return {
        estadoInfo,
        hasSuspendedText,
        allTextSnippet: allText.substring(0, 1000)
      };
    })()
  `) as any;

  console.log('Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

checkAuction();
