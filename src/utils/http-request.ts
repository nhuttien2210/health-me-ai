import { GEMINI_API_URL, GEMINI_KEY } from "@/constants";

type HttpRequestProps<Body = BodyInit> = {
    url?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: HeadersInit;
    body?: Body;
    endpoint?: string;
    signal?: AbortSignal;
};


export async function httpRequest<Resp = unknown, Body = BodyInit>({ url, method, headers, body, endpoint = '', signal }: HttpRequestProps<Body>): Promise<Resp> {
    try {
        const response = await fetch(`${url}${endpoint}`, {
            method,
            ...(method !== 'GET' && { body: JSON.stringify(body || {}) }),
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            signal
        })

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw { response, data: data?.error }
        }
        return data;

    } catch (error) {
        return Promise.reject(error);
    }
}

export const geminiHttpRequest = <Resp = unknown, Body = BodyInit>({ method, body, endpoint = '', headers, signal }: HttpRequestProps<Body>) => httpRequest<Resp, Body>({
    url: GEMINI_API_URL,
    endpoint,
    method,
    headers: {
        'x-goog-api-key': GEMINI_KEY,
        ...headers
    },
    body,
    signal
})