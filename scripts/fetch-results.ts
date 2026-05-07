import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { AUCTIONS } from '../src/data/auctions';
import { AUCTION_RESULTS } from '../src/data/auctionResults';
import { isAuctionFinished } from '../src/utils/auctionHelpers';

const RESULTS_FILE = path.join(process.cwd(), 'src/data/auctionResults.ts');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchResults() {
  const closedAuctions = Object.entries(AUCTIONS).filter(
    ([slug, auction]) => isAuctionFinished(auction.auctionDate) && !AUCTION_RESULTS[slug] && auction.province === 'Madrid'
  ).sort((a, b) => {
    const parseDate = (d: string) => {
      if (d.includes('-') && d.split('-')[0].length === 4) return new Date(d).getTime();
      const parts = d.split('-');
      if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      return 9999999999999;
    };
    const dateA = a[1].auctionDate ? parseDate(a[1].auctionDate) : 9999999999999;
    const dateB = b[1].auctionDate ? parseDate(b[1].auctionDate) : 9999999999999;
    return dateA - dateB;
  }).slice(0, 100);

  console.log(`Checking ${closedAuctions.length} closed auctions...`);

  const newResults = { ...AUCTION_RESULTS };

  for (const [slug, auction] of closedAuctions) {
    if (!auction.boeUrl) continue;

    console.log(`Checking ${slug}...`);
    
    try {
      await delay(7000 + Math.random() * 3000); // 7-10s delay

      let fetchUrl = auction.boeUrl;
      if (!fetchUrl.includes('ver=')) {
        fetchUrl += fetchUrl.includes('?') ? '&ver=5' : '?ver=5';
      }
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      
      let auctionResultStatus: 'adjudicated' | 'deserted' | 'suspended' | null = null;
      let finalPrice: number | undefined;

      let priceMatch = html.match(/Puja máxima de la subasta[\s\S]{0,300}?([\d\.\,]+)\s?€/i);
      if (!priceMatch) {
        priceMatch = html.match(/([\d\.\,]+)\s?€[\s\S]{0,100}?Puja máxima/i);
      }
      if (priceMatch && priceMatch[1]) {
        auctionResultStatus = 'adjudicated';
        const rawPriceString = priceMatch[1];
        const cleanString = rawPriceString.replace(/\./g, '').replace(',', '.');
        finalPrice = parseFloat(cleanString);
      } else if (html.toLowerCase().includes('desierta')) {
        auctionResultStatus = 'deserted';
      }

      // Validation: Only save if certain
      if (auctionResultStatus && (auctionResultStatus === 'deserted' || finalPrice)) {
        newResults[slug] = { 
          finalPrice, 
          auctionResultStatus, 
          resultCheckedAt: new Date().toISOString() 
        };
        console.log(`Result found for ${slug}: ${auctionResultStatus} ${finalPrice || ''}`);
      } else {
        console.log(`No clear result found for ${slug}`);
      }

    } catch (e) {
      console.error(`Failed to fetch ${slug}:`, e);
    }
  }

  // Save results
  const fileContent = `export const AUCTION_RESULTS: Record<string, { finalPrice?: number; auctionResultStatus?: 'adjudicated' | 'deserted' | 'suspended'; resultCheckedAt?: string; }> = ${JSON.stringify(newResults, null, 2)};`;
  fs.writeFileSync(RESULTS_FILE, fileContent);
  console.log('Results updated.');
}

fetchResults();
