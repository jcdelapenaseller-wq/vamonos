import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ExtractedInfo {
  municipality?: string;
  province?: string;
  pickupLocation?: string;
  locationText?: string;
  observations?: string;
}

interface DocumentInfo {
  name: string;
  url: string;
}

/**
 * Descarga un PDF del BOE, lo sube a Cloudinary y extrae información relevante.
 */
export async function processBoeDocument(
  pdfUrl: string, 
  vehicleId: string, 
  docName: string, 
  cookies?: string
): Promise<{ doc: DocumentInfo; info: ExtractedInfo }> {
  try {
    const headers: any = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://subastas.boe.es/'
    };

    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const response = await fetch(pdfUrl, { headers });
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      throw new Error(`Error HTTP al descargar PDF: ${response.status} (${contentType})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Manejar por tipo de contenido
    if (contentType.includes('image/')) {
      console.log(`[DocProcessor] El documento ${docName} es una imagen (${contentType}). Subiendo como imagen...`);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'activos_offmarket/documentos_imagenes',
            public_id: `${vehicleId}_${docName.toLowerCase().replace(/\s+/g, '_')}`,
            resource_type: 'image',
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      return {
        doc: { name: docName, url: (uploadResult as any).secure_url },
        info: {}
      };
    }

    // Verificar si es realmente un PDF
    if (!buffer.toString('utf8', 0, 5).startsWith('%PDF-')) {
      const snippet = buffer.toString('utf8', 0, 100).replace(/\n/g, ' ');
      if (snippet.includes('too many access attempts')) {
        console.error(`[DocProcessor] RATE LIMIT alcanzado en el BOE para ${docName}`);
      } else {
        console.error(`[DocProcessor] El archivo ${docName} no es un PDF válido. Content-Type: ${contentType}. Snippet: ${snippet}`);
      }
      throw new Error('Archivo no válido (posiblemente rate limit o sesión expirada)');
    }

    // 2. Subir PDF a Cloudinary (como raw file)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'activos_offmarket/documentos',
          public_id: `${vehicleId}_${docName.toLowerCase().replace(/\s+/g, '_')}`,
          resource_type: 'raw',
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const cloudinaryUrl = (uploadResult as any).secure_url;

    // 3. Parsear PDF para extraer texto
    console.log(`[DocProcessor] Extrayendo texto de PDF: ${docName}...`);
    // Importación dinámica para manejar ESM/CJS
    const { PDFParse } = await import('pdf-parse');
    
    if (typeof PDFParse !== 'function') {
      throw new Error(`PDFParse no es una clase/función (tipo: ${typeof PDFParse})`);
    }

    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const text = pdfData.text;

    // 3. Extraer información usando regex simples (mejorable con LLM)
    const info: ExtractedInfo = {};
    
    // Ejemplo de extracción de Provincia/Municipio
    const provinceMatch = text.match(/Provincia:\s*([^\n\r]+)/i);
    if (provinceMatch) info.province = provinceMatch[1].trim();

    const municipalityMatch = text.match(/Localidad|Municipio:\s*([^\n\r]+)/i);
    if (municipalityMatch) info.municipality = municipalityMatch[1].trim();

    const pickupMatch = text.match(/Lugar de depósito|Dirección:\s*([^\n\r]+)/i);
    if (pickupMatch) info.pickupLocation = pickupMatch[1].trim();

    info.locationText = text.substring(0, 500).replace(/\n/g, ' '); // Primeros 500 caracteres como contexto

    return {
      doc: { name: docName, url: cloudinaryUrl },
      info
    };
  } catch (error) {
    console.error(`[DocProcessor] Error procesando documento ${docName}:`, error);
    throw error;
  }
}
