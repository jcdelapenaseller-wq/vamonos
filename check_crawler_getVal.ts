import puppeteer from 'puppeteer';

async function checkSubastaCrawlerLogic() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto("https://subastas.boe.es/reg/detalleSubasta.php?idSub=SUB-JA-2026-256708&ver=1");
    
    const generalData = await page.evaluate(`
      (function() {
        window.__name = function(target, value) { return target; };
        function getVal(label) {
          var elements = Array.from(document.querySelectorAll('td, th, dt, dd, span, label, p, div.dato'))
            .filter(function(el) { return !el.closest('#pestanas') && !el.closest('.pestanas') && !el.closest('ul.tab') && !el.closest('#cabecera') && !el.closest('#pie'); });
          
          for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var text = el.innerText.trim();
            if (text.toLowerCase().startsWith(label.toLowerCase())) {
              if (text.includes('\\t')) {
                var parts = text.split('\\t');
                if (parts.length > 1 && parts[0].toLowerCase().includes(label.toLowerCase())) {
                  return parts.slice(1).join('\\t').trim();
                }
              }
              // If it's a th or dt, the value is usually in the next element
              if (el.tagName.toLowerCase() === 'th' || el.tagName.toLowerCase() === 'dt') {
                var nextEl = el.nextElementSibling;
                if (nextEl) return nextEl.innerText.trim();
              }
              // Try parent structure
              var parent = el.parentElement;
              if (parent) {
                var nextSibling = parent.nextElementSibling;
                if (nextSibling) {
                  var valueEl = nextSibling.querySelector('td, dd, span, div.dato');
                  if (valueEl) return valueEl.innerText.trim();
                  return nextSibling.innerText.trim();
                }
              }
            }
          }
          return null;
        }

        var valorSubasta = getVal('Valor subasta');
        var valorTasacion = getVal('Tasación');
        var cantidadReclamada = getVal('Cantidad reclamada');
        return { valorSubasta: valorSubasta, valorTasacion: valorTasacion, cantidadReclamada: cantidadReclamada };
      })()
    `);
    
    console.log(generalData);
  } finally {
    await browser.close();
  }
}
checkSubastaCrawlerLogic();
