const fs = require('fs');
console.log("CWD:", process.cwd());
const content = fs.readFileSync('src/data/auctions.ts', 'utf8');
const lines = content.split('\n');

const checkLines = [4509, 4631, 4662, 4722, 4752, 4783];
for (let num of checkLines) {
  console.log(`Line ${num}: ${lines[num - 1]}`);
}
