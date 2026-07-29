import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { getServerStatus } from '#/lib/server-status'
import { fetchArticleBySlug } from '#/lib/news-server'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/news/$slug')({
  component: NewsArticle,
  loader: async ({ params }) => {
    // The public endpoint only returns PUBLISHED rows, so drafts 404 here
    // exactly like a missing article (NEWS-04).
    const article = await fetchArticleBySlug({ data: params.slug })
    if (!article) throw notFound()
    return { article, status: await getServerStatus() }
  },
  // Rendered during SSR, so crawlers and link unfurlers see real values (NEWS-05).
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'Smilekrub Network' }] }

    const { article } = loaderData
    const title = article.metaTitle || article.title
    const description =
      article.metaDescription || article.subtitle || article.contentText.slice(0, 160)

    return {
      meta: [
        { title: `Smilekrub Network | ${title}` },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        ...(article.coverImageUrl
          ? [{ property: 'og:image' as const, content: article.coverImageUrl }]
          : []),
        ...(article.publishedAt
          ? [{ property: 'article:published_time' as const, content: article.publishedAt }]
          : []),
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    }
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mc text-2xl text-foreground">ไม่พบข่าวนี้</p>
      <Link to="/news" className="text-primary hover:underline">
        กลับหน้าข่าวสาร
      </Link>
    </div>
  ),
})

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsArticle() {
  const { article, status } = Route.useLoaderData()
  const liveStatus = useServerStatus(status)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={liveStatus} />

      <article className="pt-16">
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; กลับข่าวสาร
          </Link>
        </div>

        {article.coverImageUrl ? (
          <div className="relative mx-auto mt-6 max-w-6xl px-6">
            <div className="aspect-21/9 overflow-hidden border-2 border-black/40">
              <img
                src={article.coverImageUrl}
                alt=""
                aria-hidden
                className="size-full object-cover"
              />
            </div>
            <div className="absolute inset-x-0 -bottom-4 flex justify-center">
              <MinecraftTag className="!bg-foreground font-mc text-[10px] tracking-wider !text-background">
                {article.category}
              </MinecraftTag>
            </div>
          </div>
        ) : null}

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
                <p className="text-muted-foreground">{article.authorName}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">เผยแพร่</p>
                <p className="text-muted-foreground">{formatDate(article.publishedAt)}</p>
              </div>
              {article.tags.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <p className="font-semibold text-foreground">แท็ก</p>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        render={<Link to="/news" search={{ tag }} />}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="flex flex-col gap-4">
            <h1 className="font-mc text-2xl leading-tight text-foreground sm:text-3xl">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="text-lg text-muted-foreground">{article.subtitle}</p>
            ) : null}

            {/*
              Safe: the backend runs every article through sanitize-html on write,
              so stored content only contains the whitelisted tags/attributes.
            */}
            <div
              className="prose prose-invert mt-4 max-w-none border-t border-border pt-6 prose-headings:font-semibold prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
