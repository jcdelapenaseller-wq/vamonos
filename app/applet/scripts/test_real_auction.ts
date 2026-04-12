import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COOKIES_FILE = fs.existsSync(path.join(__dirname, '../boe-cookies.json')) 
  ? path.join(__dirname, '../boe-cookies.json')
  : path.join(__dirname, '../boe-cookies-test.json');

async function run() {
  const sessionPath = path.resolve(process.cwd(), "puppeteer-session");
  console.log("Session path:", sessionPath);

  const subId = 'SUB-AT-2026-25R4186002113';
  const url = `https://subastas.boe.es/reg/detalleSubasta.php?idSub=${subId}&ver=3`;
  
  console.log(`Navegando a: ${url}`);
  const browser = await puppeteer.launch({ 
    headless: false, 
    userDataDir: sessionPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let cookieString = '';
  if (fs.existsSync(COOKIES_FILE)) {
    const cookiesRaw = fs.readFileSync(COOKIES_FILE, 'utf8');
    const cookies = JSON.parse(cookiesRaw);
    await page.setCookie(...cookies);
    cookieString = cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  }

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const isAuth = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes('Cerrar sesión') || !bodyText.includes('Iniciar sesión');
  });
  console.log(`¿Sesión activa?: ${isAuth}`);

  const docs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .filter(a => {
        const href = a.href;
        const text = a.textContent?.trim().toUpperCase() || '';
        return href.includes('.pdf') || href.includes('idDoc=') || text.includes('INFORMACIÓN ADICIONAL');
      })
      .map(a => ({ name: a.textContent?.trim() || 'Doc', url: a.href }));
  });

  console.log(`Documentos encontrados:`, docs);

  for (const doc of docs) {
    console.log(`\nProcesando: ${doc.name} -> ${doc.url}`);
    
    const response = await fetch(doc.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookieString
      }
    });
    
    const buffer = await response.buffer();
    const hex = buffer.toString('hex', 0, 4);
    
    let type = 'Desconocido';
    if (hex === '25504446') type = 'PDF';
    else if (hex.startsWith('ffd8')) type = 'Imagen (JPEG)';
    else if (hex === '89504e47') type = 'Imagen (PNG)';
    else if (hex === '3c21444f' || hex === '3c68746d') type = 'HTML (Posiblemente bloqueado por login)';
    else type = `Desconocido (Magic bytes: ${hex})`;
    
    console.log(`Tipo de documento detectado: ${type}`);
    
    if (type === 'PDF') {
      try {
        const pdfParseModule = await import('pdf-parse');
        const pdfParseFn = pdfParseModule.default || pdfParseModule;
        const pdfData = await (typeof pdfParseFn === 'function' ? pdfParseFn(buffer) : null);
        
        if (pdfData && pdfData.text) {
          console.log(`\n--- PRIMERAS LÍNEAS DEL PDF ---`);
          console.log(pdfData.text.substring(0, 500).trim());
          console.log(`-------------------------------\n`);
        }
        
        const result = await processBoeDocument(doc.url, subId, doc.name, cookieString);
        console.log(`\nResultado final guardado:`, result.info);
      } catch (e) {
        console.error('Error parseando PDF:', e);
      }
    } else if (type.includes('Imagen')) {
      console.log('Confirmación: no se puede extraer texto sin OCR');
    }
  }
  
  await browser.close();
}
run();
