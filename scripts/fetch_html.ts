import fs from 'fs'; fetch('https://subastas.boe.es/detalleSubasta.php?idSub=SUB-JA-2025-251932&ver=1').then(r => r.text()).then(t => fs.writeFileSync('testBoeHtml.html', t));
