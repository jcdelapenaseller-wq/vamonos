import { AUCTIONS } from './src/data/auctions';

const bcn = Object.entries(AUCTIONS).filter(([slug, data]) => data.province === 'Barcelona' || data.province === 'BARCELONA');
console.log(bcn.slice(0, 3).map(([s,d]) => ({slug: s, auctionDate: d.auctionDate})));
