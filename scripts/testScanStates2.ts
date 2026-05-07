import * as cheerio from 'cheerio';
import { AUCTIONS } from '../src/data/auctions';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

async function main() {
  let checked = 0;
  for (const key in AUCTIONS) {
    if (isAuctionFinished(AUCTIONS[key].auctionDate)) {
      const url = AUCTIONS[key].boeUrl;
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      let state = 'unknown';
      $('dt').each((i, el) => {
        if ($(el).text().toLowerCase().trim() === 'estado') {
           state = $(el).next('dd').text().trim();
        }
      });
      
      let conclusion = 'unknown';
      $('th').each((i, el) => {
        if ($(el).text().toLowerCase().trim() === 'fecha de conclusión' || $(el).text().toLowerCase().trim() === 'fecha de fin') {
           conclusion = $(el).next('td').text().trim();
        }
      });

      console.log(`[${AUCTIONS[key].boeId}] Estado: ${state} | Conclusión: ${conclusion}`);
      
      checked++;
      if (checked > 10) break; 
    }
  }
}
main();
