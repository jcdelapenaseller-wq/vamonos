
import * as pdf from 'pdf-parse';
import fs from 'fs';

async function test() {
  console.log('Type of pdf:', typeof pdf);
  console.log('Keys of pdf:', Object.keys(pdf));
  
  const PDFParse = (pdf as any).PDFParse;
  console.log('Type of PDFParse:', typeof PDFParse);
  if (PDFParse) {
    console.log('Keys of PDFParse:', Object.keys(PDFParse));
    try {
        const parser = new PDFParse({ data: Buffer.from('%PDF-1.4\\n1 0 obj\\n<< /Title (Test) >>\\nendobj\\ntrailer\\n<< /Root 1 0 R >>\\n%%EOF') });
        console.log('Parser created');
        if (parser.getText) {
            const pdfData = await parser.getText();
            console.log('PDF Data from PDFParse:', pdfData.text);
        }
    } catch (e: any) {
        console.log('Error using PDFParse:', e.message);
    }
  }
}

test();
