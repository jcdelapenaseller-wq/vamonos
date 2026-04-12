import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const PROVINCIAS_ESPANIA = [
  'Alava', 'Albacete', 'Alicante', 'Almeria', 'Asturias', 'Avila', 'Badajoz', 'Barcelona', 'Burgos', 'Caceres',
  'Cadiz', 'Cantabria', 'Castellon', 'Ciudad Real', 'Cordoba', 'A Coruna', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
  'Guipuzcoa', 'Huelva', 'Huesca', 'Illes Balears', 'Jaen', 'Leon', 'Lleida', 'Lugo', 'Madrid', 'Malaga', 'Murcia', 'Navarra',
  'Ourense', 'Palencia', 'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Santa Cruz de Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUCTIONS_FILE = path.join(process.cwd(), 'src/data/auctions.ts');

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function extractProvinceFromText(text: string): string | null {
  const normalizedText = text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, ' ');

  for (const prov of PROVINCIAS_ESPANIA) {
    const normalizedProv = prov.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const regex = new RegExp(`\\b${normalizedProv}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return prov;
    }
  }
  return null;
}

async function run() {
  console.log('Iniciando fix final de ubicaciones desde locationText...');
  
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
  
  let updatedCount = 0;

  while ((match = regex.exec(auctionsBody)) !== null) {
    const key = match[1];
    let fullEntry = match[0];
    
    if (fullEntry.includes('assetCategory: "vehiculo"') && fullEntry.includes('locationText:')) {
      const locationMatch = fullEntry.match(/locationText:\s*"([^"]+)"/);
      if (locationMatch) {
        const locationText = locationMatch[1];
        const detectedProv = extractProvinceFromText(locationText);
        
        if (detectedProv) {
          console.log(`\nVehículo: ${key}`);
          console.log(`  -> Texto: ${locationText.substring(0, 50)}...`);
          console.log(`  -> Provincia detectada: ${detectedProv}`);
          
          fullEntry = fullEntry.replace(/province:\s*"[^"]*"/, `province: "${detectedProv}"`);
          updatedCount++;
        }
      }
    }
    entries[key] = fullEntry;
  }

  if (updatedCount > 0) {
    const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
      Object.values(entries).join('\n') + 
      '\n};';
    fs.writeFileSync(AUCTIONS_FILE, header + newAuctionsBody);
    console.log(`\n¡Dataset actualizado! Se actualizaron ${updatedCount} vehículos con provincia real.`);
  } else {
    console.log('\nNo hubo cambios en el dataset.');
  }
}

run();
