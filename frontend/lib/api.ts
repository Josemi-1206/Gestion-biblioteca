const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {}
    throw new Error(message);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiPut<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function apiPatch<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}
