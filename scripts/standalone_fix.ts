import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_ROOT = process.cwd();
const AUCTIONS_FILE = path.join(APP_ROOT, 'src/data/auctions.ts');
const USER_DATA_DIR = path.join(APP_ROOT, 'puppeteer-session');

// Configuración Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ExtractedInfo {
  municipality?: string;
  province?: string;
  pickupLocation?: string;
  locationText?: string;
}

interface DocumentInfo {
  name: string;
  url: string;
}

async function processBoeDocumentStandalone(
  pdfUrl: string, 
  vehicleId: string, 
  docName: string, 
  cookies?: string
): Promise<{ doc: DocumentInfo; info: ExtractedInfo }> {
  const headers: any = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://subastas.boe.es/'
  };

  if (cookies) {
    headers['Cookie'] = cookies;
  }

  const response = await fetch(pdfUrl, { headers });
  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'activos_offmarket/documentos',
        public_id: `${vehicleId}_${docName.toLowerCase().replace(/\s+/g, '_')}`,
        resource_type: 'raw',
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  const cloudinaryUrl = (uploadResult as any).secure_url;

  const pdf = await import('pdf-parse');
  const data = await pdf.default(buffer);
  const text = data.text;

  const info: ExtractedInfo = {};
  const provinceMatch = text.match(/Provincia:\s*([^\n\r]+)/i);
  if (provinceMatch && provinceMatch[1]) info.province = provinceMatch[1].trim();

  const municipalityMatch = text.match(/(?:Localidad|Municipio):\s*([^\n\r]+)/i);
  if (municipalityMatch && municipalityMatch[1]) info.municipality = municipalityMatch[1].trim();

  if (!info.province) {
    const PROVINCIAS = ["ALAVA", "ALBACETE", "ALICANTE", "ALMERIA", "ASTURIAS", "AVILA", "BADAJOZ", "BARCELONA", "BURGOS", "CACERES", "CADIZ", "CANTABRIA", "CASTELLON", "CIUDAD REAL", "CORDOBA", "A CORUÑA", "CUENCA", "GIRONA", "GRANADA", "GUADALAJARA", "GIPUZKOA", "HUELVA", "HUESCA", "BALEARES", "JAEN", "LEON", "LLEIDA", "LUGO", "MADRID", "MALAGA", "MURCIA", "NAVARRA", "OURENSE", "PALENCIA", "LAS PALMAS", "PONTEVEDRA", "LA RIOJA", "SALAMANCA", "SEGOVIA", "SEVILLA", "SORIA", "TARRAGONA", "TENERIFE", "TERUEL", "TOLEDO", "VALENCIA", "VALLADOLID", "VIZCAYA", "ZAMORA", "ZARAGOZA"];
    const upperText = text.toUpperCase();
    for (const prov of PROVINCIAS) {
      if (new RegExp(`\\b${prov}\\b`).test(upperText)) {
        info.province = prov.charAt(0).toUpperCase() + prov.slice(1).toLowerCase();
        break;
      }
    }
  }

  return { doc: { name: docName, url: cloudinaryUrl }, info };
}

async function run() {
  console.log('--- EJECUCIÓN CONTROLADA FINAL (PERSISTENTE) ---');
  
  const targetBoeIds = [
    "SUB-AT-2026-26R4586002004",
    "SUB-AT-2026-25R0886002225",
    "SUB-AT-2026-25R4186002113"
  ];

  const browser = await puppeteer.launch({ 
    headless: true, 
    userDataDir: USER_DATA_DIR,
    args: ['--no-sandbox'] 
  });
  
  let content = fs.readFileSync(AUCTIONS_FILE, 'utf-8');
  const objectStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
  const header = content.substring(0, objectStart);
  const auctionsBody = content.substring(objectStart);

  const entries: Record<string, string> = {};
  const regex = /'([^']+)':\s*{[\s\S]*?^  },/gm;
  let match;
  while ((match = regex.exec(auctionsBody)) !== null) {
    entries[match[1]] = match[0];
  }

  let updatedCount = 0;

  for (const boeId of targetBoeIds) {
    const key = Object.keys(entries).find(k => entries[k].includes(`boeId: "${boeId}"`));
    if (!key) continue;

    console.log(`\nProcesando: ${boeId}`);
    const entry = entries[key];
    const boeUrlMatch = entry.match(/boeUrl:\s*"([^"]+)"/);
    if (!boeUrlMatch) continue;

    try {
      const page = await browser.newPage();
      console.log(`  Navegando a: ${boeUrlMatch[1]}`);
      await page.goto(boeUrlMatch[1], { waitUntil: 'networkidle2' });

      const bodyText = await page.evaluate(() => document.body.innerText);
      const isAuth = bodyText.includes('Cerrar sesión');
      console.log(`  Sesión activa?: ${isAuth}`);

      if (!isAuth) {
        console.log('  ⚠️ Sesión no activa. Saltando...');
        await page.close();
        continue;
      }

      const docs = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="idDoc="]'));
        return links.map(l => ({ name: l.textContent?.trim() || 'Documento', url: (l as HTMLAnchorElement).href }));
      });

      console.log(`  Documentos encontrados: ${docs.length}`);
      const targetDoc = docs.find(d => d.name.toUpperCase().includes('INFORMACIÓN ADICIONAL') || d.name.toUpperCase().includes('DATOS VEHÍCULO')) || docs.find(d => d.url.toLowerCase().includes('.pdf'));

      if (targetDoc) {
        console.log(`  Documento: ${targetDoc.name}`);
        const cookies = await page.cookies();
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        await new Promise(r => setTimeout(r, 2000));
        const result = await processBoeDocumentStandalone(targetDoc.url, boeId, targetDoc.name, cookieString);
        
        const finalProvince = result.info.province || "No Consta";
        const finalCity = result.info.municipality || "No Consta";
        console.log(`  -> Provincia final: ${finalProvince}`);

        let newEntry = entry.replace(/province:\s*"[^"]*"/, `province: "${finalProvince}"`);
        newEntry = newEntry.replace(/city:\s*"[^"]*"/, `city: "${finalCity}"`);
        
        if (newEntry !== entry) {
          entries[key] = newEntry;
          updatedCount++;
        }
      }
      await page.close();
    } catch (e) {
      console.error(`  Error: ${(e as Error).message}`);
    }
  }

  await browser.close();

  if (updatedCount > 0) {
    const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + Object.values(entries).join('\n') + '\n};';
    fs.writeFileSync(AUCTIONS_FILE, header + newAuctionsBody);
    console.log(`\n¡Dataset actualizado! (${updatedCount} cambios)`);
  }
}

run();
