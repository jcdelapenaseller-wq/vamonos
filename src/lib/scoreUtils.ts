
/**
 * Calcula la puntuación de oportunidad de una subasta (0-10)
 * Basado en rentabilidad, seguridad jurídica y facilidad de toma de posesión.
 */
export function calculateOpportunityScore(inputs: {
  cargas_detectadas: any[];
  valorMercado: number;
  valorSubasta: number;
  pujaEstimada?: number;
  ocupacion_detectada: boolean;
}) {
  const { cargas_detectadas, valorMercado, pujaEstimada, valorSubasta, ocupacion_detectada } = inputs;

  const pujaBase = pujaEstimada ?? valorSubasta;

  let scoreEconomico = 0;
  let scoreJuridico = 0;
  let scorePractico = 0;
  const explicaciones: string[] = [];

  // --- 1. CÁLCULO DE CARGAS SUBSISTENTES ---
  const totalSubsistente = (cargas_detectadas || [])
    .filter(c => {
      const tipo = (c.tipo || "").toUpperCase();
      const estado = (c.estado || "").toUpperCase();
      
      if (tipo.includes("SERVIDUMBRE")) return false;
      return estado === "SUBSISTE";
    })
    .reduce((sum, c) => sum + (c.desglose?.principal || c.importe || 0), 0);

  // --- 2. FACTOR ECONÓMICO (4 PTS) ---
  const inversionTotal = pujaBase + totalSubsistente;
  const margenSeguridad = (valorMercado - inversionTotal) / valorMercado;

  if (margenSeguridad > 0.4) {
    scoreEconomico = 4;
    explicaciones.push("Margen de beneficio excelente (>40%).");
  } else if (margenSeguridad > 0.2) {
    scoreEconomico = 3;
    explicaciones.push("Buen margen de seguridad económica.");
  } else if (margenSeguridad > 0.05) {
    scoreEconomico = 1;
    explicaciones.push("Margen ajustado, rentabilidad moderada.");
  } else {
    scoreEconomico = 0;
    explicaciones.push("Margen escaso o negativo: riesgo de pérdida económica.");
  }

  // --- 3. FACTOR JURÍDICO (4 PTS) ---
  if (totalSubsistente === 0) {
    scoreJuridico = 4;
    explicaciones.push("No se han detectado cargas económicas relevantes");
  } else {
    explicaciones.push(`Existen cargas que subsisten por ${totalSubsistente.toLocaleString('es-ES')}€`);
    
    const pesoCargas = totalSubsistente / valorMercado;
    if (totalSubsistente > valorMercado) {
      scoreJuridico = 0;
    } else if (pesoCargas < 0.1) {
      scoreJuridico = 3;
    } else if (pesoCargas < 0.2) {
      scoreJuridico = 2;
    } else if (pesoCargas < 0.4) {
      scoreJuridico = 1;
    } else {
      scoreJuridico = 0;
    }
  }

  // --- 4. FACTOR PRÁCTICO (2 PTS) ---
  if (!ocupacion_detectada) {
    scorePractico = 2;
    explicaciones.push("Sin indicios de ocupación: posesión previsiblemente rápida.");
  } else {
    scorePractico = 0;
    explicaciones.push("Existe posible ocupación del inmueble");
  }

  const scoreTotal = scoreEconomico + scoreJuridico + scorePractico;

  return {
    scoreTotal: Math.min(10, Math.max(0, scoreTotal)),
    detalle: {
      economico: scoreEconomico,
      juridico: scoreJuridico,
      practico: scorePractico
    },
    explicacion: explicaciones
  };
}
