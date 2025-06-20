const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Verify the ScanSoles API key is set
  if (!process.env.SCANSOLES_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ScanSoles API key not configured' })
    };
  }

  try {
    const { footScanData, style, color, material } = JSON.parse(event.body);
    
    // Validate required parameters
    if (!footScanData || !footScanData.meshUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required foot scan data' })
      };
    }

    // Call the real ScanSoles API to generate a custom shoe
    const response = await fetch('https://api.scansoles.com/v1/shoe-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SCANSOLES_API_KEY}`
      },
      body: JSON.stringify({
        scan_data: {
          mesh_url: footScanData.meshUrl,
          measurements: {
            foot_length: footScanData.footLength,
            foot_width: footScanData.footWidth,
            arch_height: footScanData.archHeight
          }
        },
        design_parameters: {
          shoe_style: style,
          color: color,
          material: material,
          // Additional parameters the API might need
          fit_preference: 'standard',
          manufacturing_ready: false
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate shoe model');
    }

    const result = await response.json();
    
    // Return the generated model URL and any additional data
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        modelUrl: result.model_url,
        metadata: result.metadata || null
      })
    };
  } catch (err) {
    console.error('Shoe generation error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: err.message || 'Failed to generate shoe model',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      })
    };
  }
};
