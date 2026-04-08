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
const fetchCatastroSurface = async (refCat: string): Promise<number | null> => {
  logDiagnostic(`fetchCatastroSurface START: refCat=${refCat}`);
  try {
    const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/OVCCallejero.svc/Consulta_DNPRC?RefCat=${refCat}`;
    logDiagnostic(`fetchCatastroSurface REQUEST URL: ${url}`);
    
    const startTime = Date.now();
    const response = await axios.get(url, { timeout: 5000 });
    console.log("VAL response:", response.data);
    const duration = Date.now() - startTime;
    
    logDiagnostic(`fetchCatastroSurface RESPONSE: status=${response.status}, duration=${duration}ms`);
    
    const xml = response.data;
    if (typeof xml === 'string') {
      const match = xml.match(/<debi>[\s\S]*?<sfc>([\d.,]+)<\/sfc>/i);
      console.log("CATASTRO XML MATCH", match?.[1]);
      
      if (match) {
        const parsedSurface = parseFloat(match[1].replace(",", "."));
        logDiagnostic(`fetchCatastroSurface SUCCESS: surface=${match[1]}, parsed=${parsedSurface}`);
        return parsedSurface;
      }
      logDiagnostic(`fetchCatastroSurface NULL: No <debi><sfc> tag found in XML.`);
    } else {
      logDiagnostic(`fetchCatastroSurface NULL: Response data is not a string.`);
    }
    return null;
  } catch (error: any) {
    const isTimeout = error.code === 'ECONNABORTED';
    logDiagnostic(`fetchCatastroSurface EXCEPTION: isTimeout=${isTimeout}, message=${error.message}, code=${error.code}, status=${error.response?.status}`);
    return null;
  }
};

const extractRefCat = (text?: string): string | null => {
  if (!text) return null;
  const match = text.match(/[A-Z0-9]{20}/i);
  return match ? match[0].toUpperCase() : null;
};

const fetchCatastroSurfaceByAddress = async (province: string, city: string, address: string): Promise<number | null> => {
  logDiagnostic(`fetchCatastroSurfaceByAddress START: prov=${province}, city=${city}, addr=${address}`);
  try {
    const streetMatch = address.match(/([a-zA-Z\s]+)\s+(\d+)/);
    if (!streetMatch) {
      logDiagnostic(`fetchCatastroSurfaceByAddress NULL: Address format invalid (no street/number match): ${address}`);
      return null;
    }
    
    const calle = streetMatch[1].trim();
    const numero = streetMatch[2];
    
    const url = `https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/OVCCallejero.svc/Consulta_DNPPP?Provincia=${encodeURIComponent(province)}&Municipio=${encodeURIComponent(city)}&Sigla=&Calle=${encodeURIComponent(calle)}&Numero=${numero}`;
    logDiagnostic(`fetchCatastroSurfaceByAddress REQUEST URL: ${url}`);
    
    const startTime = Date.now();
    console.log("CATASTRO PARAMS", {
      Provincia: province,
      Municipio: city,
      Sigla: "",
      Calle: calle,
      Numero: numero
    });
    const response = await axios.get(url, { timeout: 5000 });
    console.log("VAL response:", response.data);
    const duration = Date.now() - startTime;
    
    logDiagnostic(`fetchCatastroSurfaceByAddress RESPONSE: status=${response.status}, duration=${duration}ms`);
    
    const xml = response.data;
    if (typeof xml === 'string') {
      const match = xml.match(/<debi>[\s\S]*?<sfc>([\d.,]+)<\/sfc>/i);
      console.log("CATASTRO XML MATCH", match?.[1]);
      
      if (match) {
        const parsedSurface = parseFloat(match[1].replace(",", "."));
        logDiagnostic(`fetchCatastroSurfaceByAddress SUCCESS: surface=${match[1]}, parsed=${parsedSurface}`);
        return parsedSurface;
      }
      logDiagnostic(`fetchCatastroSurfaceByAddress NULL: No <debi><sfc> tag found in XML.`);
    } else {
      logDiagnostic(`fetchCatastroSurfaceByAddress NULL: Response data is not a string.`);
    }
    return null;
  } catch (error: any) {
    const isTimeout = error.code === 'ECONNABORTED';
    logDiagnostic(`fetchCatastroSurfaceByAddress EXCEPTION: isTimeout=${isTimeout}, message=${error.message}, code=${error.code}, status=${error.response?.status}`);
    return null;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { boeId, address, surface, city, province, appraisalValue, refCat, description, slug } = req.body;

  logDiagnostic(`handler START: slug=${slug}, boeId=${boeId}, refCat=${refCat}, address=${address}, city=${city}, province=${province}`);

  if (!boeId) {
    return res.status(400).json({ error: 'boeId is required' });
  }

  try {
    // 1. Check Cache in Firestore (only if db is available)
    let valuationRef = null;
    if (db) {
      valuationRef = db.collection('auctions').doc(boeId).collection('valuations').doc('latest');
      try {
        const valuationSnap = await valuationRef.get();
        if (valuationSnap.exists) {
          const data = valuationSnap.data();
          logDiagnostic(`handler CACHE HIT: boeId=${boeId}`);
          return res.status(200).json({ ...data, metadata: { ...data?.metadata, cached: true } });
        }
      } catch (e) {
        console.error('Firestore Cache Read Error:', e);
        // Continue without cache
      }
    }

    // 2. Obtener superficie (Estrategia Triple: RefCat > Dirección > Estimación)
    let realSurface = surface;
    let sourceSurface = 'auction_data';
    let confidence = 0.75;
    
    const priceM2 = getPricePerM2(province, city);
    const baseValue = appraisalValue || 150000;

    let finalRefCat = refCat || extractRefCat(description);
    console.log("VAL refCat:", finalRefCat);

    if (finalRefCat) {
      const catastroSurface = await fetchCatastroSurface(finalRefCat);
      if (catastroSurface) {
        realSurface = catastroSurface;
        sourceSurface = 'catastro_ref';
        confidence = 0.95; // Alta
      }
    } else if (!realSurface && address && city && province) {
      const catastroSurface = await fetchCatastroSurfaceByAddress(province, city, address);
      if (catastroSurface) {
        realSurface = catastroSurface;
        sourceSurface = 'catastro_address';
        confidence = 0.80; // Media
      }
    }

    if (!realSurface) {
      realSurface = Math.round(baseValue / priceM2);
      sourceSurface = 'estimada';
      confidence = 0.60; // Baja
      logDiagnostic(`handler NULL_CATASTRO: Falling back to estimation. surface=${realSurface}`);
    }

    console.log("VAL surface:", realSurface);

    // 4. Calcular Valor de Mercado
    const marketValue = Math.round(realSurface * priceM2);

    // 5. Cálculos de Inversión
    const realDiscount = Math.round(((marketValue - baseValue) / marketValue) * 100);
    const maxBid = Math.round(marketValue * 0.75); // 75% del valor de mercado
    const estimatedProfit = marketValue - maxBid;
    const roi = Math.round((estimatedProfit / maxBid) * 100);

    const result = {
      boeId,
      marketValue,
      confidence,
      calculations: {
        realDiscount,
        maxBid,
        estimatedProfit,
        roi,
        surface: realSurface,
        priceM2
      },
      metadata: {
        source: 'internal_dataset_catastro',
        surfaceSource: sourceSurface,
        cached: false,
        timestamp: new Date().toISOString(),
        refCat: finalRefCat || null
      }
    };

    // 6. Save to Cache (only if db is available)
    if (db && valuationRef) {
      try {
        await valuationRef.set(result);
      } catch (e) {
        console.error('Firestore Cache Write Error:', e);
      }
    }

    logDiagnostic(`handler SUCCESS: boeId=${boeId}, surface=${realSurface}, source=${sourceSurface}`);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Valuation Error:', error);
    logDiagnostic(`handler EXCEPTION: error=${error instanceof Error ? error.message : String(error)}`);
    return res.status(500).json({ 
      error: 'Error interno en la valoración',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

