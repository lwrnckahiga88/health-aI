// Real implementation using ScanSoles API
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { footScanData, style, color, material } = JSON.parse(event.body);

    // Call ScanSoles API
    const response = await fetch('https://api.scansoles.com/v1/generate-shoe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SCANSOLES_API_KEY}`
      },
      body: JSON.stringify({
        scan_data: footScanData,
        design: { style, color, material }
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        modelUrl: data.model_url,
        priceEstimate: data.price_estimate
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Shoe generation failed',
        details: error.message 
      })
    };
  }
};
