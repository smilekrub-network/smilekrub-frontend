import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Eye, ImageIcon, Loader2, PenLine, Save, Send, Tag, Trash2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { createArticle, updateArticle } from '#/lib/news-api'
import type { ArticleInput, ArticleStatus, NewsArticle } from '#/lib/news-api'

const COVER_PRESETS = [
  { url: '/wallpaper/campfire_site_dawn.webp', label: 'Campfire รุ่งเช้า' },
  { url: '/wallpaper/campfire_site_dusk.webp', label: 'Campfire พลบค่ำ' },
  { url: '/wallpaper/smilekrub_lobby.png', label: 'Lobby' },
]

const CATEGORIES = ['NEWS', 'UPDATE', 'EVENT']

/** `publishedAt` for <input type="datetime-local">, which wants local time. */
function toLocalInputValue(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

/**
 * Renders the draft the way the public article page will, so the author can
 * check it without publishing. Content is the editor's own output and is
 * sanitized again server-side on save.
 */
function ArticlePreview({
  title,
  subtitle,
  coverImageUrl,
  category,
  content,
  authorName,
  publishedAt,
}: {
  title: string
  subtitle: string
  coverImageUrl: string
  category: string
  content: string
  authorName?: string
  publishedAt: string
}) {
  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'ยังไม่กำหนด (จะใช้เวลาที่กดเผยแพร่)'

  const isEmpty = !title.trim() && !content.replace(/<[^>]*>/g, '').trim()

  return (
    <Card>
      <CardContent className="pt-6">
        {isEmpty ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            ยังไม่มีเนื้อหาให้แสดง — กลับไปแท็บ "เขียน" เพื่อเริ่มเขียนบทความ
          </p>
        ) : (
          <article className="flex flex-col gap-4">
            {coverImageUrl ? (
              <div className="relative">
                <div className="aspect-21/9 overflow-hidden border-2 border-black/40">
                  <img src={coverImageUrl} alt="" aria-hidden className="size-full object-cover" />
                </div>
                <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                  <MinecraftTag className="!bg-foreground font-mc text-[10px] tracking-wider !text-background">
                    {category}
                  </MinecraftTag>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>เขียนโดย {authorName ?? 'คุณ'}</span>
              <span>เผยแพร่ {dateLabel}</span>
            </div>

            <h1 className="font-mc text-2xl leading-tight text-foreground sm:text-3xl">
              {title || 'ยังไม่มีหัวข้อ'}
            </h1>
            {subtitle ? <p className="text-lg text-muted-foreground">{subtitle}</p> : null}

            <div
              className="prose prose-invert mt-2 max-w-none border-t border-border pt-6 prose-headings:font-semibold prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        )}
      </CardContent>
    </Card>
  )
}

/** Small labelled section used inside the settings sidebar. */
function SidebarCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  )
}

export function ArticleForm({ article }: { article?: NewsArticle }) {
  const navigate = useNavigate()
  const isEdit = Boolean(article)

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [subtitle, setSubtitle] = useState(article?.subtitle ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [category, setCategory] = useState(article?.category ?? 'NEWS')
  const [tags, setTags] = useState<Array<string>>(article?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')
  const [publishedAt, setPublishedAt] = useState(toLocalInputValue(article?.publishedAt ?? null))
  const [metaTitle, setMetaTitle] = useState(article?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(article?.metaDescription ?? '')
  const [pending, setPending] = useState<ArticleStatus | null>(null)

  const addTag = () => {
    const value = tagDraft.trim()
    if (!value || tags.includes(value) || tags.length >= 12) {
      setTagDraft('')
      return
    }
    setTags([...tags, value])
    setTagDraft('')
  }

  const submit = async (status: ArticleStatus) => {
    if (!title.trim()) {
      toast.add({ title: 'ต้องมีหัวข้อข่าว', type: 'error' })
      return
    }

    setPending(status)
    const body: ArticleInput = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim() || null,
      coverImageUrl: coverImageUrl.trim() || null,
      content,
      category,
      tags,
      status,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
    }

    const res = article ? await updateArticle(article.id, body) : await createArticle(body)
    setPending(null)

    if (!res.ok) {
      toast.add({ title: 'บันทึกไม่สำเร็จ', description: 'กรุณาลองใหม่อีกครั้ง', type: 'error' })
      return
    }

    toast.add({
      title: status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'บันทึกฉบับร่างแล้ว',
      description: res.data.title,
      type: 'success',
    })
    navigate({ to: '/admin/news' })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Actions stay reachable without scrolling back up from the editor. */}
      <div className="sticky top-16 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border/50 bg-background/85 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="mr-auto flex items-center gap-2">
          <h2 className="text-base font-semibold">
            {isEdit ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
          </h2>
          {article ? (
            <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {article.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
            </Badge>
          ) : null}
        </div>

        {article?.status === 'PUBLISHED' ? (
          <Button
            variant="ghost"
            size="sm"
            render={<a href={`/news/${article.slug}`} target="_blank" rel="noreferrer" />}
          >
            <Eye />
            ดูหน้าเว็บ
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          disabled={pending !== null}
          onClick={() => navigate({ to: '/admin/news' })}
        >
          ยกเลิก
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending !== null}
          onClick={() => submit('DRAFT')}
        >
          {pending === 'DRAFT' ? <Loader2 className="animate-spin" /> : <Save />}
          บันทึกฉบับร่าง
        </Button>
        <Button size="sm" disabled={pending !== null} onClick={() => submit('PUBLISHED')}>
          {pending === 'PUBLISHED' ? <Loader2 className="animate-spin" /> : <Send />}
          เผยแพร่
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* --- main column: what the reader actually sees --- */}
        <Tabs defaultValue="write" className="gap-3">
          <TabsList>
            <TabsTrigger value="write" className="gap-2 px-4">
              <PenLine data-icon="inline-start" />
              เขียน
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 px-4">
              <Eye data-icon="inline-start" />
              ดูตัวอย่าง
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <Card>
              <CardContent className="flex flex-col gap-5 pt-6">
                <Field>
                  <FieldLabel htmlFor="title">หัวข้อข่าว</FieldLabel>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น สปอนกลางใหม่มาแล้ว!"
                    className="h-11 text-base font-medium"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="subtitle">คำโปรย</FieldLabel>
                  <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="สรุปสั้น ๆ ว่าข่าวนี้เกี่ยวกับอะไร"
                  />
                  <FieldDescription>แสดงใต้หัวข้อในหน้ารายการข่าวและหน้าบทความ</FieldDescription>
                </Field>

                <Separator />

                <Field>
                  <FieldLabel>เนื้อหา</FieldLabel>
                  <RichTextEditor value={content} onChange={setContent} />
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <ArticlePreview
              title={title}
              subtitle={subtitle}
              coverImageUrl={coverImageUrl}
              category={category}
              content={content}
              authorName={article?.authorName}
              publishedAt={publishedAt}
            />
          </TabsContent>
        </Tabs>

        {/* --- sidebar: settings, grouped by purpose --- */}
        <div className="flex flex-col gap-4 xl:sticky xl:top-32">
          <SidebarCard title="การเผยแพร่">
            <Field>
              <FieldLabel htmlFor="publishedAt">วันที่เผยแพร่</FieldLabel>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
              <FieldDescription>เว้นว่าง = ใช้เวลาที่กดเผยแพร่</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">Slug (URL)</FieldLabel>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="สร้างจากหัวข้ออัตโนมัติ"
              />
              <FieldDescription className="truncate">
                /news/{slug || '<สร้างอัตโนมัติ>'}
              </FieldDescription>
            </Field>
          </SidebarCard>

          <SidebarCard title="หมวดหมู่และแท็ก" description="ใช้กรองข่าวในหน้ารายการข่าว">
            <Field>
              <FieldLabel>หมวดหมู่</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      category === item
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-input/30 text-muted-foreground hover:bg-input/50',
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="tags">แท็ก</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="พิมพ์แล้วกด Enter"
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag} aria-label="เพิ่มแท็ก">
                  <Tag />
                </Button>
              </div>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        aria-label={`ลบแท็ก ${tag}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <FieldDescription>ยังไม่มีแท็ก</FieldDescription>
              )}
            </Field>
          </SidebarCard>

          <SidebarCard title="รูปหน้าปก">
            {coverImageUrl ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img src={coverImageUrl} alt="" className="aspect-video w-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={() => setCoverImageUrl('')}
                  aria-label="ลบรูปหน้าปก"
                >
                  <Trash2 />
                </Button>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                <ImageIcon className="size-6" />
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="cover">URL รูปภาพ</FieldLabel>
              <Input
                id="cover"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://… หรือ /wallpaper/…"
              />
            </Field>

            <Field>
              <FieldLabel>เลือกจากรูปที่มี</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setCoverImageUrl(preset.url)}
                    title={preset.label}
                    className={cn(
                      'overflow-hidden rounded-lg border-2 transition-colors',
                      coverImageUrl === preset.url ? 'border-primary' : 'border-transparent',
                    )}
                  >
                    <img src={preset.url} alt={preset.label} className="aspect-video w-full object-cover" />
                  </button>
                ))}
              </div>
            </Field>
          </SidebarCard>

          <SidebarCard title="SEO" description="เว้นว่างไว้จะใช้หัวข้อและคำโปรยแทน">
            <Field>
              <FieldLabel htmlFor="metaTitle">Meta title</FieldLabel>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'หัวข้อสำหรับ SEO'}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="metaDescription">Meta description</FieldLabel>
              <Textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={subtitle || 'คำอธิบายสั้น ๆ ประมาณ 150-160 ตัวอักษร'}
              />
              <FieldDescription
                className={cn(metaDescription.length > 160 && 'text-destructive')}
              >
                {metaDescription.length} / 160 ตัวอักษร
              </FieldDescription>
            </Field>
          </SidebarCard>
        </div>
      </div>
    </div>
  )
}
