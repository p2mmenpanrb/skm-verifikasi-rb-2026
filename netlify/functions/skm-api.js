exports.handler = async function(event) {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return json(500, {
      ok: false,
      message: 'APPS_SCRIPT_URL belum diatur di Netlify Environment Variables.'
    });
  }

  try {
    const method = event.httpMethod || 'GET';

    if (method === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters || {});
      const target = `${appsScriptUrl}?${params.toString()}`;

      const response = await fetch(target, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'Accept': 'application/json' }
      });

      const text = await response.text();
      return proxyResponse(response.status, text);
    }

    if (method === 'POST') {
      const body = event.body || '';

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
          'Accept': 'application/json'
        },
        body
      });

      const text = await response.text();
      return proxyResponse(response.status, text);
    }

    return json(405, {
      ok: false,
      message: `Method ${method} tidak didukung.`
    });

  } catch (error) {
    return json(500, {
      ok: false,
      message: error && error.message ? error.message : 'Gagal menghubungi Apps Script API.'
    });
  }
};

function proxyResponse(statusCode, text) {
  // Validate that Apps Script returned JSON before passing it to the browser.
  try {
    JSON.parse(text);
  } catch (error) {
    return json(502, {
      ok: false,
      message: 'Apps Script tidak mengembalikan JSON yang valid.',
      detail: text.slice(0, 300)
    });
  }

  return {
    statusCode: statusCode >= 200 && statusCode < 600 ? statusCode : 502,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: text
  };
}

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(data)
  };
}
