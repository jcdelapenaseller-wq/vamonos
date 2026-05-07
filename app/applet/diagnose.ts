import { AUCTIONS } from './src/data/auctions';
import { isAuctionFinished } from './src/utils/auctionHelpers';

const totalAuctions = Object.keys(AUCTIONS).length;
let activeAuctions = 0;
const activeSamples: any[] = [];
let vehiculos = 0;

for (const [slug, data] of Object.entries(AUCTIONS)) {
  if (!isAuctionFinished(data.auctionDate)) {
    activeAuctions++;
    if (activeSamples.length < 5) {
      activeSamples.push(data);
    }
  }
}

let activeNonVehicles = 0;
for (const [slug, data] of Object.entries(AUCTIONS)) {
  if (!isAuctionFinished(data.auctionDate) && data.assetCategory !== 'vehiculo') {
    activeNonVehicles++;
  }
}

console.log("Total registos:", totalAuctions);
console.log("Activas (según isAuctionFinished):", activeAuctions);
console.log("Activas (no vehículos):", activeNonVehicles);

console.log("\nMuestras de fechas:");
for (const data of activeSamples) {
  const originalDate = data.auctionDate;
  const parsedDate = new Date(originalDate ? (originalDate.includes('T') ? originalDate : `${originalDate}T00:00:00Z`) : '');
  const isFinished = isAuctionFinished(originalDate);
  console.log(`Original: ${originalDate} | Parsed: ${parsedDate?.toISOString()} | Finished: ${isFinished}`);
}
