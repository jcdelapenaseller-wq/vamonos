import handler from './api/run-analysis.ts';

const req = {
  method: 'POST',
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
    await handler(req, res);
  } catch (e) {
    console.error('CRASH EXACTO:', e);
  }
}

run();
