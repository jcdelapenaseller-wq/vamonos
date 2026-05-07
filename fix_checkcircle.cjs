const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir).map(f => path.join(srcDir, f));

for (const file of files) {
  if (!fs.statSync(file).isFile()) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  if (content.includes("<CheckCircle") || content.includes("CheckCircle ") || content.includes("CheckCircle,")) {
      if (!content.includes("import {") || (!content.match(/CheckCircle.*from ['"]lucide-react['"]/))) {
          // If lucide-react exists, add it to the import
          if (content.match(/import \{[^}]+\} from ['"]lucide-react['"];/)) {
             if (!content.includes("CheckCircle")) {
                 content = content.replace(/(import \{)([^}]+)(\} from ['"]lucide-react['"];)/, "$1 CheckCircle, $2 $3");
                 changed = true;
             } else {
                 if (!content.match(/import \{[^}]*CheckCircle[^}]*\} from ['"]lucide-react['"]/)) {
                    content = content.replace(/(import \{)([^}]+)(\} from ['"]lucide-react['"];)/, "$1 CheckCircle, $2 $3");
                    changed = true;
                 }
             }
          } else {
             content = "import { CheckCircle } from 'lucide-react';\n" + content;
             changed = true;
          }
      }
  }

  if (file.includes('SubastasBOEPage.tsx')) {
      content = content.replace(/<Info /g, "<Info2 ");
      content = content.replace(/<CheckCircle2 /g, "<CheckCircle ");
      if (content.includes("Info2") && !content.includes("Info2 ")) {
         content = content.replace(/(import \{)([^}]+)(\} from ['"]lucide-react['"];)/, "$1 Info as Info2, $2 $3");
      }
      changed = true;
  }
  
  if (file.includes('GuideMobileCTA.tsx')) {
      content = content.replace(/from '\.\.\/constants\/routes'/g, "from '../routes'");
      changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
}
console.log("Fixed CheckCircle missing imports in all components");
