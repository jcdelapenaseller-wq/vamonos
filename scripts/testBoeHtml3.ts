import * as cheerio from 'cheerio';

async function main() {
  let closedUrl = 'https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2026-259378'; // general
  const res = await fetch(closedUrl);
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log("Sections with 'resultado' or 'conclusión':");
  console.log($('table').text().replace(/\s+/g, ' ').substring(0, 1000));
}
main();
