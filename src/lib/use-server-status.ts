import { useEffect, useState } from 'react'

import { getServerStatus, type ServerStatus } from '#/lib/server-status'

const POLL_INTERVAL = 60_000

export function useServerStatus(initial: ServerStatus): ServerStatus {
  const [status, setStatus] = useState<ServerStatus>(initial)

  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      if (document.visibilityState === 'hidden') return
      const next = await getServerStatus()
      if (!cancelled) setStatus(next)
    }

    const interval = setInterval(refresh, POLL_INTERVAL)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return status
}
