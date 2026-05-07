import fs from 'fs';
fetch('https://subastas.boe.es/detalleSubasta.php?idSub=SUB-RC-2026-2800500103325&ver=5')
  .then(r => r.text())
  .then(t => {
    fs.writeFileSync('testSub.html', t);
    if (t.includes('Puja m&#xE1;xima de la subasta') || t.includes('Puja máxima de la subasta')) {
      console.log('SI aparece el texto (en ver=5)');
    } else {
      console.log('NO aparece el texto (en ver=5)');
    }
  });

fetch('https://subastas.boe.es/detalleSubasta.php?idSub=SUB-RC-2026-2800500103325')
  .then(r => r.text())
  .then(t => {
    if (t.includes('Puja m&#xE1;xima de la subasta') || t.includes('Puja máxima de la subasta')) {
      console.log('SI aparece el texto (sin ver)');
    } else {
      console.log('NO aparece el texto (sin ver)');
    }
  });
