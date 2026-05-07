import * as cheerio from 'cheerio';

async function main() {
  let closedUrl = 'https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2026-259378&ver=4';
  const res = await fetch(closedUrl);
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log("Tab Pujas Text length:", $('body').text().length);

  // print out text within some container, e.g. #idDetalle
  console.log("Snippet:", $('body').text().replace(/\s+/g, ' ').substring(0, 500));
}
main();
