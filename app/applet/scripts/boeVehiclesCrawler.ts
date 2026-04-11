import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadVehicleImages } from './imageUploader';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUCTIONS_FILE = path.join(process.cwd(), 'src/data/auctions.ts');
const COOKIES_FILE = path.join(__dirname, '../boe-cookies.json');

async function injectCookies(page: any) {
  if (fs.existsSync(COOKIES_FILE)) {
    try {
      const cookiesRaw = fs.readFileSync(COOKIES_FILE, 'utf8');
      const cookies = JSON.parse(cookiesRaw);
      await page.setCookie(...cookies);
      console.log('✅ Cookies de sesión inyectadas desde boe-cookies.json');
      
      // Generar string de cookies para fetch manual
      const cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
      return cookieString;
    } catch (err) {
      console.error('❌ Error al cargar boe-cookies.json:', err);
    }
  } else {
    console.log('ℹ️ No se encontró boe-cookies.json. Navegando en modo público (sin imágenes restringidas).');
  }
  return null;
}

async function checkSession(page: any) {
  const isAuth = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes('Cerrar sesión') || !bodyText.includes('Iniciar sesión');
  });
  
  if (isAuth) {
    console.log('✅ Sesión de usuario detectada como ACTIVA.');
  } else {
    console.log('⚠️ Sesión de usuario NO detectada o expirada.');
  }
  return isAuth;
}

