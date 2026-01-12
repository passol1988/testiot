/**
 * EdgeOne Pages Edge Function for Coze API Proxy
 *
 * Proxies requests to https://api.coze.cn to avoid CORS issues
 * for /open_api/* endpoints that don't have CORS headers.
 */

export async function onRequest(context) {
  const { request } = context;

  // Get the original request path, remove /api/coze prefix
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/coze', '') || '/';
  const targetUrl = `https://api.coze.cn${path}${url.search}`;

  console.log('[Proxy] Request:', request.method, targetUrl);

  // Handle OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Forward request to Coze API
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        // Forward necessary headers
        'authorization': request.headers.get('authorization') || '',
        'content-type': request.headers.get('content-type') || 'application/json',
        'accept': 'application/json',
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    console.log('[Proxy] Response:', response.status);

    // Build response headers with CORS
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Copy important response headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return new Response(JSON.stringify({ error: 'Proxy error', message: String(error) }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
