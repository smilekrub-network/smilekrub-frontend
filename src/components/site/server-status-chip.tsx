import { AnimatedNumber } from '#/components/site/motion-primitives'
import type { ServerStatus } from '#/lib/server-status'
import { cn } from '@/lib/utils'
import { MinecraftTag } from '../ui/minecraft-menu'

function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        'inline-block size-2 rounded-full',
        online ? 'animate-pulse-dot bg-primary text-primary' : 'bg-stone',
      )}
    />
  )
}

export function ServerStatusChip({
  status,
  expanded = false,
  className,
}: {
  status: ServerStatus
  expanded?: boolean
  className?: string
}) {
  const online = status.ok && status.online

  if (!expanded) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground',
          className,
        )}
      >
        <StatusDot online={online} />
        {online ? (
          <>
            <AnimatedNumber value={status.players.online} className="font-medium text-foreground" />
            <span>ออนไลน์</span>
          </>
        ) : (
          <span>ออฟไลน์</span>
        )}
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-3 text-sm',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 backdrop-blur">
        <StatusDot online={online} />
        {online ? (
          <span className="text-foreground">
            <AnimatedNumber value={status.players.online} className="font-semibold" />
            <span className="text-muted-foreground"> / {status.players.max} คนออนไลน์</span>
          </span>
        ) : (
          <span className="text-muted-foreground">เซิร์ฟเวอร์ออฟไลน์</span>
        )}
      </span>
      {online && status.version ? (
        <MinecraftTag className="bg-card/70 backdrop-blur">
          {status.version}
        </MinecraftTag>
      ) : null}
    </div>
  )
}
