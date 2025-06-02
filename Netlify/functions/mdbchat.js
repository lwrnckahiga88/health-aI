const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, apiKey, baseUrl, assistantId } = JSON.parse(event.body);

    if (!apiKey || !baseUrl || !assistantId || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Helper for MindsDB API calls with retries on 401
    async function fetchWithRetry(endpoint, options = {}) {
      const url = `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\//, '')}`;
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client': 'juA.kali-webapp/1.0'
      };

      let retries = 0, maxRetries = 3;
      while (true) {
        const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
        if (res.ok) return res.json();
        if (res.status === 401 && retries < maxRetries) {
          retries++;
          continue; // retry
        }
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: res.statusText };
        }
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
    }

    // Create thread
    const thread = await fetchWithRetry('v1/threads', { method: 'POST' });
    const threadId = thread.id;

    try {
      // Post user message
      await fetchWithRetry(`v1/threads/${threadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ role: 'user', content: message }),
      });

      // Create run with assistant ID
      const run = await fetchWithRetry(`v1/threads/${threadId}/runs`, {
        method: 'POST',
        body: JSON.stringify({ assistant_id: assistantId }),
      });

      let status = run.status;
      const start = Date.now();

      // Poll run status (timeout 30 seconds)
      while (status !== 'completed' && Date.now() - start < 30000) {
        await new Promise(r => setTimeout(r, 1000));
        const statusObj = await fetchWithRetry(`v1/threads/${threadId}/runs/${run.id}`);
        status = statusObj.status;
        if (status === 'failed') throw new Error(statusObj.last_error?.message || 'Run failed');
      }

      if (status !== 'completed') throw new Error('Run timed out');

      // Get messages and find assistant reply
      const messages = await fetchWithRetry(`v1/threads/${threadId}/messages`);
      const reply = messages.data.find(m => m.role === 'assistant')?.content?.[0]?.text?.value;

      if (!reply) throw new Error('No valid assistant reply');

      return {
        statusCode: 200,
        body: JSON.stringify({ reply }),
      };
    } finally {
      // Delete thread to clean up
      try {
        await fetchWithRetry(`v1/threads/${threadId}`, { method: 'DELETE' });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || 'Internal Server Error' }),
    };
  }
};
