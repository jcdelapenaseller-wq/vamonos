import puppeteer from 'puppeteer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analysisResult, auction } = req.body;

    if (!analysisResult) {
      return res.status(400).json({ error: 'Missing analysisResult' });
    }

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Informe de Subasta</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #334155;
          line-height: 1.6;
          padding: 40px;
          margin: 0;
          background-color: #ffffff;
        }
        .header {
          border-bottom: 2px solid #0284c7;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #0f172a;
          margin: 0 0 10px 0;
          font-size: 26px;
        }
        .subtitle {
          color: #64748b;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        .meta-item {
          background: #f8fafc;
          padding: 12px 15px;
          border-radius: 6px;
          border: 1px solid #f1f5f9;
        }
        .meta-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: bold;
        }
        .meta-value {
          font-size: 16px;
          color: #0f172a;
          font-weight: bold;
          margin-top: 4px;
        }
        h2 {
          color: #0284c7;
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
        }
        .section {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .riesgos-block {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
        }
        .riesgos-block h2 {
          color: #dc2626;
          border-bottom-color: #fca5a5;
          margin-bottom: 10px;
        }
        .cargas-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .carga-item {
          padding: 15px 0;
          border-bottom: 1px solid #cbd5e1;
        }
        .carga-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .carga-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .carga-tipo {
          font-weight: bold;
          color: #1e293b;
        }
        .carga-importe {
          font-weight: bold;
          color: #475569;
        }
        .carga-estado-cancela {
          color: #10b981;
          font-weight: bold;
          font-size: 14px;
        }
        .carga-estado-subsiste {
          color: #ef4444;
          font-weight: bold;
          font-size: 14px;
        }
        .carga-estado-default {
          color: #64748b;
          font-weight: bold;
          font-size: 14px;
        }
        .carga-desc {
          font-size: 14px;
          color: #475569;
          margin-top: 8px;
          line-height: 1.5;
        }
        .recomendacion-bloque {
          margin-bottom: 15px;
          background: #f8fafc;
          padding: 15px;
          border-radius: 6px;
        }
        .recomendacion-bloque:last-child {
          margin-bottom: 0;
        }
        .recomendacion-titulo {
          font-weight: bold;
          color: #0f172a;
          margin-bottom: 8px;
          display: block;
          font-size: 15px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          font-size: 11px;
          text-align: center;
          color: #94a3b8;
        }
        p {
          margin-top: 0;
          margin-bottom: 15px;
          color: #334155;
        }
        p:last-child {
          margin-bottom: 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="subtitle">Dossier de Análisis Jurídico</div>
        <h1>Informe de Subasta: ${auction?.boeId || 'N/A'}</h1>
        
        <div class="meta-grid">
          <div class="meta-item">
            <div class="meta-label">Ubicación</div>
            <div class="meta-value">${auction?.city || auction?.province || 'No especificada'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Valor Subasta</div>
            <div class="meta-value">${auction?.valorSubasta ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(auction.valorSubasta) : '—'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Tipología</div>
            <div class="meta-value">${auction?.propertyType || '—'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Puntuación / Rentabilidad</div>
            <div class="meta-value">${auction?.opportunityScore !== undefined ? auction.opportunityScore + '/10' : '—'}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Resumen Ejecutivo</h2>
        <p>${analysisResult?.resumen_ejecutivo || 'No disponible'}</p>
      </div>

      <div class="section">
        <h2>Análisis Registral</h2>
        <p>Interpretación basada en la nota simple y documentación aportada al expediente administrativo.</p>
        ${analysisResult?.informacion_general ? `
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <div style="font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Detalles Finca</div>
            <p style="margin:0; font-size: 14px;"><strong>Superficie:</strong> ${analysisResult.informacion_general.superficie || 'No consta'}</p>
            <p style="margin:5px 0 0 0; font-size: 14px;"><strong>Titularidad:</strong> ${analysisResult.informacion_general.porcentaje_titularidad_subastado || '100%'} subastado.</p>
          </div>
        ` : ''}
      </div>

      ${(analysisResult?.cargas && analysisResult.cargas.length > 0) ? `
      <div class="section riesgos-block">
        <h2>⚠️ Riesgos y Cargas Detectadas</h2>
        <p style="color: #991b1b; font-weight: 500; margin-bottom: 15px;">
          Se han detectado anotaciones o cargas que requieren atención y que podrían afectar a la viabilidad económica de la operación.
        </p>
        <ul class="cargas-list">
          ${analysisResult.cargas.map((c: any) => {
            const estadoCls = c.estado?.toLowerCase() === 'cancela' 
              ? 'carga-estado-cancela' 
              : (c.estado?.toLowerCase() === 'subsiste' ? 'carga-estado-subsiste' : 'carga-estado-default');
            return `
              <li class="carga-item" style="border-bottom-color: #fca5a5;">
                <div class="carga-header">
                  <span class="carga-tipo">${c.tipo || 'Carga genérica'}</span>
                  <span class="carga-importe" style="color: #991b1b;">${c.importe ? c.importe.toLocaleString('es-ES') + ' €' : 'Importe desconocido'}</span>
                </div>
                <div class="${estadoCls}">
                  Estado post-adjudicación: ${c.estado || 'Desconocido'}
                </div>
                <div class="carga-desc" style="color: #7f1d1d;">${c.descripcion || ''}</div>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
      ` : `
      <div class="section" style="background-color: #f0fdf4; border-color: #bbf7d0;">
        <h2 style="color: #166534; border-bottom-color: #bbf7d0;">✅ Sin Riesgos Registrales Detectados</h2>
        <p style="color: #166534; margin: 0;">Según la documentación analizada, no se han detectado cargas económicas ni anotaciones preventivas que subsistan tras la adjudicación y puedan perjudicar la viabilidad patrimonial.</p>
      </div>
      `}

      <div class="section">
        <h2>Conclusión y Estrategia</h2>
        ${typeof analysisResult?.recomendacion === 'object' ? 
          Object.entries(analysisResult.recomendacion).map(([k, v]) => `
            <div class="recomendacion-bloque">
              <span class="recomendacion-titulo">${k.replace(/#/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, '').trim() /* Remove emojis & hash */}</span>
              <span style="font-size: 14px; color: #475569; display: block; line-height: 1.6;">${typeof v === 'string' ? v.replace(/\n/g, '<br/>') : v}</span>
            </div>
          `).join('') 
          : `<p>${analysisResult?.recomendacion || 'No disponible'}</p>`}
      </div>

      <div class="footer">
        <strong style="color: #0f172a; font-size: 13px; display: block; margin-bottom: 4px;">Informe generado por Activos Off-Market</strong>
        <span style="color: #0284c7; font-weight: bold; font-size: 12px; display: block; margin-bottom: 12px;">Análisis jurídico asistido por IA + revisión experta</span>
        <div style="margin-top: 20px; font-size: 10px; color: #64748b; text-align: justify; background-color: #f8fafc; padding: 12px 15px; border-radius: 6px; border: 1px solid #f1f5f9; line-height: 1.6;">
          <strong>Aviso legal:</strong> Este informe se genera mediante análisis con inteligencia jurídica artificial especializada de la documentación disponible y datos de mercado estimados. Tiene carácter informativo y orientativo. No constituye asesoramiento financiero ni de inversión. Se recomienda complementar la información con profesionales cualificados antes de tomar decisiones.
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    const filenameId = auction?.id || auction?.boeId || 'subasta';
    res.setHeader('Content-Disposition', `attachment; filename="informe-${filenameId}.pdf"`);
    return res.send(Buffer.from(pdfBuffer));
  } catch (error: any) {
    console.error('Error generating PDF with Puppeteer:', error);
    return res.status(500).json({ error: error.message });
  }
}
