
import * as pdfNamespace from 'pdf-parse';

async function test() {
  try {
    console.log('Testing pdf-parse...');
    const { PDFParse } = pdfNamespace as any;
    console.log('Type of PDFParse:', typeof PDFParse);
    if (typeof PDFParse === 'function') {
      console.log('PDFParse is a function/class');
    }
  } catch (e) {
    console.error('Error in test:', e);
  }
}

test();
