const axios = require('axios');
const cheerio = require('cheerio');

const subId = 'SUB-AT-2026-25R4186002113';
const url = `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=3`;

async function diagnose() {
    console.log(`--- DIAGNÓSTICO PARA: ${subId} ---\n`);
    
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        // 1. infoAdicional
        let infoAdicional = null;
        $('th').each((i, el) => {
            if ($(el).text().trim().toLowerCase().includes('información adicional')) {
                infoAdicional = $(el).next('td').text().trim();
            }
        });
        console.log('1. infoAdicional extraído del HTML:');
        console.log(JSON.stringify(infoAdicional));
        console.log('\n');

        // 2. Regex
        console.log('2. Análisis de Regex:');
        let province = null;
        const regex1 = /\(([A-ZÁÉÍÓÚÑ\s]+)\)/;
        const regex2 = /\b([A-ZÁÉÍÓÚÑ]{3,})\.?$/;
        
        console.log('Regex 1:', regex1.toString());
        console.log('Regex 2:', regex2.toString());
        
        if (infoAdicional) {
            const parenMatch = infoAdicional.match(regex1);
            if (parenMatch) {
                console.log('Resultado Regex 1:', parenMatch[1]);
                province = parenMatch[1].trim();
            } else {
                console.log('Resultado Regex 1: No match');
            }
            
            if (!province) {
                const match = infoAdicional.match(regex2);
                if (match) {
                    console.log('Resultado Regex 2:', match[1]);
                    province = match[1];
                } else {
                    console.log('Resultado Regex 2: No match');
                }
            }
        } else {
            console.log('infoAdicional es nulo.');
        }
        console.log('\n');

        // 3. Resultado final
        console.log('3. Resultado final:');
        console.log('province:', province);
        console.log('municipality: null (no implementado en diagnóstico)');
        console.log('\n');

        // 4 & 5 & 6. Documentos
        console.log('4, 5, 6. Análisis de documentos:');
        let docLink = null;
        $('a').each((i, el) => {
            const text = $(el).text().trim();
            if (text.toLowerCase().includes('información adicional')) {
                docLink = $(el).attr('href');
            }
        });
        
        if (docLink) {
            console.log('Documento "INFORMACIÓN ADICIONAL" encontrado.');
            console.log('URL exacta:', docLink);
            // Determinar tipo (simple check)
            const type = docLink.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Imagen/Otro';
            console.log('Tipo detectado:', type);
            console.log('Contenido detectado: [SIN OCR - IGNORADO]');
        } else {
            console.log('Documento "INFORMACIÓN ADICIONAL" NO encontrado.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

diagnose();
