import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { ArrowUpRight, Newspaper, Server, TrendingUp, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NEWS_ITEMS, SERVER_IP } from '#/lib/site-content'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | แดชบอร์ดแอดมิน' }],
  }),
})

const adminRoute = getRouteApi('/admin')

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Users
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mc text-2xl">{value}</CardTitle>
        <CardAction>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4.5" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
  )
}

function AdminDashboard() {
  const status = adminRoute.useLoaderData()
  const online = status.ok && status.online
  const players = status.ok ? status.players : { online: 0, max: 0, sample: [] }
  const capacity = players.max > 0 ? (players.online / players.max) * 100 : 0
  const recentNews = NEWS_ITEMS.slice(0, 5)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="ผู้เล่นออนไลน์"
          value={online ? `${players.online}` : '—'}
          hint={online ? `จากความจุ ${players.max} ช่อง` : 'เซิร์ฟเวอร์ออฟไลน์'}
          icon={Users}
        />
        <StatCard
          label="สถานะเซิร์ฟเวอร์"
          value={online ? 'ออนไลน์' : 'ออฟไลน์'}
          hint={SERVER_IP}
          icon={Server}
        />
        <StatCard
          label="ข่าวสารที่เผยแพร่"
          value={String(NEWS_ITEMS.length)}
          hint={`ล่าสุด ${formatDate(NEWS_ITEMS[0].publishedAt)}`}
          icon={Newspaper}
        />
        <StatCard
          label="เวอร์ชันเซิร์ฟเวอร์"
          value={status.ok && status.version ? status.version : '—'}
          hint="Minecraft Java Edition"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>ข่าวสารล่าสุด</CardTitle>
            <CardDescription>ประกาศและอัปเดตที่เผยแพร่บนหน้าเว็บ</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" render={<Link to="/admin/news" />}>
                ดูทั้งหมด
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>หัวข้อ</TableHead>
                  <TableHead className="w-28">หมวดหมู่</TableHead>
                  <TableHead className="w-32 text-right">เผยแพร่</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-0">
                      <p className="truncate font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.author}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(item.publishedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ความจุเซิร์ฟเวอร์</CardTitle>
            <CardDescription>สัดส่วนผู้เล่นที่ออนไลน์อยู่ขณะนี้</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mc text-3xl text-foreground">{players.online}</span>
                <span className="text-sm text-muted-foreground">/ {players.max} ช่อง</span>
              </div>
              <Progress value={capacity} />
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">IP เซิร์ฟเวอร์</span>
                <span className="font-medium text-foreground">{SERVER_IP}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">สถานะ</span>
                <Badge variant={online ? 'default' : 'secondary'}>
                  {online ? 'ออนไลน์' : 'ออฟไลน์'}
                </Badge>
              </div>
            </div>

            <Button variant="outline" render={<Link to="/admin/players" />}>
              จัดการผู้เล่น
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
