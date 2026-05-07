const fs = require('fs');

const madridContent = fs.readFileSync('src/components/AuctionMadridGuide.tsx', 'utf8');

function generateGuide(city, imageHero, itpAmount, itpValue, region) {
    let content = madridContent;

    // Component Name
    content = content.replace(/AuctionMadridGuide/g, `Auction${city}Guide`);
    
    // Normalize city
    content = content.replace(/normalizeCity\(a\) === "Madrid"/g, `normalizeCity(a) === "${city}"`);
    
    // Hero Image
    content = content.replace(/const IMG_HERO = ".*?"/g, `const IMG_HERO = "${imageHero}"`);
    
    // Replace text "Madrid" with City
    content = content.replace(/Madrid/g, city);
    content = content.replace(/madrid/g, city.toLowerCase());
    
    // Adjust region if necessary
    if (city === "Barcelona") {
        content = content.replace(/la Comunidad de Barcelona/g, 'la provincia de Barcelona');
        content = content.replace(/en Barcelona es/g, 'en Cataluña se sitúa generalmente en');
    } else if (city === "Valencia") {
        content = content.replace(/la Comunidad de Valencia/g, 'la Comunidad Valenciana');
        content = content.replace(/en Valencia es/g, 'en la Comunidad Valenciana es');
    } else if (city === "Sevilla") {
        content = content.replace(/la Comunidad de Sevilla/g, 'Andalucía');
        content = content.replace(/en Sevilla es/g, 'en Andalucía es');
    }

    // Adjust ITP percentages
    content = content.replace(/6% con carácter general para segunda mano/g, `${itpValue}% con carácter general para segunda mano`);
    content = content.replace(/ITP Barcelona \(6%\)/g, `ITP Cataluña (10%)`);
    content = content.replace(/ITP Valencia \(6%\)/g, `ITP Comunidad Valenciana (10%)`);
    content = content.replace(/ITP Sevilla \(6%\)/g, `ITP Andalucía (7%)`);
    
    // Adjust example calculation
    const originalCalculationText = `<span>ITP Barcelona (10%) + Honorarios:</span> <span>9.000€</span>`; // Since we already replaced Madrid with City
    content = content.replace(/ITP .*? \(\d+%\) \+ Honorarios:<\/span> <span>9\.000€/, `ITP ${region} (${itpValue}%) + Honorarios:</span> <span>${itpAmount}€`);
    
    // Recalculate profit using base strings.
    // Cost calculation
    const originalTotalCost = `189.000€`;
    const newTotalCost = 150000 + 30000 + parseInt(itpAmount.replace('.', ''));
    const formattedTotalCost = newTotalCost.toLocaleString('es-ES') + "€";
    
    const profit = 240000 - newTotalCost;
    const formattedProfit = profit.toLocaleString('es-ES') + "€";

    content = content.replace(/<span>189\.000€<\/span>/, `<span>${formattedTotalCost}</span>`);
    content = content.replace(/<span>51\.000€<\/span>/, `<span>${formattedProfit}</span>`);

    // Fix related guides links back to Madrid instead of self
    const cityLinkRegex = new RegExp(`<Link to=\\{ROUTES\\.${city.toUpperCase()}\\}.*?Subastas en ${city}.*?<\\/Link>`, 'g');
    content = content.replace(
        cityLinkRegex,
        `<Link to={ROUTES.MADRID} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas en Madrid</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>`
    );
    
    fs.writeFileSync(`src/components/Auction${city}Guide.tsx`, content);
    console.log(`Generated Auction${city}Guide.tsx`);
}

generateGuide(
    "Barcelona", 
    "https://images.unsplash.com/photo-1583422409516-2895a77ef244?auto=format&fit=crop&q=80&w=1200&h=630", 
    "15.000", 
    "10",
    "Cataluña"
);

generateGuide(
    "Valencia", 
    "https://images.unsplash.com/photo-1589883661135-263faeb1cae3?auto=format&fit=crop&q=80&w=1200&h=630", 
    "15.000", 
    "10",
    "C. Valenciana"
);

generateGuide(
    "Sevilla", 
    "https://images.unsplash.com/photo-1558642084-fd07fae5282e?auto=format&fit=crop&q=80&w=1200&h=630", 
    "10.500", 
    "7",
    "Andalucía"
);
