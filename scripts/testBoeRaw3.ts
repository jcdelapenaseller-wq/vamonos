import * as cheerio from 'cheerio';

async function main() {
  const closedUrl = 'https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2025-251932&ver=1'; 
  const res = await fetch(closedUrl);
  const html = await res.text();
  
  if (html.toLowerCase().includes('puja')) {
    const idx = html.toLowerCase().indexOf('puja máxima');
    if (idx !== -1) {
      console.log('Found "puja máxima":', html.substring(idx - 50, idx + 200).replace(/\n/g, ' '));
    } else {
      console.log('Found "puja", but not "puja máxima".');
      const idx2 = html.toLowerCase().indexOf('puja');
      console.log('Snippet around "puja":', html.substring(idx2 - 50, idx2 + 200).replace(/\n/g, ' '));
    }
  } else {
    console.log("No puja keyword");
  }
}
main();
