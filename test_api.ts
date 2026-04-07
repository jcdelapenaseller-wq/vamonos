import axios from 'axios';

async function test() {
  try {
    const response = await axios.post('http://localhost:3000/api/valuation', {
      slug: "test-rc",
      boeId: "TEST-RC",
      refCat: "1234567VK4713S0001XX",
      appraisalValue: 100000
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();
