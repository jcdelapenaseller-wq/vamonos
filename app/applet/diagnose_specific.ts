import { AUCTIONS } from './src/data/auctions';

const found = Object.entries(AUCTIONS).find(([slug, data]) => data.boeId === 'SUB-JA-2026-256708' || slug.includes('256708'));
console.log(found ? "FOUND: " + JSON.stringify(found, null, 2) : "NOT FOUND");
