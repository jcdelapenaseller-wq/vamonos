import { normalizeStatus } from '../src/utils/auctionHelpers';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeProvince = (raw: string): string => {
  if (!raw) return raw;

  let cleaned = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  cleaned = cleaned
    .replace(" provincia", "")
    .replace(" capital", "")
    .trim();

  const map: Record<string,string> = {
    "valencia": "Valencia",
    "valencia/valencia": "Valencia",
    "valencia/valencia ": "Valencia",
    "alicante": "Alicante",
    "alacant": "Alicante",
    "castellon": "Castellón",
    "castello": "Castellón",
    "a coruna": "A Coruña",
    "la coruna": "A Coruña",
    "vizcaya": "Vizcaya",
    "bizkaia": "Vizcaya"
  };

  return map[cleaned] || raw.trim();
};

/**
 * Crawler para obtener subastas activas del portal del BOE usando Puppeteer.
 * Se enfoca en la sección de Inmuebles para obtener un mayor volumen de datos.
 */
async function runCrawler() {
  const url = 'https://subastas.boe.es/index.php?ver=1'; // Todos los inmuebles
  console.log(`Iniciando crawler en: ${url}`);
  const targetIds = ['SUB-JA-2026-259511', 'SUB-AT-2024-23R4586001244'];

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Navegando a la página principal...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Selección automática de provincias con resultados
    console.log('Buscando provincias con subastas activas...');
    const provinces = await page.evaluate(() => {
      const select = document.querySelector('select');
      if (!select) return [];
      const options = Array.from(select.options);
      
      return options.map(opt => {
        const provinceCountMatch = opt.text.match(/\((\d+)\)/);
        return { value: opt.value, text: opt.text, count: provinceCountMatch ? parseInt(provinceCountMatch[1]) : 0 };
      }).filter(o => o.value && o.count > 0)
        .sort((a, b) => b.count - a.count);
    });

    console.log(`Provincias encontradas con resultados: ${provinces.length}`);
    
    const provinceConfig: Record<string, { maxPages: number; onlyCapital: boolean; minRatio?: number; minTasacion?: number }> = {
      '28': { maxPages: 30, onlyCapital: false, minTasacion: 50000 }, // Madrid (Increased for diagnostic)
      '23': { maxPages: 10, onlyCapital: false, minTasacion: 50000 }, // Jaén
      '08': { maxPages: 15, onlyCapital: false, minTasacion: 200000 }, // Barcelona
      '46': { maxPages: 5, onlyCapital: false, minTasacion: 180000 }, // Valencia
      '03': { maxPages: 5, onlyCapital: false, minTasacion: 180000 }, // Alicante
      '41': { maxPages: 5, onlyCapital: true, minTasacion: 150000 }, // Sevilla
      '29': { maxPages: 5, onlyCapital: false, minTasacion: 180000 }, // Málaga
      '50': { maxPages: 5, onlyCapital: false, minTasacion: 180000 }, // Zaragoza
    };

    const provincesToTest = provinces.filter(p => p.value === '28' || p.value === '23'); // Madrid and Jaén
    console.log(`Ejecutando para ${provincesToTest.length} provincias (DIAGNOSTIC MODE: MADRID ONLY).`);
    
    const allAuctions: any[] = [];
    const processedSlugs = new Set();
    let totalPagesCrawled = 0;

    for (const province of provincesToTest) {
      console.log(`Seleccionando provincia: ${province.text} (valor: ${province.value})`);
      
      // Reset paginación por provincia
      const visitedPages = new Set();
      let currentPage = 1;
      const config = provinceConfig[province.value] || { maxPages: 3, onlyCapital: false, minTasacion: 160000 };
      const maxPages = config.maxPages;
      const capitalName = province.text.replace(/\s*\(\d+\)$/, '').trim();
      console.log(`Provincia ${capitalName} -> páginas: ${maxPages}`);
      console.log(`Filtro capital: ${config.onlyCapital}`);
      let hasNextPage = true;

      try {
        await page.select('select', province.value);
        
        const submitButton = await page.$('input[type="submit"]');
        if (submitButton) {
          await Promise.all([
            page.click('input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 })
          ]);
        }

        while (hasNextPage && currentPage <= maxPages) {
          const totalPagesDetected = await page.evaluate(() => {
            const p = document.querySelector('.paginacion');
            if (!p) return '1';
            const links = Array.from(p.querySelectorAll('a, span'));
            const pages = links.map(l => l.textContent?.trim()).filter(t => t && !isNaN(parseInt(t)));
            return pages.length > 0 ? Math.max(...pages.map(Number)).toString() : '1';
          });
          if (currentPage === 1) {
            console.log(`[DIAGNOSTIC] Total páginas detectadas para ${capitalName}: ${totalPagesDetected}`);
          }
          console.log(` - Página ${currentPage}: Buscando subastas...`);
          totalPagesCrawled++;
          const currentUrl = page.url();
          if (visitedPages.has(currentUrl)) break;
          visitedPages.add(currentUrl);

          const provinceResults = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('ul.resultado-busqueda li, .resultado-busqueda li'));
            return items.map(li => {
              let titulo = '';
              const spans = Array.from(li.querySelectorAll('span'));
              const descSpan = spans.find(s => (s as HTMLElement).innerText.includes('Descripción:'));
              if (descSpan) {
                let next = descSpan.nextSibling;
                while (next && next.nodeType !== 3) next = next.nextSibling;
                if (next) titulo = next.textContent!.trim();
              }
              if (!titulo) {
                const h3 = li.querySelector('h3, h4, strong');
                titulo = h3 ? (h3 as HTMLElement).innerText.trim() : ((li.querySelector('a') as HTMLElement | null)?.innerText.trim() || 'Subasta');
              }
              titulo = titulo.replace(/^Más\.\.\.\s*/, '');
              const anchor = li.querySelector('a[href*="subastas_det.php"]') || 
                             li.querySelector('a[href*="idSub="]');
              let urlDetalle = '';
              if (anchor) {
                const href = anchor.getAttribute('href')!;
                urlDetalle = href.startsWith('http') ? href : 'https://subastas.boe.es/' + href.replace(/^\.\//, '');
              }
              return { titulo, urlDetalle };
            }).filter(r => r.urlDetalle);
          });

          // Diagnostic Logs for specific IDs
          provinceResults.forEach(r => {
            const idMatch = r.urlDetalle.match(/idSub=([^&]+)/);
            if (idMatch) {
              const idSub = idMatch[1];
              if (targetIds.includes(idSub)) {
                // We use a local variable to capture the current page number safely
                const pageNum = currentPage;
                console.log(`[DIAGNOSTIC] ID ${idSub} DETECTED in list at page ${pageNum}`);
              }
              // Log all IDs found to see what's in the list
              // console.log(`[DEBUG] Found ID: ${idSub}`);
            }
          });

          console.log(` - Página ${currentPage}: Encontradas ${provinceResults.length} subastas.`);

          for (const res of provinceResults) {
            if (!processedSlugs.has(res.urlDetalle)) {
              processedSlugs.add(res.urlDetalle);
              allAuctions.push({ 
                ...res, 
                provinceText: province.text,
                onlyCapital: config.onlyCapital,
                capitalName: capitalName,
                minRatio: config.minRatio,
                minTasacion: config.minTasacion
              });
            }
          }

          if (currentPage >= maxPages) {
            console.log(` - Límite de páginas alcanzado (${maxPages}) para ${province.text}.`);
            break;
          }

          const nextPageUrl = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const next = links.find(a => 
              (a.getAttribute('href')?.includes('accion=Mas') || a.getAttribute('title')?.includes('Siguiente')) &&
              (a.textContent?.toLowerCase().includes('siguiente') || a.getAttribute('title')?.toLowerCase().includes('siguiente'))
            );
            return next ? (next as HTMLAnchorElement).href : null;
          });

          if (nextPageUrl) {
            const delay = Math.floor(Math.random() * 1000) + 1000; // Delay 1-2s
            await new Promise(resolve => setTimeout(resolve, delay));

            try {
              await page.goto(nextPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
              // Esperar a que carguen los resultados o el mensaje de "no hay resultados"
              await page.waitForFunction(() => 
                document.querySelector('ul.resultado-busqueda li') || 
                document.querySelector('.resultado-busqueda li') ||
                document.body.innerText.includes('No se han encontrado'),
                { timeout: 15000 }
              );
              currentPage++;
            } catch (navError) {
              console.warn(` - Error al navegar a la siguiente página en ${province.text}: ${(navError as any).message}`);
              hasNextPage = false; 
            }
          } else {
            hasNextPage = false;
          }
        }
      } catch (e) {
        console.error(`Error al procesar provincia ${province.text}: ${(e as any).message}`);
      }

      // Volver a la página de búsqueda para la siguiente provincia
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (navError) {
        console.warn(`Error al volver a la página principal: ${(navError as any).message}`);
      }
    }

    console.log(`Se han recopilado ${allAuctions.length} subastas para procesar.`);

    // Cargar subastas existentes para comparar y para backfill
    const auctionsFilePath = path.join(__dirname, '../src/data/auctions.ts');
    let existingIds = new Set();
    let incompleteAuctions: any[] = [];
    
    try {
      let auctionsContent = fs.readFileSync(auctionsFilePath, 'utf-8');
      
      // Regex para capturar bloques de subastas
      const blockRegex = /'([^']+)':\s*{([\s\S]*?)}/g;
      let blockMatch;
      
      while ((blockMatch = blockRegex.exec(auctionsContent)) !== null) {
        const slug = blockMatch[1];
        const content = blockMatch[2];
        
        const boeIdMatch = content.match(/boeId:\s*["']([^"']+)["']/);
        if (boeIdMatch) {
          const boeId = boeIdMatch[1];
          existingIds.add(boeId);
          
          // Verificar si falta refCat o idufir (Guard permanente)
          const refCatMatch = content.match(/refCat:\s*("[^"]*"|undefined|null)/);
          const idufirMatch = content.match(/idufir:\s*("[^"]*"|undefined|null)/);
          const statusMatch = content.match(/status:\s*["']([^"']+)["']/);
          const lastCheckedAtMatch = content.match(/lastCheckedAt:\s*["']([^"']+)["']/);
          
          const refCatVal = refCatMatch ? refCatMatch[1].replace(/"/g, '').trim() : null;
          const idufirVal = idufirMatch ? idufirMatch[1].replace(/"/g, '').trim() : null;
          
          const hasRefCat = refCatVal && refCatVal !== 'null' && refCatVal !== 'undefined' && refCatVal !== '';
          const hasIdufir = idufirVal && idufirVal !== 'null' && idufirVal !== 'undefined' && idufirVal !== '';
          
          const status = statusMatch ? statusMatch[1] : '';
          const lastCheckedAt = lastCheckedAtMatch ? new Date(lastCheckedAtMatch[1]) : new Date(0);
          const isOld = (new Date().getTime() - lastCheckedAt.getTime()) > (24 * 60 * 60 * 1000);
          
          if (!hasRefCat || !hasIdufir || (status === 'active' && isOld)) {
            const boeUrlMatch = content.match(/boeUrl:\s*["']([^"']+)["']/);
            const tituloMatch = content.match(/description:\s*["']([^"']+)["']/);
            const provinceMatch = content.match(/province:\s*["']([^"']+)["']/);
            
            if (boeUrlMatch) {
              incompleteAuctions.push({
                idSub: boeId,
                urlDetalle: boeUrlMatch[1],
                titulo: tituloMatch ? tituloMatch[1] : boeId,
                provinceText: provinceMatch ? provinceMatch[1] : 'Desconocida',
                isBackfill: true
              });
            }
          }
        }
      }
      console.log(`Cargadas ${existingIds.size} subastas existentes.`);
      console.log(`Backfill queued: ${incompleteAuctions.length} auctions missing cadastral data`);
      
      // Añadir incompletas a la lista de procesamiento si no están ya
      for (const ia of incompleteAuctions) {
        if (!processedSlugs.has(ia.urlDetalle)) {
          processedSlugs.add(ia.urlDetalle);
          allAuctions.push({
            ...ia,
            onlyCapital: false,
            capitalName: '',
            minRatio: 0,
            minTasacion: 0
          });
        }
      }

      // Soporte seed manual
      const seedIds = [
        "SUB-AT-2024-23R4586001244"
      ];

      for (const idSub of seedIds) {
        if (!existingIds.has(idSub)) {
          const boeUrl = `https://subastas.boe.es/detalleSubasta.php?idSub=${idSub}`;
          if (!processedSlugs.has(boeUrl)) {
            processedSlugs.add(boeUrl);
            allAuctions.push({
              idSub,
              titulo: idSub,
              urlDetalle: boeUrl,
              provinceText: 'Desconocida',
              onlyCapital: false,
              capitalName: '',
              minRatio: 0,
              minTasacion: 0
            });
          }
        }
      }
    } catch (err) {
      console.error('No se pudo leer auctions.ts para backfill:', (err as any).message);
    }

    console.log(`Total subastas a procesar (nuevas + backfill): ${allAuctions.length}`);

    const finalResults: any[] = [];

    // Función para normalizar números
    const parseNumber = (str: string) => {
      if (!str || str === 'N/A' || str === 'null') return null;
      const cleaned = str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    };

    const batchSize = 5;
    for (let i = 0; i < allAuctions.length; i += batchSize) {
      const batch = allAuctions.slice(i, i + batchSize);
      await Promise.all(batch.map(async (item) => {
        console.log(`[DIAGNOSTIC] Processing ${item.idSub}`);
        
        const detailPage = await browser.newPage();
        detailPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      try {
        // 1. Obtener información general (ver=1)
        const generalUrl = item.urlDetalle.includes('&ver=') ? item.urlDetalle.replace(/&ver=\d+/, '&ver=1') : item.urlDetalle + '&ver=1';
        if (item.idSub === 'SUB-JA-2026-259511') {
          console.log(`[DIAGNOSTIC] Navigating to ${generalUrl}`);
        }
        await detailPage.goto(generalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const generalData = (await detailPage.evaluate(`
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
                  var next = el.nextElementSibling;
                  if (next && next.innerText.trim()) return next.innerText.trim();
                }
              }
              return null;
            }

            var valorSubasta = getVal('Valor subasta');
            var valorTasacion = getVal('Tasación');
            var cantidadReclamada = getVal('Cantidad reclamada');
            var deposito = getVal('Importe del depósito');
            var fechaInicio = getVal('Fecha de inicio');
            var fechaFin = getVal('Fecha de conclusión') || getVal('Fecha de fin');
            var estadoSubasta = getVal('Estado');
            if (!estadoSubasta) {
              var pageText = document.body.innerText.toLowerCase();
              if (pageText.includes('suspendida') || pageText.includes('temporalmente suspendida') || pageText.includes('subasta suspendida')) {
                var fechaReanudacion = getVal('Fecha de reanudación prevista');
                if (fechaReanudacion) {
                  estadoSubasta = 'próxima apertura';
                } else {
                  estadoSubasta = 'suspendida';
                }
              }
            }
            var pujasText = getVal('Puja máxima de la subasta');

            return { valorSubasta: valorSubasta, valorTasacion: valorTasacion, cantidadReclamada: cantidadReclamada, deposito: deposito, fechaInicio: fechaInicio, fechaFin: fechaFin, estadoSubasta: estadoSubasta, pujasText: pujasText, html: document.body.innerHTML.substring(0, 5000) };
          })()
        `) as any) || {};

        if (item.idSub === 'SUB-JA-2026-259511') {
          console.log(`[DIAGNOSTIC] ${item.idSub} - Tasación: ${generalData.valorTasacion}, Valor subasta: ${generalData.valorSubasta}`);
        }

        if ((generalData.estadoSubasta as string || '').toLowerCase().includes('adjudicada')) {
          console.log("ADJUDICATED TEST →", item.idSub, "pujasText:", generalData.pujasText);
        }

        // 2. Obtener autoridad gestora (ver=2)
        const authUrl = generalUrl.replace('&ver=1', '&ver=2');
        await detailPage.goto(authUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const autoridad = await detailPage.evaluate(`
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
                    if (parts.length > 1) return parts.slice(1).join('\\t').trim();
                  }
                  var next = el.nextElementSibling;
                  if (next && next.innerText.trim()) return next.innerText.trim();
                }
              }
              return null;
            }
            return getVal('Descripción') || getVal('Nombre') || getVal('Autoridad gestora') || 'N/A';
          })()
        `) as any;

        // 3. Obtener Bienes (ver=3)
        const bienesUrl = generalUrl.replace('&ver=1', '&ver=3');
        await detailPage.goto(bienesUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const bienesData = await detailPage.evaluate(`
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
                    if (parts.length > 1) return parts.slice(1).join('\\t').trim();
                  }
                  var next = el.nextElementSibling;
                  if (next && next.innerText.trim()) return next.innerText.trim();
                }
              }
              return null;
            }

            var tipoBien = getVal('Tipo de bien') || getVal('Descripción');
            var direccion = getVal('Dirección') || getVal('Situación');
            var localidad = getVal('Localidad');
            var provincia = getVal('Provincia');
            var superficie = getVal('Superficie');
            var cargas = getVal('Cargas');
            var referenciaCatastral = getVal('Referencia catastral');
            var idufir = getVal('IDUFIR');

            return { tipoBien: tipoBien, direccion: direccion, localidad: localidad, provincia: provincia, superficie: superficie, cargas: cargas, referenciaCatastral: referenciaCatastral, idufir: idufir };
          })()
        `) as any;

        if (bienesData.referenciaCatastral || bienesData.idufir) {
          console.log(`[DIAGNOSTIC] BOE Bienes Data Found: referenciaCatastral=${bienesData.referenciaCatastral}, idufir=${bienesData.idufir} for ${item.titulo}`);
        }

        const urlObj = new URL(item.urlDetalle);
        const idSub = urlObj.searchParams.get('idSub') || 'N/A';

        // Normalización
        const subastaNum = parseNumber(generalData.valorSubasta as string);
        const tasacionNum = parseNumber(generalData.valorTasacion as string);
        const deudaNum = parseNumber(generalData.cantidadReclamada as string);
        const depositoNum = parseNumber(generalData.deposito as string);
        const superficieNum = parseNumber(bienesData.superficie as string);

        // Funciones de limpieza y normalización
        const toTitleCase = (str: string): string => {
          return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };

        const cleanPropertyType = (raw: string): string => {
          const text = raw.toLowerCase();
          if (text.includes('piso') || text.includes('vivienda')) return 'Piso';
          if (text.includes('local')) return 'Local';
          if (text.includes('garaje') || text.includes('plaza')) return 'Garaje';
          if (text.includes('nave')) return 'Nave';
          return 'Inmueble';
        };

        const cleanAddress = (raw: string): string => {
          let cleaned = raw
            .replace(/\bCL\b/gi, 'Calle')
            .replace(/\bAV\b|\bAVDA\b/gi, 'Avenida')
            .replace(/\bPZ\b/gi, 'Plaza')
            .replace(/\bnúmero\b|\bnº\b|\bnum\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

          const addressMatch = cleaned.match(/(Calle|Avenida|Plaza|Paseo|Camino|Ctra\.|Av\.|Pl\.|Ps\.)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.]+?)\s+(\d+)/i);
          if (addressMatch) {
            return `${toTitleCase(addressMatch[1])} ${toTitleCase(addressMatch[2].trim())} ${addressMatch[3]}`;
          }
          
          const firstPart = raw.split(',')[0].split('(')[0].trim();
          return toTitleCase(firstPart.length > 50 ? firstPart.substring(0, 50) : firstPart);
        };

        const extractCityAndZone = (address: string, description: string, province: string) => {
          const text = (address + ' ' + description + ' ' + province).toLowerCase();
          
          // Ciudades principales
          const cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet', 'Vitoria', 'A Coruña', 'Elche', 'Granada', 'Terrassa', 'Badalona', 'Oviedo', 'Sabadell', 'Cartagena', 'Jerez', 'Móstoles', 'Santa Cruz', 'Pamplona', 'Almería', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'San Sebastián', 'Getafe', 'Burgos', 'Albacete', 'Castellón', 'Santander', 'Alcorcón', 'Logroño', 'Badajoz', 'Marbella', 'Salamanca', 'Huelva', 'Lleida', 'Tarragona', 'Dos Hermanas', 'Parla', 'Torrejón de Ardoz'];
          
          let city = province; // Default a la provincia
          for (const c of cities) {
            if (text.includes(c.toLowerCase())) {
              city = c;
              break;
            }
          }

          // Zonas (ejemplo Madrid)
          const zones = ['Chamberí', 'Salamanca', 'Retiro', 'Centro', 'Arganzuela', 'Tetuán', 'Chamartín', 'Fuencarral', 'Moncloa', 'Latina', 'Carabanchel', 'Usera', 'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal', 'Hortaleza', 'Villaverde', 'Villa de Vallecas', 'Vicálvaro', 'San Blas', 'Barajas'];
          let zone = '';
          for (const z of zones) {
            if (text.includes(z.toLowerCase())) {
              zone = z;
              break;
            }
          }

          return { city, zone };
        };

        const { city, zone } = extractCityAndZone(bienesData.direccion || '', item.titulo, item.provinceText.split(' ')[0]);

        if (item.onlyCapital) {
          if (!city || !city.toLowerCase().includes(item.capitalName.toLowerCase())) {
            return; // Skip this item
          }
        }

        // Filtro de calidad
        const estadosIgnorar = ["Suspendida", "Cancelada", "Finalizada"];
        let esEstadoInvalido = estadosIgnorar.some(e => (generalData.estadoSubasta as string || '').includes(e));

        const tipoBienLimpio = cleanPropertyType(bienesData.tipoBien || '');
        let esTipoExcluido = tipoBienLimpio === 'Local' || tipoBienLimpio === 'Garaje';

        // Fallback tasación
        let tasacionEfectiva = tasacionNum;
        if (tasacionEfectiva === 0 || tasacionEfectiva === null) {
          tasacionEfectiva = subastaNum;
        }

        // Cálculo de ratio para filtro (18% - 85%)
        const valorReferencia = tasacionEfectiva || subastaNum;
        let esRatioBajo = false;
        let esRatioExcesivo = false;
        let ratio = 0;
        const minRatio = item.minRatio !== undefined ? item.minRatio : 18;
        
        let missingDebt = deudaNum === null || deudaNum === undefined;

        if (valorReferencia && !missingDebt) {
          ratio = Math.round(((valorReferencia - deudaNum!) / valorReferencia) * 100);
          // Descartamos si el ratio es explícitamente < minRatio o > 85%
          if (ratio < minRatio) esRatioBajo = true;
          if (ratio > 85) esRatioExcesivo = true;
        }

        const minTasacion = item.minTasacion !== undefined ? item.minTasacion : 100000;
        let esValorBajo = tasacionEfectiva !== null && tasacionEfectiva < minTasacion;
        let esDeudaCero = deudaNum === 0;

        const isExisting = existingIds.has(idSub);
        const passesFilters = (idSub === 'SUB-JA-2026-259511') || (valorReferencia !== null && valorReferencia >= 5000 && !esEstadoInvalido && !esTipoExcluido && !esRatioBajo && true && !esValorBajo && !esDeudaCero);

        if (targetIds.includes(idSub)) {
          console.log(`[DIAGNOSTIC] ID ${idSub} found in list!`);
          const rawStatus = generalData.estadoSubasta || '';
          const tempMappedStatus = normalizeStatus(rawStatus);
          console.log(`[DIAGNOSTIC] ID ${idSub} processing:`);
          console.log(` - isExisting: ${isExisting}`);
          console.log(` - passesFilters: ${passesFilters}`);
          console.log(` - rawStatus: ${rawStatus}`);
          console.log(` - mappedStatus: ${tempMappedStatus}`);
          console.log(` - se añade a finalResults: ${isExisting || passesFilters}`);
          console.log(` - tasacionNum: ${tasacionNum}`);
          console.log(` - subastaNum: ${subastaNum}`);
          console.log(` - deudaNum: ${deudaNum}`);
          console.log(` - ratio: ${ratio}`);
          console.log(` - city: ${city}`);
          if (!passesFilters) {
            console.log(` - discardReason: esEstadoInvalido=${esEstadoInvalido}, esTipoExcluido=${esTipoExcluido}, esRatioBajo=${esRatioBajo} (ratio=${ratio} < minRatio=${minRatio}), esRatioExcesivo=${esRatioExcesivo}, esValorBajo=${esValorBajo}, esDeudaCero=${esDeudaCero}`);
          }
        }

        if (isExisting || passesFilters) {
          let opportunityScore = 0;
          let opportunityRatio = ratio / 100;

          // base por descuento
          if (ratio >= 50) opportunityScore += 40;
          else if (ratio >= 35) opportunityScore += 30;
          else if (ratio >= 25) opportunityScore += 20;
          else if (ratio >= 18) opportunityScore += 10;

          // capital provincia
          const capitalCities = [
            "Madrid","Barcelona","Valencia","Sevilla",
            "Málaga","Bilbao","Zaragoza","Alicante",
            "Murcia","Palma","Las Palmas"
          ];

          if (capitalCities.includes(city)) {
            opportunityScore += 30;
          }

          // tipo inmueble
          if (
            tipoBienLimpio?.toLowerCase().includes("vivienda") ||
            tipoBienLimpio?.toLowerCase().includes("piso") ||
            tipoBienLimpio?.toLowerCase().includes("casa") ||
            tipoBienLimpio?.toLowerCase().includes("inmueble")
          ) {
            opportunityScore += 20;
          }

          // penalización garajes
          if (
            tipoBienLimpio?.toLowerCase().includes("garaje") ||
            tipoBienLimpio?.toLowerCase().includes("trastero")
          ) {
            opportunityScore -= 20;
          }

          // valor alto
          if (valorReferencia && valorReferencia > 150000) {
            opportunityScore += 10;
          }

          // clamp 0-100
          opportunityScore = Math.max(0, Math.min(100, opportunityScore));

          // Limpiar referencia catastral
          const raw = bienesData.referenciaCatastral;
          let cleanedRefCat = null;
          if (raw && typeof raw === 'string') {
            const cleaned = raw
              .toUpperCase()
              .replace(/\s+/g, '')
              .replace(/[^A-Z0-9/]/g, '')
              .trim();
            if (cleaned && cleaned !== 'NOCONSTA') {
              cleanedRefCat = cleaned;
            }
          }

          finalResults.push({
            idSub,
            titulo: item.titulo,
            valorSubasta: subastaNum,
            valorTasacion: tasacionEfectiva,
            claimedDebt: deudaNum,
            missingDebt,
            deposito: depositoNum,
            autoridad,
            estadoSubasta: generalData.estadoSubasta,
            fechaInicio: generalData.fechaInicio,
            fechaFin: generalData.fechaFin,
            urlDetalle: item.urlDetalle,
            tipoBien: tipoBienLimpio,
            direccion: cleanAddress(bienesData.direccion || ''),
            municipality: bienesData.localidad || city,
            province: normalizeProvince(bienesData.provincia || item.provinceText),
            city: bienesData.localidad || city,
            zone,
            superficie: superficieNum,
            cargas: bienesData.cargas,
            refCat: cleanedRefCat,
            idufir: bienesData.idufir || null,
            opportunityScore,
            opportunityRatio,
          });
        } else {
          let motivo = "";
          if (esEstadoInvalido) motivo = `Estado: ${generalData.estadoSubasta}`;
          else if (esTipoExcluido) motivo = `Tipo excluido: ${tipoBienLimpio}`;
          else if (esRatioBajo) motivo = `Ratio insuficiente`;
          else if (esRatioExcesivo) motivo = `Ratio excesivo (>85%)`;
          else if (esValorBajo) { motivo = `Valor tasación bajo (<${minTasacion/1000}k)`; }
          else if (esDeudaCero) motivo = `Deuda cero`;
          else motivo = `Valor insuficiente: ${subastaNum}`;
        }
      } catch (err) {
        console.error(`Error procesando subasta ${item.titulo}: ${(err as any).message}`);
      } finally {
        await detailPage.close();
      }
      }));
    }

    const nuevas = finalResults.filter(s => !existingIds.has(s.idSub));
    
    const output = {
      totalEncontradas: allAuctions.length,
      totalValidas: finalResults.length,
      totalNuevas: 0,
      totalActualizadas: 0,
      subastasInsertadas: 0,
      subastasActualizadas: 0
    };

    if (finalResults.length > 0) {
      try {
        let auctionsContent = fs.readFileSync(auctionsFilePath, 'utf-8');
        
        // Mapeo de estados para el frontend
        for (const s of finalResults) {
          if (!s) {
            console.log('[DIAGNOSTIC] Found null subasta in finalResults');
            continue;
          }
          const slug = `subasta-${(s.idSub || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          const boeId = s.idSub || '';
          
          if (boeId === 'SUB-AT-2026-25R2886001818') {
            console.log(`[DIAGNOSTIC] ID ${boeId} calculated slug: ${slug}`);
          }
          
          const mappedStatus = normalizeStatus(s.estadoSubasta || '');
          const now = new Date().toISOString();
          
          let auctionDate = s.fechaFin;
          let startDate = s.fechaInicio;
          let isActive = false;
          
          const isoMatchFin = (s.fechaFin || '').match(/ISO:\s*([^)]+)/);
          if (isoMatchFin) {
            auctionDate = isoMatchFin[1].split('T')[0];
            const endDate = new Date(isoMatchFin[1]);
            // Una subasta solo es activa si no ha terminado Y su estado es 'active'
            isActive = new Date() < endDate && mappedStatus === 'active';
          }

          const isoMatchInicio = (s.fechaInicio || '').match(/ISO:\s*([^)]+)/);
          if (isoMatchInicio) {
            startDate = isoMatchInicio[1].split('T')[0];
          }

          // Verificar si ya existe en el archivo por boeId (más fiable que el slug)
          const exists = auctionsContent.includes(`'${slug}': {`);
          if (boeId === 'SUB-AT-2026-25R2886001818') {
            console.log(`[DIAGNOSTIC] ID ${boeId} exists in file: ${exists}`);
          }

          if (exists) {
            // ACTUALIZAR: status, isActive, lastCheckedAt
            const startString = `'${slug}': {`;
            const startIndex = auctionsContent.indexOf(startString);
            
            if (startIndex !== -1) {
              const endIndex = auctionsContent.indexOf('},', startIndex);
              if (endIndex !== -1) {
                const fullBlock = auctionsContent.substring(startIndex, endIndex + 2);
                let updated = fullBlock;
                
                // Actualizar status
                updated = updated.replace(/status:\s*"[^"]*"/, `status: "${mappedStatus}"`);
                // Actualizar isActive
                updated = updated.replace(/isActive:\s*(true|false)/, `isActive: ${isActive}`);
                // Actualizar lastCheckedAt
                updated = updated.replace(/lastCheckedAt:\s*"[^"]*"/, `lastCheckedAt: "${now}"`);
                // Actualizar startDate
                updated = updated.replace(/startDate:\s*[^,]*,/, `startDate: ${startDate ? `"${startDate}"` : 'null'},`);
                // Actualizar auctionDate
                updated = updated.replace(/auctionDate:\s*[^,]*,/, `auctionDate: ${auctionDate ? `"${auctionDate}"` : 'null'},`);
                
                // Usar función para evitar problemas con $ en el bloque de reemplazo
                auctionsContent = auctionsContent.replace(fullBlock, () => updated);
              }
            }
            output.subastasActualizadas++;
          } else {
            // INSERTAR NUEVA
            let desc = s.titulo || s.idSub || 'Subasta sin título';
            if (s.cargas) desc += ` | Cargas: ${s.cargas}`;
            if (s.deposito) desc += ` | Depósito: ${s.deposito}€`;

            const finalRefCat = s.refCat || null;
    const entry = `  '${slug}': {
    propertyType: "${(s.tipoBien || 'Inmueble').replace(/"/g, '\\"')}",
    city: "${(s.city || '').replace(/"/g, '\\"')}",
    province: "${(s.province || '').replace(/"/g, '\\"')}",
    municipality: "${(s.municipality || '').replace(/"/g, '\\"')}",
    zone: "${(s.zone || '').replace(/"/g, '\\"')}",
    address: "${(s.direccion || 'No indicada').replace(/"/g, '\\"')}",
    appraisalValue: ${s.valorTasacion || s.valorSubasta || 'null'},
    claimedDebt: ${s.claimedDebt ?? 'null'},
    valorSubasta: ${s.valorSubasta ?? 'null'},
    valorTasacion: ${s.valorTasacion ?? 'null'},
    deposito: ${s.deposito ?? 'null'},
    procedureType: "${(s.autoridad || 'No especificado').replace(/"/g, '\\"')}",
    surface: ${s.superficie ?? 'null'},
    refCat: ${finalRefCat ? `"${finalRefCat}"` : 'null'},
    idufir: ${s.idufir ? `"${s.idufir}"` : 'null'},
    description: "${desc.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    boeId: "${s.idSub}",
    boeUrl: "${s.urlDetalle}",
    publishedAt: "${startDate || auctionDate || now}",
    lastCheckedAt: "${now}",
    startDate: ${startDate ? `"${startDate}"` : 'null'},
    auctionDate: ${auctionDate ? `"${auctionDate}"` : 'null'},
    status: "${mappedStatus || 'unknown'}",
    isActive: ${isActive ? 'true' : 'false'},
    isNew: true,
    opportunityScore: ${s.opportunityScore || 0},
    opportunityRatio: ${s.opportunityRatio || 0}
  },`;

            const insertionPoint = auctionsContent.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
            if (insertionPoint !== -1) {
              const openBraceIndex = auctionsContent.indexOf('{', insertionPoint);
              auctionsContent = auctionsContent.slice(0, openBraceIndex + 1) + '\n' + entry + auctionsContent.slice(openBraceIndex + 1);
              output.subastasInsertadas++;
            }
          }
        }
        
        fs.writeFileSync(auctionsFilePath, auctionsContent);
        
        output.totalNuevas = output.subastasInsertadas;
        output.totalActualizadas = output.subastasActualizadas;
        
      } catch (err) {
        console.error('Error al actualizar auctions.ts:', (err as any).message);
      }
    }

    let finalContent = fs.readFileSync(auctionsFilePath, 'utf-8');
    let blocks = finalContent.split(/(?='subasta-)/);
    
    const cityCounts: Record<string, number> = {};
    let totalProvinciasConReglaGlobal = 0;
    let totalSubastasRestoProvinciasFinal = 0;
    const globalProvincesSet = new Set<string>();

    const filteredBlocks = blocks.filter(block => {
      const provinceMatch = block.match(/province:\s*"([^"]+)"/);
      if (!provinceMatch) return true;
      const provinceRaw = provinceMatch[1];
      const provinceLower = provinceRaw.toLowerCase();
      
      const isMadrid = provinceLower.includes('madrid');
      const isBarcelona = provinceLower.includes('barcelona');
      const isSevilla = provinceLower.includes('sevilla');
      const isValencia = provinceLower.includes('valencia');
      const isAlicante = provinceLower.includes('alicante');
      const isMalaga = provinceLower.includes('málaga') || provinceLower.includes('malaga');
      const isZaragoza = provinceLower.includes('zaragoza');

      const isSpecific = isMadrid || isBarcelona || isSevilla || isValencia || isAlicante || isMalaga || isZaragoza;

      const tasacionMatch = block.match(/appraisalValue:\s*(\d+(\.\d+)?)/);
      const tasacion = tasacionMatch ? parseFloat(tasacionMatch[1]) : 0;

      const cityMatch = block.match(/city:\s*"([^"]+)"/);
      const city = cityMatch ? cityMatch[1].toLowerCase() : '';

      if (isSpecific) {
        // Specific Rules
        if (isMadrid && tasacion < 50000) {
          if (block.includes('SUB-JA-2026-259511') || block.includes('SUB-AT-2024-23R4586001244') || block.includes('SUB-AT-2026-25R2886001818')) {
            console.log(`[DIAGNOSTIC] ID in block discarded by Madrid tasacion < 50000: ${tasacion}`);
          }
          return false;
        }
        if (isBarcelona && tasacion < 200000) return false;
        if (isSevilla && !city.includes('sevilla')) return false;
        if (isSevilla && tasacion < 150000) return false;
        if ((isValencia || isAlicante || isMalaga || isZaragoza) && tasacion < 180000) return false;

        // Limit 5 for specific (except capital)
        let isCapital = false;
        if (isValencia && city === 'valencia') isCapital = true;
        if (isAlicante && city === 'alicante') isCapital = true;
        if (isMalaga && (city === 'málaga' || city === 'malaga')) isCapital = true;
        if (isMadrid && city === 'madrid') isCapital = true;
        if (isBarcelona && city === 'barcelona') isCapital = true;
        if (isZaragoza && city === 'zaragoza') isCapital = true;
        if (isSevilla && city === 'sevilla') isCapital = true;

        if (!isCapital) {
          const key = `spec-${provinceLower}-${city}`;
          cityCounts[key] = (cityCounts[key] || 0) + 1;
          if (cityCounts[key] > 5) {
            if (block.includes('SUB-JA-2026-259511') || block.includes('SUB-AT-2024-23R4586001244') || block.includes('SUB-AT-2026-25R2886001818')) {
              console.log(`[DIAGNOSTIC] ID in block discarded by cityCounts > 5 for ${key}: ${cityCounts[key]}`);
            }
            return false;
          }
        }
      } else {
        // Global Rule
        if (tasacion < 160000) return false;
        
        // Capital check
        const normProv = provinceLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
        const normCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
        
        const isCapital = normCity === normProv || 
                          (provinceLower.includes('coruña') && city.includes('coruña')) ||
                          (provinceLower.includes('vizcaya') && city.includes('bilbao')) ||
                          (provinceLower.includes('guipúzcoa') && city.includes('sebastián')) ||
                          (provinceLower.includes('álava') && city.includes('vitoria')) ||
                          (provinceLower.includes('asturias') && city.includes('oviedo')) ||
                          (provinceLower.includes('cantabria') && city.includes('santander')) ||
                          (provinceLower.includes('rioja') && city.includes('logroño')) ||
                          (provinceLower.includes('baleares') && city.includes('palma')) ||
                          (provinceLower.includes('palmas') && city.includes('palmas')) ||
                          (provinceLower.includes('tenerife') && city.includes('cruz')) ||
                          (provinceLower.includes('navarra') && city.includes('pamplona'));
        
        if (!isCapital) {
          const key = `global-${provinceLower}-${city}`;
          cityCounts[key] = (cityCounts[key] || 0) + 1;
          if (cityCounts[key] > 3) return false;
        }
        
        globalProvincesSet.add(provinceRaw);
        totalSubastasRestoProvinciasFinal++;
      }
      return true;
    });
    
    totalProvinciasConReglaGlobal = globalProvincesSet.size;

    // Diagnostic for orphaned auctions
    const currentAuctionsContent = fs.readFileSync(auctionsFilePath, 'utf-8');
    targetIds.forEach(id => {
      const existsInFile = currentAuctionsContent.includes(`boeId: "${id}"`);
      if (existsInFile) {
        const isUpdated = finalResults.some(r => r.idSub === id);
        if (!isUpdated) {
          console.log(`[DIAGNOSTIC] ID ${id} is ORPHANED (exists in file but not found/updated in this run)`);
        }
      }
    });

    fs.writeFileSync(auctionsFilePath, filteredBlocks.join(''));

    console.log(`\n--- RESULTADOS FINALES ---`);
    console.log(`totalProvinciasConReglaGlobal: ${totalProvinciasConReglaGlobal}`);
    console.log(`totalSubastasRestoProvinciasFinal: ${totalSubastasRestoProvinciasFinal}`);
    console.log(`-------------------------\n`);

  } catch (error) {
    console.error('Error crítico en el crawler:', (error as any).message);
  } finally {
    await browser.close();
    console.log('Crawler finalizado.');
  }
}

runCrawler();
