import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { Ban, MoreHorizontal, ServerOff, UserCog, Users } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/players')({
  component: AdminPlayers,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | จัดการผู้เล่น' }],
  }),
})

const adminRoute = getRouteApi('/admin')

function AdminPlayers() {
  const status = adminRoute.useLoaderData()
  const online = status.ok && status.online
  const players = status.ok ? status.players : { online: 0, max: 0, sample: [] }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>ผู้เล่นออนไลน์</CardTitle>
        <CardDescription>
          {online
            ? `กำลังเล่นอยู่ ${players.online} จาก ${players.max} ช่อง`
            : 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ในขณะนี้'}
        </CardDescription>
        <CardAction>
          <Badge variant={online ? 'default' : 'secondary'}>
            {online ? 'ออนไลน์' : 'ออฟไลน์'}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        {!online ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ServerOff />
              </EmptyMedia>
              <EmptyTitle>เซิร์ฟเวอร์ออฟไลน์</EmptyTitle>
              <EmptyDescription>
                ระบบจะดึงรายชื่อผู้เล่นอัตโนมัติเมื่อเซิร์ฟเวอร์กลับมาออนไลน์
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : players.sample.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>ยังไม่มีผู้เล่นในเซิร์ฟเวอร์</EmptyTitle>
              <EmptyDescription>
                เซิร์ฟเวอร์ออนไลน์อยู่ แต่ยังไม่มีใครเข้าเล่นในขณะนี้
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้เล่น</TableHead>
                <TableHead className="hidden lg:table-cell">UUID</TableHead>
                <TableHead className="w-28">สถานะ</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.sample.map((player) => (
                <TableRow key={player.uuid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={`https://mc-heads.net/avatar/${player.uuid}/64`}
                          alt=""
                        />
                        <AvatarFallback className="rounded-lg">
                          {player.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-0 lg:table-cell">
                    <span className="block truncate font-mono text-xs text-muted-foreground">
                      {player.uuid}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">กำลังเล่น</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" aria-label="ตัวเลือกผู้เล่น">
                            <MoreHorizontal />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuGroup>
                          <DropdownMenuItem disabled>
                            <UserCog />
                            จัดการยศ
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive" disabled>
                            <Ban />
                            แบนผู้เล่น
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
