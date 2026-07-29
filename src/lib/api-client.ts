import { API_URL } from '#/lib/auth-client'

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; code?: string }

export async function apiJson<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!res.ok) {
    const code = await res
      .json()
      .then((body: { error?: string }) => body.error)
      .catch(() => undefined)
    return { ok: false, status: res.status, code }
  }

  return { ok: true, data: (await res.json()) as T }
}
