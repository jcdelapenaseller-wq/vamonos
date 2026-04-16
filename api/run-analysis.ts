// import auctions from '../src/data/auctions.json' assert { type: 'json' };

export default async function handler(req: any, res: any) {
  console.log("START handler");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const type = req.body?.type;
    const auctionId = req.body?.auctionId;
    const pdfUrl = req.body?.pdfUrl || null;
    
    console.log("pdfUrl received:", pdfUrl);
    console.log("analysis type:", type);
    console.log("auctionId:", auctionId);

    let base64 = "";

    if (pdfUrl) {
      // Descargar PDF
      console.log("[Backend] Intentando descargar PDF desde URL:", pdfUrl);
      const responseFile = await fetch(pdfUrl);
      
      console.log("[Backend] Cloudinary Response Status:", responseFile.status);
      console.log("[Backend] Cloudinary Response StatusText:", responseFile.statusText);
      
      if (!responseFile.ok) {
        const errorText = await responseFile.text();
        console.error("[Backend] Error body from Cloudinary:", errorText);
        throw new Error(`Error al descargar el PDF (${responseFile.status}): ${errorText || responseFile.statusText}`);
      }
      const fileBuffer = await responseFile.arrayBuffer();
      base64 = Buffer.from(fileBuffer).toString("base64");
    } else if (req.files && req.files.length > 0) {
      // Fallback a req.files si no hay pdfUrl
      base64 = req.files[0].buffer.toString("base64");
    } else {
      return res.status(400).json({ error: "No pdfUrl or files provided" });
    }

    // Obtener datos de la subasta si existen
    // const auction = auctionId ? (auctions as any)[auctionId] : null;
    // const claimedDebt = auction?.claimedDebt;
    const claimedDebt: any = null;

    let claimedDebtContext = "";
    /*
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
    */

    let analysisMode = "cargas";
    if (type === "completo") {
      analysisMode = "completo";
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const pdfParts = [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64
        }
      }
    ];

    console.log(`[Backend] --- INICIANDO ANÁLISIS CON GEMINI ---`);

    // Diagnóstico de modelos disponibles
    try {
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const modelsData = await modelsResponse.json();
      console.log("MODELOS DISPONIBLES:", JSON.stringify(modelsData, null, 2));
    } catch (err) {
      console.error("Error al listar modelos:", err);
    }

    const prompt = `
Analiza EXCLUSIVAMENTE el contenido del documento PDF proporcionado. No respondas si no detectas texto claro del documento.

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

INSTRUCCIONES DE ANÁLISIS (CHAIN OF THOUGHT):
Antes de generar el JSON final, debes realizar un razonamiento jurídico interno (campo "razonamiento_juridico").
En este razonamiento debes documentar explícitamente los siguientes pasos:
1. IDENTIFICACIÓN: Listar las cargas encontradas en el texto.
2. EJECUTANTE: Identificar explícitamente cuál es la carga que se ejecuta citando el texto que lo demuestra ("EXPEDICIÓN DE CERTIFICACIÓN DE CARGAS", etc.). Si no se encuentra, declarar que todas las cargas son DESCONOCIDO.
3. PURGA: Aplicar la regla de purga (art. 674 LEC) basándote en la carga ejecutante identificada.
4. VALIDACIÓN NUMÉRICA: Suma explícita de las cargas que subsisten para confirmar el peor escenario.

Responde ÚNICAMENTE con el objeto JSON solicitado, sin texto adicional.
`;

      const modelName = "gemini-2.5-flash";
      console.log("Model used:", modelName);
      console.log("MODEL OK:", modelName);
      console.log("PDF PARTS:", pdfParts.map(p => ({ inlineData: { mimeType: p.inlineData.mimeType, data: p.inlineData.data.substring(0, 50) + "..." } })));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  ...pdfParts
                ]
              }
            ]
          })
        }
      );

      console.log("STATUS:", response.status);
      console.log("HEADERS:", Object.fromEntries(response.headers.entries()));
      const rawText = await response.text();
      console.log("RAW TEXT:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse raw text as JSON", e);
      }

      if (data && data.error) {
        console.error("GEMINI ERROR:", data.error);
        return res.status(500).json({ error: data.error.message });
      }

      console.log("Gemini RAW:", data);

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("No response from Gemini");
      }

      console.log("=== GEMINI RAW START ===");
      console.log(text);
      console.log("=== GEMINI RAW END ===");

      const cleanText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let result;
      try {
        result = JSON.parse(cleanText);
      } catch (e) {
        console.error("JSON PARSE ERROR:", cleanText);
        return res.status(500).json({ error: "Error parseando respuesta IA" });
      }

      console.log("[Backend] --- ANÁLISIS COMPLETADO ---");
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("[Backend] Error calling Gemini API:", error);
      return res.status(500).json({ error: error.message || "Error desconocido en el servicio de IA." });
    }
}
