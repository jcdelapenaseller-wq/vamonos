import { AUCTIONS } from '../src/data/auctions';

let oldest = '9999';
let oldestId = '';
for (const key in AUCTIONS) {
  if (AUCTIONS[key].auctionDate && AUCTIONS[key].auctionDate < oldest) {
    oldest = AUCTIONS[key].auctionDate;
    oldestId = AUCTIONS[key].boeId;
  }
}
console.log('Oldest date:', oldest, 'for ID:', oldestId);
