import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import fs from 'fs'
import { DISCOVER_REPORTS } from './src/data/discoverReports'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')
const pr = vitePrerender.default || vitePrerender;
const JSDOMRenderer = require('@prerenderer/renderer-jsdom');
const Renderer = JSDOMRenderer.default || JSDOMRenderer;

// Helper to normalized province name
const removeAccents = (str: string): string => {
  return str
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U');
};

const normalizeLocationName = (name: string): string => {
  if (!name) return '';
  let clean = name.toLowerCase().trim();
  if (clean.includes('/')) clean = clean.split('/')[0].trim();
  clean = clean.replace(/\([^)]*\)/g, '').trim();
  clean = clean.replace(/,?\s*\d{5}\b/g, '').trim();
  clean = removeAccents(clean);
  clean = clean.split(/[\s-]+/).map(word => {
    if (['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'l'].includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  const corrections: Record<string, string> = {
    'Alacant': 'Alicante', 'Castello': 'Castellon', 'Girona': 'Gerona',
    'Lleida': 'Lerida', 'Ourense': 'Orense', 'A Coruna': 'A Coruña',
    'Donostia': 'San Sebastian', 'Gasteiz': 'Vitoria', 'Bilbo': 'Bilbao'
  };
  return corrections[clean] || clean;
};

// Extract provinces from auctions.json
const auctionsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/data/auctions.json'), 'utf-8'));
const uniqueProvinceNames = new Set<string>();
Object.values(auctionsData).forEach((a: any) => {
  const p = normalizeLocationName(a.province || a.city);
  if (p && p !== 'España') uniqueProvinceNames.add(p);
});

const provinceRoutes = Array.from(uniqueProvinceNames).map(p => 
  `/noticias-subastas/provincia/${p.toLowerCase().replace(/\s+/g, '-')}`
);

const isAuctionFinished = (auctionDate?: string | null): boolean => {
  if (!auctionDate || auctionDate === 'null') return false;
  const endDate = new Date(auctionDate.includes('T') ? auctionDate : `${auctionDate}T00:00:00Z`);
  if (isNaN(endDate.getTime())) return false;
  return new Date().getTime() > endDate.getTime();
}

const TOP_CITIES = ['madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'murcia'];

const activeAuctionRoutes = Object.entries(auctionsData)
  .filter(([slug, data]: [string, any]) => data.assetCategory !== 'vehiculo')
  .map(([slug, data]: [string, any]) => {
    const tasacion = data.valorTasacion || data.appraisalValue || 0;
    const valor = data.valorSubasta || 0;
    const ratio = (tasacion > 0 && valor > 0) ? (1 - (valor / tasacion)) : 0;
    
    const isTopCity = data.city && TOP_CITIES.some(c => data.city.toLowerCase().includes(c));
    const active = !isAuctionFinished(data.auctionDate);
    
    let timestamp = 0;
    if (data.auctionDate && data.auctionDate !== 'null') {
      const ts = new Date(data.auctionDate.includes('T') ? data.auctionDate : `${data.auctionDate}T00:00:00Z`).getTime();
      if (!isNaN(ts)) timestamp = ts;
    }

    let score = 0;
    if (active) score += 10000;
    if (ratio >= 0.25) score += 1000;
    if (isTopCity) score += 100;
    
    return { slug, ratio, timestamp, score };
  })
  .sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.ratio !== b.ratio) return b.ratio - a.ratio;
    return b.timestamp - a.timestamp;
  })
  .map(item => `/subasta/${item.slug}`)
  .slice(0, 150);

