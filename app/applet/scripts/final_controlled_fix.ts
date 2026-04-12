import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { processBoeDocument } from './documentProcessor.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_ROOT = '/app/applet';
const AUCTIONS_FILE = path.join(APP_ROOT, 'src/data/auctions.ts');
const COOKIES_FILE = path.join(APP_ROOT, 'boe-cookies.json');

async function run() {
  console.log('--- EJECUCIÓN CONTROLADA FINAL ---');
  
  if (!fs.existsSync(AUCTIONS_FILE)) {
    console.error(`No se encontró el archivo de subastas en: ${AUCTIONS_FILE}`);
    return;
  }

  let content = fs.readFileSync(AUCTIONS_FILE, 'utf-8');
  const objectStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
  if (objectStart === -1) {
    console.error('No se encontró el objeto AUCTIONS');
    return;
  }

  const header = content.substring(0, objectStart);
  const auctionsBody = content.substring(objectStart);

  // BoeIds específicos a procesar (3 vehículos)
  const targetBoeIds = [
    "SUB-AT-2026-26R4586002004", // Toyota C-HR
    "SUB-AT-2026-25R0886002225", // Citroen Berlingo
    "SUB-AT-2026-25R4186002113"  // El de Malaga
  ];

  console.log(`Objetivo: Procesar ${targetBoeIds.length} vehículos específicos.`);

  let cookieString = '';
  if (fs.existsSync(COOKIES_FILE)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
    cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
    console.log('Cookies cargadas correctamente.');
  } else {
    console.error(`No se encontró boe-cookies.json en: ${COOKIES_FILE}`);
    return;
  }

  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const entries: Record<string, string> = {};
  const regex = /'([^']+)':\s*{[\s\S]*?^  },/gm;
  let match;
  
  while ((match = regex.exec(auctionsBody)) !== null) {
    entries[match[1]] = match[0];
  }

  let updatedCount = 0;

  for (const boeId of targetBoeIds) {
    // Buscar la entrada que contenga este boeId
    const key = Object.keys(entries).find(k => entries[k].includes(`boeId: "${boeId}"`));
    
    if (!key) {
      console.log(`! No se encontró entrada para boeId: ${boeId}`);
      continue;
    }

    console.log(`\nProcesando: ${boeId} (${key})`);
    const entry = entries[key];
    
    // Extraer URL del BOE
    const urlMatch = entry.match(/boeUrl:\s*"([^"]+)"/);
    if (!urlMatch) {
      console.log(`  ! No se encontró boeUrl para ${boeId}`);
      continue;
    }
    const boeUrl = urlMatch[1];

    try {
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ 'Cookie': cookieString });
      console.log(`  Navegando a: ${boeUrl}`);
      await page.goto(boeUrl, { waitUntil: 'networkidle2' });

      // Buscar documentos PDF
      const docs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="idDoc="]'));
        return links.map(l => ({
          name: l.textContent?.trim() || 'Documento',
          url: (l as HTMLAnchorElement).href
        }));
      });

      const targetDoc = docs.find(d => 
        d.name.toUpperCase().includes('INFORMACIÓN ADICIONAL') || 
        d.name.toUpperCase().includes('DATOS VEHÍCULO')
      ) || docs.find(d => d.url.toLowerCase().includes('.pdf'));

      let detectedProvince = '';
      let detectedCity = '';

      if (targetDoc) {
        console.log(`  Procesando documento: ${targetDoc.name}`);
        // Delay para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));
        const result = await processBoeDocument(targetDoc.url, boeId, targetDoc.name, cookieString);
        
        if (result.info.province) {
          detectedProvince = result.info.province;
          console.log(`    [DocFix] Provincia detectada: ${detectedProvince}`);
        }
        if (result.info.municipality) {
          detectedCity = result.info.municipality;
        }
      } else {
        console.log('  ! No se encontraron documentos PDF clave.');
      }

      // Aplicar lógica de asignación crítica
      const finalProvince = detectedProvince || "No Consta";
      const finalCity = detectedCity || "No Consta";

      console.log(`  -> Provincia final: ${finalProvince}`);
      
      // Actualizar la entrada en el objeto entries
      let newEntry = entry.replace(/province:\s*"[^"]*"/, `province: "${finalProvince}"`);
      newEntry = newEntry.replace(/city:\s*"[^"]*"/, `city: "${finalCity}"`);
      
      if (newEntry !== entry) {
        entries[key] = newEntry;
        updatedCount++;
        console.log(`  ✅ Entrada actualizada en memoria.`);
      } else {
        console.log(`  - No hubo cambios (ya tenía el valor correcto).`);
      }

      await page.close();
    } catch (err) {
      console.error(`  ! Error procesando ${boeId}:`, (err as Error).message);
    }
  }

  await browser.close();

  if (updatedCount > 0) {
    console.log(`\nGuardando cambios en ${AUCTIONS_FILE}...`);
    const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
      Object.values(entries).join('\n') + 
      '\n};';
    fs.writeFileSync(AUCTIONS_FILE, header + newAuctionsBody);
    console.log(`¡Dataset actualizado! Se actualizaron ${updatedCount} vehículos.`);
  } else {
    console.log('\nNo se realizaron cambios en el archivo.');
  }

  console.log('\n--- FIN DE EJECUCIÓN CONTROLADA ---');
}

run();
