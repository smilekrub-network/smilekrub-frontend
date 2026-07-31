import { createServerFn } from '@tanstack/react-start'

import { API_URL } from '#/lib/auth-client'
import type { PlayerDoc } from '#/lib/player-api'

export const fetchPlayer = createServerFn({ method: 'GET' })
  .validator((name: string) => name)
  .handler(async ({ data }): Promise<PlayerDoc | null> => {
    try {
      const res = await fetch(`${API_URL}/api/player/${encodeURIComponent(data)}`, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return null
      return (await res.json()) as PlayerDoc
    } catch {
      return null
    }
  })
