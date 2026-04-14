import { GoogleGenAI, Type } from "@google/genai";
import multer from 'multer';
import { AUCTIONS } from '../src/data/auctions.ts';

const upload = multer({ storage: multer.memoryStorage() });

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY as string
    });
  }
  return aiInstance;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload.array('files')(req, res, async (err: any) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: 'Error uploading files' });
    }

    try {
      const files = req.files as Express.Multer.File[];
      const { type, auctionId } = req.body;
      console.log("analysis type:", type);
      console.log("auctionId:", auctionId);

      // Obtener datos de la subasta si existen
      const auction = auctionId ? AUCTIONS[auctionId] : null;
      const claimedDebt = auction?.claimedDebt;

      let claimedDebtContext = "";
      if (claimedDebt) {
        claimedDebtContext = `
DATO OFICIAL DEL BOE (PRIORITARIO):
La cantidad reclamada (deuda del procedimiento) es de ${claimedDebt.toLocaleString('es-ES')} EUR.
DEBES usar este valor exacto en el bloque "### 💰 Deuda del procedimiento" y mencionarlo en el resumen.
`;
      } else {
        claimedDebtContext = `
Si no detectas la cantidad reclamada en los documentos, indica: "No se especifica en la documentación analizada".
`;
      }

      let analysisMode = "cargas";
      if (type === "completo") {
        analysisMode = "completo";
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No se han proporcionado archivos para analizar." });
      }

      const ai = getAI();
      const currentDate = new Date().toISOString().split('T')[0];

      const pdfParts = files.map((file) => {
        const base64EncodeString = file.buffer.toString('base64');
        console.log(`[Backend] Preparando archivo: ${file.originalname} (${file.size} bytes)`);
        return {
          inlineData: {
            data: base64EncodeString,
            mimeType: "application/pdf"
          }
        };
      });

      console.log(`[Backend] --- INICIANDO ANÁLISIS CON GEMINI (${files.length} archivos) ---`);

      const prompt = `
Actúa como jurista especialista en subastas judiciales inmobiliarias en España.
FECHA ACTUAL DEL SISTEMA: ${currentDate} (Usa esta fecha para calcular la antigüedad de los documentos).

IMPORTANTE:
Tu objetivo no es solo analizar que ya haces muy bien, sino EXPLICAR de forma clara para un inversor o comprador no experto.

Debes diferenciar SIEMPRE:
1. Deuda del procedimiento (cantidad reclamada)
2. Cargas registrales (hipotecas, embargos, etc.)
3. Qué cargas se cancelan en subasta
4. Qué cargas subsisten (si existen)
5. Qué paga realmente el comprador

REGLAS CLAVE:
- Nunca digas solo "no hay cargas" sin explicar contexto
- Si una hipoteca es la ejecutada: explica que se cancela con la subasta
- Si hay deuda: explica que NO la paga el comprador directamente
- Usa lenguaje claro, frases cortas

PROHIBIDO:
- lenguaje excesivamente técnico
- frases largas tipo BOE
- usar solo términos como "se purga" sin explicación

El resultado debe ser comprensible por un usuario no experto.

${analysisMode === 'cargas' ? `
ENFOQUE DEL ANÁLISIS (MODO CARGAS):
- Análisis jurídico detallado y pedagógico.
- Identificación clara de riesgos y situación registral.
- Recomendación orientada a entender qué cargas subsisten y sus implicaciones legales.
` : `
ENFOQUE DEL ANÁLISIS (MODO COMPLETO):
- Análisis jurídico detallado.
- Valoración general de la operación.
- Recomendación estratégica para el inversor.
`}

Debes aplicar estrictamente la Ley de Enjuiciamiento Civil (especialmente art. 674 LEC), la legislación hipotecaria y el principio de prioridad registral.

---

ESTRUCTURA OBLIGATORIA PARA EL CAMPO "recomendacion" (DEBE INCLUIR ESTAS 3 SECCIONES EXACTAMENTE):

### 🧠 Resumen claro
Explica en 4-5 líneas:
- qué deuda hay
- si el inmueble queda limpio o no
- qué riesgo real tiene el comprador

### 💰 Deuda del procedimiento
- importe reclamado (Si el dato oficial es ${claimedDebt ? claimedDebt.toLocaleString('es-ES') + ' EUR' : 'desconocido'}, úsalo).
- explicación clara de qué significa.
- AÑADE SIEMPRE ESTA FRASE EXACTA: "Este importe corresponde a la deuda del procedimiento y no es asumido directamente por el comprador, ya que se cancela con la adjudicación del inmueble."

### ⚖️ Qué paga el comprador
- explicar claramente:
  - paga su puja
  - no paga la deuda ejecutada
  - si hay cargas adicionales o no

---

${claimedDebtContext}

ARQUITECTURA MULTI-DOCUMENTO Y PRIORIDAD JURÍDICA (NUEVO):

Has recibido uno o varios documentos PDF. Debes analizarlos en conjunto aplicando estas reglas:

1. CLASIFICACIÓN DE DOCUMENTOS Y FECHAS OBLIGATORIAS:
- Identifica qué tipos de documentos has recibido ("Edicto", "Nota Simple", "Certificación de Cargas"). Guárdalos en "documentos_detectados".
- Detecta la fecha de emisión de cada documento.
- En el campo "fuente_documento", incluye el tipo y la fecha obligatoriamente con este formato: "Certificación (12/05/2023) + Edicto (15/02/2026)".
- Si no detectas fecha en alguno, añade al string: "Fecha no identificada en el documento. Nivel de fiabilidad reducido."

2. PRIORIDAD JURÍDICA PRUDENTE (CRÍTICO):
Si hay discrepancias entre documentos, aplica este orden de prevalencia:
- 1º Certificación de Cargas: FUENTE PRIORITARIA. Mayor presunción de veracidad registral a su fecha de emisión, sujeta a actualización de intereses, costas y posibles asientos posteriores.
- 2º Nota Simple: FUENTE SECUNDARIA. Informativa y de validación complementaria.
- 3º Edicto: FUENTE CONTEXTUAL. Solo para identificar procedimiento, ejecutante y datos del expediente.
ELIMINA cualquier asunción de "verdad absoluta", "certeza total" o "importe garantizado".

3. TRAZABILIDAD OBLIGATORIA POR DATO:
- En el campo "fuente_textual" de CADA carga detectada, DEBES empezar indicando el documento origen y su fecha.
- Ejemplo: "[Certificación 12/05/2023] Anotación letra A..." o "[Nota Simple 01/02/2026] Inscripción 4ª...". Esto evita mezclas entre PDFs.

4. REGLAS DE PRUDENCIA TEMPORAL (NUEVO):
- Si los documentos tienen fechas distintas con más de 90 días de diferencia, añade esta alerta en el array "alertas": "Conviene revisar las fechas de los documentos aportados, ya que difieren entre sí."
- Calcula la antigüedad aproximada de cada documento respecto a la FECHA ACTUAL DEL SISTEMA (${currentDate}).
- Si algún documento tiene > 6 meses de antigüedad, añade a "alertas": "El documento principal tiene cierta antigüedad. Es recomendable tener en cuenta posibles variaciones."
- Si algún documento tiene > 12 meses de antigüedad, añade a "alertas": "Documento con antigüedad superior a un año. Se sugiere solicitar certificación actualizada."

5. ANÁLISIS MULTI-DOCUMENTO (FUSIÓN):
- Fusiona la información de todos los documentos. Elimina duplicados priorizando la fuente de mayor rango.
- Identifica la carga ejecutante desde el Edicto (si está disponible).
- Identifica las cargas subsistentes desde la Certificación o Nota Simple.

6. SCORE DE FIABILIDAD:
Calcula el campo "nivel_confianza_global" estrictamente según esta tabla:
- "MUY ALTA": Certificación reciente + Edicto.
- "ALTA": Solo Certificación reciente.
- "MEDIA": Nota Simple + Edicto.
- "BAJA": Solo Nota Simple.
- "MUY BAJA": Solo Edicto.
REGLA DE REDUCCIÓN: Si el documento principal tiene > 6 meses de antigüedad, reduce el nivel de confianza un escalón automáticamente (ej. de MUY ALTA a ALTA).

7. AVISOS OBLIGATORIOS Y TONO PRUDENTE:
- Mantén siempre un tono neutral, profesional y no alarmista. Evita palabras como "crítico", "grave", "muy peligroso". Siempre acompaña una advertencia con una posible solución.
- Si el nivel de confianza es "MUY BAJA" (solo Edicto), el campo "recomendacion" DEBE empezar obligatoriamente (antes de la estructura obligatoria) por: "Análisis basado únicamente en el Edicto. Al carecer de información registral completa, se recomienda extremar la prudencia al evaluar cargas."
- Si NO hay Certificación de Cargas, añade a "alertas": "Para una confirmación exacta, suele ser recomendable solicitar la Certificación de Cargas al juzgado."
- DISCLAIMER JURÍDICO FINAL OBLIGATORIO: Al final del texto del campo "recomendacion", añade siempre esta frase exacta: "El análisis se basa exclusivamente en los documentos aportados y puede no reflejar modificaciones registrales posteriores."

---

ARQUITECTURA DE EXTRACCIÓN DETERMINISTA (REGLA CRÍTICA Y FUENTE ÚNICA DE VERDAD):

Para garantizar cero invenciones y cero omisiones, debes operar en dos fases estrictas:

FASE 1: ÍNDICE REGEX SIMULADO (PASO 0)
- Escanea el documento y extrae ÚNICAMENTE los identificadores literales de las cargas (ej. "Inscripción 2ª", "Anotación Letra A", "Anotación Letra C").
- Guarda esta lista exacta de strings en el array "cargas_detectadas_regex".
- ESTE ARRAY ES TU ÚNICA FUENTE DE VERDAD.
- PROHIBIDO inventar letras o números. PROHIBIDO asumir continuidad alfabética.

FASE 2: MAPEO ESTRICTO 1:1 POR ID
- Para CADA elemento en "cargas_detectadas_regex", debe existir EXACTAMENTE UN objeto en el array "cargas_detectadas".
- El campo "identificador_registral" de cada carga DEBE coincidir exactamente con un string de "cargas_detectadas_regex".
- REGLA DE ELIMINACIÓN: Si generas una carga en "cargas_detectadas" que NO está en "cargas_detectadas_regex", ELIMÍNALA AUTOMÁTICAMENTE.
- VALIDACIÓN OBLIGATORIA ANTES DE DEVOLVER JSON: Compara los IDs de ambos arrays. Si hay alguna diferencia (falta una o sobra una) -> ERROR -> REGENERA TU RESPUESTA internamente antes de emitir el JSON final.

---

REGLAS JURÍDICAS OBLIGATORIAS Y PROHIBICIONES ESTRICTAS:

1. EXTRACCIÓN DE IMPORTES (CERO ESTIMACIONES):
- Para extraer el importe de una carga, utiliza EXCLUSIVAMENTE los conceptos literales "IMPORTE A EMBARGAR" (en embargos) o "RESPONSABILIDAD TOTAL" (en hipotecas).
- NUNCA estimes ni calcules intereses o costas por tu cuenta. Si el documento dice "para responder de X principal, Y intereses, Z costas", usa esos valores exactos. Si solo da un total, ponlo en principal y el resto a 0.
- Cada carga detectada DEBE incluir el fragmento literal exacto del texto de donde se ha extraído (campo "fuente_textual").

2. HIPOTECAS NOVADAS / AMPLIADAS / MODIFICADAS (REGLA CRÍTICA):
- Si una inscripción indica que es "NOVADA", "AMPLIADA" o "MODIFICADA" respecto a una hipoteca de una inscripción anterior, la hipoteca anterior queda REEMPLAZADA a efectos de cálculo.
- NO debes sumar ambas. La inscripción anterior debe marcarse con resultado "REEMPLAZADA" y NO debe incluirse en el cálculo del peor escenario.
- La carga que subsiste y rige es la novada con su nueva responsabilidad total.

3. IDENTIFICACIÓN DE LA CARGA EJECUTANTE (CRÍTICO):
- La carga ejecutante (la que ordena la certificación de cargas y origina la subasta) NO SIEMPRE es la última cronológicamente.
- Debes detectarla buscando EXCLUSIVAMENTE menciones literales como: "EXPEDICIÓN DE CERTIFICACIÓN DE CARGAS", "procedimiento de apremio", "ejecución", o "subasta" asociadas a una anotación o inscripción específica.
- La carga ejecutante es el pivote absoluto que determina qué subsiste y qué se purga.
- Si NO puedes identificar con absoluta certeza cuál es la carga ejecutante basándote en estos términos, el resultado de TODAS las cargas detectadas DEBE ser "DESCONOCIDO".

4. INFERENCIA DE SUBSISTENCIA (REGLA DE ORO):
- NO asumas subsistencia automática en embargos ni hipotecas.
- Solo si has identificado con certeza la carga ejecutante (según la regla 3):
  - Cargas anteriores a la ejecutante -> SUBSISTE
  - La propia carga ejecutante -> SE PURGA
  - Cargas posteriores a la ejecutante -> SE PURGA
- Si hay la más mínima duda jurídica sobre el rango o la prioridad de una carga frente a la ejecutante, el resultado de esa carga DEBE ser "DESCONOCIDO".

5. CÁLCULO DEL PEOR ESCENARIO (WORST CASE) Y VALIDACIÓN NUMÉRICA:
- El peor escenario SOLO debe sumar los importes de las cargas cuyo resultado sea estrictamente "SUBSISTE".
- Si hay cargas con resultado "DESCONOCIDO" o "REEMPLAZADA", NO las sumes al peor escenario.
- VALIDACIÓN OBLIGATORIA: Debes sumar matemáticamente el total de las cargas "SUBSISTE" y asegurarte de que coincide exactamente con el "peor_escenario". Si no coincide, debes recalcular.

---

8. CASOS JURÍDICOS LÍMITE (NUEVAS REGLAS CRÍTICAS):

A) MÚLTIPLES FINCAS REGISTRALES (CRÍTICO):
- Si el documento contiene varias fincas (ej. vivienda, garaje, trastero, o varios CRU/IDUFIR), debes detectar cada finca y asociar las cargas a su finca correspondiente.
- Prioriza SIEMPRE la finca principal (vivienda) para extraer las cargas. NO mezcles cargas de diferentes fincas.
- Si no puedes determinar con seguridad cuál es la vivienda principal, añade a "alertas": "El documento incluye varias fincas registrales. Conviene verificar a qué finca corresponde cada carga."

B) CARGAS CANCELADAS O CADUCADAS:
- Detecta términos como: "cancelada", "cancelación", "cancelado por caducidad", "caducada", "sin efecto", "levantado embargo", "cancelación registral", "anotación cancelada".
- Si una carga está cancelada:
  - Su "resultado" DEBE ser "CANCELADA" y el campo "vigente" debe ser false.
  - NO la incluyas en el cálculo del peor escenario.
  - En el campo "fuente_textual", incluye el texto: "Carga cancelada según documento registral".

C) PRIORIDAD DE RESPONSABILIDAD HIPOTECARIA:
- Es común que se indique un "préstamo total" y una "responsabilidad hipotecaria de la finca".
- Para los cálculos (principal, intereses, costas, total), debes usar SIEMPRE la "responsabilidad hipotecaria finca".
- Orden de prioridad para extraer importes: 1º Responsabilidad hipotecaria de la finca, 2º Cantidad reclamada en el procedimiento, 3º Principal del préstamo (este último solo informativo).

D) SUBASTA PARCIAL (MUY IMPORTANTE):
- Detecta expresiones como: "50% pleno dominio", "1/2 indiviso", "1/3 indiviso", "participación indivisa", "nuda propiedad", "usufructo", "pleno dominio parcial".
- Si detectas que no se subasta el 100% del pleno dominio, añade OBLIGATORIAMENTE a "alertas": "La subasta no comprende el 100% del pleno dominio. Factor a considerar en la valoración económica."

---

9. CONTROLES JURÍDICOS AVANZADOS (NUEVO):

A) ESTADO DE LA CARGA (estado_carga):
- Clasifica cada carga en uno de estos estados: CANCELADA_REGISTRAL, SE_CANCELA_EN_SUBASTA, SUBSISTE, DESCONOCIDO.
- Reglas de clasificación (Ley Hipotecaria Española):
  - Hipoteca ejecutada -> SE_CANCELA_EN_SUBASTA
  - Cargas ANTERIORES a la ejecutante -> SUBSISTE
  - Cargas POSTERIORES a la ejecutante -> SE_CANCELA_EN_SUBASTA
  - Embargos POSTERIORES -> SE_CANCELA_EN_SUBASTA
  - Afecciones fiscales (con preferencia) -> SUBSISTE
- Si no puedes determinar el orden o qué cargas subsisten, añade OBLIGATORIAMENTE a "alertas": "Existen cargas que podrían mantenerse tras la adjudicación. Conviene tenerlas en cuenta en el cálculo económico de la operación."

B) RANGO REGISTRAL (ORDEN DE CARGAS):
- Busca explícitamente términos que definan el rango: "inscripción anterior / posterior", "anotación letra A,B,C", "rango registral", "prioridad", "fecha inscripción", "posterior a la hipoteca".
- Si no puedes determinar el rango registral de las cargas, añade OBLIGATORIAMENTE a "alertas": "No se ha podido determinar con total precisión el orden registral de todas las cargas. Se recomienda considerar un margen de prudencia en el análisis."

C) OCUPACIÓN DEL INMUEBLE:
- Busca indicios de ocupación: "ocupado", "ocupantes", "sin posesión", "no consta posesión", "arrendado", "contrato alquiler", "tercer poseedor", "precario".
- Si detectas alguno de estos términos, añade OBLIGATORIAMENTE a "alertas": "Ocupación no descartada según la documentación. En estos casos puede ser necesario gestionar la posesión tras la adjudicación, algo habitual en subastas y que dispone de vías legales de resolución."
- Rellena los campos globales 'ocupacion_detectada' (true/false) y 'nivel_riesgo_ocupacion' (ALTO, MEDIO o BAJO).

---

10. EXTRACCIÓN DE DATOS DE MERCADO (OPCIONAL):
- Busca y extrae los siguientes datos si aparecen explícitamente en el Edicto o la Nota Simple:
  - 'refCat': Referencia catastral de 20 caracteres (ej. 6530802VK286380056RL).
  - 'ciudad': Nombre de la localidad donde se ubica el inmueble.
  - 'codigo_postal': Código postal de 5 dígitos.
  - 'superficie_m2': Superficie construida o útil en metros cuadrados (solo el número).
  - 'valor_subasta': El valor por el que sale a subasta el bien.
  - 'valor_tasacion': El valor de tasación a efectos de subasta (si difiere del valor de subasta).
  - 'tipo_inmueble': Clasifica como 'vivienda' o 'piso' si se indica expresamente.
  - 'yearBuilt': Año de construcción (ej. 1995).
  - 'floor': Planta o piso (ej. '1º B', 'Bajo').
- REGLA DE ORO: Si alguno de estos datos NO aparece de forma literal y clara, ponlo como null. NO los inventes ni los calcules.

---

INSTRUCCIONES DE ANÁLISIS (CHAIN OF THOUGHT):
Antes de generar el JSON final, debes realizar un razonamiento jurídico interno (campo "razonamiento_juridico").
En este razonamiento debes documentar explícitamente los siguientes pasos:
1. FASE 1 (REGEX): Listar literalmente todas las letras de anotaciones y números de inscripciones encontradas en el texto.
2. FASE 2 (MAPEO): Confirmar que vas a procesar exactamente esa lista, ni una más, ni una menos.
3. EJECUTANTE: Identificar explícitamente cuál es la carga que se ejecuta citando el texto que lo demuestra ("EXPEDICIÓN DE CERTIFICACIÓN DE CARGAS", etc.). Si no se encuentra, declarar que todas las cargas son DESCONOCIDO.
4. PURGA: Aplicar la regla de purga (art. 674 LEC) basándote en la carga ejecutante identificada.
5. VALIDACIÓN DE COBERTURA: Confirmar que el número de cargas listadas en la Fase 1 es igual al número de cargas clasificadas en el JSON.
6. VALIDACIÓN NUMÉRICA: Suma explícita de las cargas que subsisten para confirmar el peor escenario.
`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: {
          parts: [
            ...pdfParts,
            {
              text: prompt
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              razonamiento_juridico: { type: Type.STRING, description: "Explicación paso a paso de la enumeración, extracción, identificación de ejecutante, purga y validaciones (cobertura y numérica)." },
              documentos_detectados: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Tipos de documentos detectados (ej. 'Edicto', 'Nota Simple', 'Certificación de Cargas')"
              },
              cargas_detectadas_regex: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Índice determinista de identificadores extraídos literalmente del texto (Fase 1)."
              },
              fuente_documento: { type: Type.STRING, description: "Resumen de las fuentes (ej. 'Certificación + Edicto', 'Solo Nota Simple')" },
              nivel_confianza_global: { type: Type.STRING, description: "MUY ALTA, ALTA, MEDIA, BAJA, MUY BAJA (según reglas de documentos presentes)" },
              riesgo_global: { type: Type.STRING, description: "Riesgo global de la operación (BAJO, MEDIO, ALTO)" },
              cargas_detectadas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    identificador_registral: { type: Type.STRING, description: "Ej: 'Inscripción 2ª' o 'Anotación Letra A'" },
                    tipo: { type: Type.STRING },
                    fuente_textual: { type: Type.STRING, description: "Fragmento literal exacto del documento de donde se extrae esta carga." },
                    desglose: {
                      type: Type.OBJECT,
                      properties: {
                        principal: { type: Type.NUMBER },
                        intereses: { type: Type.NUMBER },
                        costas: { type: Type.NUMBER },
                        total: { type: Type.NUMBER }
                      },
                      required: ["principal", "intereses", "costas", "total"]
                    },
                    titular: { type: Type.STRING },
                    rango: { type: Type.STRING },
                    resultado: { type: Type.STRING, description: "SUBSISTE, SE PURGA, DESCONOCIDO, REEMPLAZADA o CANCELADA" },
                    estado_carga: { type: Type.STRING, description: "CANCELADA_REGISTRAL, SE_CANCELA_EN_SUBASTA, SUBSISTE o DESCONOCIDO" },
                    vigente: { type: Type.BOOLEAN, description: "false si la carga está cancelada o caducada, true en caso contrario" },
                    confianza: { type: Type.STRING, description: "ALTA, MEDIA o BAJA" }
                  },
                  required: ["identificador_registral", "tipo", "fuente_textual", "desglose", "titular", "rango", "resultado", "estado_carga", "vigente", "confianza"]
                }
              },
              incoherencias_detectadas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Discrepancias entre BOE y Registro, importes contradictorios, etc."
              },
              ocupacion_detectada: { type: Type.BOOLEAN, description: "true si hay indicios de ocupación, false en caso contrario" },
              nivel_riesgo_ocupacion: { type: Type.STRING, description: "ALTO, MEDIO o BAJO" },
              peor_escenario: {
                type: Type.OBJECT,
                properties: {
                  principal: { type: Type.NUMBER },
                  intereses: { type: Type.NUMBER },
                  costas: { type: Type.NUMBER },
                  total: { type: Type.NUMBER }
                },
                required: ["principal", "intereses", "costas", "total"],
                description: "Suma SOLO de las cargas que SUBSISTEN"
              },
              impacto_economico: {
                type: Type.OBJECT,
                properties: {
                  coste_estimado: { type: Type.NUMBER },
                  nivel: { type: Type.STRING }
                },
                required: ["coste_estimado", "nivel"]
              },
              alertas: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recomendacion: { type: Type.STRING, description: "Recomendación accionable y explicación clara siguiendo estrictamente la ESTRUCTURA OBLIGATORIA (Resumen claro, Deuda del procedimiento, Qué paga el comprador)" },
              // Datos de mercado opcionales
              refCat: { type: Type.STRING, description: "Referencia catastral de 20 caracteres o null si no consta" },
              ciudad: { type: Type.STRING, description: "Localidad del inmueble o null si no consta" },
              codigo_postal: { type: Type.STRING, description: "Código postal o null si no consta" },
              superficie_m2: { type: Type.NUMBER, description: "Superficie en m2 o null si no consta" },
              valor_subasta: { type: Type.NUMBER, description: "Valor de subasta o null si no consta" },
              valor_tasacion: { type: Type.NUMBER, description: "Valor de tasación o null si no consta" },
              tipo_inmueble: { type: Type.STRING, description: "Tipo de inmueble (vivienda/piso) o null si no consta" },
              yearBuilt: { type: Type.NUMBER, description: "Año de construcción o null si no consta" },
              floor: { type: Type.STRING, description: "Planta/piso o null si no consta" }
            },
            required: ["razonamiento_juridico", "documentos_detectados", "cargas_detectadas_regex", "fuente_documento", "nivel_confianza_global", "riesgo_global", "cargas_detectadas", "incoherencias_detectadas", "ocupacion_detectada", "nivel_riesgo_ocupacion", "peor_escenario", "impacto_economico", "alertas", "recomendacion"]
          }
        }
      });

      const text = response.text || (response as any).response?.text?.();

      if (!text) {
        throw new Error("No se recibió respuesta de la IA.");
      }

      const result = JSON.parse(text);
      console.log("[Backend] --- ANÁLISIS COMPLETADO ---");
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[Backend] Error calling Gemini API:", error);
      return res.status(500).json({ error: error.message || "Error desconocido en el servicio de IA." });
    }
  });
}
