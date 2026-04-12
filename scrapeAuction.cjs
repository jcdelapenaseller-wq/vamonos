const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Script de prueba para extraer datos técnicos de una subasta del BOE.
 * 
 * Uso: node scrapeAuction.js SUB-JA-2026-258334
 */

async function scrapeAuction(subId) {
  console.log(`\n--- Iniciando scraping para la subasta: ${subId} ---\n`);

  const urls = {
    general: `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=1`,
    financial: `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=2`,
    asset: `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=3`
  };

  const results = {
    subId,
    appraisalValue: null,
    claimedDebt: null,
    deposit: null,
    address: null,
    municipality: null,
    province: null,
    referenceCadastral: null,
    auctionStart: null,
    auctionEnd: null,
    description: null,
    infoAdicional: null
  };

  try {
    // 1. Información General (Tab 1)
    const res1 = await axios.get(urls.general);
    const $1 = cheerio.load(res1.data);
    results.auctionStart = extractValue($1, 'Fecha de inicio');
    results.auctionEnd = extractValue($1, 'Fecha de conclusión');

    // 2. Datos Económicos (Tab 2)
    const res2 = await axios.get(urls.financial);
    const $2 = cheerio.load(res2.data);
    results.appraisalValue = parseCurrency(extractValue($2, 'Valor de subasta'));
    results.claimedDebt = parseCurrency(extractValue($2, 'Cantidad reclamada'));
    results.deposit = parseCurrency(extractValue($2, 'Depósito'));

    // 3. Descripción del Bien (Tab 3)
    const res3 = await axios.get(urls.asset);
    const $3 = cheerio.load(res3.data);
    
    // Log all links to find document links
    $3('a').each((i, el) => {
        console.log('Link:', $3(el).attr('href'));
    });

    results.address = extractValue($3, 'Dirección');
    results.municipality = extractValue($3, 'Localidad');
    results.province = extractValue($3, 'Provincia');
    results.referenceCadastral = extractValue($3, 'Referencia catastral');
    results.description = extractValue($3, 'Descripción');
    results.infoAdicional = extractValue($3, 'Información adicional');
    
    // Normalize province: if 'Desconocida', treat as null to allow regex overwrite
    if (results.province && results.province.toLowerCase() === 'desconocida') {
        results.province = null;
    }

    if (results.infoAdicional) {
        // Try to extract province from parentheses: (TARRAGONA)
        const parenMatch = results.infoAdicional.match(/\(([A-ZÁÉÍÓÚÑ\s]+)\)/);
        if (parenMatch && !results.province) {
            results.province = toTitleCase(parenMatch[1].trim());
        }
        
        // Fallback: Simple regex to find uppercase words at the end of the string
        if (!results.province) {
            const match = results.infoAdicional.match(/\b([A-ZÁÉÍÓÚÑ]{3,})\.?$/);
            if (match) {
                results.province = toTitleCase(match[1]);
            }
        }

        // Try to extract municipality if it's in the infoAdicional
        // This is tricky, maybe look for common patterns or just take the first part of address if available
        if (!results.municipality && results.address) {
            // Simple heuristic: take the first part of the address before a comma
            const addressParts = results.address.split(',');
            if (addressParts.length > 0) {
                results.municipality = addressParts[0].trim();
            }
        }
    }

    // Mostrar resultado final
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error(`❌ Error al realizar el scraping: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
    }
  }

  console.log(`\n--- Fin del proceso ---\n`);
}

/**
 * Busca un valor en las tablas del BOE basándose en el texto del encabezado (th).
 */
function extractValue($, label) {
  let value = null;
  $('th').each((i, el) => {
    const headerText = $(el).text().trim();
    if (headerText.toLowerCase().includes(label.toLowerCase())) {
      value = $(el).next('td').text().trim();
      return false; // Break loop
    }
  });
  return value;
}

/**
 * Limpia y convierte strings de moneda (123.456,78 €) a números (123456.78).
 */
function parseCurrency(str) {
  if (!str) return null;
  // Eliminar todo lo que no sea dígito o coma
  const cleaned = str.replace(/[^\d,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

// Ejecución
const subIdArg = process.argv[2];

if (!subIdArg) {
  console.log('Uso: node scrapeAuction.js <SUB-ID>');
  console.log('Ejemplo: node scrapeAuction.js SUB-JA-2026-258334');
} else {
  scrapeAuction(subIdArg);
}
