import * as cheerio from 'cheerio';
import { AUCTIONS } from '../src/data/auctions';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

async function main() {
  let closedUrl = '';
  for (const key in AUCTIONS) {
    if (isAuctionFinished(AUCTIONS[key].auctionDate)) {
      closedUrl = AUCTIONS[key].boeUrl || '';
      if (closedUrl) break;
    }
  }

  if (!closedUrl) {
    console.log("No closed BOE URL found");
    return;
  }
  console.log("Testing URL:", closedUrl);
  const res = await fetch(closedUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const resultSection = $('.resultado-subasta, .pujas-subasta');
  console.log(`resultSection found length: ${resultSection.length}`);
  if (resultSection.length > 0) {
    console.log('Result text:', resultSection.text());
    console.log('Price text:', resultSection.find('.precio-final, .importe').text());
  } else {
    console.log("Could not find generic classes. Checking BOE dt/dd...");
    let found = false;
    $('dt').each((i, el) => {
       const dt = $(el).text();
       if (dt.toLowerCase().includes('adjudica') || dt.toLowerCase().includes('situación') || dt.toLowerCase().includes('conclusión') || dt.toLowerCase().includes('estado')) {
         console.log(dt, ' => ', $(el).next('dd').text()); 
         found = true;
       }
    });

    $('h4, h3, h2').each((i, el) => {
      const hd = $(el).text();
      if (hd.toLowerCase().includes('resultado')) {
        console.log('Header', hd);
      }
    })
  }

  /* 
  If BOE uses something like "Pujas" or "Resultado de la subasta", we can dump text of 
  panels or sections. 
  */
  
}
main();
