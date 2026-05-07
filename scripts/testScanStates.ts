import { AUCTIONS } from '../src/data/auctions';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

async function main() {
  let checked = 0;
  for (const key in AUCTIONS) {
    if (isAuctionFinished(AUCTIONS[key].auctionDate)) {
      const url = AUCTIONS[key].boeUrl;
      const res = await fetch(url);
      const html = await res.text();
      
      const text = html.toLowerCase();
      // parse cheerios instead for robust state extraction
      let state = 'unknown';
      const idx = text.indexOf('<th>estado</th>');
      if (idx !== -1) {
        state = html.substring(idx, idx + 100).replace(/\n/g, '');
      }

      console.log(`Checked ${AUCTIONS[key].boeId} - Date ${AUCTIONS[key].auctionDate}`);
      console.log(`Has puja maxima: ${text.includes('puja máxima') || text.includes('puja m&aacute;xima')}`);
      console.log(`Has adjudica: ${text.includes('adjudica')}`);
      console.log(`State HTML: ${state}`);
      
      checked++;
      if (checked > 5) break; 
    }
  }
}
main();
