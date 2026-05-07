import { execSync } from 'child_process';
import { AUCTIONS } from '../src/data/auctions';

async function main() {
  console.log("--- 1. Git Status ---");
  try {
    const output = execSync('git fetch origin main', { encoding: 'utf-8', stdio: 'pipe' });
    console.log("Git fetch success:");
    console.log(output);
    const status = execSync('git status -uno', { encoding: 'utf-8', stdio: 'pipe' });
    console.log(status);
  } catch (err: any) {
    console.log("Git fetch failed or Git is not initialized:");
    console.log(err.message);
  }

  console.log("\n--- 2. Dataset Status (src/data/auctions.ts) ---");
  const numAuctions = Object.keys(AUCTIONS).length;
  console.log(`Number of auctions in preview dataset: ${numAuctions}`);
  
}

main();
