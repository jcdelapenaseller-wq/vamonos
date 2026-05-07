import * as cheerio from 'cheerio';

async function main() {
  const url = 'https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2026-259378&ver=1';
  const res = await fetch(url);
  const html = await res.text();
  console.log("PUJA IN HTML:", html.toLowerCase().includes('puja'));
  console.log("ADJUDICADA IN HTML:", html.toLowerCase().includes('adjudica'));
  console.log("DESIERTA IN HTML:", html.toLowerCase().includes('desierta'));
  console.log("CONCLUSION IN HTML:", html.toLowerCase().includes('conclusión'));
  console.log("SITUACIÓN IN HTML:", html.toLowerCase().includes('situación'));
}
main();
