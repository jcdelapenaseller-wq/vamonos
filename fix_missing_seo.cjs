const fs = require('fs');
const path = require('path');

const files = [
    path.resolve(__dirname, 'src/components/AuctionGuideIndex.tsx'),
    path.resolve(__dirname, 'src/components/AuctionGuidesHub.tsx'),
    path.resolve(__dirname, 'src/components/CalculateBidGuide.tsx')
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf-8');
    
    // We just want to add the canonical and og tags dynamically, and breadcrumbs
    if (file.includes('CalculateBidGuide.tsx')) {
        // Fix FAQ UI
        const faqReplacement = `
      <section className="not-prose bg-slate-50 p-10 rounded-3xl border border-slate-200 mt-12">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
            <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-lg pr-4">¿Cómo calcular la puja máxima?</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </summary>
                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>Calcula restando todos los costes asociados (impuestos, registro, reformas, deudas previas) al valor real de mercado.</p>
                </div>
            </details>
            <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-lg pr-4">¿Cuánto dinero necesito?</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </summary>
                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>Como mínimo, necesitas el 5% de consignación del valor de subasta para poder participar en el portal del BOE.</p>
                </div>
            </details>
        </div>
      </section>
`;
        content = content.replace(/<h2>FAQ<\/h2>\s*<ul>[\s\S]*?<\/ul>/, faqReplacement);
        
        // Add SEO tags in useEffect
        const hookInject = `
    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://activosoffmarket.es/guia/';
    
    // Schema
    const schemaData = {
          "@context": "https://schema.org",
          "@graph": [
            {
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
                  "name": "Guías",
                  "item": "https://activosoffmarket.es/guia-subastas-judiciales-boe/"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": content.title,
                  "item": canonicalUrl
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "¿Cómo calcular la puja máxima?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Calcula restando todos los costes asociados al valor real de mercado." }
                },
                {
                  "@type": "Question",
                  "name": "¿Cuánto dinero necesito?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Como mínimo, necesitas el 5% de consignación del valor de subasta para participar." }
                }
              ]
            }
          ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
    
    const setTwitter = (name, val) => {
        let element = document.head.querySelector(\`meta[name="\${name}"]\`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', val);
    };
    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', content.title);
    setTwitter('twitter:description', content.desc);
    
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    return () => {
        if (document.head.contains(script)) {
            document.head.removeChild(script);
        }
    };
`;
        content = content.replace(/document\.title = [\s\S]*?\};\n  \}, \[content\.title\]\);/, `document.title = \`\${content.title} | Activos Off-Market\`;
${hookInject}
  }, [content.title]);`);

    } else {
        // AuctionGuidesHub and AuctionGuideIndex just need BreadcrumbList added securely
        if (content.includes('"@graph": [')) {
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
                  "name": "Guías",
                  "item": "https://activosoffmarket.es/guia-subastas-judiciales-boe/"
                }
              ]
            }, null, 10);
            content = content.replace(/"@graph":\s*\[/, `"@graph": [\n${breadcrumbJson},`);
            
            // Add OG and twitter logic
            const canonicalSnippet = `
    const canonicalUrl = 'https://activosoffmarket.es' + ROUTES.GUIDE_PILLAR;
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    const setTwitter = (name, val) => {
        let element = document.head.querySelector(\`meta[name="\${name}"]\`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', val);
    };
    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', document.title);
            `;
            
            if (!content.includes('setTwitter')) {
                content = content.replace(/const script = document\.createElement\('script'\);/, canonicalSnippet + `\n    const script = document.createElement('script');`);
            }
        }
    }
    
    fs.writeFileSync(file, content);
}
console.log('Fixed 3 missing files');
