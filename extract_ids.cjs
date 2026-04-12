const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('output.html', 'utf8');
const $ = cheerio.load(html);

const auctionIds = [];
$('a.resultado-busqueda-link-defecto').each((i, el) => {
    const href = $(el).attr('href');
    const match = href.match(/idSub=([^&]+)/);
    if (match) {
        auctionIds.push(match[1]);
    }
});

console.log(JSON.stringify(auctionIds));
