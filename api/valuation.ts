import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import axios from 'axios';
import fs from 'fs';

const LOG_FILE = './catastro_diagnostic.log';

const logDiagnostic = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    console.error('Error writing to log file:', e);
  }
};

// Initialize Firebase Admin
const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

if (!admin.apps.length && projectId) {
  try {
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (e) {
    console.error('Firebase Admin Init Error:', e);
  }
}

const db = admin.apps.length ? admin.firestore() : null;

// Dataset simplificado de precios medios por m2 en España (Marzo 2026)
const MARKET_PRICES: Record<string, { avgPrice: number, cities?: Record<string, number> }> = {
  'MADRID': { avgPrice: 3200, cities: { 'MADRID': 4500, 'ALCOBENDAS': 3800, 'MOSTOLES': 2100, 'GETAFE': 2300 } },
  'BARCELONA': { avgPrice: 2900, cities: { 'BARCELONA': 4200, 'SANT CUGAT': 4000, 'BADALONA': 2300 } },
  'VALENCIA': { avgPrice: 1600, cities: { 'VALENCIA': 2200, 'TORRENT': 1400 } },
  'MALAGA': { avgPrice: 2400, cities: { 'MALAGA': 2600, 'MARBELLA': 4500, 'ESTEPONA': 3000 } },
  'ALICANTE': { avgPrice: 1700, cities: { 'ALICANTE': 1900, 'BENIDORM': 2800 } },
  'SEVILLA': { avgPrice: 1500, cities: { 'SEVILLA': 2100 } },
  'ZAMORA': { avgPrice: 1100, cities: { 'ZAMORA': 1250 } },
  'DEFAULT': { avgPrice: 1450 }
};

const getPricePerM2 = (province?: string, city?: string): number => {
  const normProvince = province?.toUpperCase() || '';
  const normCity = city?.toUpperCase() || '';
  const provinceData = MARKET_PRICES[normProvince] || MARKET_PRICES['DEFAULT'];
  return (provinceData.cities && provinceData.cities[normCity]) ? provinceData.cities[normCity] : provinceData.avgPrice;
};

/**
 * Consulta a la Sede Electrónica del Catastro (SEC)
 * Utiliza el servicio Consulta_DNPRC para obtener datos no protegidos por Referencia Catastral.
 */
const fetchCatastroData = async (refCat: string): Promise<{ surface: number | null, yearBuilt: number | null, floor: string | null }> => {
  logDiagnostic(`fetchCatastroData START: refCat=${refCat}`);
  try {
    const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/OVCCallejero.svc/Consulta_DNPRC?RefCat=${refCat}`;
    logDiagnostic(`fetchCatastroData REQUEST URL: ${url}`);
    
    const startTime = Date.now();
    const response = await axios.get(url, { timeout: 5000 });
    const duration = Date.now() - startTime;
    
    logDiagnostic(`fetchCatastroData RESPONSE: status=${response.status}, duration=${duration}ms`);
    
    const xml =
      typeof response.data === "string"
        ? response.data
        : response.data?.toString?.() || "";

    console.log("CATASTRO XML RAW START");
    console.log(xml);
    console.log("CATASTRO XML RAW END");

    if (typeof xml === 'string') {
      const surfaceMatch = xml.match(/<sfc>([\d.,]+)<\/sfc>/i);
      const yearMatch =
        xml.match(/<ant>(\d{4})<\/ant>/i) ||
        xml.match(/<year>(\d{4})<\/year>/i) ||
        xml.match(/<anno>(\d{4})<\/anno>/i) ||
        xml.match(/CONSTRUCCION\s*(\d{4})/i);
      
      const floorMatch =
        xml.match(/<pln>([^<]+)<\/pln>/i) ||
        xml.match(/<plant>([^<]+)<\/plant>/i) ||
        xml.match(/<pau>([^<]+)<\/pau>/i) ||
        xml.match(/PLANTA\s*([0-9]+)/i) ||
        xml.match(/<ldt>[^<]*PLANTA\s*([0-9]+)/i);
      
      const surface = surfaceMatch ? parseFloat(surfaceMatch[1].replace(",", ".")) : null;
      const yearBuilt = yearMatch?.[1] ? parseInt(yearMatch[1]) : null;
      const floor = floorMatch?.[1]?.trim() ?? null;

      logDiagnostic(`fetchCatastroData SUCCESS: surface=${surface}, yearBuilt=${yearBuilt}, floor=${floor}`);
      return { surface, yearBuilt, floor };
    }
    return { surface: null, yearBuilt: null, floor: null };
  } catch (error: any) {
    logDiagnostic(`fetchCatastroData EXCEPTION: message=${error.message}`);
    return { surface: null, yearBuilt: null, floor: null };
  }
};

const extractRefCat = (text?: string): string | null => {
  if (!text) return null;
  const match = text.match(/[A-Z0-9]{20}/i);
  return match ? match[0].toUpperCase() : null;
};

const fetchCatastroDataByAddress = async (province: string, city: string, address: string): Promise<{ surface: number | null, yearBuilt: number | null, floor: string | null }> => {
  logDiagnostic(`fetchCatastroDataByAddress START: prov=${province}, city=${city}, addr=${address}`);
  try {
    const streetMatch = address.match(/([a-zA-Z\s]+)\s+(\d+)/);
    if (!streetMatch) return { surface: null, yearBuilt: null, floor: null };
    
    const calle = streetMatch[1].trim();
    const numero = streetMatch[2];
    
    const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/OVCCallejero.svc/Consulta_DNPPP?Provincia=${encodeURIComponent(province)}&Municipio=${encodeURIComponent(city)}&Sigla=&Calle=${encodeURIComponent(calle)}&Numero=${numero}`;
    const response = await axios.get(url, { timeout: 5000 });
    
    const xml =
      typeof response.data === "string"
        ? response.data
        : response.data?.toString?.() || "";

    console.log("CATASTRO XML BY ADDRESS RAW START");
    console.log(xml);
    console.log("CATASTRO XML BY ADDRESS RAW END");

    if (typeof xml === 'string') {
      const surfaceMatch = xml.match(/<sfc>([\d.,]+)<\/sfc>/i);
      const yearMatch =
        xml.match(/<ant>(\d{4})<\/ant>/i) ||
        xml.match(/<year>(\d{4})<\/year>/i) ||
        xml.match(/<anno>(\d{4})<\/anno>/i) ||
        xml.match(/CONSTRUCCION\s*(\d{4})/i);
      
      const floorMatch =
        xml.match(/<pln>([^<]+)<\/pln>/i) ||
        xml.match(/<plant>([^<]+)<\/plant>/i) ||
        xml.match(/<pau>([^<]+)<\/pau>/i) ||
        xml.match(/PLANTA\s*([0-9]+)/i) ||
        xml.match(/<ldt>[^<]*PLANTA\s*([0-9]+)/i);
      
      const floor = floorMatch?.[1]?.trim() ?? null;
      
      return {
        surface: surfaceMatch ? parseFloat(surfaceMatch[1].replace(",", ".")) : null,
        yearBuilt: yearMatch?.[1] ? parseInt(yearMatch[1]) : null,
        floor: floor
      };
    }
    return { surface: null, yearBuilt: null, floor: null };
  } catch (error: any) {
    return { surface: null, yearBuilt: null, floor: null };
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { boeId, address, surface, city, province, appraisalValue, refCat, description, slug } = req.body;

    logDiagnostic(`handler START: slug=${slug}, boeId=${boeId}, refCat=${refCat}`);

    if (!boeId) {
      return res.status(400).json({ error: 'boeId is required' });
    }

    // 1. Check Cache in Firestore (Optional)
    if (db) {
      try {
        const valuationRef = db.collection('auctions').doc(boeId).collection('valuations').doc('latest');
        const valuationSnap = await valuationRef.get();
        if (valuationSnap.exists) {
          const data = valuationSnap.data();
          return res.status(200).json({ ...data, metadata: { ...data?.metadata, cached: true } });
        }
      } catch (e) {
        console.warn("Firestore cache read failed:", e);
      }
    }

    // 2. Obtener datos (Estrategia: Catastro XML > Dirección > Estimación Interna)
    let realSurface = surface;
    let yearBuilt = null;
    let floor = null;
    let sourceSurface = surface ? 'auction_data' : 'estimated';
    let confidence = 0.75;
    let dataSource = 'internal_fallback';
    
    const priceM2 = getPricePerM2(province, city);
    const baseValue = appraisalValue || 150000;

    let finalRefCat = refCat;
    if (!finalRefCat) {
      finalRefCat = extractRefCat(description) || extractRefCat(address);
    }

    // PRIORIDAD 1: Catastro por Referencia
    if (finalRefCat) {
      console.log("CALLING CATASTRO WITH REF:", finalRefCat);
      const catData = await fetchCatastroData(finalRefCat);
      
      if (catData.surface) {
        realSurface = catData.surface;
        sourceSurface = 'catastro_ref';
      }
      if (catData.yearBuilt) yearBuilt = catData.yearBuilt;
      if (catData.floor) floor = catData.floor;
      
      if (catData.surface || catData.yearBuilt || catData.floor) {
        confidence = 0.95;
        dataSource = 'catastro_xml';
      }
    }

    // PRIORIDAD 2: Catastro por Dirección (si no hay datos aún)
    if (dataSource === 'internal_fallback' && address && city && province) {
      const catData = await fetchCatastroDataByAddress(province, city, address);
      if (catData.surface || catData.yearBuilt || catData.floor) {
        if (catData.surface) {
          realSurface = catData.surface;
          sourceSurface = 'catastro_address';
        }
        yearBuilt = catData.yearBuilt;
        floor = catData.floor;
        confidence = 0.85;
        dataSource = 'catastro_xml_address';
      }
    }

    // FALLBACK: Estimación matemática
    if (!realSurface) {
      realSurface = Math.round(baseValue / priceM2);
      sourceSurface = 'estimada';
      confidence = 0.60;
    }

    const marketValue = Math.round(realSurface * priceM2);
    const result = {
      boeId,
      marketValue,
      confidence,
      calculations: {
        realDiscount: Math.round(((marketValue - baseValue) / marketValue) * 100),
        maxBid: Math.round(marketValue * 0.75),
        estimatedProfit: marketValue - Math.round(marketValue * 0.75),
        roi: Math.round(((marketValue - Math.round(marketValue * 0.75)) / Math.round(marketValue * 0.75)) * 100),
        surface: realSurface,
        priceM2
      },
      metadata: {
        source: dataSource,
        surfaceSource: sourceSurface,
        cached: false,
        timestamp: new Date().toISOString(),
        refCat: finalRefCat || null,
        yearBuilt,
        floor
      }
    };

    // 3. Save to Cache (Optional - Don't block if permissions fail)
    if (db) {
      try {
        await db.collection('auctions').doc(boeId).collection('valuations').doc('latest').set(result);
      } catch (e) {
        console.warn("Firestore cache write failed (Permission Denied?):", e);
      }
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("VALUATION ERROR:", err);
    return res.status(500).json({ 
      error: String(err), 
      stack: err?.stack 
    });
  }
}

