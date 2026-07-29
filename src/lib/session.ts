import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

import { API_URL } from '#/lib/auth-client'
import type { AuthSession } from '#/lib/auth-client'

/**
 * Reads the Better Auth session on the server by forwarding the browser's
 * cookie header to smilekrub-backend.
 *
 * This runs during SSR (and during client navigations, via the server-function
 * RPC), which is what lets `beforeLoad` guards decide before the first paint
 * instead of flashing protected UI and redirecting afterwards.
 *
 * Cookies ignore ports, so the `localhost:3001` session cookie is present on
 * `localhost:3000` requests in dev. In production the API must share a parent
 * domain with the app (see `advanced.crossSubDomainCookies` in the backend).
 */
export const fetchSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthSession | null> => {
    const cookie = getRequestHeader('cookie')
    if (!cookie) return null

    try {
      const res = await fetch(`${API_URL}/api/auth/get-session`, {
        headers: { cookie },
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return null

      const session = (await res.json()) as AuthSession | null
      return session?.user ? session : null
    } catch {
      // Auth API unreachable — treat as signed out rather than crashing the page.
      return null
    }
  },
)
