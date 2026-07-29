import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Eye, MoreHorizontal, Newspaper, Pencil, Search, Trash2 } from 'lucide-react'

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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NEWS_ITEMS } from '#/lib/site-content'

export const Route = createFileRoute('/admin/news')({
  component: AdminNews,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | จัดการข่าวสาร' }],
  }),
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AdminNews() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return NEWS_ITEMS
    return NEWS_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>จัดการข่าวสาร</CardTitle>
        <CardDescription>
          ข่าวสารทั้งหมด {NEWS_ITEMS.length} รายการที่แสดงบนหน้าเว็บ
        </CardDescription>
        <CardAction>
          <InputGroup className="w-full sm:w-64">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="ค้นหาข่าวสาร"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        {results.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Newspaper />
              </EmptyMedia>
              <EmptyTitle>ไม่พบข่าวสาร</EmptyTitle>
              <EmptyDescription>
                ลองเปลี่ยนคำค้นหาหรือล้างช่องค้นหาเพื่อดูข่าวทั้งหมด
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หัวข้อ</TableHead>
                <TableHead className="w-28">หมวดหมู่</TableHead>
                <TableHead className="hidden w-40 md:table-cell">ผู้เขียน</TableHead>
                <TableHead className="w-32">เผยแพร่</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-0">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {item.author}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(item.publishedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" aria-label="ตัวเลือกข่าวสาร">
                            <MoreHorizontal />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            render={
                              <Link
                                to="/news/$newsId"
                                params={{ newsId: String(item.id) }}
                              />
                            }
                          >
                            <Eye />
                            ดูบนหน้าเว็บ
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Pencil />
                            แก้ไข
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive" disabled>
                            <Trash2 />
                            ลบ
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
