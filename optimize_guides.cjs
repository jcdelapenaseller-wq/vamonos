const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'src/components');
const files = fs.readdirSync(srcDir)
  .filter(f => (f.includes('Guide.tsx') || f === 'SubastasBOEPage.tsx') 
          && !f.includes('Index') && !f.includes('Hub'));

const dict = {
    "Auction70RuleGuide.tsx": ["La norma clave para evitar que el deudor mejore postura.", "Se aprueba automáticamente si tu puja llega al 70%.", "Si no, el juzgado decide si el precio es suficiente."],
    "AuctionAnalysisGuide.tsx": ["Analizar las cargas registrales es obligatorio.", "La tasación BOE rara vez es el valor de mercado.", "Calcula siempre tu rentabilidad real antes de pujar."],
    "AuctionAssignmentGuide.tsx": ["Permite transferir tu adjudicación a un tercero.", "Es legal pero requiere aprobación del letrado.", "Útil para evitar doble tributación."],
    "AuctionBarcelonaGuide.tsx": ["Mercado muy competitivo en Cataluña.", "Altos impuestos (ITP del 10%).", "Busca oportunidades en las afueras."],
    "AuctionChargesGuide.tsx": ["Las deudas anteriores o preferentes NO se borran.", "Pide siempre Certificación de Cargas.", "Ignorar este paso es el mayor error del inversor novato."],
    "AuctionComparisonGuide.tsx": ["Las subastas judiciales cancelan casi todas las cargas posteriores.", "Hacienda es más económica pero no da la posesión.", "Seguridad Social funciona distinto."],
    "AuctionDepositGuide.tsx": ["El 5% de depósito es obligatorio.", "Si no ganas, se te devuelve íntegramente.", "Si ganas y no pagas el resto, lo pierdes."],
    "AuctionEmptyGuide.tsx": ["Nadie pujó en la subasta.", "El acreedor puede adjudicársela por un porcentaje menor.", "Gran pérdida de oportunidad para el público."],
    "AuctionErrorsGuide.tsx": ["No estudiar las cargas.", "Pujar por un bien sin visitarlo por fuera.", "Calcular mal los impuestos de la operación."],
    "AuctionHowMuchToPayGuide.tsx": ["Resta todos los costes al valor real.", "Nunca te guíes solo por el valor BOE.", "Aplica tu propio margen de seguridad."],
    "AuctionMadridGuide.tsx": ["Alta demanda en bienes prime.", "ITP en torno al 6%, ventaja competitiva.", "Céntrate en analizar rápido y pujar fuerte."],
    "AuctionMaxBidGuide.tsx": ["Fija tu límite de puja antes y no te dejes llevar.", "Incluye impuestos, reformas y derramas.", "Si la puja sube más, abandona la subasta."],
    "AuctionProfitabilityCalculatorGuide.tsx": ["Entiende la diferencia entre rentabilidad bruta y neta.", "Incluye los plazos del juzgado en tu ROI temporal.", "Usa Excel o calculadoras automáticas."],
    "AuctionProfitabilityGuide.tsx": ["No caigas en la trampa del precio barato.", "Una reforma cara arruina una buena subasta.", "Cuidado con los inmuebles okupados y su tiempo de desalojo."],
    "AuctionSevillaGuide.tsx": ["Mercado interesante en Andalucía.", "ITP alto (7% al 8%).", "Revisa si hay okupas, es zona compleja."],
    "AuctionValenciaGuide.tsx": ["Oportunidades en la costa mediterránea.", "El ITP es del 10%.", "Mercado con buenos retornos de alquiler."],
    "AuctionVisitGuide.tsx": ["El BOE no enseña los pisos por dentro.", "Hay tácticas para averiguar el estado y ocupación.", "Nunca pujes sin haber ido a la puerta del inmueble."],
    "AuctionWorthItGuide.tsx": ["Sí, si compras con descuento importante.", "Requiere formación financiera y jurídica.", "Es arriesgado para el dinero de los ahorros familiares."],
    "CalculateBidGuide.tsx": ["Tienes que despejar la fórmula de coste total.", "Sumas la carga y el ITP.", "Tu puja es = Venta - Reforma - Beneficio - Impuestos."],
    "OccupiedHousingGuide.tsx": ["El juzgado debe expulsarlos mediante 'lanzamiento'.", "Tarda entre 6 y 18 meses adicionales.", "Considera este plazo un coste oculto en tu ROI."],
    "SubastasBOEPage.tsx": null 
};

let count = 0;
for (const file of files) {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Imports
    if (!content.includes('GuideTOC')) {
        content = content.replace(/import\s+.*?;/, `$&
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';
import { CheckCircle } from 'lucide-react';`);
    }

    if (!content.includes('Resumen Rápido (TL;DR)') && dict[file]) {
        const bullets = dict[file];
        const summaryHtml = `
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    ${bullets.map(b => `<li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">${b}</p>
                    </li>`).join('')}
                </ul>
            </div>
            
            <GuideTOC />
            
        `;
        
        const firstH2Match = content.match(/<h2[^>]*>/);
        if (firstH2Match) {
            content = content.substring(0, firstH2Match.index) + summaryHtml + "\n" + content.substring(firstH2Match.index);
        }
    } else if (file === 'SubastasBOEPage.tsx') {
        const tldRMatch = content.match(/<h3[^>]*>[\s\S]*?Resumen Rápido \(TL;DR\)[\s\S]*?<\/ul>\s*<\/div>/);
        if (tldRMatch && !content.includes('<GuideTOC />')) {
            content = content.replace(tldRMatch[0], tldRMatch[0] + "\n\n<GuideTOC />");
        }
    } else {
        if (!content.includes('<GuideTOC />')) {
            const firstH2Match = content.match(/<h2[^>]*>/);
            if (firstH2Match) {
                content = content.substring(0, firstH2Match.index) + "<GuideTOC />\n\n" + "\n" + content.substring(firstH2Match.index);
            }
        }
    }

    if (!content.includes('<GuideMobileCTA />')) {
        let h2Matches = [...content.matchAll(/<h2[^>]*>/g)];
        if (h2Matches.length >= 2) {
            let targetIdx = h2Matches.length > 2 ? h2Matches[2].index : h2Matches[1].index;
            content = content.substring(0, targetIdx) + "\n<GuideMobileCTA />\n" + content.substring(targetIdx);
        }
    }

    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/g;
    content = content.replace(ulRegex, (match, innerProps) => {
        if (innerProps.includes('<li><strong>') && !match.includes('CheckCircle') && innerProps.split('<li>').length > 2) {
            
            const liRegex = /<li[^>]*>\s*<strong[^>]*>(.*?):?<\/strong>\s*(.*?)<\/li>/gi;
            let cardsHtml = '';
            let hasMatch = false;
            
            let htmlInner = innerProps;
            let m;
            while ((m = liRegex.exec(innerProps)) !== null) {
                hasMatch = true;
                const title = m[1].replace(/<[^>]+>/g, '').trim();
                const desc = m[2].replace(/<[^>]+>/g, '').trim();
                
                cardsHtml += `
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> ${title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">${desc}</p>
                </div>`;
            }
            
            if (hasMatch) {
                return `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">\n${cardsHtml}\n</div>`;
            }
        }
        return match;
    });

    fs.writeFileSync(filePath, content);
    count++;
}

console.log("Optimized", count, "guides");
