# Reglas del Agente para Protección del Dataset

## Flujo de Trabajo Seguro para Frontend y Dataset

Dado que el `src/data/auctions.ts` funciona como el dataset maestro actualizado de manera autónoma por el crawler, es crítico evitar que los commits y despliegues originados en modificaciones del frontend sobrescriban o reviertan sus datos.

**ANTES de proceder con cualquier modificación estructural, sincronización y/o "commit" del frontend, debes:**

1. **Ejecutar SIEMPRE: `git pull origin main`**
   *(Incluso si este es el entorno de AI Studio, asume y verifica la procedencia de los archivos para garantizar que contamos con los datos más recientes del crawler de automatización).*

2. **Verificar cambios en el dataset:**
   - Si `src/data/auctions.ts` ha sido modificado en el área de trabajo activa, **NO** debes incluirlo en ningún update/commit o sincronización de código de frontend.
   - Si se identifica que una modificación de frontend alteró `src/data/auctions.ts`, se debe descartar dicha alteración del dataset.

3. **Commit / Actualizaciones:** 
   - SOLO modifica y consolida los archivos del frontend.
   - NUNCA modifiques las herramientas de scraping (`scripts/boeSubastasCrawler.ts`, etc.) ni restablezcas con datos de pruebas u obsoletos el archivo `src/data/auctions.ts`.

4. **Objetivo:**
   - Mantener el dataset actualizado por el crawler.
   - Evitar la sobrescritura accidental por ajustes visuales.
   - No romper el pipeline actual donde frontend y crawler conviven.
