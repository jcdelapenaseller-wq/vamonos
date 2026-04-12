const axios = require('axios');
const fs = require('fs');

async function fetchBienesTab() {
  const subId = 'SUB-AT-2026-25R4186002113';
  const url = `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=3`;
  
  try {
    const res = await axios.get(url);
    fs.writeFileSync('bienes_tab.html', res.data);
    console.log('HTML saved to bienes_tab.html');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchBienesTab();
