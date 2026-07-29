import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { getServerStatus } from '#/lib/server-status'
import { NEWS_ITEMS } from '#/lib/site-content'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/news/')({
  component: NewsIndex,
  loader: () => getServerStatus(),
  head: () => ({
    meta: [{ title: 'Smilekrub Network | ข่าวสารทั้งหมด' }],
  }),
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsIndex() {
  const status = useServerStatus(Route.useLoaderData())

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
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <StaggerItem key={item.id}>
              <Card
                size="sm"
                className="group h-full gap-0 overflow-hidden p-0 transition-all hover:-translate-y-1 hover:ring-primary/50"
                render={
                  <Link to="/news/$newsId" params={{ newsId: String(item.id) }} />
                }
              >
                <div
                  className={`relative aspect-video overflow-hidden bg-gradient-to-br ${item.gradient}`}
                >
                  <img
                    src={item.cover}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <MinecraftTag className="absolute bottom-2 left-2 font-mc text-[10px]">
                    {item.category}
                  </MinecraftTag>
                </div>
                <CardContent className="flex flex-col gap-2 py-4">
                  <p className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
                  <h3 className="font-mc text-base leading-snug text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    อ่านต่อ
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Footer />
    </div>
  )
}
