import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUCTIONS_FILE = path.join(process.cwd(), 'src/data/auctions.ts');
const COOKIES_FILE = path.join(process.cwd(), 'boe-cookies.json');

async function run() {
  console.log('Iniciando reprocesamiento COMPLETO de vehículos...');
  
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
  
  const vehiclesToProcess: string[] = [];

  while ((match = regex.exec(auctionsBody)) !== null) {
    const key = match[1];
    const fullEntry = match[0];
    entries[key] = fullEntry;
    
    if (fullEntry.includes('assetCategory: "vehiculo"')) {
      vehiclesToProcess.push(key);
    }
  }

  console.log(`Encontrados ${vehiclesToProcess.length} vehículos para reprocesar.`);
  
  if (vehiclesToProcess.length === 0) {
    console.log('No hay vehículos.');
    return;
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let cookieString = '';
  const COOKIES_FILE_FALLBACK = path.join(process.cwd(), 'app/applet/boe-cookies.json');
  const actualCookiesFile = fs.existsSync(COOKIES_FILE) ? COOKIES_FILE : (fs.existsSync(COOKIES_FILE_FALLBACK) ? COOKIES_FILE_FALLBACK : null);
  
  if (actualCookiesFile) {
    const cookiesRaw = fs.readFileSync(actualCookiesFile, 'utf8');
    const cookies = JSON.parse(cookiesRaw);
    await page.setCookie(...cookies);
    cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
    console.log(`Cookies cargadas correctamente desde ${actualCookiesFile}.`);
  } else {
    console.log('ADVERTENCIA: No se encontró boe-cookies.json.');
  }

  let updatedCount = 0;

  for (const key of vehiclesToProcess) {
    const entry = entries[key];
    const boeIdMatch = entry.match(/boeId:\s*"([^"]+)"/);
    if (!boeIdMatch) continue;
    
    const boeId = boeIdMatch[1];
    console.log(`\nProcesando ${boeId}...`);
    
    // Skip fake IDs that don't start with SUB-
    if (!boeId.startsWith('SUB-')) {
      console.log(`  -> ID no válido para BOE (${boeId}). Saltando.`);
      continue;
    }

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

    let detectedProvince = '';
    let detectedCity = '';

    if (targetDocs.length > 0) {
      for (const doc of targetDocs) {
        try {
          console.log(`  Descargando ${doc.name}...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay to speed up
          const result = await processBoeDocument(doc.url, boeId, doc.name, cookieString);
          if (result.info.province) {
            detectedProvince = result.info.province;
            console.log(`    [DocFix] Provincia detectada en PDF: ${detectedProvince}`);
          }
          if (result.info.municipality) detectedCity = result.info.municipality;
        } catch (e) {
          console.log(`  ! Error procesando doc: ${(e as Error).message}`);
        }
      }
    }

    // Aplicar lógica crítica de asignación
    const finalProvince = detectedProvince || "No Consta";
    const finalCity = detectedCity || "No Consta";

    console.log(`  -> Provincia final: ${finalProvince}`);
    console.log(`  -> Municipio final: ${finalCity}`);
    
    // Replace province
    let newEntry = entry.replace(/province:\s*"[^"]*"/, `province: "${finalProvince}"`);
    // Replace city
    newEntry = newEntry.replace(/city:\s*"[^"]*"/, `city: "${finalCity}"`);
    
    if (newEntry !== entry) {
      entries[key] = newEntry;
      updatedCount++;
    }
  }

  await browser.close();

  if (updatedCount > 0) {
    const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
      Object.values(entries).join('\n') + 
      '\n};';
    fs.writeFileSync(AUCTIONS_FILE, header + newAuctionsBody);
    console.log(`\n¡Dataset actualizado! Se actualizaron ${updatedCount} vehículos.`);
  } else {
    console.log('\nNo hubo cambios en el dataset.');
  }
}

run();
