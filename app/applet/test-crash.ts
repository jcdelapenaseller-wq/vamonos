import handler from '../../api/run-analysis.ts';

const req = {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: {
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'cargas'
  }
};

const res = {
  status: (code) => ({
    json: (data) => console.log('STATUS', code, 'JSON', data)
  })
};

async function run() {
  try {
    console.log("--- TEST PATH 2: DIRECT FILE ---");
    const reqFile = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data; boundary=---TestBoundary'
      },
      body: { type: 'cargas' },
      file: { 
        buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'),
        size: 100,
        originalname: 'test.pdf'
      }
    };
    // Desactivamos Multer para el test si no tenemos un stream real, 
    // pero el handler lo llama. Mejor mockeamos el middleware.
    await handler(reqFile, res);
  } catch (e) {
    console.error('CRASH EXACTO:', e);
  }
}

run();
