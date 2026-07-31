import { useState } from 'react'
import { createFileRoute, getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { Ban, MoreHorizontal, Search, ServerOff, UserCog, Users } from 'lucide-react'

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
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/players/')({
  component: AdminPlayers,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | จัดการผู้เล่น' }],
  }),
})

const adminRoute = getRouteApi('/admin')

function PlayerLookupCard() {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  const onSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    navigate({ to: '/admin/players/$name', params: { name: trimmed } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ค้นหาผู้เล่น</CardTitle>
        <CardDescription>ดูข้อมูลทั้งหมดของผู้เล่นคนใดก็ได้ ไม่จำกัดแค่คนที่ออนไลน์อยู่</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="player-lookup">ชื่อผู้เล่น</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="player-lookup"
              placeholder="เช่น FewFond_"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            />
            <Button type="button" disabled={!name.trim()} onClick={onSubmit}>
              <Search />
              ค้นหา
            </Button>
          </div>
        </Field>
      </CardContent>
    </Card>
  )
}

function AdminPlayers() {
  const status = adminRoute.useLoaderData()
  const online = status.ok && status.online
  const players = status.ok ? status.players : { online: 0, max: 0, sample: [] }

  return (
    <div className="flex flex-col gap-6">
      <PlayerLookupCard />

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
                          <DropdownMenuItem
                            render={<Link to="/admin/players/$name" params={{ name: player.name }} />}
                          >
                            <Search />
                            ดูข้อมูลทั้งหมด
                          </DropdownMenuItem>
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
    </div>
  )
}
