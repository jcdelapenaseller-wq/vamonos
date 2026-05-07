const fs = require('fs');

const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla"];

cities.forEach(city => {
    let filePath = `src/components/Auction${city}Guide.tsx`;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove all existing city links to avoid duplication.
    content = content.replace(/<Link to=\{ROUTES\.(MADRID|BARCELONA|VALENCIA|SEVILLA)\}.*?<\/Link>/gs, '');

    // The other 3 cities
    const otherCities = cities.filter(c => c !== city);
    
    // Create the new links block
    let newLinks = ``;
    otherCities.forEach(other => {
        newLinks += `<Link to={ROUTES.${other.toUpperCase()}} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas en ${other}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>\n                    `;
    });

    // We will inject the newLinks into the nav right before the PROFITABILITY_CALC_GUIDE
    content = content.replace(
        /<Link to=\{ROUTES\.PROFITABILITY_CALC_GUIDE\}/g,
        newLinks + `<Link to={ROUTES.PROFITABILITY_CALC_GUIDE}`
    );

    fs.writeFileSync(filePath, content);
    console.log(`Fixed links in ${city}`);
});
