import puppeteer from 'puppeteer';

function parseNumber(str: string): number | null {
  if (!str) return null;
  const match = str.match(/(?:[1-9]\d{0,2}(?:\.\d{3})*|0)(?:,\d{1,2})?/);
  if (!match) return null;
  const numStr = match[0].replace(/\./g, '').replace(',', '.');
  const num = parseFloat(numStr);
  return isNaN(num) ? null : num;
}

async function testCrawler() {
  console.log("Testing parseNumber with '392.205,00 €':", parseNumber('392.205,00 €'));
  console.log("Testing parseNumber with '226.748,95 €':", parseNumber('226.748,95 €'));
}

testCrawler();
