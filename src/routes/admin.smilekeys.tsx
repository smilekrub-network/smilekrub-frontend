import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from 'lucide-react'

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
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
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
import { createSmileKey, deleteSmileKey, listSmileKeys } from '#/lib/smile-keys-admin'
import type { SmileKeyRow } from '#/lib/smile-keys-admin'

export const Route = createFileRoute('/admin/smilekeys')({
  component: AdminSmileKeys,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | สมิลคีย์' }],
  }),
})

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({ title: 'คัดลอกไม่สำเร็จ', description: value, type: 'error' })
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-input/30 px-2.5 py-1 font-mono text-xs hover:bg-input/50"
    >
      {value}
      {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5 text-muted-foreground" />}
    </button>
  )
}

function DeleteKeyButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const onClick = async () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    setDeleting(true)
    const res = await deleteSmileKey(id)
    setDeleting(false)
    if (!res.ok) {
      toast.add({ title: 'ลบไม่สำเร็จ', description: 'กรุณาลองใหม่อีกครั้ง', type: 'error' })
      return
    }
    onDeleted()
  }

  return (
    <Button
      type="button"
      variant={confirming ? 'destructive' : 'ghost'}
      size="icon-sm"
      disabled={deleting}
      onClick={onClick}
      aria-label={confirming ? 'ยืนยันการลบ' : 'ลบสมิลคีย์'}
    >
      {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  )
}

type FilterValue = 'all' | 'unused' | 'used'

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'unused', label: 'ยังไม่ใช้' },
  { value: 'used', label: 'ใช้แล้ว' },
]

function AdminSmileKeys() {
  const [keys, setKeys] = useState<Array<SmileKeyRow> | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<FilterValue>('all')

  const refresh = async () => {
    const res = await listSmileKeys()
    if (res.ok) setKeys(res.data)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const onCreate = async () => {
    setCreating(true)
    const res = await createSmileKey()
    setCreating(false)
    if (!res.ok) {
      toast.add({ title: 'สร้างสมิลคีย์ไม่สำเร็จ', description: 'กรุณาลองใหม่อีกครั้ง', type: 'error' })
      return
    }
    setKeys((prev) => (prev ? [res.data, ...prev] : [res.data]))
    toast.add({ title: 'สร้างสมิลคีย์แล้ว', description: res.data.code, type: 'success' })
  }

  const onDeleted = (id: string) => {
    setKeys((prev) => prev?.filter((k) => k.id !== id) ?? prev)
    toast.add({ title: 'ลบสมิลคีย์แล้ว', type: 'success' })
  }

  const filteredKeys = useMemo(() => {
    if (!keys) return keys
    if (filter === 'unused') return keys.filter((k) => !k.usedAt)
    if (filter === 'used') return keys.filter((k) => !!k.usedAt)
    return keys
  }, [keys, filter])

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>สมิลคีย์ (Smilekey)</CardTitle>
        <CardDescription>โค้ดเชิญสำหรับให้ผู้เล่นกรอกตอนสมัครเข้าเซิร์ฟ ใช้ได้ครั้งเดียวต่อโค้ด</CardDescription>
        <CardAction>
          <Button size="sm" disabled={creating} onClick={onCreate}>
            {creating ? <Loader2 className="animate-spin" /> : <Plus />}
            สร้างสมิลคีย์ใหม่
          </Button>
        </CardAction>
      </CardHeader>

      <div className="flex gap-1.5 border-b p-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-input/30 text-muted-foreground hover:bg-input/50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <CardContent className="px-0">
        {filteredKeys === null ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : filteredKeys.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyRound />
              </EmptyMedia>
              <EmptyTitle>
                {keys && keys.length > 0 ? 'ไม่มีสมิลคีย์ในหมวดนี้' : 'ยังไม่มีสมิลคีย์'}
              </EmptyTitle>
              <EmptyDescription>
                {keys && keys.length > 0
                  ? 'ลองเปลี่ยนตัวกรองด้านบน'
                  : 'กด "สร้างสมิลคีย์ใหม่" เพื่อสร้างโค้ดเชิญแรก'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>โค้ด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="hidden md:table-cell">ผู้ใช้โค้ด</TableHead>
                <TableHead className="hidden lg:table-cell">สร้างเมื่อ</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <CopyableCode value={key.code} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.usedAt ? 'secondary' : 'default'}>
                      {key.usedAt ? 'ใช้แล้ว' : 'ยังไม่ใช้'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {key.usedByMinecraftUsername ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{key.usedByMinecraftUsername}</span>
                        <span className="text-xs text-muted-foreground">{key.usedByEmail}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                    {formatDateTime(key.createdAt)}
                  </TableCell>
                  <TableCell>
                    {!key.usedAt ? (
                      <DeleteKeyButton id={key.id} onDeleted={() => onDeleted(key.id)} />
                    ) : null}
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
