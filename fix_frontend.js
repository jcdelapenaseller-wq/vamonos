const fs = require('fs');
let content = fs.readFileSync('src/components/LoadAnalysisBlock.tsx', 'utf8');

// 1. Insert safeResult definition
const safeResultDef = `
  const safeResult = resultData ? {
    cargas_detectadas: [],
    incoherencias_detectadas: [],
    alertas: [],
    ...resultData,
    peor_escenario: {
      total: 0,
      importe_total: 0,
      ...(resultData.peor_escenario || {})
    },
    impacto_economico: {
      nivel: "DESCONOCIDO",
      ...(resultData.impacto_economico || {})
    },
    nivel_confianza_global: resultData.nivel_confianza_global || "DESCONOCIDO",
    riesgo_global: resultData.riesgo_global || "DESCONOCIDO",
    fuente_documento: resultData.fuente_documento || "Desconocida",
  } : null;
`;

content = content.replace(
  'const [resultData, setResultData] = useState<AnalysisResult | null>(initialData);',
  'const [resultData, setResultData] = useState<AnalysisResult | null>(initialData);\n' + safeResultDef
);

// 2. Replace resultData with safeResult in specific blocks
content = content.replace(/resultData\./g, 'safeResult.');
content = content.replace(/resultData\?/g, 'safeResult?');
content = content.replace(/step === 'result' && resultData/g, "step === 'result' && safeResult");
content = content.replace(/analysisResult: resultData/g, "analysisResult: safeResult");
content = content.replace(/JSON\.stringify\(resultData\)/g, "JSON.stringify(safeResult)");

// Fix the definition part back to resultData
content = content.replace(/\.\.\.safeResult/g, '...resultData');
content = content.replace(/safeResult\.peor_escenario/g, 'resultData.peor_escenario');
content = content.replace(/safeResult\.impacto_economico/g, 'resultData.impacto_economico');
content = content.replace(/safeResult\.nivel_confianza_global/g, 'resultData.nivel_confianza_global');
content = content.replace(/safeResult\.riesgo_global/g, 'resultData.riesgo_global');
content = content.replace(/safeResult\.fuente_documento/g, 'resultData.fuente_documento');

// Fix useEffect dependency array
content = content.replace(/\[step, safeResult, isIntegrated, navigate, boeId\]/g, "[step, resultData, isIntegrated, navigate, boeId]");

// 3. Fix toLocaleString calls
const localeStringRegex = /\{([^}]+)\.toLocaleString\('es-ES', \{style: 'currency', currency: 'EUR'\}\)\}/g;
content = content.replace(localeStringRegex, (match, p1) => {
  return `{${p1} ? ${p1}.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}`;
});

const peorEscenarioRegex = /\{safeResult\.peor_escenario\.total\.toLocaleString\('es-ES', \{style: 'currency', currency: 'EUR'\}\)\}/g;
content = content.replace(peorEscenarioRegex, `{safeResult.peor_escenario?.total ? safeResult.peor_escenario.total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}`);

fs.writeFileSync('src/components/LoadAnalysisBlock.tsx', content);
console.log("Done");
