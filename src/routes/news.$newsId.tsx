import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { getServerStatus } from '#/lib/server-status'
import { NEWS_ITEMS } from '#/lib/site-content'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/news/$newsId')({
  component: NewsArticle,
  loader: async ({ params }) => {
    const item = NEWS_ITEMS.find((n) => String(n.id) === params.newsId)
    if (!item) throw notFound()
    const status = await getServerStatus()
    return { item, status }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `Smilekrub Network | ${loaderData.item.title}` : 'Smilekrub Network',
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mc text-2xl text-foreground">ไม่พบข่าวนี้</p>
      <Link to="/" className="text-primary hover:underline">
        กลับหน้าแรก
      </Link>
    </div>
  ),
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsArticle() {
  const { item, status } = Route.useLoaderData()
  const liveStatus = useServerStatus(status)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={liveStatus} />

      <article className="pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <Link
            to="/"
            hash="news"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; กลับข่าวสาร
          </Link>
        </div>

        <div className="relative mx-auto mt-6 max-w-6xl px-6">
          <div className="aspect-21/9 overflow-hidden border-2 border-black/40">
            <img
              src={item.cover}
              alt=""
              aria-hidden
              className="size-full object-cover"
            />
          </div>
          <div className="absolute inset-x-0 -bottom-4 flex justify-center">
            <MinecraftTag className="!bg-foreground font-mc text-[10px] tracking-wider !text-background">
              {item.category}
            </MinecraftTag>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[200px_1fr]">
          <aside className="flex flex-row gap-4 lg:flex-col">
            <img
              src="/mock/chibi-FewFond_-1024.png"
              alt=""
              aria-hidden
              className="size-24"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">เขียนโดย</p>
                <p className="text-muted-foreground">{item.author}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">เผยแพร่</p>
                <p className="text-muted-foreground">{formatDate(item.publishedAt)}</p>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-4">
            <h1 className="font-mc text-2xl leading-tight text-foreground sm:text-3xl">
              {item.title}
            </h1>
            <p className="text-lg text-muted-foreground">{item.subtitle}</p>

            <div className="mt-4 flex flex-col gap-4 border-t border-border pt-6 text-base leading-relaxed text-foreground/90">
              {item.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
