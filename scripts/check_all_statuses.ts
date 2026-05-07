import { AUCTIONS } from '../src/data/auctions';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

let statusCounts: Record<string, number> = {};
let closedByDate = 0;

for (const key in AUCTIONS) {
  const auction = AUCTIONS[key];
  const status = auction.status || 'undefined';
  statusCounts[status] = (statusCounts[status] || 0) + 1;
  const isFinished = isAuctionFinished(auction.auctionDate);
  if (isFinished) closedByDate++;
}
console.log('Statuses in AUCTIONS:', statusCounts);
console.log('Closed by date:', closedByDate);
