const fs = require('fs');
const glob = require('glob');

// Use glob to find all TSX files in src/components
const files = glob.sync('src/components/**/*.tsx');

for (const file of files) {
  // Exclude dynamic or list pages
  if (file.includes('AuctionPage.tsx') || file.includes('ProvinceHub.tsx') || file.includes('DiscoverSingleAuctionArticle.tsx') || file.includes('AuctionCard.tsx')) {
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Look for any variation of prose that has max-w-none
  // We want to replace it with text-justify max-w-4xl space-y-6
  const regex1 = /className="prose prose-lg prose-slate (max-w-none )?/g;
  const replacement1 = 'className="prose prose-lg prose-slate text-justify max-w-4xl space-y-6 ';
  
  const regex2 = /className="prose prose-slate (max-w-none )?/g;
  const replacement2 = 'className="prose prose-slate text-justify max-w-4xl space-y-6 ';

  // But wait, the previous replacement might leave multiple spaces or we might replace things we don't want.
  // Instead, let's target specific components: Guide, Page, Article, Hub
  if (file.includes('Guide') || file.includes('Page') || file.includes('Article') || file.includes('Hub') || file.includes('Checklist') || file.includes('Protocolo')) {
      content = content.replace(/className="prose prose-lg prose-slate max-w-none/g, 'className="prose prose-lg prose-slate text-justify max-w-4xl space-y-6');
      content = content.replace(/className="prose prose-slate max-w-none/g, 'className="prose prose-slate text-justify max-w-4xl space-y-6');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}

