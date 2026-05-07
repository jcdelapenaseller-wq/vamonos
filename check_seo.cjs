const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir)
  .filter(f => (f.includes('Guide') || f === 'SubastasBOEPage.tsx') && f.endsWith('.tsx'))
  .map(f => path.resolve(srcDir, f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('BreadcrumbList')) {
      console.log('Missing BreadcrumbList:', path.basename(file));
  }
}
