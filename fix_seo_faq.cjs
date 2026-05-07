const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir)
  .filter(f => (f.includes('Guide') || f === 'SubastasBOEPage.tsx') && f.endsWith('.tsx'))
  .map(f => path.resolve(srcDir, f));

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Skip files that don't look like standard guides (e.g. indexes) -> wait, maybe some don't have useEffect or article
  if (!content.includes('useEffect')) continue;

  // 1. FAQ to Accordion & Extract JSON-LD FAQs
  const faqSectionRegex = /<section[^>]*>\s*<h2[^>]*>(?:Preguntas frecuentes|FAQ)<\/h2>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/section>/i;
  const match = content.match(faqSectionRegex);
  
  let faqsForSchema = [];
  
  if (match) {
    const faqContainerContent = match[1];
    
    // We parse individual `<div> <h3>...</h3> <p>...</p> </div>` blocks
    // Using a regex carefully
    const singleFaqRegex = /<div[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/gi;
    
    let modifiedContainer = faqContainerContent;
    let faqMatch;
    
    while ((faqMatch = singleFaqRegex.exec(faqContainerContent)) !== null) {
      const qHtml = faqMatch[1];
      const aHtml = faqMatch[2];
      
      // Clean up text for schema
      const cleanQ = qHtml.replace(/<[^>]+>/g, '').trim();
      const cleanA = aHtml.replace(/<[^>]+>/g, '').trim();
      
      faqsForSchema.push({
        "@type": "Question",
        "name": cleanQ,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": cleanA
        }
      });
      
      // Build replacement UX details
      const replacement = `
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">${qHtml.trim()}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>${aHtml.trim()}</p>
                        </div>
                    </details>`;
                    
      modifiedContainer = modifiedContainer.replace(faqMatch[0], replacement);
    }
    
    if (faqsForSchema.length > 0) {
        // Replace inner of section
        const newSection = match[0].replace(faqContainerContent, modifiedContainer);
        content = content.replace(match[0], newSection);
    }
  }

  // 2. SEO Tags in useEffect
  // Find useEffect that has window.scrollTo or SEO Meta Tags
  // We will replace the whole document.title ... down to JSON-LD injection
  
  // Extract URL
  const urlMatch = content.match(/setMeta\(['"`]og:url['"`],\s*['"`](https:\/\/activosoffmarket\.es\/[^'"`]+)['"`]\)/);
  const canonicalUrl = urlMatch ? urlMatch[1] : `https://activosoffmarket.es/guia/`;
  
  // Extract Title
  const titleMatch = content.match(/document\.title\s*=\s*['"`]([^'"`]+)['"`]/) || content.match(/setMeta\(['"`]og:title['"`],\s*['"`]([^'"`]+)['"`]\)/);
  const docTitle = titleMatch ? titleMatch[1] : 'Guía de Subastas | Activos Off-Market';
  
  // Extract Desc
  const descMatch = content.match(/setMeta\(['"`]og:description['"`],\s*['"`]([^'"`]+)['"`]\)/) || content.match(/metaDesc\.setAttribute\(['"`]content['"`],\s*['"`]([^'"`]+)['"`]\)/);
  const docDesc = descMatch ? descMatch[1] : '';
  
  // Ensure structured data graph
  // If we have an existing schemaData object
  let hasArticle = false;
  if (content.includes('"@type": "Article"')) {
     hasArticle = true;
  }
  
  // Let's replace the schemaData variable completely using regex
  // It's usually `const schemaData = { ... };` before useEffect
  const schemaVarRegex = /const schemaData = \{[\s\S]*?(?:;\n|;\s*useEffect)/;
  
  // We'll replace the existing schemaData and the whole SEO block in useEffect to ensure uniformity
  const seoSectionRegex = /document\.title = [\s\S]*?return \(\) =>/m;
  
  // If we can't safely regex, we'll try something else.
  // Actually, let's just make sure we replace the `schemaData` value.

  // 1. Identify schemaData block
  let existingSchemaString = '';
  const schemaRegex = /const schemaData = (\{[\s\S]*?\});/;
  const schemaMatch = content.match(schemaRegex);
  if (schemaMatch) {
      existingSchemaString = schemaMatch[1];
  }

  if (existingSchemaString && !existingSchemaString.includes('@graph')) {
      // It's not a graph yet. Convert it to a graph.
      let newSchema = `const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        ${existingSchemaString.replace(/"@context":\s*"https:\/\/schema\.org",?/, '')}`;
        
      if (faqsForSchema.length > 0) {
          const faqJson = JSON.stringify({
            "@type": "FAQPage",
            "mainEntity": faqsForSchema
          }, null, 10);
          newSchema += `,\n        ${faqJson}`;
      }
      
      const breadcrumbJson = JSON.stringify({
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": "https://activosoffmarket.es/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Guías sobre Subastas",
              "item": "https://activosoffmarket.es/guia-subastas-judiciales-boe/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": docTitle.split('|')[0].trim(),
              "item": canonicalUrl
            }
          ]
      }, null, 10);
      
      newSchema += `,\n        ${breadcrumbJson}\n      ]\n    };`;
      
      content = content.replace(schemaMatch[0], newSchema);
      
      // Update useEffect to have canonical and twitter
      const twitterCardSnippet = `
    // Twitter Card
    const setTwitter = (name, content) => {
        let element = document.head.querySelector(\`meta[name="\${name}"]\`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };
    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', \`${docTitle}\`);
    setTwitter('twitter:description', \`${docDesc}\`);
    setTwitter('twitter:image', IMG_HERO);

    // Canonical
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', \`${canonicalUrl}\`);
`;

      // Find where Open Graph ends or before JSON-LD inject
      // If canonical already exists, we might duplicate, so let's check
      if (!content.includes('// Twitter Card')) {
          content = content.replace(/\/\/ 3\. Inject JSON-LD/, twitterCardSnippet + "\n    // 3. Inject JSON-LD");
      }
      
      updatedCount++;
      fs.writeFileSync(file, content);
  }
}

console.log("Updated", updatedCount, "files with SEO and UX accordions.");
