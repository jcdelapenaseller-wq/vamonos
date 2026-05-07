import { AUCTIONS } from '../src/data/auctions';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

for (const key in AUCTIONS) {
  if (isAuctionFinished(AUCTIONS[key].auctionDate)) {
    console.log(AUCTIONS[key].boeId, AUCTIONS[key].auctionDate);
  }
}
