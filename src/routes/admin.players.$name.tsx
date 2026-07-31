import type { ReactNode } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { fetchPlayer } from '#/lib/player-server'
import { rankForValue, rankTagProps } from '#/lib/rank'
import type { GameModeStats } from '#/lib/player-api'

const PIXEL_SHADOW = 'shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.6)]'

export const Route = createFileRoute('/admin/players/$name')({
  component: PlayerProfile,
  loader: async ({ params }) => {
    const player = await fetchPlayer({ data: params.name })
    if (!player) throw notFound()
    return player
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Smilekrub Network | ผู้เล่น ${loaderData?.name ?? ''}` }],
  }),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mc text-2xl text-foreground">ไม่พบผู้เล่นนี้</p>
      <Link to="/admin/players" className="text-primary hover:underline">
        กลับไปหน้ารายชื่อผู้เล่น
      </Link>
    </div>
  ),
})

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(totalSeconds?: number) {
  if (!totalSeconds) return '0 นาที'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const parts: Array<string> = []
  if (hours > 0) parts.push(`${hours} ชม.`)
  parts.push(`${minutes} นาที`)
  return parts.join(' ')
}

function StatPill({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-black/20 bg-muted/50 px-4 py-3 text-center dark:border-black/50">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

const GAME_MODE_LABEL: Record<string, string> = {
  ultra_hardcore: 'Ultra Hardcore',
  lava_jumping: 'Lava Jumping',
  dragon_survival: 'Dragon Survival',
}

function RankBadge({ rank }: { rank: number }) {
  const def = rankForValue(rank)
  const { color, style } = rankTagProps(def)
  return (
    <MinecraftTag color={color} style={style} className="font-mc gap-1 text-[11px] tracking-wider">
      {def.name}
    </MinecraftTag>
  )
}

function GameModeCard({ id, stats }: { id: string; stats: GameModeStats }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-black/20 bg-muted/50 p-4 dark:border-black/50">
      <span className="font-semibold text-foreground">{GAME_MODE_LABEL[id] ?? id}</span>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">ชนะ</span>
        <span className="text-right font-medium">{stats.total_wins ?? 0}</span>
        <span className="text-muted-foreground">แพ้</span>
        <span className="text-right font-medium">{stats.total_lost ?? 0}</span>
        <span className="text-muted-foreground">เล่นทั้งหมด</span>
        <span className="text-right font-medium">{stats.total_game_played ?? 0}</span>
        <span className="text-muted-foreground">เวลาเล่น</span>
        <span className="text-right font-medium">{formatDuration(stats.total_play_time)}</span>
      </div>
    </div>
  )
}

function PlayerProfile() {
  const player = Route.useLoaderData()

  const account = player.server?.network?.account
  const currency = player.server?.currency
  const cosmetics = player.server?.network?.cosmetics ?? {}
  const gadgets = player.server?.network?.gadgets ?? {}

  const gameModes = ['ultra_hardcore', 'lava_jumping', 'dragon_survival'].filter(
    (id) => player.server?.[id],
  )

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        render={<Link to="/admin/players" />}
        className="-ml-3 w-fit text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft data-icon="inline-start" />
        กลับไปหน้ารายชื่อผู้เล่น
      </Button>

      <Card className={cn('overflow-hidden border-2 border-black/40 p-0 dark:border-black/60', PIXEL_SHADOW)}>
        <div className="relative h-24 bg-gradient-to-br from-primary/50 via-primary/15 to-transparent" />
        <CardContent className="-mt-12 flex flex-col items-center gap-3 pb-6 text-center">
          <div className="rounded-full border-2 border-black/50 bg-card p-1 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] dark:border-black/70">
            <Avatar className="size-24">
              <AvatarImage src={`https://mc-heads.net/avatar/${player.uuid}/96`} alt="" />
              <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl font-semibold">{player.name}</span>
            <span className="font-mono text-xs break-all text-muted-foreground">{player.uuid}</span>
          </div>

          <div className="mt-2 flex w-full flex-wrap gap-2">
            <StatPill label="เลเวล" value={account?.level ?? '—'} />
            <StatPill
              label="แรงค์"
              value={account?.rank !== undefined ? <RankBadge rank={account.rank} /> : '—'}
            />
            <StatPill label="เวลาเล่นรวม" value={formatDuration(player.total_online_seconds)} />
            <StatPill label="ออนไลน์ล่าสุด" value={formatDate(player.last_online)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-black/40 dark:border-black/60">
          <CardHeader>
            <CardTitle>บัญชี</CardTitle>
            <CardDescription>ข้อมูลบัญชีในเครือข่ายเซิร์ฟเวอร์</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">EXP</span>
              <span className="font-medium">{account?.exp ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smiles</span>
              <span className="font-medium">{currency?.smiles ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smileplex</span>
              <span className="font-medium">{currency?.smileplex ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Smilebox</span>
              <span className="font-medium">{player.server?.hub?.smilebox ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">สมัครเมื่อ</span>
              <span className="font-medium">{formatDate(player.registered)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black/40 dark:border-black/60">
          <CardHeader>
            <CardTitle>คอสเมติกที่สวมใส่</CardTitle>
            <CardDescription>ของตกแต่งตัวละครที่กำลังใช้งาน</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.entries(cosmetics).map(([slot, items]) => (
              <div key={slot} className="flex flex-wrap items-center gap-2">
                <span className="w-16 shrink-0 text-xs text-muted-foreground capitalize">{slot}</span>
                {items.length ? (
                  items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {gameModes.length > 0 ? (
        <Card className="border-2 border-black/40 dark:border-black/60">
          <CardHeader>
            <CardTitle>สถิติเกม</CardTitle>
            <CardDescription>ผลการเล่นในแต่ละโหมด</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {gameModes.map((id) => (
              <GameModeCard key={id} id={id} stats={player.server![id] as GameModeStats} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      {Object.keys(gadgets).length > 0 ? (
        <Card className="border-2 border-black/40 dark:border-black/60">
          <CardHeader>
            <CardTitle>อุปกรณ์ (Gadgets)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {Object.entries(gadgets).map(([id, amount]) => (
              <Badge key={id} variant="secondary">
                {id}: {amount}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-2 border-black/40 dark:border-black/60">
        <CardHeader>
          <CardTitle>ข้อมูลดิบทั้งหมด</CardTitle>
          <CardDescription>ข้อมูลทั้งหมดจากฐานข้อมูล (ไม่รวมรหัสผ่าน)</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[600px] overflow-auto rounded-xl border-2 border-black/20 bg-muted/50 p-4 text-xs dark:border-black/50">
            {JSON.stringify(player, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
