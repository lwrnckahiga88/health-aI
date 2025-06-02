const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, config } = JSON.parse(event.body);
    
    // Validate config
    if (!config.apiKey || !config.baseUrl || !config.assistantId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid configuration' })
      };
    }

    // Create thread
    const thread = await fetch(`${config.baseUrl}/v1/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());

    try {
      // Post message
      await fetch(`${config.baseUrl}/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      // Create run
      const run = await fetch(`${config.baseUrl}/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistant_id: config.assistantId,
          model: config.model || 'gpt-4',
          temperature: config.temperature || 0.7
        })
      }).then(res => res.json());

      // Wait for completion
      let status = run.status;
      const start = Date.now();
      while (status !== 'completed' && Date.now() - start < 30000) {
        await new Promise(r => setTimeout(r, 1000));
        const statusRes = await fetch(`${config.baseUrl}/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        status = (await statusRes.json()).status;
      }

      if (status !== 'completed') {
        throw new Error('Run timed out');
      }

      // Get response
      const messages = await fetch(`${config.baseUrl}/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());

      const reply = messages.data.find(m => m.role === 'assistant')?.content?.[0]?.text?.value;
      
      if (!reply) throw new Error('No reply received');

      return {
        statusCode: 200,
        body: JSON.stringify({ reply })
      };
    } finally {
      // Clean up thread
      try {
        await fetch(`${config.baseUrl}/v1/threads/${thread.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (e) {
        console.error('Cleanup failed:', e);
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
