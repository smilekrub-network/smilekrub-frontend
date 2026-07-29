import { createServerFn } from '@tanstack/react-start'

import { SERVER_IP } from '#/lib/site-content'

export type ServerStatus =
  | {
      ok: true
      online: boolean
      players: {
        online: number
        max: number
        sample: Array<{ name: string; uuid: string }>
      }
      version: string | null
      retrievedAt: number
    }
  | { ok: false }

interface McStatusResponse {
  online: boolean
  expires_at?: number
  retrieved_at?: number
  players?: {
    online?: number
    max?: number
    list?: Array<{ uuid: string; name_clean: string }>
  }
  version?: {
    name_clean?: string
  }
}

let cache: { data: ServerStatus; expiresAt: number } | null = null

export const getServerStatus = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ServerStatus> => {
    if (cache && Date.now() < cache.expiresAt) {
      return cache.data
    }

    try {
      const res = await fetch(
        `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`,
        { signal: AbortSignal.timeout(5000) },
      )
      if (!res.ok) throw new Error(`mcstatus responded ${res.status}`)

      const json = (await res.json()) as McStatusResponse

      const data: ServerStatus = {
        ok: true,
        online: json.online,
        players: {
          online: json.players?.online ?? 0,
          max: json.players?.max ?? 0,
          sample: (json.players?.list ?? [])
            .slice(0, 12)
            .map((p) => ({ name: p.name_clean, uuid: p.uuid })),
        },
        version: json.version?.name_clean ?? null,
        retrievedAt: json.retrieved_at ?? Date.now(),
      }

      cache = {
        data,
        expiresAt: json.expires_at ?? Date.now() + 60_000,
      }
      return data
    } catch {
      // Offline/unreachable is a rendered state, not an error page.
      return { ok: false }
    }
  },
)
