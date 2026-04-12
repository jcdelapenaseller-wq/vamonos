import puppeteer from 'puppeteer';
import path from 'path';

async function boeLogin() {
  const userDataDir = path.join(process.cwd(), 'puppeteer-session');
  
  console.log('--- INICIANDO NAVEGADOR PARA LOGIN MANUAL ---');
  console.log(`Usando directorio de sesión: ${userDataDir}`);
  console.log('IMPORTANTE: Se abrirá una ventana del navegador. Por favor, inicia sesión en el BOE.');
  console.log('Una vez hayas iniciado sesión y veas tu nombre de usuario, puedes cerrar el navegador o presionar Ctrl+C en esta terminal.');

  const browser = await puppeteer.launch({
    headless: false, // Abrir navegador visible
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,800'
    ],
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://subastas.boe.es/index.php', { waitUntil: 'networkidle2' });

    console.log('Esperando a que el usuario inicie sesión...');
    
    // Esperar a que aparezca el texto "Cerrar sesión" que indica que el login fue exitoso
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes('Cerrar sesión'),
        { timeout: 300000 } // 5 minutos para loguearse
      );
      console.log('✅ ¡Login detectado con éxito!');
    } catch (e) {
      console.log('⚠️ Tiempo de espera agotado o navegador cerrado manualmente.');
    }

    console.log('Sesión guardada en el directorio puppeteer-session.');
    
  } catch (err) {
    console.error('Error durante el proceso de login:', err);
  } finally {
    // No cerramos el navegador inmediatamente para que el usuario vea el éxito
    console.log('Cerrando navegador en 5 segundos...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

boeLogin();
