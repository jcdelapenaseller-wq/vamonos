const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/auctions.ts');
const content = fs.readFileSync(filePath, 'utf8');

const auctionsStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
if (auctionsStart === -1) {
  console.error('No se encontró AUCTIONS');
  process.exit(1);
}

const header = content.substring(0, auctionsStart);
const auctionsBody = content.substring(auctionsStart);

const entries = {};
// Regex para capturar cada entrada: 'key': { ... },
// Buscamos el patrón de inicio de clave y luego consumimos hasta el cierre de la llave que está al principio de línea
const regex = /'([^']+)':\s*{[\s\S]*?^  },/gm;

let match;
let count = 0;
let duplicates = 0;

while ((match = regex.exec(auctionsBody)) !== null) {
  const key = match[1];
  const fullEntry = match[0];
  
  if (entries[key]) {
    duplicates++;
  }
  // Siempre guardamos la última (la más reciente)
  entries[key] = fullEntry;
  count++;
}

console.log(`Total entradas encontradas: ${count}`);
console.log(`Duplicados eliminados: ${duplicates}`);
console.log(`Entradas únicas: ${Object.keys(entries).length}`);

const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
  Object.values(entries).join('\n') + 
  '\n};';

fs.writeFileSync(filePath, header + newAuctionsBody);
console.log('Archivo deduplicado con éxito.');