async function runCrawler() {
  console.log('Iniciando crawler de vehículos en modo shadow...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Inyectar cookies si existen
    const cookieString = await injectCookies(page);

    console.log('Navegando a la búsqueda avanzada...');
    await page.goto('https://subastas.boe.es/subastas_ava.php', { waitUntil: 'domcontentloaded', timeout: 60000 });

    if (cookieString) {
      await checkSession(page);
    }

    // Seleccionar Vehículos (dato[3] = "V") y Celebrándose (dato[2] = "EJ")
    await page.evaluate(() => {
      (document.querySelector('input[name="dato[3]"][value="V"]') as HTMLInputElement).checked = true;
      (document.querySelector('input[name="dato[2]"][value="EJ"]') as HTMLInputElement).checked = true;
      (document.querySelector('input[type="submit"][value="Buscar"]') as HTMLInputElement).click();
    });

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.resultado-busqueda li')).slice(0, 5); // Check more to find images
      return items.map(li => {
        const anchor = li.querySelector('a[href*="subastas_det.php"]') || li.querySelector('a[href*="idSub="]');
        const href = anchor ? anchor.getAttribute('href') : null;
        const urlDetalle = href ? (href.startsWith('http') ? href : 'https://subastas.boe.es/' + href.replace(/^\.\//, '')) : null;
        
        let titulo = '';
        const h3 = li.querySelector('h3, h4, strong');
        titulo = h3 ? (h3 as HTMLElement).innerText.trim() : ((li.querySelector('a') as HTMLElement | null)?.innerText.trim() || 'Subasta');
        titulo = titulo.replace(/^Más\.\.\.\s*/, '');
        
        return { titulo, urlDetalle };
      }).filter(r => r.urlDetalle);
    });

    console.log(`Encontrados ${results.length} vehículos para procesar.`);

    const newVehicles: any[] = [];

    for (const item of results) {
      if (!item.urlDetalle) continue;
      
      console.log(`\nProcesando: ${item.titulo}`);
      console.log(`URL Detalle: ${item.urlDetalle}`);
      const detailPage = await browser.newPage();
      
      try {
        // VER 1 (General)
        const generalUrl = item.urlDetalle.includes('&ver=') ? item.urlDetalle.replace(/&ver=\d+/, '&ver=1') : item.urlDetalle + '&ver=1';
        await detailPage.goto(generalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const generalData = await detailPage.evaluate(() => {
          const data: any = {};
          const elements = Array.from(document.querySelectorAll('th, td, dt, dd'));
          for (let i = 0; i < elements.length; i++) {
            const text = elements[i].textContent?.trim() || '';
            if (text.includes('Identificador') && elements[i+1]) data.id = elements[i+1].textContent?.trim();
            if (text.includes('Valor subasta') && elements[i+1]) data.valor = elements[i+1].textContent?.trim();
            if (text.includes('Tasación') && elements[i+1]) data.tasacion = elements[i+1].textContent?.trim();
            if (text.includes('Fecha de conclusión') && elements[i+1]) data.fechaConclusion = elements[i+1].textContent?.trim();
          }
          return data;
        });

        // VER 3 (Bienes)
        const bienesUrl = generalUrl.replace('&ver=1', '&ver=3');
        await detailPage.goto(bienesUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const bienesData = await detailPage.evaluate(() => {
          const data: any = {};
          const elements = Array.from(document.querySelectorAll('th, td, dt, dd'));
          for (let i = 0; i < elements.length; i++) {
            const text = elements[i].textContent?.trim() || '';
            if (text === 'Matrícula' && elements[i+1]) data.matricula = elements[i+1].textContent?.trim();
            if (text === 'Marca' && elements[i+1]) data.marca = elements[i+1].textContent?.trim();
            if (text === 'Modelo' && elements[i+1]) data.modelo = elements[i+1].textContent?.trim();
            if (text === 'Número de bastidor' && elements[i+1]) data.bastidor = elements[i+1].textContent?.trim();
            if (text === 'Fecha de matriculación' && elements[i+1]) data.fechaMatriculacion = elements[i+1].textContent?.trim();
            if (text === 'Información adicional' && elements[i+1]) data.infoAdicional = elements[i+1].textContent?.trim();
          }
          
          // Images
          data.images = Array.from(document.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => !src.includes('logo') && !src.includes('ayuda') && !src.includes('portal_subastas'));

          // Documents (PDFs)
          data.docs = Array.from(document.querySelectorAll('a[href*=".pdf"], a[href*="idDoc="]'))
            .map(a => {
              const name = a.textContent?.trim() || 'Documento';
              const url = (a as HTMLAnchorElement).href;
              return { name, url };
            });
          
          if (data.docs.length > 0) {
            console.log(`    [Debug] Documentos encontrados: ${data.docs.map((d: any) => d.name).join(', ')}`);
          }
            
          return data;
        });

        const parseNumber = (str: string) => {
          if (!str || str === 'N/A' || str === 'null') return undefined;
          const cleaned = str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? undefined : num;
        };

        const yearMatch = bienesData.fechaMatriculacion?.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
        
        const vehicleId = generalData.id || `V-${Date.now()}`;
        
        console.log(`  -> Subiendo imágenes a Cloudinary (${(bienesData.images || []).length} encontradas)...`);
        const finalImages = await uploadVehicleImages(bienesData.images || [], vehicleId, cookieString || undefined);
        console.log(`  -> Imágenes subidas: ${finalImages.length}`);
        if (finalImages.length > 0) {
          console.log(`  -> URL CLOUDINARY: ${finalImages[0]}`);
        }

        // Procesar Documentos
        const documents: any[] = [];
        let extractedLocation: any = {};

        if (bienesData.docs && bienesData.docs.length > 0) {
          // Filtrar duplicados
          const uniqueDocs = bienesData.docs.filter((doc: any, index: number, self: any[]) => 
            index === self.findIndex((t) => t.url === doc.url)
          );

          console.log(`  -> Procesando ${uniqueDocs.length} documentos únicos...`);
          for (const doc of uniqueDocs) {
            try {
              // Delay para evitar rate limit (BOE es sensible)
              await new Promise(resolve => setTimeout(resolve, 3000));

              const result = await processBoeDocument(doc.url, vehicleId, doc.name, cookieString || undefined);
              documents.push(result.doc);
              // Mezclar info extraída (priorizando la más completa)
              extractedLocation = { ...extractedLocation, ...result.info };
            } catch (err) {
              // No logueamos el error completo aquí para no ensuciar, ya lo hace processBoeDocument
              console.log(`     ! Error con documento ${doc.name}`);
            }
          }
        }

        const vehicle = {
          id: vehicleId,
          boeId: vehicleId,
          title: item.titulo,
          type: 'Vehículo',
          status: 'active',
          value: parseNumber(generalData.valor) || 0,
          appraisal: parseNumber(generalData.tasacion) || 0,
          province: extractedLocation.province || 'Desconocida',
          city: extractedLocation.municipality || 'Desconocida',
          publishedAt: new Date().toISOString(),
          auctionDate: generalData.fechaConclusion ? generalData.fechaConclusion.split(' ')[0] : undefined,
          boeUrl: generalUrl,
          assetCategory: 'vehiculo',
          brand: bienesData.marca,
          model: bienesData.modelo,
          licensePlate: bienesData.matricula,
          year: year,
          vin: bienesData.bastidor,
          images: finalImages,
          // Nuevos campos
          municipality: extractedLocation.municipality,
          pickupLocation: extractedLocation.pickupLocation,
          locationText: extractedLocation.locationText,
          documents: documents
        };

        newVehicles.push(vehicle);
        console.log(`  -> Extraído: ${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`);

      } catch (err) {
        console.error(`Error extrayendo detalles de ${item.titulo}:`, err);
      } finally {
        await detailPage.close();
      }
    }

    console.log(`\nSe extrajeron ${newVehicles.length} vehículos en modo shadow.`);
    
    // Save to dataset
    if (newVehicles.length > 0) {
      let content = fs.readFileSync(AUCTIONS_FILE, 'utf-8');
      
      // Find the object
      const objectStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
      if (objectStart !== -1) {
        const insertPos = content.indexOf('{', objectStart) + 1;
        
        let newEntries = '';
        for (const v of newVehicles) {
          const slug = `subasta-${v.id.toLowerCase()}`;
          newEntries += `
  '${slug}': {
    boeId: "${v.boeId}",
    status: "${v.status}",
    valorSubasta: ${v.value},
    valorTasacion: ${v.appraisal},
    province: "${v.province}",
    city: "${v.city}",
    publishedAt: "${v.publishedAt}",
    auctionDate: ${v.auctionDate ? `"${v.auctionDate}"` : 'undefined'},
    boeUrl: "${v.boeUrl}",
    assetCategory: "vehiculo",
    brand: ${v.brand ? `"${v.brand}"` : 'undefined'},
    model: ${v.model ? `"${v.model}"` : 'undefined'},
    licensePlate: ${v.licensePlate ? `"${v.licensePlate}"` : 'undefined'},
    year: ${v.year ? v.year : 'undefined'},
    vin: ${v.vin ? `"${v.vin}"` : 'undefined'},
    images: ${JSON.stringify(v.images)},
    municipality: ${v.municipality ? `"${v.municipality}"` : 'undefined'},
    pickupLocation: ${v.pickupLocation ? `"${v.pickupLocation}"` : 'undefined'},
    locationText: ${v.locationText ? `"${v.locationText}"` : 'undefined'},
    documents: ${JSON.stringify(v.documents)}
  },`;
        }
        
        content = content.slice(0, insertPos) + newEntries + content.slice(insertPos);
        fs.writeFileSync(AUCTIONS_FILE, content);
        console.log('Dataset actualizado con los nuevos vehículos en modo shadow.');
      }
    }

  } catch (e) {
    console.error('Error en el crawler:', e);
  } finally {
    await browser.close();
  }
}

runCrawler();
