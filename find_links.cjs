const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_asset.html', 'utf8');
const $ = cheerio.load(html);

$('a').each((i, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('información')) {
        console.log('Link:', $(el).attr('href'), 'Text:', text);
    }
});
