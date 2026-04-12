import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log(`Iniciando prueba de extracción de PDF...`);

  // Create a dummy PDF with some text to test the parsing logic
  const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
  
  // We can't easily create a valid PDF from scratch in Node without a library like pdfkit.
  // Let's just test the logic directly by simulating the text extraction part.
  
  const text = `
    Información Adicional del Vehículo
    Marca: SEAT
    Modelo: IBIZA
    Matrícula: 1234ABC
    
    El vehículo se encuentra en el depósito municipal de vehículos de TARRAGONA.
    
    Observaciones: Vehículo con daños en la carrocería.
  `;
  
  console.log(`\n--- TEXTO SIMULADO DEL PDF ---\n${text}\n------------------------------\n`);

  const info: any = {};
  
  const provinceMatch = text.match(/Provincia:\s*([^\n\r]+)/i);
  if (provinceMatch && provinceMatch[1]) info.province = provinceMatch[1].trim();

  const municipalityMatch = text.match(/(?:Localidad|Municipio):\s*([^\n\r]+)/i);
  if (municipalityMatch && municipalityMatch[1]) info.municipality = municipalityMatch[1].trim();

  const pickupMatch = text.match(/(?:Lugar de depósito|Dirección):\s*([^\n\r]+)/i);
  if (pickupMatch && pickupMatch[1]) info.pickupLocation = pickupMatch[1].trim();

  if (!info.province) {
    const PROVINCIAS_ESPANIA = [
      "ALAVA", "ALBACETE", "ALICANTE", "ALMERIA", "ASTURIAS", "AVILA", "BADAJOZ", "BARCELONA", "BURGOS", "CACERES",
      "CADIZ", "CANTABRIA", "CASTELLON", "CIUDAD REAL", "CORDOBA", "A CORUÑA", "LA CORUÑA", "CUENCA", "GIRONA", "GERONA", "GRANADA", "GUADALAJARA",
      "GIPUZKOA", "GUIPUZCOA", "HUELVA", "HUESCA", "ISLAS BALEARES", "BALEARES", "JAEN", "LEON", "LLEIDA", "LERIDA", "LUGO", "MADRID", "MALAGA", "MURCIA", "NAVARRA",
      "OURENSE", "ORENSE", "PALENCIA", "LAS PALMAS", "PONTEVEDRA", "LA RIOJA", "SALAMANCA", "SEGOVIA", "SEVILLA", "SORIA", "TARRAGONA",
      "SANTA CRUZ DE TENERIFE", "TENERIFE", "TERUEL", "TOLEDO", "VALENCIA", "VALLADOLID", "BIZKAIA", "VIZCAYA", "ZAMORA", "ZARAGOZA", "CEUTA", "MELILLA"
    ];
    
    const upperText = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const prov of PROVINCIAS_ESPANIA) {
      const regex = new RegExp(`\\b${prov}\\b`);
      if (regex.test(upperText)) {
        info.province = prov.charAt(0).toUpperCase() + prov.slice(1).toLowerCase();
        console.log(`[DocProcessor] Provincia detectada por diccionario: ${info.province}`);
        break;
      }
    }
  }

  console.log('Resultado info extraída:', info);
}

runTest();
