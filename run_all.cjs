const { execSync } = require('child_process');
const fs = require('fs');
const auctionIds = [
    "SUB-JA-2024-228471","SUB-JA-2026-234448","SUB-JV-2026-258600","SUB-JA-2025-253046","SUB-JA-2025-253449","SUB-JA-2025-253652","SUB-JA-2025-256022","SUB-JA-2026-258794","SUB-JA-2026-258904","SUB-JA-2026-258921"
];

const results = [];

for (const id of auctionIds) {
    try {
        console.log(`Scraping ${id}...`);
        const output = execSync(`npx ts-node scrapeAuction.cjs ${id}`).toString();
        // Extract JSON from output
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            results.push(JSON.parse(jsonMatch[0]));
        }
    } catch (e) {
        console.error(`Error scraping ${id}: ${e.message}`);
    }
}

fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
