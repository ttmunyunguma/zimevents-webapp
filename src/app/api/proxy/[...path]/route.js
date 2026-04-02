const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function getClientIp(request) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
}

function logPrefix() {
    return `[Proxy ${new Date().toISOString()}]`;
}

async function handler(request, { params }) {
    const { path } = await params;
    const targetPath = path.join('/');
    const url = new URL(request.url);
    const targetUrl = `${API_BASE_URL}/${targetPath}${url.search}`;

    const method = request.method;
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const startTime = Date.now();

    console.log(`${logPrefix()} --> ${method} ${targetUrl} | ip=${clientIp} ua="${userAgent}"`);

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
        console.log(`${logPrefix()} <-- ${method} ${targetUrl} ${response.status} (${duration}ms) | ip=${clientIp}`);

        const data = await response.text();

        return new Response(data, {
            status: response.status,
            headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`${logPrefix()} ERROR ${method} ${targetUrl} (${duration}ms) | ip=${clientIp}`, error.message, error.cause || error);

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
