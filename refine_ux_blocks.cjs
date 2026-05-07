const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/**/*.tsx');

files.forEach(file => {
  if (!file.includes('Guide') && !file.includes('Page') && !file.includes('Article') && !file.includes('Hub') && !file.includes('Checklist') && !file.includes('Protocolo') && !file.includes('Pillar')) {
    return;
  }
  if (file.includes('AuctionPage.tsx') || file.includes('ProvinceHub.tsx') || file.includes('DiscoverSingleAuctionArticle.tsx') || file.includes('AuctionCard.tsx') || file.includes('SubastasBOEPage.tsx') || file.includes('VehicleAuctionsPage.tsx') || file.includes('CityPropertyAuctions.tsx') || file.includes('ZonePropertyAuctions.tsx')) {
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Let's replace the previous string we put:
  // "className=\"prose prose-lg prose-slate text-left max-w-3xl leading-relaxed space-y-6" (or similar)
  // We'll just do a more generic replace to be safe.
  
  const classTarget = 'prose prose-lg prose-slate text-left max-w-5xl mx-auto space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl prose-ul:max-w-3xl prose-ol:max-w-3xl';
  // Also we must reset any "max-w-3xl" that is directly on the article tag.
  content = content.replace(/className="prose ([^"]*)"/g, (match, p1) => {
      // Remove any existing max-w-* and text-left, text-justify
      let newClasses = p1.replace(/max-w-[a-z0-9]+/g, '');
      newClasses = newClasses.replace(/text-(left|justify|right|center)/g, '');
      newClasses = newClasses.replace(/leading-relaxed/g, '');
      newClasses = newClasses.replace(/space-y-6/g, '');
      newClasses = newClasses.replace(/prose-[a-z0-9:-]+/g, match => {
          // keep prose-headings, prose-p except max-w overrides we are adding
          if (match.includes('max-w-')) return '';
          return match;
      });
      // compress spaces
      newClasses = newClasses.replace(/\s+/g, ' ').trim();
      
      // We rebuild the optimal premium UX string
      return `className="prose ${newClasses} text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl"`;
  });
  
  // Actually, string interpolation won't work like that without backticks.
  content = content.replace(/className="prose \\$\\{newClasses\\}/g, 'className="prose '); // fix the mistake if any

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated UX Blocks in ' + file);
  }
});
