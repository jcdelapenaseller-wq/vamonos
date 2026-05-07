const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'src/components/AuctionWorthItGuide.tsx');
let content = fs.readFileSync(file, 'utf-8');

const regex = /<div className="bg-green-50[^>]*>[\s\S]*?Checklist de Viabilidad[\s\S]*?<\/ul>\s*<\/div>/g;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Fixed bg-green-50 checklist in bg-green-50 file');
