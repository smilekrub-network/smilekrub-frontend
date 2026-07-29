import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Eye,
  Loader2,
  MoreHorizontal,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Undo2,
} from 'lucide-react'

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
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { deleteArticle, listAdminNews, updateArticle } from '#/lib/news-api'
import type { ArticleStatus, NewsListItem, NewsListResult } from '#/lib/news-api'

export const Route = createFileRoute('/admin/news/')({
  component: AdminNews,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | จัดการข่าวสาร' }],
  }),
})

type StatusFilter = 'ALL' | ArticleStatus

const FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'ALL', label: 'ทั้งหมด' },
  { value: 'PUBLISHED', label: 'เผยแพร่แล้ว' },
  { value: 'DRAFT', label: 'ฉบับร่าง' },
]

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AdminNews() {
  const [result, setResult] = useState<NewsListResult | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const res = await listAdminNews({
      page,
      q: query.trim() || undefined,
      status: status === 'ALL' ? undefined : status,
    })
    if (res.ok) setResult(res.data)
  }, [page, query, status])

  // Debounced so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 250)
    return () => clearTimeout(timer)
  }, [refresh])

  const onToggleStatus = async (item: NewsListItem) => {
    const next: ArticleStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setBusyId(item.id)
    const res = await updateArticle(item.id, { status: next })
    setBusyId(null)
    if (!res.ok) {
      toast.add({ title: 'เปลี่ยนสถานะไม่สำเร็จ', type: 'error' })
      return
    }
    toast.add({
      title: next === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ย้ายไปฉบับร่างแล้ว',
      description: item.title,
      type: 'success',
    })
    void refresh()
  }

  const onDelete = async (item: NewsListItem) => {
    setBusyId(item.id)
    const res = await deleteArticle(item.id)
    setBusyId(null)
    if (!res.ok) {
      toast.add({ title: 'ลบไม่สำเร็จ', type: 'error' })
      return
    }
    toast.add({ title: 'ลบบทความแล้ว', description: item.title, type: 'success' })
    void refresh()
  }

  const items = result?.items ?? []

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>จัดการข่าวสาร</CardTitle>
        <CardDescription>
          {result ? `ทั้งหมด ${result.total} บทความ` : 'กำลังโหลด…'}
        </CardDescription>
        <CardAction className="flex flex-wrap items-center gap-2">
          <InputGroup className="w-full sm:w-56">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="ค้นหาข่าวสาร"
              value={query}
              onChange={(e) => {
                setPage(1)
                setQuery(e.target.value)
              }}
            />
          </InputGroup>
          <Button render={<Link to="/admin/news/new" />}>
            <Plus />
            เขียนข่าวใหม่
          </Button>
        </CardAction>
      </CardHeader>

      <div className="flex gap-1.5 border-b p-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setPage(1)
              setStatus(f.value)
            }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              status === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-input/30 text-muted-foreground hover:bg-input/50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <CardContent className="px-0">
        {result === null ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Newspaper />
              </EmptyMedia>
              <EmptyTitle>ไม่พบข่าวสาร</EmptyTitle>
              <EmptyDescription>
                ลองเปลี่ยนคำค้นหา ตัวกรอง หรือกด "เขียนข่าวใหม่" เพื่อเริ่มบทความแรก
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หัวข้อ</TableHead>
                <TableHead className="w-28">สถานะ</TableHead>
                <TableHead className="hidden w-28 lg:table-cell">หมวดหมู่</TableHead>
                <TableHead className="hidden w-36 md:table-cell">ผู้เขียน</TableHead>
                <TableHead className="w-32">เผยแพร่</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className={cn(busyId === item.id && 'opacity-50')}>
                  <TableCell className="max-w-0">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.subtitle || item.excerpt}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {item.status === 'PUBLISHED' ? 'เผยแพร่' : 'ฉบับร่าง'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {item.authorName}
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
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            render={
                              <Link
                                to="/admin/news/$articleId"
                                params={{ articleId: item.id }}
                              />
                            }
                          >
                            <Pencil />
                            แก้ไข
                          </DropdownMenuItem>
                          {item.status === 'PUBLISHED' ? (
                            <DropdownMenuItem
                              render={
                                <a
                                  href={`/news/${item.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                            >
                              <Eye />
                              ดูบนหน้าเว็บ
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => onToggleStatus(item)}>
                            {item.status === 'PUBLISHED' ? <Undo2 /> : <Send />}
                            {item.status === 'PUBLISHED' ? 'ย้ายเป็นฉบับร่าง' : 'เผยแพร่'}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(item)}
                          >
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

        {result && result.totalPages > 1 ? (
          <div className="flex items-center justify-between gap-2 px-6 pt-4">
            <span className="text-xs text-muted-foreground">
              หน้า {result.page} จาก {result.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={result.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={result.page >= result.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
