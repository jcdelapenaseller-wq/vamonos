const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (!dirent.isDirectory()) {
      if (res.includes('Guide') && res.endsWith('.tsx')) {
        files.push(res);
      }
    }
  }
  return files;
}

const files = getFiles(path.resolve(__dirname, 'src/components'));

let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Strip Checklists - they usually start with <div className="bg-brand-50 border-l-4...
  // and end with </div>
  const checklistRegex = /<div className="bg-brand-(?:50|100)[^>]*>[\s\S]*?<CheckCircle[^>]*>[\s\S]*?Checklist[\s\S]*?<\/div>/gi;
  if(checklistRegex.test(content)) {
     content = content.replace(checklistRegex, '');
     changed++;
  }
  
  const checklistRegex2 = /<div className="bg-white border[^>]*>[\s\S]*?<CheckCircle[^>]*>[\s\S]*?Checklist[\s\S]*?<\/div>/gi;
  if(checklistRegex2.test(content)) {
     content = content.replace(checklistRegex2, '');
     changed++;
  }
  
  fs.writeFileSync(file, content);
}
console.log('Fixed checklist blocks in ' + changed + ' files');
