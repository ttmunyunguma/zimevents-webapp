const API_BASE_URL = process.env.API_URL || 'https://api.linkupzim.co.uk/api/v1';
const API_KEY = process.env.API_KEY || 'cb4563fe-c840-4bdd-bdc6-06a8e21271b4';

async function handler(request, { params }) {
    const { path } = await params;
    const targetPath = path.join('/');
    const url = new URL(request.url);
    const targetUrl = `${API_BASE_URL}/${targetPath}${url.search}`;

    const method = request.method;
    const startTime = Date.now();

    console.log(`[Proxy] --> ${method} ${targetUrl}`);

    try {
        const headers = {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY,
        };

        const fetchOptions = { method, headers };

        if (method !== 'GET' && method !== 'HEAD') {
            fetchOptions.body = await request.text();
        }

        const response = await fetch(targetUrl, fetchOptions);
        const duration = Date.now() - startTime;
        console.log(`[Proxy] <-- ${method} ${targetUrl} ${response.status} (${duration}ms)`);

        const data = await response.text();

        return new Response(data, {
            status: response.status,
            headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[Proxy] Error ${method} ${targetUrl} after ${duration}ms:`, error.message);

        return Response.json(
            { message: 'Backend unavailable', error: error.message },
            { status: 502 },
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
