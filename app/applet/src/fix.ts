import fs from 'fs';
let content = fs.readFileSync('src/components/LoadAnalysisBlock.tsx', 'utf8');

// Replace resultData with safeResult in the JSX block
// The JSX block starts around line 1087: "{step === 'result' && resultData && ("
// We can just replace all `resultData` with `safeResult` from that point onwards.
const parts = content.split("{step === 'result' && resultData && (");
if (parts.length === 2) {
  let jsxBlock = parts[1];
  jsxBlock = jsxBlock.replace(/resultData/g, 'safeResult');
  
  // Fix toLocaleString calls in the jsxBlock
  const localeStringRegex = /\{([^}]+)\.toLocaleString\('es-ES', \{style: 'currency', currency: 'EUR'\}\)\}/g;
  jsxBlock = jsxBlock.replace(localeStringRegex, (match, p1) => {
    return `{${p1} ? ${p1}.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}`;
  });

  content = parts[0] + "{step === 'result' && safeResult && (" + jsxBlock;
  fs.writeFileSync('src/components/LoadAnalysisBlock.tsx', content);
  console.log("Done");
} else {
  console.log("Could not find the split point");
}
