const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir)
  .filter(f => f.includes('.tsx'))
  .map(f => path.join(srcDir, f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  if (content.includes("import { CheckCircle } from 'lucide-react';")) {
      content = content.replace(/import { CheckCircle } from 'lucide-react';\n/g, "");
      
      // Now re-add CheckCircle to the existing lucide-react import
      if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
          content = content.replace(/(import \{[^}]+)\} from 'lucide-react';/, "$1, CheckCircle } from 'lucide-react';");
      } else {
          content = "import { CheckCircle } from 'lucide-react';\n" + content;
      }
      changed = true;
  }
  
  // Also clean up any multiples
  if (content.includes("CheckCircle, CheckCircle")) {
      content = content.replace(/CheckCircle, CheckCircle/g, "CheckCircle");
  }

  // Mobile CTA route fix
  if (file.includes('GuideMobileCTA')) {
      content = content.replace(/from '\.\.\/routes'/g, "from '../constants/routes'");
      content = content.replace(/ROUTES\.HUB_ANALISIS/g, "ROUTES.ANALIZAR_SUBASTA");
      changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
}
// Clean up any stray "import { CheckCircle } from ... " leftovers inside imports
// Done above via stripping them first
