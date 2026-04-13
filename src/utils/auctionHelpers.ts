import { AuctionData } from '../data/auctions';
import { AuctionStatus } from '../types';
import { normalizeCity, normalizeProvince } from './auctionNormalizer';

export function normalizeStatus(boeStatus: string): AuctionStatus {
  const s = boeStatus.toLowerCase();
  if (s.includes('próxima') || s.includes('proxima') || s.includes('próxima apertura')) return 'upcoming';
  if (s.includes('celebrándose') || s.includes('celebrandose') || s.includes('en curso')) return 'active';
  if (s.includes('suspendida') || s.includes('pausada')) return 'suspended';
  if (s.includes('finalizada') || s.includes('cancelada') || s.includes('concluida') || s.includes('adjudicada')) return 'closed';
  return 'active';
}

export function formatPublishedDate(dateString?: string) {
  if (!dateString || dateString === 'null' || dateString === 'undefined') return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Publicado hoy";
  } else if (diffDays < 30) {
    return `Publicado hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else {
    return `Publicado el ${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
}

export function getOpportunityThreshold(auctions: Record<string, AuctionData>): number {
  const discounts = Object.values(auctions)
    .map(a => calculateDiscount(a.valorTasacion, a.valorSubasta, a.claimedDebt))
    .filter((d): d is number => d !== null && d > 0)
    .sort((a, b) => b - a);
  
  if (discounts.length === 0) return 0;
  
  const topIndex = Math.floor(discounts.length * 0.3); // Top 30%
  return discounts[topIndex] || 0;
}

export function getAuctionType(boeId?: string): string {
  if (!boeId) return 'Administrativa';
  const id = boeId.toUpperCase();
  if (id.startsWith('SUB-JA') || id.startsWith('SUB-JV') || id.startsWith('SUB-JC')) return 'Judicial';
  if (id.startsWith('SUB-AT')) return 'AEAT';
  if (id.startsWith('SUB-SS')) return 'Seguridad Social';
  if (id.startsWith('SUB-NV') || id.startsWith('SUB-NC')) return 'Notarial';
  return 'Administrativa';
}

export function getProcedureType(auction: AuctionData): string {
  return auction.procedureType || 'No especificado';
}

export function getComputedStatus(data: { status?: string; auctionDate?: string | null }): string {
  if (data.status === 'closed' || isAuctionFinished(data.auctionDate)) return 'closed';
  if (data.status === 'suspended') return 'suspended';
  if (data.status === 'upcoming') return 'upcoming';
  return 'active';
}

export function sortAuctions(items: [string, AuctionData][], sortBy: string = 'discount'): [string, AuctionData][] {
  return [...items].sort((a, b) => {
    const aData = a[1];
    const bData = b[1];
    
    const aStatus = getComputedStatus(aData);
    const bStatus = getComputedStatus(bData);
    
    const aClosed = aStatus === 'closed';
    const bClosed = bStatus === 'closed';
    
    if (aClosed && !bClosed) return 1;
    if (!aClosed && bClosed) return -1;
    
    const aActive = aStatus === 'active';
    const bActive = bStatus === 'active';
    
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    if (sortBy === 'recent') {
      if (aData.auctionDate && bData.auctionDate) {
        const aClose = new Date(aData.auctionDate).getTime();
        const bClose = new Date(bData.auctionDate).getTime();
        if (aClose !== bClose) {
          return aClose - bClose;
        }
      }
      const aDate = new Date(aData.publishedAt || aData.startDate || 0).getTime();
      const bDate = new Date(bData.publishedAt || bData.startDate || 0).getTime();
      return bDate - aDate;
    } else if (sortBy === 'oldest') {
      const aDate = new Date(aData.publishedAt || aData.startDate || 0).getTime();
      const bDate = new Date(bData.publishedAt || bData.startDate || 0).getTime();
      return aDate - bDate;
    } else if (sortBy === 'value_high') {
      const aVal = aData.valorSubasta || 0;
      const bVal = bData.valorSubasta || 0;
      return bVal - aVal;
    } else if (sortBy === 'value_low') {
      const aVal = aData.valorSubasta || 0;
      const bVal = bData.valorSubasta || 0;
      return aVal - bVal;
    }

    const aDiscount = calculateDiscount(aData.valorTasacion, aData.valorSubasta, aData.claimedDebt) || 0;
    const bDiscount = calculateDiscount(bData.valorTasacion, bData.valorSubasta, bData.claimedDebt) || 0;
    return bDiscount - aDiscount;
  });
}

export function calculateDiscount(valorTasacion?: number | null, valorSubasta?: number | null, claimedDebt?: number | null): number | null {
  const valorReferencia = valorTasacion || valorSubasta;

  if (valorReferencia && valorReferencia > 0 && claimedDebt != null && claimedDebt > 0) {
    const discount = ((valorReferencia - claimedDebt) / valorReferencia) * 100;
    return Math.round(discount);
  }
  return null;
}

export function extractFinalPrice(pujasText?: string): number | null {
  if (!pujasText) return null;
  const regex = /Puja máxima de la subasta\s*([\d.,]+)\s?€/i;
  const match = pujasText.match(regex);
  if (match) {
    const val = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    return isNaN(val) || val <= 0 ? null : val;
  }
  return null;
}

// ⚠️ IMPORTANTE:
// No introducir condiciones hardcodeadas por fecha (debug)
// Esta función se usa en producción para determinar estado real
export function isAuctionFinished(auctionDate?: string | null): boolean {
  if (!auctionDate || auctionDate === 'null') return false;
  
  // Parsear asegurando formato UTC para evitar problemas de timezone
  const endDate = new Date(auctionDate.includes('T') ? auctionDate : `${auctionDate}T00:00:00Z`);
  if (isNaN(endDate.getTime())) return false; // Invalid date

  const now = new Date();
  
  return now.getTime() > endDate.getTime();
}

export function formatDate(dateString: string | null): string {
  if (!dateString || dateString === 'null') return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function isAuctionActive(data: AuctionData): boolean {
  const status = getComputedStatus(data);
  return ['active', 'upcoming', 'suspended'].includes(status);
}

export function isAuctionClosed(data: AuctionData): boolean {
  return data.status === 'closed';
}

export function applyBasicFilters(data: AuctionData): boolean {
  const valorReferencia = data.valorTasacion || data.valorSubasta || data.appraisalValue || 0;
  // Reducimos el umbral para mostrar más subastas en desarrollo
  return valorReferencia >= 50000;
}

export function getFilteredAuctions(
  auctions: Record<string, AuctionData>
): Record<string, AuctionData> {
  const filtered: Record<string, AuctionData> = {};
  for (const [slug, data] of Object.entries(auctions)) {
    if (isAuctionActive(data) && applyBasicFilters(data) && data.assetCategory !== 'vehiculo') {
      filtered[slug] = data;
    }
  }
  return filtered;
}

export function isCapital(data: AuctionData): boolean {
  const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const city = normalizeCity(data);
  const province = normalizeProvince(data.province || data.city);
  if (!city || !province) return false;
  return city !== 'España' && normalize(city) === normalize(province);
}

export function isConflictZone(auction: AuctionData): boolean {
  if (!auction.address && !auction.description) return false;
  
  // Códigos postales comúnmente asociados a zonas de especial análisis (ejemplos muy conservadores)
  // Madrid: 28031 (Villa de Vallecas), 28041 (Usera), 28053 (Entrevías)
  // Barcelona/Sant Adrià: 08930 (La Mina)
  // Sevilla: 41006 (Los Pajaritos), 41009 (Polígono Norte), 41013 (Polígono Sur)
  // Alicante: 03009 (Virgen del Remedio), 03011 (Juan XXIII), 03014 (Colonia Requena)
  const conflictPostalCodes = [
    '28031', '28041', '28053', 
    '08930', 
    '41006', '41009', '41013',
    '03009', '03011', '03014'
  ];
  
  const address = (auction.address || '').toLowerCase();
  for (const pc of conflictPostalCodes) {
    if (address.includes(pc)) return true;
  }
  
  const desc = (auction.description || '').toLowerCase();
  if (desc.includes('okupa') || desc.includes('ocupado sin título') || desc.includes('ocupado ilegalmente')) {
    return true;
  }
  
  return false;
}

export function sortActiveFirst<T>(
  items: T[],
  getDate: (item: T) => string | null | undefined
): T[] {
  return [...items].sort((a, b) => {
    const aFinished = isAuctionFinished(getDate(a));
    const bFinished = isAuctionFinished(getDate(b));
    if (aFinished && !bFinished) return 1;
    if (!aFinished && bFinished) return -1;
    return 0;
  });
}

/**
 * Extrae planta y puerta de un string de dirección del BOE.
 * Implementa lógica de seguridad para evitar falsos positivos con números de calle.
 */
export function extractFloorFromAddress(address?: string | null): string | null {
  if (!address) return null;

  const upper = address.toUpperCase();
  const hasStrongContext = 
    upper.includes("PLANTA") || 
    upper.includes("PISO") || 
    upper.includes("BAJO") || 
    upper.includes("ATICO") || 
    upper.includes("ÁTICO") ||
    upper.includes("ENTRESUELO") ||
    upper.includes("PUERTA") ||
    upper.includes("DERECHA") ||
    upper.includes("IZQUIERDA");

  if (!address.includes(',') && !hasStrongContext) return null;

  const parts = address.split(',');
  const firstSegment = parts[0];
  // Si hay coma, buscamos en segmentos extra. Si no, buscamos en todo el string (contexto fuerte).
  const searchContext = address.includes(',') ? parts.slice(1).join(',').toUpperCase() : address.toUpperCase();

  // Extraer número de calle del primer segmento para validación (último número antes de la coma)
  const streetNumberMatch = firstSegment.match(/\s(\d+)[^\d]*$/);
  const streetNumber = streetNumberMatch ? streetNumberMatch[1] : null;

  const ordinalMap: Record<string, string> = {
    "PRIMERA": "1ª", "SEGUNDA": "2ª", "TERCERA": "3ª", "CUARTA": "4ª", "QUINTA": "5ª",
    "SEXTA": "6ª", "SEPTIMA": "7ª", "SÉPTIMA": "7ª", "OCTAVA": "8ª", "NOVENA": "9ª", "DECIMA": "10ª", "DÉCIMA": "10ª"
  };

  // 1. Buscar Planta (Obligatoria para este helper)
  let planta: string | null = null;
  
  // A) Planta narrativa
  const plantaNarrativeRegex = /(?:PLANTA|PISO)\s+(BAJA|PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|S[EÉ]PTIMA|OCTAVA|NOVENA|D[EÉ]CIMA|BAJO-CUBIERTA|S[OÓ]TANO|[AÁ]TICO|ENTRESUELO|ENTREPLANTA)/i;
  const plantaNarrativeMatch = searchContext.match(plantaNarrativeRegex);
  
  if (plantaNarrativeMatch) {
    const val = plantaNarrativeMatch[1].toUpperCase();
    if (val === "BAJA") planta = "Bajo";
    else if (val === "BAJO-CUBIERTA") planta = "Bajo cubierta";
    else if (ordinalMap[val]) planta = ordinalMap[val];
    else planta = val.charAt(0) + val.slice(1).toLowerCase();
  }

  // B) Planta formato corto (PLANTA 3, PLANTA 3ª)
  if (!planta) {
    const plantaShortRegex = /PLANTA\s*([A-Z0-9ªº°-]+)/i;
    const plantaShortMatch = searchContext.match(plantaShortRegex);
    if (plantaShortMatch) {
      planta = plantaShortMatch[1].trim();
    }
  }

  // C) Planta formato ordinal directo (1º, 2ª) - Solo si no es número de calle
  if (!planta) {
    const ordinalMatch = searchContext.match(/(\d{1,2}\s?[ºª°])(\s?[A-Z0-9ªº°-]*)/i);
    if (ordinalMatch) {
      const floorNumber = ordinalMatch[1].replace(/[^\d]/g, '');
      const hasDoor = ordinalMatch[2] && ordinalMatch[2].trim() !== "";
      if (hasDoor || floorNumber !== streetNumber) {
        planta = ordinalMatch[1].trim();
      }
    }
  }

  // Si no hay planta, abortamos (según requerimiento: planta obligatoria)
  if (!planta) return null;

  // 2. Buscar Puerta (Opcional, solo si hay planta)
  let puerta: string | null = null;

  // A) Puerta narrativa
  const puertaNarrativeRegex = /(?:PUERTA\s+(PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|S[EÉ]PTIMA|OCTAVA|NOVENA|D[EÉ]CIMA|[A-Z0-9]+)|A LA (DERECHA|IZQUIERDA)|AL (CENTRO))/i;
  const puertaNarrativeMatch = searchContext.match(puertaNarrativeRegex);
  
  if (puertaNarrativeMatch) {
    if (puertaNarrativeMatch[1]) {
      const val = puertaNarrativeMatch[1].toUpperCase();
      puerta = ordinalMap[val] || val;
    } else if (puertaNarrativeMatch[2]) {
      puerta = puertaNarrativeMatch[2].toLowerCase();
    } else if (puertaNarrativeMatch[3]) {
      puerta = puertaNarrativeMatch[3].toLowerCase();
    }
  }

  // B) Puerta desde el match ordinal (si existía)
  if (!puerta) {
    const ordinalMatch = searchContext.match(/(\d{1,2}\s?[ºª°])\s?([A-Z0-9ªº°]+)/i);
    if (ordinalMatch && ordinalMatch[2]) {
      puerta = ordinalMatch[2].trim().toLowerCase();
    }
  }

  return puerta ? `${planta} ${puerta}` : planta;
}
