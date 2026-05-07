const fs = require('fs');

const file = 'src/components/AuctionAnalysisGuide.tsx';
const lines = fs.readFileSync(file, 'utf-8').split('\n');
const fixed = lines.filter((_, i) => !(i >= 269 && i <= 285)).join('\n');
fs.writeFileSync(file, fixed);
console.log("Fixed!");
