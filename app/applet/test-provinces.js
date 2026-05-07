const fs = require('fs');
const auctions = require('./src/data/auctions.json');

const removeAccents = (str) => {
  return str
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U');
};

const normalizeLocationName = (name) => {
  if (!name) return '';
  let clean = name.toLowerCase().trim();
  if (clean.includes('/')) clean = clean.split('/')[0].trim();
  clean = clean.replace(/\([^)]*\)/g, '').trim();
  clean = clean.replace(/,?\s*\d{5}\b/g, '').trim();
  clean = removeAccents(clean);
  clean = clean.split(/[\s-]+/).map(word => {
    if (['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'l'].includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  const corrections = {
    'Alacant': 'Alicante', 'Castello': 'Castellon', 'Girona': 'Gerona',
    'Lleida': 'Lerida', 'Ourense': 'Orense', 'A Coruna': 'A Coruña',
    'Donostia': 'San Sebastian', 'Gasteiz': 'Vitoria', 'Bilbo': 'Bilbao'
  };
  return corrections[clean] || clean;
};

const provinces = new Set();
// Just get unique 
Object.values(auctions).forEach(a => {
  const p = normalizeLocationName(a.province || a.city);
  if (p && p !== 'España') provinces.add(p);
});

console.log(Array.from(provinces).map(p => `/noticias-subastas/provincia/${p.toLowerCase().replace(/\s+/g, '-')}`).join(', '));
