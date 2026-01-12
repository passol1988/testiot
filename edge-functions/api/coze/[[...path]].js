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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Coze-Client-User-Agent',
      },
    });
  }

  try {
    // Build headers to forward
    const headers = new Headers();

    // Forward authorization
    const auth = request.headers.get('authorization');
    if (auth) headers.set('authorization', auth);

    // Forward content-type if exists
    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    // Set required headers for Coze API
    headers.set('accept', 'application/json');

    // Forward X-Coze-Client-User-Agent if exists
    const cozeUA = request.headers.get('x-coze-client-user-agent');
    if (cozeUA) headers.set('x-coze-client-user-agent', cozeUA);

    // Get request body for non-GET methods
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
      // If body exists, ensure content-type is set
      if (body && !headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }
    }

    console.log('[Proxy] Forwarding with headers:', Object.fromEntries(headers.entries()));

    // Forward request to Coze API
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    });

    console.log('[Proxy] Response status:', response.status);

    // Read response body to get more info if error
    const responseText = await response.text();

    // Build response headers with CORS
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Copy content-type
    const responseContentType = response.headers.get('content-type');
    if (responseContentType) {
      responseHeaders.set('content-type', responseContentType);
    }

    // Log error details for debugging
    if (response.status >= 400) {
      console.error('[Proxy] Error response:', response.status, responseText);
    }

    return new Response(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy] Exception:', error);
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: String(error),
      targetUrl
    }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
