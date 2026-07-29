import { createFileRoute } from '@tanstack/react-router'

import { Community } from '#/components/site/community'
import { Features } from '#/components/site/features'
import { Footer } from '#/components/site/footer'
import { GameModes } from '#/components/site/game-modes'
import { Hero } from '#/components/site/hero'
import { HowToJoin } from '#/components/site/how-to-join'
import { NavBar } from '#/components/site/nav-bar'
import { NewsGrid } from '#/components/site/news-grid'
import { getServerStatus } from '#/lib/server-status'
import { fetchNewsList } from '#/lib/news-server'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({
    status: await getServerStatus(),
    news: await fetchNewsList({ data: { perPage: 3 } }),
  }),
  head: () => ({
    meta: [{ title: 'Smilekrub Network | หน้าแรก' }],
  }),
})

function Home() {
  const { status: initialStatus, news } = Route.useLoaderData()
  const status = useServerStatus(initialStatus)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={status} />
      <Hero status={status} />
      <Features />
      <GameModes />
      <HowToJoin />
      <NewsGrid items={news.items} />
      <Community />
      <Footer />
    </div>
  )
}
