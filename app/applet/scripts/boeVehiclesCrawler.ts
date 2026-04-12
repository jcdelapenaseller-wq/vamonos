import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadVehicleImages } from './imageUploader';
import { processBoeDocument } from './documentProcessor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUCTIONS_FILE = path.join(process.cwd(), 'src/data/auctions.ts');
const USER_DATA_DIR = path.join(process.cwd(), 'puppeteer-session');

async function checkSession(page: any) {
  const isAuth = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes('Cerrar sesión') || !bodyText.includes('Iniciar sesión');
  });
  
  if (isAuth) {
    console.log('✅ Sesión de usuario detectada como ACTIVA.');
  } else {
    console.log('⚠️ Sesión de usuario NO detectada o expirada.');
  }
  return isAuth;
}

async function runCrawler() {
  console.log('Iniciando crawler de vehículos con SESIÓN PERSISTENTE...');
  console.log(`Usando userDataDir: ${USER_DATA_DIR}`);

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: USER_DATA_DIR,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Verificando sesión persistente...');
    await page.goto('https://subastas.boe.es/index.php', { waitUntil: 'domcontentloaded' });
    const isAuth = await checkSession(page);

    if (!isAuth) {
      console.log('❌ NO hay sesión activa. Por favor, ejecuta primero: npx tsx scripts/boeLogin.ts');
      await browser.close();
      return;
    }

    console.log('Navegando a la búsqueda avanzada...');
    await page.goto('https://subastas.boe.es/subastas_ava.php', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Seleccionar Vehículos (dato[3] = "V") y Celebrándose (dato[2] = "EJ")
    await page.evaluate(() => {
      (document.querySelector('input[name="dato[3]"][value="V"]') as HTMLInputElement).checked = true;
      (document.querySelector('input[name="dato[2]"][value="EJ"]') as HTMLInputElement).checked = true;
      (document.querySelector('input[type="submit"][value="Buscar"]') as HTMLInputElement).click();
    });

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.resultado-busqueda li'));
      return items.map(li => {
        const anchor = li.querySelector('a[href*="subastas_det.php"]') || li.querySelector('a[href*="idSub="]');
        const href = anchor ? anchor.getAttribute('href') : null;
        const urlDetalle = href ? (href.startsWith('http') ? href : 'https://subastas.boe.es/' + href.replace(/^\.\//, '')) : null;
        
        let titulo = '';
        const h3 = li.querySelector('h3, h4, strong');
        titulo = h3 ? (h3 as HTMLElement).innerText.trim() : ((li.querySelector('a') as HTMLElement | null)?.innerText.trim() || 'Subasta');
        titulo = titulo.replace(/^Más\.\.\.\s*/, '');
        
        return { titulo, urlDetalle };
      }).filter(r => r.urlDetalle);
    });

    console.log(`Encontrados ${results.length} vehículos para procesar.`);

    const newVehicles: any[] = [];

    for (const item of results) {
      if (!item.urlDetalle) continue;
      
      console.log(`\nProcesando: ${item.titulo}`);
      console.log(`URL Detalle: ${item.urlDetalle}`);
      const detailPage = await browser.newPage();
      
      try {
        // VER 1 (General)
        const generalUrl = item.urlDetalle.includes('&ver=') ? item.urlDetalle.replace(/&ver=\d+/, '&ver=1') : item.urlDetalle + '&ver=1';
        await detailPage.goto(generalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const generalData = await detailPage.evaluate(() => {
          const data: any = {};
          const elements = Array.from(document.querySelectorAll('th, td, dt, dd'));
          for (let i = 0; i < elements.length; i++) {
            const text = elements[i].textContent?.trim() || '';
            if (text.includes('Identificador') && elements[i+1]) data.id = elements[i+1].textContent?.trim();
            if (text.includes('Valor subasta') && elements[i+1]) data.valor = elements[i+1].textContent?.trim();
            if (text.includes('Tasación') && elements[i+1]) data.tasacion = elements[i+1].textContent?.trim();
            if (text.includes('Fecha de conclusión') && elements[i+1]) data.fechaConclusion = elements[i+1].textContent?.trim();
          }
          return data;
        });

        // VER 3 (Bienes)
        const bienesUrl = generalUrl.replace('&ver=1', '&ver=3');
        await detailPage.goto(bienesUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const bienesData = await detailPage.evaluate(() => {
          const data: any = {};
          const elements = Array.from(document.querySelectorAll('th, td, dt, dd'));
          for (let i = 0; i < elements.length; i++) {
            const text = elements[i].textContent?.trim() || '';
            if (text === 'Matrícula' && elements[i+1]) data.matricula = elements[i+1].textContent?.trim();
            if (text === 'Marca' && elements[i+1]) data.marca = elements[i+1].textContent?.trim();
            if (text === 'Modelo' && elements[i+1]) data.modelo = elements[i+1].textContent?.trim();
            if (text === 'Número de bastidor' && elements[i+1]) data.bastidor = elements[i+1].textContent?.trim();
            if (text === 'Fecha de matriculación' && elements[i+1]) data.fechaMatriculacion = elements[i+1].textContent?.trim();
            if (text === 'Información adicional' && elements[i+1]) data.infoAdicional = elements[i+1].textContent?.trim();
          }
          
          // Images: Extract high-res links from the wrapping <a> tag if available
          data.images = Array.from(document.querySelectorAll('img'))
            .filter(img => !img.src.includes('logo') && !img.src.includes('ayuda') && !img.src.includes('portal_subastas') && !img.src.includes('favicon'))
            .map(img => {
              const parentAnchor = img.closest('a');
              const highResUrl = parentAnchor?.href;
              
              // Log original vs final for debugging (will be visible in console)
              if (highResUrl && highResUrl.includes('verDocumento.php')) {
                console.log(`[ImageFix] Original (Thumbnail): ${img.src}`);
                console.log(`[ImageFix] Final (High-Res): ${highResUrl}`);
                return highResUrl;
              }
              
              return img.src;
            });

          // Documents (PDFs and others)
          data.docs = Array.from(document.querySelectorAll('a'))
            .filter(a => {
              const href = (a as HTMLAnchorElement).href;
              const text = a.textContent?.trim() || '';
              return href.includes('.pdf') || href.includes('idDoc=') || text.toUpperCase().includes('INFORMACIÓN ADICIONAL');
            })
            .map(a => {
              const name = a.textContent?.trim() || 'Documento';
              const url = (a as HTMLAnchorElement).href;
              console.log(`    [Debug] Documento detectado: ${name} -> ${url}`);
              return { name, url };
            });
          
          if (data.docs.length > 0) {
            console.log(`    [Debug] Documentos encontrados: ${data.docs.map((d: any) => d.name).join(', ')}`);
          }
            
          return data;
        });

        const parseNumber = (str: string) => {
          if (!str || str === 'N/A' || str === 'null') return undefined;
          const cleaned = str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? undefined : num;
        };

        const yearMatch = bienesData.fechaMatriculacion?.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
        
        const vehicleId = generalData.id || `V-${Date.now()}`;
        
        console.log(`  -> Subiendo imágenes a Cloudinary (${(bienesData.images || []).length} encontradas)...`);
        // Las cookies para fetch manual se obtienen directamente de la página actual
        const cookies = await detailPage.cookies();
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        const finalImages = await uploadVehicleImages(bienesData.images || [], vehicleId, cookieString);
        console.log(`  -> Imágenes subidas: ${finalImages.length}`);
        if (finalImages.length > 0) {
          console.log(`  -> URL CLOUDINARY: ${finalImages[0]}`);
        }

        // Procesar Documentos
        const documents: any[] = [];
        let detectedProvince = '';
        let detectedMunicipality = '';
        let detectedLocationText = '';

        // Fix: Extraer ubicación de infoAdicional si existe
        if (bienesData.infoAdicional) {
          const match = bienesData.infoAdicional.match(/\(([^)]+)\)/);
          if (match) {
            const prov = match[1].trim();
            detectedProvince = prov.charAt(0).toUpperCase() + prov.slice(1).toLowerCase();
            console.log(`    [LocationFix] Provincia detectada en infoAdicional: ${detectedProvince}`);
          }
        }

        if (bienesData.docs && bienesData.docs.length > 0) {
          // Filtrar duplicados y priorizar INFORMACIÓN ADICIONAL
          let targetDocs = bienesData.docs.filter((doc: any, index: number, self: any[]) => 
            index === self.findIndex((t) => t.url === doc.url)
          );
          
          const infoAdicionalDoc = targetDocs.find((d: any) => d.name.toUpperCase().includes('INFORMACIÓN ADICIONAL'));
          const datosVehiculoDoc = targetDocs.find((d: any) => d.name.toUpperCase().includes('DATOS VEHÍCULO'));
          
          if (infoAdicionalDoc) {
            targetDocs = [infoAdicionalDoc];
          } else if (datosVehiculoDoc) {
            targetDocs = [datosVehiculoDoc];
          } else {
            // Si no hay ninguno de los dos, procesamos solo el primero que sea PDF
            const firstPdf = targetDocs.find((d: any) => d.url.toLowerCase().includes('.pdf'));
            targetDocs = firstPdf ? [firstPdf] : [];
          }

          console.log(`  -> Procesando ${targetDocs.length} documentos clave...`);
          for (const doc of targetDocs) {
            try {
              // Delay para evitar rate limit (BOE es sensible)
              await new Promise(resolve => setTimeout(resolve, 2000));

              const cookies = await detailPage.cookies();
              const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');

              const result = await processBoeDocument(doc.url, vehicleId, doc.name, cookieString);
              documents.push(result.doc);
              
              // SIEMPRE sobrescribir si hay dato válido detectado
              if (result.info.province) {
                detectedProvince = result.info.province;
                console.log(`    [DocFix] Provincia detectada en PDF: ${detectedProvince}`);
              }
              if (result.info.municipality) detectedMunicipality = result.info.municipality;
              if (result.info.locationText) detectedLocationText = result.info.locationText;
            } catch (err) {
              console.log(`     ! Error con documento ${doc.name}`);
            }
          }
        }

        // Aplicar lógica crítica de asignación
        const finalProvince = detectedProvince || 'No Consta';
        const finalCity = detectedMunicipality || 'No Consta';
        console.log(`  -> Provincia final: ${finalProvince}`);

        const vehicle = {
          id: vehicleId,
          boeId: vehicleId,
          title: item.titulo,
          type: 'Vehículo',
          status: 'active',
          value: parseNumber(generalData.valor) || 0,
          appraisal: parseNumber(generalData.tasacion) || 0,
          province: finalProvince,
          city: finalCity,
          publishedAt: new Date().toISOString(),
          auctionDate: generalData.fechaConclusion ? generalData.fechaConclusion.split(' ')[0] : undefined,
          boeUrl: generalUrl,
          assetCategory: 'vehiculo',
          brand: bienesData.marca,
          model: bienesData.modelo,
          licensePlate: bienesData.matricula,
          year: year,
          vin: bienesData.bastidor,
          images: finalImages,
          // Nuevos campos
          municipality: detectedMunicipality,
          pickupLocation: detectedMunicipality, // Usamos municipio como base si no hay más
          locationText: detectedLocationText,
          documents: documents
        };

        newVehicles.push(vehicle);
        console.log(`  -> Extraído: ${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`);

      } catch (err) {
        console.error(`Error extrayendo detalles de ${item.titulo}:`, err);
      } finally {
        await detailPage.close();
      }
    }

    console.log(`\nSe extrajeron ${newVehicles.length} vehículos en modo shadow.`);
    
    // Save to dataset
    if (newVehicles.length > 0) {
      let content = fs.readFileSync(AUCTIONS_FILE, 'utf-8');
      
      // Find the object
      const objectStart = content.indexOf('export const AUCTIONS: Record<string, AuctionData> = {');
      if (objectStart !== -1) {
        for (const v of newVehicles) {
          const slug = `subasta-${v.id.toLowerCase()}`;
          const newEntry = `  '${slug}': {
    boeId: "${v.boeId}",
    status: "${v.status}",
    valorSubasta: ${v.value},
    valorTasacion: ${v.appraisal},
    province: "${v.province}",
    city: "${v.city}",
    publishedAt: "${v.publishedAt}",
    auctionDate: ${v.auctionDate ? `"${v.auctionDate}"` : 'undefined'},
    boeUrl: "${v.boeUrl}",
    assetCategory: "vehiculo",
    brand: ${v.brand ? `"${v.brand}"` : 'undefined'},
    model: ${v.model ? `"${v.model}"` : 'undefined'},
    licensePlate: ${v.licensePlate ? `"${v.licensePlate}"` : 'undefined'},
    year: ${v.year ? v.year : 'undefined'},
    vin: ${v.vin ? `"${v.vin}"` : 'undefined'},
    images: ${JSON.stringify(v.images)},
    municipality: ${v.municipality ? `"${v.municipality}"` : 'undefined'},
    pickupLocation: ${v.pickupLocation ? `"${v.pickupLocation}"` : 'undefined'},
    locationText: ${v.locationText ? `"${v.locationText}"` : 'undefined'},
    documents: ${JSON.stringify(v.documents)}
  },`;

          // Check if the slug already exists
          const regex = new RegExp(`'${slug}':\\s*{[\\s\\S]*?^  },`, 'm');
          if (regex.test(content)) {
            // Overwrite existing entry
            content = content.replace(regex, newEntry.trim() + ',');
          } else {
            // Insert at the beginning
            const insertPos = content.indexOf('{', objectStart) + 1;
            content = content.slice(0, insertPos) + '\n' + newEntry + content.slice(insertPos);
          }
        }
        
        fs.writeFileSync(AUCTIONS_FILE, content);
        console.log('Dataset actualizado con los nuevos vehículos en modo shadow.');
      }
    }

  } catch (e) {
    console.error('Error en el crawler:', e);
  } finally {
    await browser.close();
  }
}

runCrawler();
