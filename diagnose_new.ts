import { AUCTIONS } from './src/data/auctions';
import { isAuctionFinished } from './src/utils/auctionHelpers';

const totalAuctions = Object.keys(AUCTIONS).length;

let active = 0;
let closed = 0;
let activeVehiculos = 0;
let closedVehiculos = 0;
let activeNonVehiculos = 0;
let closedNonVehiculos = 0;

for (const [slug, data] of Object.entries(AUCTIONS)) {
  const isFinished = isAuctionFinished(data.auctionDate);
  const isVehiculo = data.assetCategory === 'vehiculo';

  if (!isFinished) {
    active++;
    if (isVehiculo) activeVehiculos++;
    else activeNonVehiculos++;
  } else {
    closed++;
    if (isVehiculo) closedVehiculos++;
    else closedNonVehiculos++;
  }
}

console.log(`Total: ${totalAuctions}`);
console.log(`Activas totales: ${active}`);
console.log(`Cerradas totales: ${closed}`);
console.log(`Activas Vehículos: ${activeVehiculos}`);
console.log(`Activas No Vehículos: ${activeNonVehiculos}`);
console.log(`Cerradas Vehículos: ${closedVehiculos}`);
console.log(`Cerradas No Vehículos: ${closedNonVehiculos}`);