const routesToPrerender = [
  ...Object.keys(DISCOVER_REPORTS).map(slug => `/analisis/${slug}`),
  ...provinceRoutes,
  ...activeAuctionRoutes,
  '/equipo'
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pr({
      staticDir: path.join(__dirname, 'dist'),
      routes: routesToPrerender,
      postProcess(renderedRoute: any) {
        // Extract the slug from the route path
        const slug = renderedRoute.route.split('/').pop();
        
        let modifiedHtml = renderedRoute.html;

        // Try reading as a discover report
        const report = DISCOVER_REPORTS[slug];
        if (report) {
          const title = `${report.title} | Activos Off-Market`;
          
          let contentHtml = `
            <div id="root">
              <main class="prerendered-content" style="padding: 2rem;">
                <h1>${report.title}</h1>
                <img src="${report.image}" alt="${report.title}" style="max-width:100%; height:auto;" />
                <p><strong>Publicado:</strong> ${report.publishDate}</p>
                <article>
                  <p>${report.intro}</p>
                  <h2>Puntos Clave</h2>
                  ${report.keyPoints ? `<ul>${report.keyPoints.map((k: string) => `<li>${k}</li>`).join('')}</ul>` : ''}
                </article>
              </main>
            </div>`;
            
          const schemaObj = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": report.title,
            "image": report.image,
            "datePublished": report.publishDate,
            "author": { 
              "@type": "Person", 
              "name": "José Carlos de la Peña",
              "jobTitle": "Analista de subastas BOE"
            }
          };
          
          modifiedHtml = modifiedHtml.replace('<title>Activos Off-Market | Inversión en Subastas Públicas</title>', `<title>${title}</title>`);
          modifiedHtml = modifiedHtml.replace('content="Oportunidades verificadas en subastas BOE y AEAT. Análisis de cargas y consultoría estratégica para inversores. Sin falsas promesas."', `content="${report.intro.substring(0, 150)}..."`);
          modifiedHtml = modifiedHtml.replace('<link rel="canonical" href="https://activosoffmarket.es/">', `<link rel="canonical" href="https://activosoffmarket.es/analisis/${slug}">`);
          modifiedHtml = modifiedHtml.replace('<div id="root"></div>', contentHtml);
          modifiedHtml = modifiedHtml.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script></head>`);
        } else if (renderedRoute.route.includes('/noticias-subastas/provincia/')) {
          // Find original province name from the uniqueProvinceNames mapping (ignoring case/accents roughly)
          // Since "slug" is already the URL slug, we can format it back
          const provinceName = String(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const title = `Subastas en ${provinceName}: oportunidades activas | BOE | Activos Off-Market`;
          const meta = `Subastas activas en ${provinceName}. Viviendas y activos judiciales con descuento.`;
          
          let contentHtml = `
            <div id="root">
              <main class="prerendered-content" style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
                <nav aria-label="Breadcrumb">
                  Home / Noticias / ${provinceName}
                </nav>
                <article>
                  <header>
                    <h1>Subastas en ${provinceName}: oportunidades activas | BOE</h1>
                  </header>
                  <section>
                    <p>Detectamos oportunidades en subastas de ${provinceName}. Información sobre deudas, tasaciones y estado posesorio de los activos procedentes de ejecuciones hipotecarias, Agencia Tributaria y Seguridad Social.</p>
                  </section>
                </article>
              </main>
            </div>`;
          
          const schemaObj = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": title,
            "description": meta,
            "author": [{ 
              "@type": "Person", 
              "name": "José Carlos de la Peña",
              "jobTitle": "Analista de subastas BOE"
            }],
            "publisher": {
              "@type": "Organization",
              "name": "Activos Off-Market",
              "logo": {
                "@type": "ImageObject",
                "url": "https://activosoffmarket.es/logo.png"
              }
            }
          };

          modifiedHtml = modifiedHtml.replace('<title>Activos Off-Market | Inversión en Subastas Públicas</title>', `<title>${title}</title>`);
          modifiedHtml = modifiedHtml.replace('content="Oportunidades verificadas en subastas BOE y AEAT. Análisis de cargas y consultoría estratégica para inversores. Sin falsas promesas."', `content="${meta}"`);
          modifiedHtml = modifiedHtml.replace('<link rel="canonical" href="https://activosoffmarket.es/">', `<link rel="canonical" href="https://activosoffmarket.es/noticias-subastas/provincia/${slug}">`);
          modifiedHtml = modifiedHtml.replace('<div id="root"></div>', contentHtml);
          modifiedHtml = modifiedHtml.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script></head>`);
        } else if (renderedRoute.route.includes('/subasta/')) {
          const auction = auctionsData[slug];
          if (auction) {
            const city = normalizeLocationName(auction.city || auction.province || 'España');
            let propertyType = (auction.propertyType || auction.assetCategory || 'inmueble').toLowerCase();
            propertyType = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
            
            const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
            const valorFormat = formatter.format(auction.valorSubasta || 0);

            const title = `${propertyType} en ${city} | Subasta BOE`;
            const meta = `Subasta judicial de ${propertyType.toLowerCase()} en ${city}. Valor de subasta: ${valorFormat}. Expediente: ${slug}.`;
            
            let contentHtml = `
              <div id="root">
                <main class="prerendered-content" style="padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: sans-serif;">
                  <nav aria-label="Breadcrumb">
                    Home / Subastas / ${city} / ${slug}
                  </nav>
                  <article>
                    <header>
                      <h1>${title}</h1>
                      <p><strong>Expediente judicial/administrativo:</strong> ${slug}</p>
                    </header>
                    <section>
                      <h2>Datos económicos</h2>
                      <ul>
                        <li>Valor de subasta: ${valorFormat}</li>
                        <li>Tasación oficial: ${formatter.format(auction.valorTasacion || auction.appraisalValue || 0)}</li>
                      </ul>
                    </section>
                    <section>
                      <h2>Ubicación del activo</h2>
                      <p>${auction.locationText || city}</p>
                    </section>
                  </article>
                </main>
              </div>`;
            
            const schemaObj = {
              "@context": "https://schema.org",
              "@type": "ItemPage",
              "name": title,
              "description": meta,
              "mainEntity": {
                "@type": "RealEstateListing",
                "name": title,
                "description": meta,
                "url": `https://activosoffmarket.es/subasta/${slug}`
              }
            };

            modifiedHtml = modifiedHtml.replace(/<title>.*<\/title>/i, `<title>${title}</title>`);
            modifiedHtml = modifiedHtml.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${meta}">`);
            modifiedHtml = modifiedHtml.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="https://activosoffmarket.es/subasta/${slug}">`);
            modifiedHtml = modifiedHtml.replace('<div id="root"></div>', contentHtml);
            modifiedHtml = modifiedHtml.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script></head>`);
          }
        } else if (renderedRoute.route === '/equipo') {
          const title = "Activos Off-Market | Análisis de subastas BOE";
          const meta = "Conoce al analista detrás de Activos Off-Market. Auditoría jurídica de subastas BOE, análisis de cargas y selección de oportunidades.";
          
          modifiedHtml = modifiedHtml.replace('<title>Activos Off-Market | Inversión en Subastas Públicas</title>', `<title>${title}</title>`);
          modifiedHtml = modifiedHtml.replace('content="Oportunidades verificadas en subastas BOE y AEAT. Análisis de cargas y consultoría estratégica para inversores. Sin falsas promesas."', `content="${meta}"`);
          modifiedHtml = modifiedHtml.replace('<link rel="canonical" href="https://activosoffmarket.es/">', `<link rel="canonical" href="https://activosoffmarket.es/equipo">`);
        }
        
        renderedRoute.html = modifiedHtml;
        
        return renderedRoute;
      },
      server: {
        host: '127.0.0.1',
        port: 3001
      },
      renderer: new Renderer({
        renderAfterTime: 100, // Faster, we don't care about JSDOM rendering since we postProcess
        maxConcurrentRoutes: 2
      })
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})