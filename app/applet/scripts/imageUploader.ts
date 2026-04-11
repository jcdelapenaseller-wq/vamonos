import { v2 as cloudinary } from 'cloudinary';

// La configuración tomará automáticamente las variables de entorno:
// CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// O configurando manualmente si se prefieren separadas:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Descarga imágenes del BOE, las sube a Cloudinary redimensionadas a 800px y en formato WebP.
 * 
 * @param boeUrls Array de URLs originales del BOE
 * @param vehicleId ID único del vehículo (para nombrar los archivos)
 * @param cookies Opcional: Cookies de sesión para descargar imágenes restringidas
 * @returns Array con las URLs finales de Cloudinary
 */
export async function uploadVehicleImages(boeUrls: string[], vehicleId: string, cookies?: string): Promise<string[]> {
  const finalUrls: string[] = [];
  
  // Requisito: máximo 5 imágenes
  const urlsToProcess = boeUrls.slice(0, 5);

  for (let i = 0; i < urlsToProcess.length; i++) {
    try {
      const boeUrl = urlsToProcess[i];
      
      // 1. Descargar la imagen del BOE
      // Usamos headers para simular un navegador y evitar bloqueos por hotlinking
      const headers: any = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://subastas.boe.es/'
      };

      if (cookies) {
        headers['Cookie'] = cookies;
      }

      const response = await fetch(boeUrl, { headers });

      if (!response.ok) {
        throw new Error(`Error HTTP al descargar del BOE: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('El recurso devuelto es HTML, probablemente requiere login o la sesión ha expirado.');
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        throw new Error('El archivo descargado está vacío.');
      }

      // 2. Subir a Cloudinary con transformaciones on-the-fly
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'activos_offmarket/vehiculos',
            public_id: `${vehicleId}_img_${i + 1}`,
            overwrite: true,
            // Requisitos: redimensionar a 800px (width) y convertir a webp
            transformation: [
              { width: 800, crop: 'limit' },
              { fetch_format: 'webp', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(buffer);
      });

      // 3. Guardar la URL segura generada
      if (uploadResult && (uploadResult as any).secure_url) {
        finalUrls.push((uploadResult as any).secure_url);
      }

    } catch (error) {
      console.error(`[ImageUploader] Error procesando imagen ${i + 1} para el vehículo ${vehicleId}:`, error);
      // Fallback: Si falla una imagen, simplemente continuamos con la siguiente.
      // Si fallan todas, devolverá un array vacío y el frontend mostrará el placeholder.
    }
  }

  return finalUrls;
}
