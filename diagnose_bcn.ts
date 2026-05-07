import { AUCTIONS } from './src/data/auctions';
import { isAuctionFinished } from './src/utils/auctionHelpers';

let bcnTotal = 0;
let bcnActive = 0;
let bcnClosed = 0;
let bcnSamples = [];

for (const [slug, data] of Object.entries(AUCTIONS)) {
  const isBcn = data.province?.toLowerCase().includes('barcelona') || data.city?.toLowerCase().includes('barcelona') || slug.toLowerCase().includes('barcelona');
  if (isBcn) {
    bcnTotal++;
    const finished = isAuctionFinished(data.auctionDate);
    if (!finished) bcnActive++;
    else bcnClosed++;
    
    if (bcnSamples.length < 5) {
      bcnSamples.push({ slug, date: data.auctionDate, finished, valorTasacion: data.valorTasacion, type: data.assetCategory });
    }
  }
}

console.log("=== DIAGNOSTICO BARCELONA ===");
console.log(`Total BCN en dataset: ${bcnTotal}`);
console.log(`Activas BCN: ${bcnActive}`);
console.log(`Cerradas BCN: ${bcnClosed}`);

console.log("\nMuestras:");
for (const s of bcnSamples) {
  console.log(`- ${s.slug} | Date: ${s.date} | Finished? ${s.finished} | Tasacion: ${s.valorTasacion} | Category: ${s.type}`);
}
