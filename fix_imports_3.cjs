const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir)
  .filter(f => f.includes('Guide') || f === 'SubastasBOEPage.tsx')
  .map(f => path.join(srcDir, f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  if (content.includes("CheckCircle")) {
      // Find the lucide-react import
      if (content.match(/import \{[^}]+\} from 'lucide-react';/)) {
          // Check if CheckCircle already exists
          if (!content.match(/import \{[^}]*CheckCircle[^}]*\} from 'lucide-react';/)) {
            content = content.replace(/(import \{)([^}]+)(\} from 'lucide-react';)/, "$1 CheckCircle, $2 $3");
            changed = true;
          }
      } else if (content.match(/import \{[^}]+\} from "lucide-react";/)) {
          if (!content.match(/import \{[^}]*CheckCircle[^}]*\} from "lucide-react";/)) {
            content = content.replace(/(import \{)([^}]+)(\} from "lucide-react";)/, "$1 CheckCircle, $2 $3");
            changed = true;
          }
      } else {
          content = "import { CheckCircle } from 'lucide-react';\n" + content;
          changed = true;
      }
  }

  if (file.includes('GuideMobileCTA.tsx')) {
      content = content.replace(/from '\.\.\/routes'/g, "from '../constants/routes'");
      content = content.replace(/ROUTES\.HUB_ANALISIS/g, "ROUTES.ANALIZAR_SUBASTA");
      changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
}
console.log("Fixed proper imports");
