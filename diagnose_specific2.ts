import { AUCTIONS } from './src/data/auctions';
import { isAuctionFinished, getFilteredAuctions } from './src/utils/auctionHelpers';

const slug = 'subasta-sub-ja-2026-256708';
const data = AUCTIONS[slug];

if (!data) {
  console.log("NOT FOUND in auctions.ts");
} else {
  console.log("FOUND");
  console.log("isActive:", !isAuctionFinished(data.auctionDate));
  console.log("passes getFilteredAuctions:", !!getFilteredAuctions({[slug]: data})[slug]);
}
