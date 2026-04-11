import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/auctions.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Extraer la parte de AUCTIONS
const auctionsStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
if (auctionsStart === -1) {
  console.error('No se encontró AUCTIONS');
  process.exit(1);
}

const header = content.substring(0, auctionsStart);
const auctionsBody = content.substring(auctionsStart);

// Intentar parsear las entradas
// Como es un objeto JS/TS, no es JSON puro. 
// Vamos a usar una estrategia de regex para encontrar las claves y sus bloques.
// Cada entrada empieza con 'slug': { y termina con },

const entries: { [key: string]: string } = {};
const regex = /'([^']+)':\s*{([\s\S]*?^  },)/gm;

let match;
let count = 0;
let duplicates = 0;

while ((match = regex.exec(auctionsBody)) !== null) {
  const key = match[1];
  const body = match[0];
  
  if (entries[key]) {
    duplicates++;
    // Mantener la versión más reciente (la que aparece después en el archivo suele ser la más completa si se apendó)
    entries[key] = body;
  } else {
    entries[key] = body;
  }
  count++;
}

console.log(`Total entradas encontradas: ${count}`);
console.log(`Duplicados eliminados: ${duplicates}`);

const newAuctionsBody = 'export const AUCTIONS: Record<string, AuctionData> = {\n' + 
  Object.values(entries).join('\n') + 
  '\n};';

fs.writeFileSync(filePath, header + newAuctionsBody);
console.log('Archivo deduplicado con éxito.');
