const axios = require('axios');
const fs = require('fs');

async function debugScrape() {
  const subId = 'SUB-AT-2026-25R4186002113';
  const url = `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=1`;
  
  try {
    const res = await axios.get(url);
    fs.writeFileSync('debug_ver1.html', res.data);
    console.log('HTML saved to debug_ver1.html');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugScrape();
