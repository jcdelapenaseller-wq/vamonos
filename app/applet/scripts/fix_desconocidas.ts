import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUCTIONS_FILE = path.join(process.cwd(), 'src/data/auctions.ts');
const COOKIES_FILE = path.join(process.cwd(), 'boe-cookies.json');
const COOKIES_FILE_FALLBACK = path.join(process.cwd(), 'app/applet/boe-cookies.json');

async function run() {
  console.log('Iniciando fix de provincias Desconocidas...');
  
  let content = fs.readFileSync(AUCTIONS_FILE, 'utf-8');
  const objectStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
  if (objectStart === -1) {
    console.error('No se encontró AUCTIONS');
    return;
  }

  const header = content.substring(0, objectStart);
  const auctionsBody = content.substring(objectStart);

  const entries: Record<string, string> = {};
  const regex = /'([^']+)':\s*{[\s\S]*?^  },/gm;
  let match;
  
  const desconocidas: string[] = [];

  while ((match = regex.exec(auctionsBody)) !== null) {
    const key = match[1];
    const fullEntry = match[0];
    entries[key] = fullEntry;
    
    if (fullEntry.includes('province: "Desconocida"')) {
      desconocidas.push(key);
    }
  }

  console.log(`Encontradas ${desconocidas.length} subastas con provincia Desconocida.`);
  
  if (desconocidas.length === 0) {
    console.log('No hay nada que arreglar.');
    return;
  }

  const batch = desconocidas.slice(0, 5);
  console.log(`Procesando lote de ${batch.length} vehículos...`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let cookieString = '';
  const actualCookiesFile = fs.existsSync(COOKIES_FILE) ? COOKIES_FILE : (fs.existsSync(COOKIES_FILE_FALLBACK) ? COOKIES_FILE_FALLBACK : null);
  
  if (actualCookiesFile) {
    const cookiesRaw = fs.readFileSync(actualCookiesFile, 'utf8');
    const cookies = JSON.parse(cookiesRaw);
    await page.setCookie(...cookies);
    cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
    console.log(`Cookies cargadas correctamente desde ${actualCookiesFile}.`);
  } else {
    console.log('ADVERTENCIA: No se encontró boe-cookies.json. Es posible que el BOE bloquee los documentos.');
  }

  let updatedCount = 0;
  let processedCount = 0;

  for (const key of desconocidas) {
    if (processedCount >= 5) break;
    
    const entry = entries[key];
    const boeIdMatch = entry.match(/boeId:\s*"([^"]+)"/);
    if (!boeIdMatch) continue;
    
    const boeId = boeIdMatch[1];
    console.log(`\nProcesando ${boeId}...`);
    
    const url = `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${boeId}&ver=3`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const docs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter(a => {
          const href = a.href;
          const text = a.textContent?.trim().toUpperCase() || '';
          return href.includes('.pdf') || href.includes('idDoc=') || text.includes('INFORMACIÓN ADICIONAL');
        })
        .map(a => ({ name: a.textContent?.trim() || 'Doc', url: a.href }));
    });

    console.log(`  Documentos encontrados: ${docs.length}`);

    let targetDocs = docs.filter((doc: any, index: number, self: any[]) => 
      index === self.findIndex((t) => t.url === doc.url)
    );
    
    const infoAdicionalDoc = targetDocs.find((d: any) => d.name.toUpperCase().includes('INFORMACIÓN ADICIONAL'));
    const datosVehiculoDoc = targetDocs.find((d: any) => d.name.toUpperCase().includes('DATOS VEHÍCULO'));
    
    if (infoAdicionalDoc) {
      targetDocs = [infoAdicionalDoc];
    } else if (datosVehiculoDoc) {
      targetDocs = [datosVehiculoDoc];
    } else {
      const firstPdf = targetDocs.find((d: any) => d.url.toLowerCase().includes('.pdf'));
      targetDocs = firstPdf ? [firstPdf] : [];
    }

    console.log(`  Documentos a procesar: ${targetDocs.map((d: any) => d.name).join(', ')}`);

    let newProvince = 'Desconocida';
    let newCity = 'Desconocida';

    if (targetDocs.length > 0) {
      processedCount++; // Solo contamos si realmente intentamos descargar algo
      for (const doc of targetDocs) {
        try {
          console.log(`  Descargando ${doc.name}...`);
          await new Promise(resolve => setTimeout(resolve, 4000)); // 4s delay
          const result = await processBoeDocument(doc.url, boeId, doc.name, cookieString);
          if (result.info.province) newProvince = result.info.province;
          if (result.info.municipality) newCity = result.info.municipality;
        } catch (e) {
          console.log(`  ! Error procesando doc: ${(e as Error).message}`);
        }
      }
    } else {
      console.log(`  -> Sin documentos clave. Marcando como procesado para no atascarse.`);
      // Lo marcamos con un espacio al final para que no vuelva a salir en la regex de "Desconocida" exacta, o simplemente lo ignoramos.
      // Mejor: cambiamos "Desconocida" por "No Consta" para que no vuelva a procesarse infinitamente.
      newProvince = "No Consta";
    }

    if (newProvince !== 'Desconocida') {
      console.log(`  -> ¡Provincia encontrada/actualizada!: ${newProvince}`);
      let newEntry = entry.replace(/province:\s*"Desconocida"/, `province: "${newProvince}"`);
      if (newCity !== 'Desconocida') {
        newEntry = newEntry.replace(/city:\s*"Desconocida"/, `city: "${newCity}"`);
      }
      entries[key] = newEntry;
      updatedCount++;
    } else {
      console.log(`  -> Sigue siendo Desconocida.`);
    }
  }

  await browser.close();

  if (updatedCount > 0) {
    const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
      Object.values(entries).join('\n') + 
      '\n};';
    fs.writeFileSync(AUCTIONS_FILE, header + newAuctionsBody);
    console.log(`\n¡Dataset actualizado! Se arreglaron ${updatedCount} subastas.`);
  } else {
    console.log('\nNo se pudo arreglar ninguna subasta.');
  }
}

run();
