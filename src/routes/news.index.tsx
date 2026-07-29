import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Newspaper, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { getServerStatus } from '#/lib/server-status'
import { fetchNewsList, fetchNewsTags } from '#/lib/news-server'
import { useServerStatus } from '#/lib/use-server-status'

const PER_PAGE = 9

export const Route = createFileRoute('/news/')({
  // Search state lives in the URL so pagination and filters are shareable and
  // survive a refresh — and so the list can be server-rendered per query.
  validateSearch: (search: Record<string, unknown>): { page?: number; q?: string; tag?: string } => {
    const page = Number(search.page)
    return {
      page: Number.isFinite(page) && page > 1 ? Math.floor(page) : undefined,
      q: typeof search.q === 'string' && search.q ? search.q : undefined,
      tag: typeof search.tag === 'string' && search.tag ? search.tag : undefined,
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({
    status: await getServerStatus(),
    news: await fetchNewsList({
      data: { page: deps.page ?? 1, perPage: PER_PAGE, q: deps.q, tag: deps.tag },
    }),
    tags: await fetchNewsTags(),
  }),
  component: NewsIndex,
  head: () => ({
    meta: [
      { title: 'Smilekrub Network | ข่าวสารทั้งหมด' },
      {
        name: 'description',
        content: 'รวมทุกประกาศ กิจกรรม และความเคลื่อนไหวของเซิร์ฟเวอร์ Smilekrub',
      },
    ],
  }),
})

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsIndex() {
  const { status: initialStatus, news, tags } = Route.useLoaderData()
  const status = useServerStatus(initialStatus)
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const setSearch = (next: { page?: number; q?: string; tag?: string }) => {
    void navigate({ search: next, resetScroll: false })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={status} />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-6">
        <MinecraftTag className="font-mc text-[10px] tracking-wider text-primary">
          NEWS
        </MinecraftTag>
        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          ข่าวสารและอัปเดตทั้งหมด
        </h1>
        <p className="mt-2 text-muted-foreground">
          รวมทุกประกาศ กิจกรรม และความเคลื่อนไหวของ Smilekrub
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault()
            const value = new FormData(e.currentTarget).get('q')
            setSearch({ q: String(value ?? '') || undefined, tag: search.tag })
          }}
        >
          <InputGroup className="w-full sm:max-w-xs">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              name="q"
              placeholder="ค้นหาข่าวสาร"
              defaultValue={search.q ?? ''}
            />
          </InputGroup>
          <Button type="submit" variant="outline">
            ค้นหา
          </Button>
        </form>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSearch({ q: search.q })}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                !search.tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-input/30 text-muted-foreground hover:bg-input/50',
              )}
            >
              ทั้งหมด
            </button>
            {tags.map((tag) => (
              <button
                key={tag.tag}
                type="button"
                onClick={() => setSearch({ q: search.q, tag: tag.tag })}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  search.tag === tag.tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-input/30 text-muted-foreground hover:bg-input/50',
                )}
              >
                {tag.tag} ({tag.count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {news.items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Newspaper />
              </EmptyMedia>
              <EmptyTitle>ไม่พบข่าวสาร</EmptyTitle>
              <EmptyDescription>
                ลองเปลี่ยนคำค้นหาหรือเลือกแท็กอื่นเพื่อดูข่าวทั้งหมด
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.items.map((item) => (
              <StaggerItem key={item.id}>
                <Card
                  size="sm"
                  className="group h-full gap-0 overflow-hidden p-0 transition-all hover:-translate-y-1 hover:ring-primary/50"
                  render={<Link to="/news/$slug" params={{ slug: item.slug }} />}
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <MinecraftTag className="absolute bottom-2 left-2 font-mc text-[10px]">
                      {item.category}
                    </MinecraftTag>
                  </div>
                  <CardContent className="flex flex-col gap-2 py-4">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.publishedAt)}
                    </p>
                    <h3 className="font-mc text-base leading-snug text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.subtitle || item.excerpt}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      อ่านต่อ
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {news.totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={news.page <= 1}
              onClick={() =>
                setSearch({ ...search, page: news.page - 1 <= 1 ? undefined : news.page - 1 })
              }
            >
              ก่อนหน้า
            </Button>
            <span className="text-sm text-muted-foreground">
              หน้า {news.page} จาก {news.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={news.page >= news.totalPages}
              onClick={() => setSearch({ ...search, page: news.page + 1 })}
            >
              ถัดไป
            </Button>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  )
}
